import { motion } from 'framer-motion';

interface TypingIndicatorProps {
  users: { userId: string; displayName: string }[];
}

export function TypingIndicator({ users }: TypingIndicatorProps) {
  if (users.length === 0) return null;

  const text =
    users.length === 1
      ? `${users[0].displayName} is typing...`
      : users.length === 2
        ? `${users[0].displayName} and ${users[1].displayName} are typing...`
        : `${users[0].displayName} and ${users.length - 1} others are typing...`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      className="flex items-center gap-2 px-4 py-1.5"
    >
      <div className="flex gap-1">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-text-secondary)]" style={{ animationDelay: '0ms' }} />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-text-secondary)]" style={{ animationDelay: '150ms' }} />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-text-secondary)]" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-xs italic text-[var(--color-text-secondary)]">
        {text}
      </span>
    </motion.div>
  );
}
