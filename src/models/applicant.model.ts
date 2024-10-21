import { Document, model, Schema, Types } from 'mongoose';
import type { Applicant as ApplicantI } from '../types';

// Skill Schema
const skillSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
});

// Experience Schema
const experienceSchema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true }, // Can be city, state, or country
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: false }, // Optional if still working
  description: { type: String, required: false },
});

// Education Schema
const educationSchema = new Schema({
  degree: { type: String, required: true }, // e.g., Bachelor's, Master's
  institution: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: false }, // Optional if still in school
  description: { type: String, required: false }, // Optional description or achievements
});

interface ApplicantDoc extends Omit<ApplicantI, 'userId'>, Document {
  userId: Schema.Types.ObjectId | string;
}

// Applicant Schema
const applicantSchema = new Schema<ApplicantDoc>({
  phone: { type: String, required: true },
  resumeLink: { type: String, required: true },
  coverLetter: { type: String, required: false },
  linkedin: { type: String, required: false },
  education: { type: [educationSchema], required: true }, // Array of Education objects
  skills: { type: [skillSchema], required: true }, // Array of Skill objects
  experiences: { type: [experienceSchema], required: true }, // Array of Experience objects
  // If extending from User, add userId (assuming User model exists)
  userId: { type: Types.ObjectId, ref: 'User', required: true },
});

// Create and export the Applicant model
export const Applicant = model('Applicant', applicantSchema);
