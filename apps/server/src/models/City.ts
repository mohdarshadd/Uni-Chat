import mongoose, { Schema, type Document } from 'mongoose';

export interface ICity extends Document {
  name: string;
  stateId: mongoose.Types.ObjectId;
  countryId: mongoose.Types.ObjectId;
  isActive: boolean;
}

const citySchema = new Schema<ICity>(
  {
    name: { type: String, required: true },
    stateId: { type: Schema.Types.ObjectId, ref: 'State', required: true, index: true },
    countryId: { type: Schema.Types.ObjectId, ref: 'Country', required: true, index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

citySchema.index({ name: 1, stateId: 1 }, { unique: true });
citySchema.index({ name: 'text' });

export const City = mongoose.model<ICity>('City', citySchema);
