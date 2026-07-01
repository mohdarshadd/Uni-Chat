import { Megaphone, X } from 'lucide-react';

interface AnnouncementItem {
  id: string;
  content: string;
  createdByName: string;
  createdAt: string;
}

interface AnnouncementBubbleProps {
  announcement: AnnouncementItem;
  onDismiss?: (id: string) => void;
}

export function AnnouncementBubble({ announcement, onDismiss }: AnnouncementBubbleProps) {
  return (
    <div className="mx-4 my-2 overflow-hidden rounded-xl border border-orange-500/30 bg-gradient-to-r from-orange-500/5 to-transparent">
      <div className="flex items-start gap-3 p-4">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-orange-500/20">
          <Megaphone size={16} className="text-orange-500" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-orange-500">Announcement</span>
            <span className="text-[10px] text-[var(--color-text-secondary)]">
              by {announcement.createdByName}
            </span>
            <span className="text-[10px] text-[var(--color-text-secondary)]">
              {new Date(announcement.createdAt).toLocaleTimeString()}
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--color-text)]">{announcement.content}</p>
        </div>
        {onDismiss ? (
          <button
            onClick={() => onDismiss(announcement.id)}
            className="rounded-lg p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
          >
            <X size={14} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
