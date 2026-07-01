import type { Message, MessageContentType, User, University } from './types';

// ─── Client → Server Events ──────────────────────────────
export interface ClientToServerEvents {
  'room:join': (
    data: { universityId: string },
    ack: (response: { success: boolean; error?: string }) => void,
  ) => void;
  'room:leave': (data: { universityId: string }) => void;
  'message:send': (
    data: { content: string; contentType?: MessageContentType; mediaUrl?: string; replyTo?: string | null },
    ack: (response: { success: boolean; message?: Message; error?: string }) => void,
  ) => void;
  'message:delete': (data: { messageId: string }) => void;
  'message:like': (data: { messageId: string }) => void;
  'typing:start': (data: { universityId: string }) => void;
  'typing:stop': (data: { universityId: string }) => void;
}

// ─── Server → Client Events ──────────────────────────────
export interface ServerToClientEvents {
  'room:joined': (data: {
    university: University;
    users: User[];
    messages: Message[];
    onlineCount: number;
  }) => void;
  'room:members': (data: { users: User[]; onlineCount: number }) => void;
  'message:new': (data: Message) => void;
  'message:expired': (data: { messageId: string }) => void;
  'message:deleted': (data: { messageId: string }) => void;
  'message:liked': (data: { messageId: string; likes: string[] }) => void;
  'typing:update': (data: { userId: string; displayName: string; isTyping: boolean }) => void;
  'error': (data: { code: string; message: string }) => void;
}

// ─── Inter-Server Events ──────────────────────────────
export interface InterServerEvents {
  ping: () => void;
}

// ─── Socket Data ──────────────────────────────────────────
export interface SocketData {
  sessionId: string;
  displayName: string;
  avatar: string;
  universityId: string;
}
