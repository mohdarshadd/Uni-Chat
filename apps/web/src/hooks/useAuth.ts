import { useEffect, useCallback, useState } from 'react';
import { api } from '../lib/api';
import { getSocket } from '../lib/socket';
import { useChatStore } from '../store/useChatStore';

interface AuthResponse {
  token: string;
  sessionId: string;
  displayName: string;
  avatar: string;
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setSession, sessionId } = useChatStore();

  const createSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data } = await api.post<AuthResponse>('/api/auth/anonymous');

      sessionStorage.setItem('token', data.token);
      setSession(data.sessionId, data.displayName, data.avatar);

      const socket = getSocket();
      socket.auth = { token: data.token };
      socket.connect();

      return data;
    } catch {
      setError('Failed to create session');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setSession]);

  const rename = useCallback(
    async (newName: string): Promise<boolean> => {
      try {
        const { data } = await api.post<{ token: string; displayName: string }>(
          '/api/auth/rename',
          { displayName: newName },
        );

        sessionStorage.setItem('token', data.token);
        useChatStore.setState({ displayName: data.displayName });

        const socket = getSocket();
        socket.auth = { token: data.token };
        if (socket.connected) {
          socket.disconnect().connect();
        }

        return true;
      } catch {
        return false;
      }
    },
    [],
  );

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      api
        .post<AuthResponse>('/api/auth/refresh')
        .then(({ data }) => {
          sessionStorage.setItem('token', data.token);
          setSession(data.sessionId, data.displayName, data.avatar);

          const socket = getSocket();
          socket.auth = { token: data.token };
          socket.connect();
        })
        .catch(() => {
          sessionStorage.removeItem('token');
          createSession();
        })
        .finally(() => setIsLoading(false));
    } else {
      createSession();
    }
  }, [createSession, setSession]);

  return {
    isLoading,
    error,
    isAuthenticated: !!sessionId,
    rename,
  };
}
