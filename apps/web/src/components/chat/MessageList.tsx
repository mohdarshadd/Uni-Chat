import { useRef, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { PollBubble } from './PollBubble';
import type { Message, Poll } from '@campus-chat/shared';
import { useChatStore } from '../../store/useChatStore';

type TimelineItem =
  | { kind: 'message'; ts: number; message: Message }
  | { kind: 'poll'; ts: number; poll: Poll };

function buildTimeline(messages: Message[], polls: Poll[]): TimelineItem[] {
  const items: TimelineItem[] = [
    ...messages.map((m) => ({ kind: 'message' as const, ts: new Date(m.createdAt).getTime(), message: m })),
    ...polls.map((p) => ({ kind: 'poll' as const, ts: new Date(p.createdAt).getTime(), poll: p })),
  ];
  return items.sort((a, b) => a.ts - b.ts);
}

interface MessageListProps {
  messages: Message[];
  polls: Poll[];
  onReply: (message: Message) => void;
  onDelete: (messageId: string) => void;
  onLike: (messageId: string) => void;
  onVote: (pollId: string, optionId: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

export function MessageList({
  messages,
  polls,
  onReply,
  onDelete,
  onLike,
  onVote,
  onLoadMore,
  hasMore,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingUsers = useChatStore((s) => s.typingUsers);
  const prevMessageCount = useRef(messages.length);

  useEffect(() => {
    if (messages.length > prevMessageCount.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMessageCount.current = messages.length;
  }, [messages.length]);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || !hasMore) return;
    if (container.scrollTop < 100) {
      onLoadMore();
    }
  }, [hasMore, onLoadMore]);

  const timeline = useMemo(
    () => buildTimeline(messages, polls),
    [messages, polls],
  );

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto scrollbar-thin py-2"
    >
      {hasMore ? (
        <div className="flex justify-center py-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        </div>
      ) : null}

      {/* Messages & Polls (chronological) */}
      <AnimatePresence initial={false}>
        {timeline.map((item) =>
          item.kind === 'message' ? (
            <MessageBubble
              key={item.message.id}
              message={item.message}
              onReply={onReply}
              onDelete={onDelete}
              onLike={onLike}
            />
          ) : (
            <PollBubble key={item.poll.id} poll={item.poll} onVote={onVote} />
          ),
        )}
      </AnimatePresence>

      {typingUsers.length > 0 ? (
        <TypingIndicator users={typingUsers} />
      ) : null}

      <div ref={bottomRef} />
    </div>
  );
}
