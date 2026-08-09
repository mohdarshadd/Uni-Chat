import { useEffect, useCallback, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSocket } from '../lib/socket';
import { api } from '../lib/api';
import { useChatStore } from '../store/useChatStore';
import type { Message, MessageContentType, Poll } from '@campus-chat/shared';
import type { AnnouncementItem } from '../store/useChatStore';

export function useChat() {
  const { universityId } = useParams<{ universityId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();
  const joinAttemptedRef = useRef(false);
  const joinedRoomRef = useRef<string | null>(null);

  const {
    messages,
    addMessage,
    removeMessage,
    updateMessageLikes,
    setMessages,
    setUniversity,
    setUsers,
    setConnected,
    setTypingUsers,
    polls,
    addPoll,
    updatePoll,
    setPolls,
    announcements,
    addAnnouncement,
    setAnnouncements,
  } = useChatStore();

  const doJoin = useCallback(async (force = false) => {
    if (!universityId) return;
    if (joinAttemptedRef.current && !force) return;
    joinAttemptedRef.current = true;

    setIsLoading(true);
    const socket = getSocket();

    // Wait up to 12s for the socket to be connected (useAuth handles connection with proper auth)
    if (!socket.connected) {
      await Promise.race([
        new Promise<void>((resolve) => {
          socket.once('connect', () => resolve());
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 12000)),
      ]).catch(() => {});
    }

    if (!socket.connected) {
      // Fallback: connect ourselves with whatever auth is set
      socket.connect();
      await Promise.race([
        new Promise<void>((resolve) => {
          socket.once('connect', () => resolve());
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000)),
      ]).catch(() => {});
    }

    if (!socket.connected) {
      setIsLoading(false);
      return;
    }

    socket.emit('room:join', { universityId }, (response) => {
      if (response.success) {
        joinedRoomRef.current = universityId;
        Promise.all([
          api.get(`/api/room/${universityId}`),
          api.get(`/api/universities/${universityId}`),
        ])
          .then(([msgRes, uniRes]) => {
            setMessages(msgRes.data);
            setHasMore(msgRes.data.length >= 50);
            setUniversity(uniRes.data);
            localStorage.setItem('lastRoom', JSON.stringify({ id: uniRes.data.id, name: uniRes.data.name }));
          })
          .catch(() => {})
          .finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    setTimeout(() => setIsLoading(false), 8000);
  }, [universityId, setMessages, setUniversity]);

  useEffect(() => {
    const socket = getSocket();

    socket.on('connect', () => {
      setConnected(true);
      if (universityId && joinedRoomRef.current === universityId) {
        doJoin(true);
      } else if (universityId && !joinAttemptedRef.current) {
        doJoin();
      }
    });
    socket.on('disconnect', () => setConnected(false));

    socket.on('room:joined', (data) => {
      setUniversity(data.university);
      setUsers(data.users, data.onlineCount);
      setMessages(data.messages);
      localStorage.setItem('lastRoom', JSON.stringify({ id: data.university.id, name: data.university.name }));
    });

    socket.on('poll:new', (poll) => {
      addPoll(poll);
    });

    socket.on('poll:updated', (poll) => {
      updatePoll(poll);
    });

    socket.on('announcement:new', (data) => {
      addAnnouncement({ id: Date.now().toString(), ...data });
    });

    socket.on('room:members', (data) => {
      setUsers(data.users, data.onlineCount);
    });

    socket.on('message:new', (message) => {
      addMessage(message);
    });

    socket.on('message:expired', ({ messageId }) => {
      removeMessage(messageId);
    });

    socket.on('message:deleted', ({ messageId }) => {
      removeMessage(messageId);
    });

    socket.on('message:liked', ({ messageId, likes }) => {
      updateMessageLikes(messageId, likes);
    });

    socket.on('typing:update', (data) => {
      const state = useChatStore.getState();
      const prev = state.typingUsers;
      if (data.isTyping) {
        const exists = prev.some((u) => u.userId === data.userId);
        if (!exists) {
          state.setTypingUsers([...prev, { userId: data.userId, displayName: data.displayName }]);
        }
      } else {
        state.setTypingUsers(prev.filter((u) => u.userId !== data.userId));
      }
    });

    doJoin();

    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      const socket = getSocket();
      if (!socket.connected) {
        socket.connect();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      joinAttemptedRef.current = false;
      document.removeEventListener('visibilitychange', handleVisibility);
      if (universityId) {
        socket.emit('room:leave', { universityId });
      }
      socket.off('connect');
      socket.off('disconnect');
      socket.off('room:joined');
      socket.off('room:members');
      socket.off('message:new');
      socket.off('message:expired');
      socket.off('message:deleted');
      socket.off('message:liked');
      socket.off('poll:new');
      socket.off('poll:updated');
      socket.off('announcement:new');
      socket.off('typing:update');
    };
  }, [universityId, doJoin, setConnected, setUniversity, setUsers, setMessages, addMessage, removeMessage, updateMessageLikes, setTypingUsers, addPoll, updatePoll, addAnnouncement]);

  const ensureSocketReady = useCallback(async (): Promise<boolean> => {
    const socket = getSocket();
    if (!socket.connected) socket.connect();

    if (!socket.connected) {
      try {
        await Promise.race([
          new Promise<void>((resolve) => socket.once('connect', () => resolve())),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000)),
        ]);
      } catch {
        return false;
      }
    }

    if (universityId && joinedRoomRef.current !== universityId) {
      await doJoin();
    }

    return socket.connected;
  }, [universityId, doJoin]);

  const sendMessage = useCallback(
    async (content: string, replyToId?: string | null, gifData?: { url: string; title?: string }) => {
      const ready = await ensureSocketReady();
      if (!ready) return;

      const socket = getSocket();
      const payload: { content: string; contentType?: MessageContentType; mediaUrl?: string; replyTo?: string | null } = { content, replyTo: replyToId };
      if (gifData) {
        payload.contentType = 'gif';
        payload.mediaUrl = gifData.url;
      }

      socket.emit('message:send', payload, (response) => {
        if (!response.success) {
          console.error('Failed to send message:', response.error);
        }
      });
    },
    [ensureSocketReady],
  );

  const deleteMessage = useCallback((messageId: string) => {
    const socket = getSocket();
    socket.emit('message:delete', { messageId });
  }, []);

  const likeMessage = useCallback((messageId: string) => {
    const socket = getSocket();
    socket.emit('message:like', { messageId });
  }, []);

  const handleTyping = useCallback(
    (isTyping: boolean) => {
      if (!universityId) return;

      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      const socket = getSocket();
      if (isTyping) {
        socket.emit('typing:start', { universityId });
      } else {
        debounceTimer.current = setTimeout(() => {
          socket.emit('typing:stop', { universityId });
        }, 1000);
      }
    },
    [universityId],
  );

  const createPoll = useCallback(async (question: string, options: string[]) => {
    const ready = await ensureSocketReady();
    if (!ready) return;
    const socket = getSocket();
    socket.emit('poll:create', { question, options }, (response) => {
      if (!response.success) {
        console.error('Failed to create poll:', response.error);
      }
    });
  }, [ensureSocketReady]);

  const votePoll = useCallback(async (pollId: string, optionId: string) => {
    const ready = await ensureSocketReady();
    if (!ready) return;
    const socket = getSocket();
    socket.emit('poll:vote', { pollId, optionId }, (response) => {
      if (!response.success) {
        console.error('Failed to vote:', response.error);
      }
    });
  }, [ensureSocketReady]);

  const dismissAnnouncement = useCallback((id: string) => {
    const state = useChatStore.getState();
    state.setAnnouncements(state.announcements.filter((a) => a.id !== id));
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore || messages.length === 0) return;

    const oldestMessage = messages[0];
    try {
      const { data } = await api.get<Message[]>(
        `/api/room/${universityId}?before=${oldestMessage.id}`,
      );
      if (data.length < 50) setHasMore(false);
      setMessages([...data, ...messages]);
    } catch {
      // Silently fail
    }
  }, [hasMore, messages, universityId, setMessages]);

  return {
    isLoading,
    hasMore,
    replyTo,
    setReplyTo,
    sendMessage,
    deleteMessage,
    likeMessage,
    handleTyping,
    createPoll,
    votePoll,
    dismissAnnouncement,
    loadMore,
    leaveRoom: doJoin,
    polls,
    announcements,
  };
}
