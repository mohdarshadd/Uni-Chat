import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Building2, Flag, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: BarChart3 },
  { label: 'Reports', path: '/admin/reports', icon: Flag },
  { label: 'Universities', path: '/admin/universities', icon: Building2 },
];

interface AdminLayoutProps {
  activePath: string;
  children: ReactNode;
}

export function AdminLayout({ activePath, children }: AdminLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)] md:flex-row">
      <header className="glass sticky top-0 z-20 border-b border-[var(--color-border)] md:hidden">
        <div className="flex items-center gap-2 px-4 pt-3">
          <Settings className="h-5 w-5 text-brand-500" />
          <span className="font-semibold text-[var(--color-text)]">Admin Panel</span>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 py-2 scrollbar-thin">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                activePath === item.path
                  ? 'bg-brand-500 text-[var(--color-on-accent)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text)]',
              )}
            >
              <item.icon size={14} />
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <aside className="glass hidden w-64 flex-shrink-0 border-r border-[var(--color-border)] p-4 md:block">
        <div className="mb-8 flex items-center gap-2">
          <Settings className="h-5 w-5 text-brand-500" />
          <span className="font-semibold text-[var(--color-text)]">Admin Panel</span>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                activePath === item.path
                  ? 'bg-brand-500 text-[var(--color-on-accent)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text)]',
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
