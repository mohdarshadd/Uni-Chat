import { Sun, Moon, Users, LogOut } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { RenameModal } from './RenameModal';
import { useState } from 'react';

interface ChatTopBarProps {
  universityName: string;
  cityName: string;
  onlineCount: number;
  onRename: (name: string) => Promise<boolean>;
  onLeave: () => void;
}

export function ChatTopBar({
  universityName,
  cityName,
  onlineCount,
  onRename,
  onLeave,
}: ChatTopBarProps) {
  const { theme, toggleTheme, displayName } = useChatStore();
  const [showRename, setShowRename] = useState(false);

  return (
    <>
      <header className="glass sticky top-0 z-10 border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10">
              <span className="text-sm font-bold text-brand-500">
                {universityName.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-[var(--color-text)]">
                {universityName}
              </h1>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {cityName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg bg-[var(--color-bg-secondary)] px-2.5 py-1.5">
              <Users size={14} className="text-brand-500" />
              <span className="text-xs font-medium text-[var(--color-text)]">
                {onlineCount}
              </span>
            </div>

            <button
              onClick={() => setShowRename(true)}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
            >
              {displayName}
            </button>

            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text)] transition-colors"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              onClick={onLeave}
              className="rounded-lg p-2 text-[var(--color-text-secondary)] hover:bg-red-500/10 hover:text-red-500 transition-colors"
              title="Leave room"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <RenameModal
        isOpen={showRename}
        onClose={() => setShowRename(false)}
        onRename={onRename}
      />
    </>
  );
}
