import mongoose, { Schema, type Document } from 'mongoose';

export interface IPollOption {
  id: string;
  text: string;
  votes: string[];
}

export interface IPoll extends Document {
  roomId: mongoose.Types.ObjectId;
  question: string;
  options: IPollOption[];
  createdBy: string;
  createdByName: string;
  isClosed: boolean;
  createdAt: Date;
  expiresAt: Date;
}

const pollOptionSchema = new Schema<IPollOption>(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    votes: [{ type: String }],
  },
  { _id: false },
);

const pollSchema = new Schema<IPoll>(
  {
    roomId: { type: Schema.Types.ObjectId, ref: 'University', required: true, index: true },
    question: { type: String, required: true, maxlength: 200 },
    options: { type: [pollOptionSchema], required: true },
    createdBy: { type: String, required: true },
    createdByName: { type: String, required: true },
    isClosed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 5 * 60 * 1000) },
  },
  { timestamps: false },
);

pollSchema.index({ roomId: 1, createdAt: -1 });

export const Poll = mongoose.model<IPoll>('Poll', pollSchema);
