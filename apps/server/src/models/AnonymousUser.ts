import mongoose, { Schema, type Document } from 'mongoose';

export interface IAnonymousUser extends Document {
  sessionId: string;
  displayName: string;
  avatar: string;
  universityId: mongoose.Types.ObjectId | null;
  lastActive: Date;
  isMuted: boolean;
  mutedUntil: Date | null;
}

const anonymousUserSchema = new Schema<IAnonymousUser>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    displayName: { type: String, required: true },
    avatar: { type: String, default: '' },
    universityId: { type: Schema.Types.ObjectId, ref: 'University', default: null },
    lastActive: { type: Date, default: Date.now },
    isMuted: { type: Boolean, default: false },
    mutedUntil: { type: Date, default: null },
  },
  { timestamps: true },
);

export const AnonymousUser = mongoose.model<IAnonymousUser>('AnonymousUser', anonymousUserSchema);
