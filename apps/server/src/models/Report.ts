import mongoose, { Schema, type Document } from 'mongoose';

export interface IReport extends Document {
  messageId: mongoose.Types.ObjectId;
  reportedBy: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    messageId: { type: Schema.Types.ObjectId, ref: 'Message', required: true, index: true },
    reportedBy: { type: String, required: true, index: true },
    reason: { type: String, required: true, maxlength: 500 },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'dismissed'],
      default: 'pending',
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

reportSchema.index({ status: 1, createdAt: -1 });

export const Report = mongoose.model<IReport>('Report', reportSchema);
