import mongoose, { Schema, type Document } from 'mongoose';

export interface IState extends Document {
  name: string;
  countryId: mongoose.Types.ObjectId;
  isActive: boolean;
}

const stateSchema = new Schema<IState>(
  {
    name: { type: String, required: true },
    countryId: { type: Schema.Types.ObjectId, ref: 'Country', required: true, index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

stateSchema.index({ name: 1, countryId: 1 }, { unique: true });

export const State = mongoose.model<IState>('State', stateSchema);
