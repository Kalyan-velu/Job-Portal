import { Document, model, Schema } from 'mongoose';
import type { Company as CompanyI } from '../types'; // Adjust the import according to your project structure

// Extend CompanyI to include the Mongoose Document
export interface CompanyDocument extends Omit<CompanyI, 'createdBy'>, Document {
  createdBy: Schema.Types.ObjectId | string; // Allow both ObjectId and string for compatibility
}

const companySchema = new Schema<CompanyDocument>(
  {
    name: { type: String, required: true },
    industry: { type: String, required: true },
    siteUrl: { type: String, required: true },
    companySize: {
      type: String,
      enum: ['1-10', '1-50', '1-100', '1000<'],
      required: true,
    },
    based: { type: String, required: true },
    description: { type: String, required: true },
    socialMedia: [{ type: String }], // Array of strings for social media links
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Corrected: Use Schema.Types.ObjectId
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
    toJSON: {
      transform(doc, ret) {
        delete ret.__v; // Remove __v field
        return ret;
      },
    },
  },
);

// Create and export the Company model
export const Company = model<CompanyDocument>('Company', companySchema);