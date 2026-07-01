import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Copy, Trash2, Reply, Clock, Flag } from 'lucide-react';
import type { Message } from '@campus-chat/shared';
import { cn, getTime } from '../../lib/utils';
import { useChatStore } from '../../store/useChatStore';
import { ReportModal } from './ReportModal';

interface MessageBubbleProps {
  message: Message;
  onReply: (message: Message) => void;
  onDelete: (messageId: string) => void;
  onLike: (messageId: string) => void;
}

function useCountdown(expiresAt: string) {
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    const update = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) return setRemaining('Expired');
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setRemaining(`${mins}:${secs.toString().padStart(2, '0')}`);
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  return remaining;
}

export const MessageBubble = memo(function MessageBubble({
  message,
  onReply,
  onDelete,
  onLike,
}: MessageBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const sessionId = useChatStore((s) => s.sessionId);
  const isOwn = message.senderId === sessionId;
  const countdown = useCountdown(message.expiresAt);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative flex gap-2.5 px-4 py-1.5 transition-colors hover:bg-[var(--color-bg-secondary)]/50',
        isOwn ? 'flex-row-reverse' : '',
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold',
          'bg-brand-500/10 text-brand-500 dark:bg-brand-500/20',
        )}
      >
        {message.avatar.slice(0, 2).toUpperCase()}
      </div>

      <div className={cn('flex max-w-[75%] flex-col', isOwn ? 'items-end' : 'items-start')}>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-medium text-[var(--color-text)]">
            {message.senderName}
          </span>
          <span className="text-[10px] text-[var(--color-text-secondary)]">
            {getTime(message.createdAt)}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-[var(--color-text-secondary)]">
            <Clock size={10} />
            {countdown}
          </span>
        </div>

        {message.replyTo ? (
          <div className="mb-1 rounded-md border-l-2 border-brand-500 bg-[var(--color-bg-secondary)] px-2.5 py-1 text-xs text-[var(--color-text-secondary)]">
            Replying to a message
          </div>
        ) : null}

        {message.contentType === 'gif' && message.mediaUrl ? (
          <div className={cn(
            'overflow-hidden rounded-2xl',
            isOwn ? 'rounded-tr-md' : 'rounded-tl-md',
          )}>
            <img
              src={message.mediaUrl}
              alt={message.content || 'GIF'}
              className="max-w-[280px] h-auto object-cover"
              loading="lazy"
            />
            {message.content ? (
              <p className={cn(
                'px-3.5 py-2 text-sm leading-relaxed',
                isOwn
                  ? 'bg-brand-500 text-white'
                  : 'bg-[var(--color-bg-secondary)] text-[var(--color-text)]',
              )}>
                {message.content}
              </p>
            ) : null}
          </div>
        ) : (
          <div
            className={cn(
              'rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
              isOwn
                ? 'bg-brand-500 text-white rounded-tr-md'
                : 'bg-[var(--color-bg-secondary)] text-[var(--color-text)] rounded-tl-md',
            )}
          >
            {message.content}
          </div>
        )}

        <div className={cn('mt-1 flex items-center gap-2', isHovered ? 'opacity-100' : 'opacity-0', 'transition-opacity')}>
          <button
            onClick={() => onReply(message)}
            className="text-[var(--color-text-secondary)] hover:text-brand-500 transition-colors"
            title="Reply"
          >
            <Reply size={14} />
          </button>
          <button
            onClick={() => onLike(message.id)}
            className={cn(
              'flex items-center gap-1 transition-colors',
              message.likes.includes(sessionId ?? '')
                ? 'text-red-500'
                : 'text-[var(--color-text-secondary)] hover:text-red-500',
            )}
            title="Like"
          >
            <Heart size={14} fill={message.likes.includes(sessionId ?? '') ? 'currentColor' : 'none'} />
            {message.likes.length > 0 && (
              <span className="text-xs">{message.likes.length}</span>
            )}
          </button>
          <button
            onClick={handleCopy}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
            title="Copy"
          >
            <Copy size={14} />
          </button>
          {isOwn ? (
            <button
              onClick={() => onDelete(message.id)}
              className="text-[var(--color-text-secondary)] hover:text-red-500 transition-colors"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          ) : (
            <button
              onClick={() => setShowReport(true)}
              className="text-[var(--color-text-secondary)] hover:text-orange-500 transition-colors"
              title="Report"
            >
              <Flag size={14} />
            </button>
          )}
        </div>
      </div>

      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        messageId={message.id}
      />
    </motion.div>
  );
});
