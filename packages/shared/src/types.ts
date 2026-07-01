export interface User {
  sessionId: string;
  displayName: string;
  avatar: string;
  universityId: string;
  isOnline: boolean;
  lastActive: string;
}

export type MessageContentType = 'text' | 'gif';

export interface PollOption {
  id: string;
  text: string;
  votes: string[];
  voterCount: number;
}

export interface Poll {
  id: string;
  roomId: string;
  question: string;
  options: PollOption[];
  createdBy: string;
  createdByName: string;
  totalVotes: number;
  isClosed: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  avatar: string;
  content: string;
  contentType: MessageContentType;
  mediaUrl?: string;
  replyTo: string | null;
  likes: string[];
  createdAt: string;
  expiresAt: string;
}

export interface University {
  id: string;
  name: string;
  cityId: string;
  cityName: string;
  isActive: boolean;
  memberCount: number;
}

export interface City {
  id: string;
  name: string;
  stateId: string;
  stateName: string;
  countryId: string;
  countryName: string;
  universityCount: number;
}

export interface Report {
  id: string;
  messageId: string;
  reportedBy: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface Announcement {
  id: string;
  roomId: string;
  content: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

export interface RoomState {
  university: University;
  users: User[];
  messages: Message[];
  onlineCount: number;
}
