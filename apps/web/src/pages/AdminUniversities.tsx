import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Check, X } from 'lucide-react';
import { api } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { BarChart3, Building2, Flag, Settings } from 'lucide-react';

interface University {
  id: string;
  name: string;
  cityId: string;
  isActive: boolean;
  memberCount: number;
}

interface City {
  id: string;
  name: string;
  stateName: string;
  countryName: string;
}

export function AdminUniversities() {
  const navigate = useNavigate();
  const adminKey = sessionStorage.getItem('admin-key');
  const [universities, setUniversities] = useState<University[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [newName, setNewName] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    if (!adminKey) { navigate('/admin'); return; }
    Promise.all([
      api.get('/api/admin/universities', { headers: { 'admin-key': adminKey } }),
      api.get('/api/admin/cities', { headers: { 'admin-key': adminKey } }),
    ]).then(([uniRes, cityRes]) => {
      setUniversities(uniRes.data);
      setCities(cityRes.data);
    }).catch(() => navigate('/admin'));
  }, [adminKey, navigate]);

  const handleAdd = async () => {
    if (!newName || !selectedCity) return;
    await api.post('/api/admin/universities', { name: newName, cityId: selectedCity }, {
      headers: { 'admin-key': adminKey },
    });
    setNewName('');
    // Refresh
    const { data } = await api.get('/api/admin/universities', { headers: { 'admin-key': adminKey } });
    setUniversities(data);
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    await api.patch(`/api/admin/universities/${id}`, { isActive: !isActive }, {
      headers: { 'admin-key': adminKey },
    });
    setUniversities((prev) => prev.map((u) => u.id === id ? { ...u, isActive: !isActive } : u));
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/api/admin/universities/${id}`, {
      headers: { 'admin-key': adminKey },
    });
    setUniversities((prev) => prev.filter((u) => u.id !== id));
  };

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
        <button
          onClick={() => navigate('/admin')}
          className="mb-6 flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="mb-8 text-2xl font-bold text-[var(--color-text)]">
          Manage Universities ({universities.length})
        </h1>

        <div className="glass mb-8 rounded-xl border border-[var(--color-border)] p-4">
          <h2 className="mb-4 text-sm font-semibold text-[var(--color-text)]">Add University</h2>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="University name"
              />
            </div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)]"
            >
              <option value="">Select city</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}, {c.stateName}</option>
              ))}
            </select>
            <Button onClick={handleAdd} disabled={!newName || !selectedCity}>
              <Plus size={16} className="mr-1" /> Add
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {universities.map((uni) => (
            <div
              key={uni.id}
              className="glass flex items-center justify-between rounded-xl border border-[var(--color-border)] px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">{uni.name}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {uni.memberCount} online
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggle(uni.id, uni.isActive)}
                  className={`rounded-lg p-1.5 ${uni.isActive ? 'text-green-500' : 'text-red-500'}`}
                >
                  {uni.isActive ? <Check size={16} /> : <X size={16} />}
                </button>
                <button
                  onClick={() => handleDelete(uni.id)}
                  className="rounded-lg p-1.5 text-[var(--color-text-secondary)] hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
