import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Users, Building2, Flag,
  TrendingUp, Activity, Megaphone, CheckCircle, Lock, Search,
} from 'lucide-react';
import { api } from '../lib/api';
import { Button } from '../components/ui/Button';
import { AdminLayout } from '../components/admin/AdminLayout';

interface Analytics {
  totalMessages: number;
  totalUsers: number;
  totalUniversities: number;
  totalReports: number;
  activeToday: number;
}

interface Room {
  id: string;
  name: string;
  memberCount: number;
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: any; label: string; value: number | string; color: string;
}) {
  return (
    <div className="glass rounded-xl border border-[var(--color-border)] p-5">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">{label}</p>
          <p className="text-2xl font-bold text-[var(--color-text)]">{value}</p>
        </div>
      </div>
    </div>
  );
}

export function Admin() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [annRoomId, setAnnRoomId] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annSearch, setAnnSearch] = useState('');
  const [annSending, setAnnSending] = useState(false);
  const [annSent, setAnnSent] = useState(false);
  const [adminKey, setAdminKey] = useState<string | null>(() => sessionStorage.getItem('admin-key'));
  const [authError, setAuthError] = useState('');
  const [loginKey, setLoginKey] = useState('');
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    if (!adminKey) return;

    fetchedRef.current = true;
    Promise.all([
      api.get('/api/admin/analytics', { headers: { 'admin-key': adminKey } }),
      api.get('/api/admin/rooms', { headers: { 'admin-key': adminKey } }),
    ]).then(([analyticsRes, roomsRes]) => {
      setAnalytics(analyticsRes.data);
      setRooms(roomsRes.data);
    }).catch(() => {
      sessionStorage.removeItem('admin-key');
      setAdminKey(null);
      setAuthError('Invalid admin key or server unreachable');
      fetchedRef.current = false;
    });
  }, [adminKey]);

  const handleLogin = () => {
    if (!loginKey.trim()) return;
    sessionStorage.setItem('admin-key', loginKey.trim());
    setAdminKey(loginKey.trim());
    setAuthError('');
    setLoginKey('');
    fetchedRef.current = false;
  };

  // Login screen
  if (!adminKey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <div className="glass w-full max-w-sm rounded-xl border border-[var(--color-border)] p-8 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10">
            <Lock className="h-7 w-7 text-brand-500" />
          </div>
          <h1 className="mb-2 text-xl font-bold text-[var(--color-text)]">Admin Access</h1>
          <p className="mb-6 text-sm text-[var(--color-text-secondary)]">Enter your admin key to continue</p>
          {authError ? (
            <p className="mb-4 text-sm text-red-500">{authError}</p>
          ) : null}
          <input
            type="password"
            value={loginKey}
            onChange={(e) => setLoginKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Admin key"
            autoFocus
            className="mb-4 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:border-brand-500 focus:outline-none"
          />
          <Button onClick={handleLogin} disabled={!loginKey.trim()} className="w-full">
            Sign In
          </Button>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <Activity className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <AdminLayout activePath="/admin">
      <div className="space-y-6 lg:space-y-8">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Dashboard</h1>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard icon={MessageSquare} label="Total Messages" value={analytics.totalMessages} color="bg-blue-500" />
          <StatCard icon={Users} label="Total Users" value={analytics.totalUsers} color="bg-green-500" />
          <StatCard icon={Building2} label="Universities" value={analytics.totalUniversities} color="bg-purple-500" />
          <StatCard icon={Flag} label="Pending Reports" value={analytics.totalReports} color="bg-orange-500" />
          <StatCard icon={TrendingUp} label="Active Today" value={analytics.activeToday} color="bg-cyan-500" />
        </div>

        <section className="glass rounded-xl border border-[var(--color-border)] p-6">
          <div className="mb-4 flex items-center gap-2">
            <Megaphone size={18} className="text-orange-500" />
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Send Announcement</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">Room (University)</label>
              <div className="relative mb-2">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
                <input
                  type="text"
                  value={annSearch}
                  onChange={(e) => {
                    setAnnSearch(e.target.value);
                    if (!rooms?.some((r) => r.id === annRoomId)) setAnnRoomId('');
                  }}
                  placeholder="Search university/room..."
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 pl-9 pr-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:border-brand-500 focus:outline-none"
                />
              </div>
              <select
                value={annRoomId}
                onChange={(e) => setAnnRoomId(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)]"
              >
                <option value="">Select a room...</option>
                {rooms
                  ?.filter((room) => room.name.toLowerCase().includes(annSearch.trim().toLowerCase()))
                  .map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} ({room.memberCount} online)
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">Message</label>
              <textarea
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                placeholder="Type your announcement..."
                maxLength={500}
                rows={3}
                className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => {
                  if (!annRoomId || !annContent.trim() || annSending) return;
                  setAnnSending(true);
                  setAnnSent(false);
                  api.post('/api/admin/announcements', { roomId: annRoomId, content: annContent.trim() }, {
                    headers: { 'admin-key': adminKey },
                  }).then(() => {
                    setAnnSent(true);
                    setAnnContent('');
                    setTimeout(() => setAnnSent(false), 3000);
                  }).catch(() => {}).finally(() => setAnnSending(false));
                }}
                disabled={!annRoomId || !annContent.trim() || annSending}
                isLoading={annSending}
                variant="danger"
              >
                <Megaphone size={16} className="mr-1" /> Send Announcement
              </Button>
              {annSent ? (
                <span className="flex items-center gap-1 text-sm text-green-500">
                  <CheckCircle size={16} /> Sent!
                </span>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
