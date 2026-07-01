import { useState, useRef, useCallback } from 'react';
import { Send, Smile, Reply as ReplyIcon, Image, X } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import type { Message } from '@campus-chat/shared';
import { MAX_MESSAGE_LENGTH } from '@campus-chat/shared';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { GifPicker } from './GifPicker';
import { motion, AnimatePresence } from 'framer-motion';

interface GifResult {
  id: string;
  url: string;
  previewUrl: string;
  title: string;
  width: number;
  height: number;
}

interface MessageInputProps {
  onSend: (content: string, replyTo?: string | null) => void;
  onSendGif?: (gif: GifResult, replyTo?: string | null) => void;
  replyTo: Message | null;
  onClearReply: () => void;
  isLoading?: boolean;
}

export function MessageInput({ onSend, onSendGif, replyTo, onClearReply, isLoading }: MessageInputProps) {
  const [content, setContent] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = content.trim();
    if (!trimmed || isLoading) return;

    onSend(trimmed, replyTo?.id ?? null);
    setContent('');
    onClearReply();
    setShowEmoji(false);
    inputRef.current?.focus();
  }, [content, isLoading, onSend, replyTo, onClearReply]);

  const handleGifSelect = useCallback((gif: GifResult) => {
    onSendGif?.(gif, replyTo?.id ?? null);
    onClearReply();
    inputRef.current?.focus();
  }, [onSendGif, replyTo, onClearReply]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setContent((prev) => prev + emoji.native);
    inputRef.current?.focus();
  };

  return (
    <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)] px-4 pb-4 pt-3">
      <AnimatePresence>
        {replyTo ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2 flex items-center gap-2 rounded-lg bg-[var(--color-bg-secondary)] px-3 py-2"
          >
            <ReplyIcon size={14} className="text-brand-500 flex-shrink-0" />
            <span className="flex-1 truncate text-sm text-[var(--color-text-secondary)]">
              Replying to <strong className="text-[var(--color-text)]">{replyTo.senderName}</strong>: {replyTo.contentType === 'gif' ? 'a GIF' : replyTo.content}
            </span>
            <button onClick={onClearReply} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
              <X size={16} />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="relative flex items-end gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            maxLength={MAX_MESSAGE_LENGTH}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3 pr-12 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            disabled={isLoading}
          />

          <div className="absolute bottom-2.5 right-2 flex items-center gap-1">
            <span className={cn(
              'text-[11px]',
              content.length > MAX_MESSAGE_LENGTH * 0.9
                ? 'text-red-500'
                : 'text-[var(--color-text-secondary)]'
            )}>
              {content.length}/{MAX_MESSAGE_LENGTH}
            </span>
            <button
              onClick={() => { setShowEmoji(false); setShowGif(!showGif); }}
              className="rounded-lg p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] hover:text-brand-500 transition-colors"
              title="GIF"
            >
              <Image size={18} />
            </button>
            <button
              onClick={() => { setShowGif(false); setShowEmoji(!showEmoji); }}
              className="rounded-lg p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)] transition-colors"
            >
              <Smile size={18} />
            </button>
          </div>
        </div>

        <Button
          onClick={handleSend}
          disabled={!content.trim() || isLoading}
          isLoading={isLoading}
          className="flex-shrink-0"
          size="md"
        >
          <Send size={18} />
        </Button>
      </div>

      <GifPicker
        isOpen={showGif}
        onClose={() => setShowGif(false)}
        onSelect={handleGifSelect}
      />

      <AnimatePresence>
        {showEmoji ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full right-4 mb-2"
          >
            <Picker
              data={data}
              onEmojiSelect={handleEmojiSelect}
              theme="dark"
              previewPosition="none"
              skinTonePosition="none"
              set="native"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
