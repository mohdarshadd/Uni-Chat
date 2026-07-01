import { create } from 'zustand';
import type { Message, Poll, User, University } from '@campus-chat/shared';

export interface AnnouncementItem {
  id: string;
  content: string;
  createdByName: string;
  createdAt: string;
}

interface ChatState {
  // Connection
  isConnected: boolean;
  setConnected: (connected: boolean) => void;

  // Room
  university: University | null;
  setUniversity: (university: University) => void;

  // Users
  users: User[];
  onlineCount: number;
  setUsers: (users: User[], onlineCount: number) => void;

  // Messages
  messages: Message[];
  addMessage: (message: Message) => void;
  removeMessage: (messageId: string) => void;
  updateMessageLikes: (messageId: string, likes: string[]) => void;
  setMessages: (messages: Message[]) => void;

  // Polls
  polls: Poll[];
  addPoll: (poll: Poll) => void;
  updatePoll: (poll: Poll) => void;
  setPolls: (polls: Poll[]) => void;

  // Announcements
  announcements: AnnouncementItem[];
  addAnnouncement: (announcement: AnnouncementItem) => void;
  setAnnouncements: (announcements: AnnouncementItem[]) => void;

  // Typing
  typingUsers: { userId: string; displayName: string }[];
  setTypingUsers: (users: { userId: string; displayName: string }[]) => void;

  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // User session
  sessionId: string | null;
  displayName: string | null;
  avatar: string | null;
  setSession: (sessionId: string, displayName: string, avatar: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  // Connection
  isConnected: false,
  setConnected: (isConnected) => set({ isConnected }),

  // Room
  university: null,
  setUniversity: (university) => set({ university }),

  // Users
  users: [],
  onlineCount: 0,
  setUsers: (users, onlineCount) => set({ users, onlineCount }),

  // Messages
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  removeMessage: (messageId) =>
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== messageId),
    })),
  updateMessageLikes: (messageId, likes) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId ? { ...m, likes } : m,
      ),
    })),
  setMessages: (messages) => set({ messages }),

  // Polls
  polls: [],
  addPoll: (poll) => set((state) => ({ polls: [...state.polls, poll] })),
  updatePoll: (poll) =>
    set((state) => ({
      polls: state.polls.map((p) => (p.id === poll.id ? poll : p)),
    })),
  setPolls: (polls) => set({ polls }),

  // Announcements
  announcements: [],
  addAnnouncement: (announcement) =>
    set((state) => ({ announcements: [...state.announcements, announcement] })),
  setAnnouncements: (announcements) => set({ announcements }),

  // Typing
  typingUsers: [],
  setTypingUsers: (typingUsers) => set({ typingUsers }),

  // Theme
  theme: (localStorage.getItem('theme') as 'light' | 'dark') ?? 'dark',
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      return { theme: newTheme };
    }),

  // Session
  sessionId: null,
  displayName: null,
  avatar: null,
  setSession: (sessionId, displayName, avatar) =>
    set({ sessionId, displayName, avatar }),
}));
