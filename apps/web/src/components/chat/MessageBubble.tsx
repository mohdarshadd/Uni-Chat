import { memo, useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Heart, Copy, Trash2, Reply, Clock, Flag } from 'lucide-react';
import type { Message } from '@campus-chat/shared';
import { cn, getTime, getAvatarEmoji } from '../../lib/utils';
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

function isSingleEmojiMessage(content: string): boolean {
  const trimmed = content.trim();
  if (!trimmed) return false;

  let graphemeCount = 0;
  try {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    for (const _ of segmenter.segment(trimmed)) {
      graphemeCount++;
      if (graphemeCount > 1) return false;
    }
  } catch {
    if (Array.from(trimmed).length > 2) return false;
  }

  return /\p{Extended_Pictographic}/u.test(trimmed) && !/[A-Za-z0-9]/.test(trimmed);
}

export const MessageBubble = memo(function MessageBubble({
  message,
  onReply,
  onDelete,
  onLike,
}: MessageBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const lastTapRef = useRef(0);
  const sessionId = useChatStore((s) => s.sessionId);
  const messages = useChatStore((s) => s.messages);
  const isOwn = message.senderId === sessionId;
  const x = useMotionValue(0);
  const replyHintOpacity = useTransform(
    x,
    isOwn ? [-70, -20] : [20, 70],
    isOwn ? [1, 0] : [0, 1],
  );
  const replyHintX = useTransform(
    x,
    isOwn ? [-70, -20] : [20, 70],
    isOwn ? [-6, -18] : [18, 6],
  );
  const countdown = useCountdown(message.expiresAt);
  const isSingleEmoji = message.contentType !== 'gif' && isSingleEmojiMessage(message.content);
  const repliedMessage = message.replyTo
    ? messages.find((m) => m.id === message.replyTo) ?? null
    : null;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const handleDoubleTapLike = () => {
    const alreadyLiked = message.likes.includes(sessionId ?? '');
    setShowBurst(true);
    setTimeout(() => setShowBurst(false), 700);
    if (!alreadyLiked) onLike(message.id);
  };

  const handleContainerTap = (e: MouseEvent | TouchEvent | PointerEvent) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('button')) return;
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      lastTapRef.current = 0;
      handleDoubleTapLike();
    } else {
      lastTapRef.current = now;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      drag="x"
      dragDirectionLock
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.45}
      style={{ x }}
      onDragEnd={(_, info) => {
        if (isOwn ? info.offset.x < -70 : info.offset.x > 70) {
          onReply(message);
        }
      }}
      onTap={handleContainerTap}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative flex gap-2.5 px-4 py-1.5 transition-colors hover:bg-[var(--color-bg-secondary)]/50',
        isOwn ? 'flex-row-reverse' : '',
      )}
    >
      <motion.span
        style={{ opacity: replyHintOpacity, x: replyHintX, translateX: '-50%' }}
        className={cn(
          'pointer-events-none absolute top-1/2 -translate-y-1/2 z-10 text-brand-500',
          isOwn ? 'right-6' : 'left-6',
        )}
      >
        <Reply size={18} />
      </motion.span>

      <AnimatePresence>
        {showBurst ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.15, opacity: 1 }}
            exit={{ scale: 1.7, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
          >
            <Heart
              size={44}
              className={cn(
                'drop-shadow-lg',
                message.likes.includes(sessionId ?? '') ? 'fill-red-500 text-red-500' : 'text-red-500',
              )}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div
        className={cn(
          'flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-base',
          'bg-brand-500/10 text-brand-500 dark:bg-brand-500/20',
        )}
      >
        {getAvatarEmoji(message.avatar)}
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
          <div className="mb-1 flex max-w-[280px] items-center gap-1.5 rounded-md border-l-2 border-brand-500 bg-[var(--color-bg-secondary)] px-2.5 py-1 text-xs text-[var(--color-text-secondary)]">
            {repliedMessage ? (
              <>
                <strong className="truncate text-[var(--color-text)]">{repliedMessage.senderName}</strong>
                <span className="truncate">
                  {repliedMessage.contentType === 'gif' ? 'sent a GIF' : repliedMessage.content}
                </span>
              </>
            ) : (
              <span>Replying to a message</span>
            )}
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
          </div>
        ) : isSingleEmoji ? (
          <div className="select-text py-0.5 text-5xl leading-none sm:text-6xl">
            {message.content}
          </div>
        ) : (
          <div
            className={cn(
              'max-w-full rounded-2xl px-3.5 py-2 text-sm leading-relaxed [overflow-wrap:anywhere]',
              isOwn
                ? 'bg-brand-500 text-[var(--color-on-accent)] rounded-tr-md'
                : 'bg-[var(--color-bg-secondary)] text-[var(--color-text)] rounded-tl-md',
            )}
          >
            {message.content}
          </div>
        )}

        {message.likes.length > 0 ? (
          <div className={cn('mt-0.5 flex', isOwn ? 'justify-end' : 'justify-start')}>
            <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-500">
              <Heart size={10} fill="currentColor" />
              {message.likes.length}
            </span>
          </div>
        ) : null}

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
