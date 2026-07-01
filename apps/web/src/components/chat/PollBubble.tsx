import { useState } from 'react';
import { BarChart3, CheckCircle, Clock } from 'lucide-react';
import type { Poll } from '@campus-chat/shared';
import { cn } from '../../lib/utils';
import { useChatStore } from '../../store/useChatStore';

interface PollBubbleProps {
  poll: Poll;
  onVote: (pollId: string, optionId: string) => void;
}

export function PollBubble({ poll, onVote }: PollBubbleProps) {
  const [votedOption, setVotedOption] = useState<string | null>(() => {
    const sessionId = useChatStore.getState().sessionId;
    if (!sessionId) return null;
    for (const opt of poll.options) {
      if (opt.votes.includes(sessionId)) return opt.id;
    }
    return null;
  });
  const sessionId = useChatStore((s) => s.sessionId);
  const isOwner = poll.createdBy === sessionId;
  const isExpired = new Date(poll.expiresAt) < new Date();
  const isClosed = poll.isClosed || isExpired;

  const timeLeft = () => {
    const diff = new Date(poll.expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Closed';
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVote = (optionId: string) => {
    if (votedOption || isClosed) return;
    setVotedOption(optionId);
    onVote(poll.id, optionId);
  };

  return (
    <div className="mx-4 my-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-brand-500" />
          <span className="text-sm font-semibold text-[var(--color-text)]">{poll.question}</span>
        </div>
        <div className="flex items-center gap-2">
          {isOwner ? (
            <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] text-brand-500">
              Your Poll
            </span>
          ) : null}
          <span className={cn(
            'flex items-center gap-1 text-[10px]',
            isClosed ? 'text-red-500' : 'text-[var(--color-text-secondary)]',
          )}>
            {isClosed ? <CheckCircle size={10} /> : <Clock size={10} />}
            {isClosed ? 'Closed' : timeLeft()}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {poll.options.map((option) => {
          const pct = poll.totalVotes > 0 ? Math.round((option.voterCount / poll.totalVotes) * 100) : 0;
          const isSelected = votedOption === option.id;
          const showResults = votedOption || isClosed;

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={!!votedOption || isClosed}
              className={cn(
                'relative w-full overflow-hidden rounded-lg border px-3 py-2.5 text-left transition-all',
                isSelected
                  ? 'border-brand-500 bg-brand-500/10'
                  : 'border-[var(--color-border)] hover:border-brand-500/50',
                (votedOption || isClosed) ? 'cursor-default' : 'cursor-pointer',
              )}
            >
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-sm text-[var(--color-text)]">{option.text}</span>
                {showResults ? (
                  <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                    {option.voterCount} ({pct}%)
                  </span>
                ) : null}
              </div>
              {showResults ? (
                <div
                  className={cn(
                    'absolute inset-y-0 left-0 rounded-lg transition-all duration-500',
                    isSelected ? 'bg-brand-500/20' : 'bg-[var(--color-bg)]',
                  )}
                  style={{ width: `${pct}%` }}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-[10px] text-[var(--color-text-secondary)]">
        {poll.totalVotes} vote{poll.totalVotes !== 1 ? 's' : ''} — by {poll.createdByName}
      </p>
    </div>
  );
}
