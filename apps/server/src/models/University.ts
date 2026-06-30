import mongoose, { Schema, type Document } from 'mongoose';

export interface IUniversity extends Document {
  name: string;
  cityId: mongoose.Types.ObjectId;
  stateId: mongoose.Types.ObjectId;
  countryId: mongoose.Types.ObjectId;
  isActive: boolean;
  memberCount: number;
  description?: string;
}

const universitySchema = new Schema<IUniversity>(
  {
    name: { type: String, required: true },
    cityId: { type: Schema.Types.ObjectId, ref: 'City', required: true, index: true },
    stateId: { type: Schema.Types.ObjectId, ref: 'State', required: true, index: true },
    countryId: { type: Schema.Types.ObjectId, ref: 'Country', required: true, index: true },
    isActive: { type: Boolean, default: true },
    memberCount: { type: Number, default: 0 },
    description: { type: String },
  },
  { timestamps: true },
);

universitySchema.index({ name: 1, cityId: 1 }, { unique: true });
universitySchema.index({ name: 'text' });

export const University = mongoose.model<IUniversity>('University', universitySchema);
