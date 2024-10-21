"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Company = void 0;
const mongoose_1 = require("mongoose");
const companySchema = new mongoose_1.Schema({
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
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }, // Corrected: Use Schema.Types.ObjectId
}, {
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
});
// Create and export the Company model
exports.Company = (0, mongoose_1.model)('Company', companySchema);
