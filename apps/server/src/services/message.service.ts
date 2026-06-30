import { Message } from '../models/Message.js';
import { MESSAGE_TTL_MINUTES, MESSAGES_PER_PAGE } from '@campus-chat/shared';

export interface CreateMessageInput {
  roomId: string;
  senderId: string;
  senderName: string;
  avatar: string;
  content: string;
  replyTo?: string | null;
}

export interface MessageResponse {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  avatar: string;
  content: string;
  replyTo: string | null;
  likes: string[];
  createdAt: string;
  expiresAt: string;
}

function toResponse(msg: Record<string, any>): MessageResponse {
  return {
    id: msg._id.toString(),
    roomId: msg.roomId.toString(),
    senderId: msg.senderId,
    senderName: msg.senderName,
    avatar: msg.avatar,
    content: msg.content,
    replyTo: msg.replyTo?.toString() ?? null,
    likes: msg.likes ?? [],
    createdAt: new Date(msg.createdAt).toISOString(),
    expiresAt: new Date(msg.expiresAt).toISOString(),
  };
}

export async function createMessage(input: CreateMessageInput): Promise<MessageResponse> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + MESSAGE_TTL_MINUTES * 60 * 1000);

  const message = new Message({
    roomId: input.roomId,
    senderId: input.senderId,
    senderName: input.senderName,
    avatar: input.avatar,
    content: input.content,
    replyTo: input.replyTo || null,
    likes: [],
    createdAt: now,
    expiresAt,
  });

  await message.save();
  return toResponse(message);
}

export async function getMessages(
  roomId: string,
  before?: string,
  limit: number = MESSAGES_PER_PAGE,
): Promise<MessageResponse[]> {
  const filter: Record<string, unknown> = { roomId };
  if (before) {
    filter._id = { $lt: before };
  }

  const messages = await Message.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return messages.reverse().map(toResponse);
}

export async function deleteMessage(
  messageId: string,
  senderId: string,
): Promise<boolean> {
  const result = await Message.deleteOne({
    _id: messageId,
    senderId,
  });
  return result.deletedCount === 1;
}

export async function toggleLike(
  messageId: string,
  userId: string,
): Promise<string[] | null> {
  const message = await Message.findById(messageId);
  if (!message) return null;

  const index = message.likes.indexOf(userId);
  if (index === -1) {
    message.likes.push(userId);
  } else {
    message.likes.splice(index, 1);
  }

  await message.save();
  return message.likes;
}
