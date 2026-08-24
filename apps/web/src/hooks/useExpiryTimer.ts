import { useEffect, useRef } from 'react';
import type { Message } from '@campus-chat/shared';
import { useChatStore } from '../store/useChatStore';

export function useExpiryTimer() {
  const messages = useChatStore((s) => s.messages);
  const removeMessage = useChatStore((s) => s.removeMessage);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const state = useChatStore.getState();
      const expiredMessages = state.messages.filter((m) => new Date(m.expiresAt).getTime() <= now);

      if (expiredMessages.length > 0) {
        expiredMessages.forEach((m) => state.removeMessage(m.id));
      }

      const expiredPolls = state.polls.filter((p) => new Date(p.expiresAt).getTime() <= now);

      if (expiredPolls.length > 0) {
        expiredPolls.forEach((p) => state.removePoll(p.id));
      }
    }, 2000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return null;
}
