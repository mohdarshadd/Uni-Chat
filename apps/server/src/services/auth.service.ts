import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env.js';
import type { IAnonymousUser } from '../models/AnonymousUser.js';
import { AnonymousUser } from '../models/AnonymousUser.js';
import { ADJECTIVES, ANIMALS } from '@campus-chat/shared';

interface JwtPayload {
  sessionId: string;
  displayName: string;
  avatar: string;
  iat: number;
  exp: number;
}

function generateAnonymousName(): { displayName: string; avatar: string } {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const displayName = `${adjective} ${animal}`;
  const avatar = animal.toLowerCase();
  return { displayName, avatar };
}

async function findOrCreateAnonymousUser(): Promise<IAnonymousUser> {
  const sessionId = uuidv4();
  const { displayName, avatar } = generateAnonymousName();

  const user = new AnonymousUser({
    sessionId,
    displayName,
    avatar,
  });

  return user.save();
}

function signToken(sessionId: string, displayName: string, avatar: string): string {
  return jwt.sign(
    { sessionId, displayName, avatar },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions,
  );
}

function signRefreshToken(sessionId: string): string {
  return jwt.sign(
    { sessionId, type: 'refresh' },
    env.JWT_SECRET,
    { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN } as jwt.SignOptions,
  );
}

export async function createAnonymousSession(): Promise<{
  token: string;
  refreshToken: string;
  sessionId: string;
  displayName: string;
  avatar: string;
}> {
  const user = await findOrCreateAnonymousUser();
  const token = signToken(user.sessionId, user.displayName, user.avatar);
  const refreshToken = signRefreshToken(user.sessionId);

  return {
    token,
    refreshToken,
    sessionId: user.sessionId,
    displayName: user.displayName,
    avatar: user.avatar,
  };
}

export async function refreshSession(refreshToken: string): Promise<{
  token: string;
  displayName: string;
  avatar: string;
} | null> {
  try {
    const payload = jwt.verify(refreshToken, env.JWT_SECRET) as { sessionId: string; type: string };
    if (payload.type !== 'refresh') return null;

    const user = await AnonymousUser.findOne({ sessionId: payload.sessionId });
    if (!user) return null;

    const token = signToken(user.sessionId, user.displayName, user.avatar);

    return {
      token,
      displayName: user.displayName,
      avatar: user.avatar,
    };
  } catch {
    return null;
  }
}

export async function updateDisplayName(
  sessionId: string,
  newName: string,
): Promise<{ token: string; displayName: string } | null> {
  const user = await AnonymousUser.findOne({ sessionId });
  if (!user) return null;

  user.displayName = newName;
  await user.save();

  const token = signToken(user.sessionId, user.displayName, user.avatar);

  return {
    token,
    displayName: user.displayName,
  };
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
