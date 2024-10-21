"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['applicant', 'employer'], required: true },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true,
    },
    toJSON: {
        transform(doc, ret) {
            delete ret.__v; // Remove __v field
            delete ret.password; // Do not expose the password field
            return ret;
        },
    },
});
// Password hashing middleware
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified or is new
    if (!this.isModified('password'))
        return next();
    try {
        const salt = await bcryptjs_1.default.genSalt(10); // Generate salt
        this.password = await bcryptjs_1.default.hash(this.password, salt); // Hash the password
        next(); // Proceed to save the user
    }
    catch (error) {
        return next(error); // Pass any errors to the next middleware
    }
});
// Method to compare password
userSchema.methods.comparePassword = async function (password) {
    return bcryptjs_1.default.compare(password, this.password);
};
// Create the User model with the correct type
exports.User = (0, mongoose_1.model)('User', userSchema);
