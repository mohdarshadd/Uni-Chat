import mongoose, { Schema, type Document } from 'mongoose';

export interface ICountry extends Document {
  name: string;
  code: string;
  isActive: boolean;
}

const countrySchema = new Schema<ICountry>(
  {
    name: { type: String, required: true, unique: true, index: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Country = mongoose.model<ICountry>('Country', countrySchema);
