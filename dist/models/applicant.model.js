"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Applicant = void 0;
const mongoose_1 = require("mongoose");
// Skill Schema
const skillSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
});
// Experience Schema
const experienceSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true }, // Can be city, state, or country
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false }, // Optional if still working
    description: { type: String, required: false },
});
// Education Schema
const educationSchema = new mongoose_1.Schema({
    degree: { type: String, required: true }, // e.g., Bachelor's, Master's
    institution: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false }, // Optional if still in school
    description: { type: String, required: false }, // Optional description or achievements
});
// Applicant Schema
const applicantSchema = new mongoose_1.Schema({
    phone: { type: String, required: true },
    resumeLink: { type: String, required: true },
    coverLetter: { type: String, required: false },
    linkedin: { type: String, required: false },
    education: { type: [educationSchema], required: true }, // Array of Education objects
    skills: { type: [skillSchema], required: true }, // Array of Skill objects
    experiences: { type: [experienceSchema], required: true }, // Array of Experience objects
    // If extending from User, add userId (assuming User model exists)
    userId: { type: mongoose_1.Types.ObjectId, ref: 'User', required: true },
});
// Create and export the Applicant model
exports.Applicant = (0, mongoose_1.model)('Applicant', applicantSchema);
