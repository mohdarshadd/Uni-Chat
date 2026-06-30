import mongoose, { Schema, type Document } from 'mongoose';

export interface IMessage extends Document {
  roomId: mongoose.Types.ObjectId;
  senderId: string;
  senderName: string;
  avatar: string;
  content: string;
  replyTo: mongoose.Types.ObjectId | null;
  likes: string[];
  createdAt: Date;
  expiresAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    roomId: { type: Schema.Types.ObjectId, ref: 'University', required: true, index: true },
    senderId: { type: String, required: true, index: true },
    senderName: { type: String, required: true },
    avatar: { type: String, default: '' },
    content: { type: String, required: true, maxlength: 1000 },
    replyTo: { type: Schema.Types.ObjectId, ref: 'Message', default: null },
    likes: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: false },
);

messageSchema.index({ createdAt: -1 });
messageSchema.index({ roomId: 1, createdAt: -1 });
messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Message = mongoose.model<IMessage>('Message', messageSchema);
