import bcrypt from 'bcryptjs'
import { Document, model, Schema } from 'mongoose'
import type { User as UserI } from '../types'; // Adjust the import according to your project structure

// Extend UserI to include comparePassword method
export interface UserDocument extends UserI, Document {
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['applicant', 'employer'], required: true },
  },
  {
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
  },
);

// Password hashing middleware
userSchema.pre<UserDocument>('save', async function (next) {
  // Only hash the password if it has been modified or is new
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next(); // Proceed to save the user
  } catch (error) {
    return next(error); // Pass any errors to the next middleware
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Create the User model with the correct type
export const User = model<UserDocument>('User', userSchema);
