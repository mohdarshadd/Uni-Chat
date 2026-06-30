import { useRef, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import type { Message } from '@campus-chat/shared';
import { useChatStore } from '../../store/useChatStore';

interface MessageListProps {
  messages: Message[];
  onReply: (message: Message) => void;
  onDelete: (messageId: string) => void;
  onLike: (messageId: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

export function MessageList({
  messages,
  onReply,
  onDelete,
  onLike,
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

      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onReply={onReply}
            onDelete={onDelete}
            onLike={onLike}
          />
        ))}
      </AnimatePresence>

      {typingUsers.length > 0 ? (
        <TypingIndicator users={typingUsers} />
      ) : null}

      <div ref={bottomRef} />
    </div>
  );
}
