interface MuteEntry {
  sessionId: string;
  roomId: string;
  mutedUntil: Date;
}

const mutedUsers: Map<string, MuteEntry[]> = new Map();

export function isMuted(sessionId: string, roomId: string): boolean {
  const entries = mutedUsers.get(sessionId);
  if (!entries || entries.length === 0) return false;

  const now = new Date();
  const active = entries.filter(
    (e) => e.roomId === roomId && e.mutedUntil > now,
  );

  if (active.length === 0) {
    mutedUsers.delete(sessionId);
    return false;
  }

  return true;
}

export function muteUser(
  sessionId: string,
  roomId: string,
  durationMinutes: number = 5,
): void {
  const mutedUntil = new Date(Date.now() + durationMinutes * 60 * 1000);
  const entry: MuteEntry = { sessionId, roomId, mutedUntil };

  const existing = mutedUsers.get(sessionId) ?? [];
  existing.push(entry);
  mutedUsers.set(sessionId, existing);
}

export function unmuteUser(sessionId: string, roomId: string): void {
  const entries = mutedUsers.get(sessionId);
  if (!entries) return;

  const remaining = entries.filter((e) => e.roomId !== roomId);
  if (remaining.length === 0) {
    mutedUsers.delete(sessionId);
  } else {
    mutedUsers.set(sessionId, remaining);
  }
}

setInterval(() => {
  const now = new Date();
  for (const [sessionId, entries] of mutedUsers.entries()) {
    const active = entries.filter((e) => e.mutedUntil > now);
    if (active.length === 0) {
      mutedUsers.delete(sessionId);
    } else {
      mutedUsers.set(sessionId, active);
    }
  }
}, 60_000);
