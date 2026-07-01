export interface AnnouncementInput {
  roomId: string;
  content: string;
  createdBy: string;
  createdByName: string;
}

export interface AnnouncementResponse {
  id: string;
  roomId: string;
  content: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

// In-memory announcements (not persisted — they expire with the server)
const announcements = new Map<string, AnnouncementResponse>();
let counter = 0;

export function createAnnouncement(input: AnnouncementInput): AnnouncementResponse {
  counter++;
  const announcement: AnnouncementResponse = {
    id: `ann-${counter}-${Date.now()}`,
    roomId: input.roomId,
    content: input.content,
    createdBy: input.createdBy,
    createdByName: input.createdByName,
    createdAt: new Date().toISOString(),
  };
  announcements.set(announcement.id, announcement);
  return announcement;
}

export function getRoomAnnouncements(roomId: string): AnnouncementResponse[] {
  return Array.from(announcements.values()).filter((a) => a.roomId === roomId);
}
