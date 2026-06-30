import { useEffect, useCallback, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSocket, connectSocket } from '../lib/socket';
import { api } from '../lib/api';
import { useChatStore } from '../store/useChatStore';
import type { Message } from '@campus-chat/shared';

export function useChat() {
  const { universityId } = useParams<{ universityId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();

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
  } = useChatStore();

  const joinRoom = useCallback(async () => {
    if (!universityId) return;

    setIsLoading(true);
    const socket = getSocket();

    if (!socket.connected) {
      connectSocket();
    }

    socket.emit('room:join', { universityId }, (response) => {
      if (response.success) {
        api
          .get(`/api/room/${universityId}`)
          .then(({ data }: { data: Message[] }) => {
            setMessages(data);
            setHasMore(data.length >= 50);
          })
          .catch(() => {})
          .finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });
  }, [universityId, setMessages]);

  useEffect(() => {
    const socket = getSocket();

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('room:joined', (data) => {
      setUniversity(data.university);
      setUsers(data.users, data.onlineCount);
      setMessages(data.messages);
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

    joinRoom();

    return () => {
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
      socket.off('typing:update');
    };
  }, [universityId, joinRoom, setConnected, setUniversity, setUsers, setMessages, addMessage, removeMessage, updateMessageLikes, setTypingUsers]);

  const sendMessage = useCallback(
    (content: string, replyToId?: string | null) => {
      const socket = getSocket();
      if (!socket.connected) return;

      socket.emit('message:send', { content, replyTo: replyToId }, (response) => {
        if (!response.success) {
          console.error('Failed to send message:', response.error);
        }
      });
    },
    [],
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
    loadMore,
    leaveRoom: joinRoom,
  };
}
