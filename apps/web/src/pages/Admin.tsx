import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Users, Building2, Flag, Activity,
  TrendingUp, BarChart3, Settings,
} from 'lucide-react';
import { api } from '../lib/api';

interface Analytics {
  totalMessages: number;
  totalUsers: number;
  totalUniversities: number;
  totalReports: number;
  activeToday: number;
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
  const adminKey = sessionStorage.getItem('admin-key');

  useEffect(() => {
    if (!adminKey) {
      const key = prompt('Enter admin key:');
      if (key) {
        sessionStorage.setItem('admin-key', key);
        window.location.reload();
      } else {
        navigate('/');
      }
      return;
    }

    api.get('/api/admin/analytics', {
      headers: { 'admin-key': adminKey },
    }).then(({ data }) => setAnalytics(data)).catch(() => {
      sessionStorage.removeItem('admin-key');
      navigate('/');
    });
  }, [adminKey, navigate]);

  if (!analytics) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <Activity className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: BarChart3 },
    { label: 'Reports', path: '/admin/reports', icon: Flag },
    { label: 'Universities', path: '/admin/universities', icon: Building2 },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <aside className="glass w-64 border-r border-[var(--color-border)] p-4">
        <div className="mb-8 flex items-center gap-2">
          <Settings className="h-5 w-5 text-brand-500" />
          <span className="font-semibold text-[var(--color-text)]">Admin Panel</span>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text)] transition-colors"
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="mb-8 text-2xl font-bold text-[var(--color-text)]">Dashboard</h1>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard icon={MessageSquare} label="Total Messages" value={analytics.totalMessages} color="bg-blue-500" />
          <StatCard icon={Users} label="Total Users" value={analytics.totalUsers} color="bg-green-500" />
          <StatCard icon={Building2} label="Universities" value={analytics.totalUniversities} color="bg-purple-500" />
          <StatCard icon={Flag} label="Pending Reports" value={analytics.totalReports} color="bg-orange-500" />
          <StatCard icon={TrendingUp} label="Active Today" value={analytics.activeToday} color="bg-cyan-500" />
        </div>
      </main>
    </div>
  );
}
