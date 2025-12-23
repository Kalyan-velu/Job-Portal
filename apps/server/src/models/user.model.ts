import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { CallbackError, Document, model, Schema } from 'mongoose'
import type { User as UserI } from '../types' // Adjust the import according to your project structure
// Extend UserI to include the comparePassword method
export interface UserDocument
  extends Omit<UserI, 'companyId' | 'applicantId' | 'id'>,
    Document {
  comparePassword: (password: string) => Promise<boolean>
  companyId: Schema.Types.ObjectId | string
  applicantId: Schema.Types.ObjectId | string
  verificationToken: string | undefined
  resetPasswordToken: string | undefined
  resetPasswordExpires: Date | undefined | number
  verificationTokenExpires: Date | undefined | number
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['applicant', 'employer'], required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    verificationToken: { type: String },
    isVerified: { type: Boolean, default: false },
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: 'Applicant',
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    verificationTokenExpires: { type: Date },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
    toJSON: {
      transform(doc, rec) {
        const { password: _p, __v: _v, ...ret } = rec
        return ret
      },
    },
  },
)

userSchema.virtual('id').get(function () {
  return (this._id as string | undefined)?.toString()
})

// Ensure `toJSON` and `toObject` include virtuals
userSchema.set('toJSON', { virtuals: true })
userSchema.set('toObject', { virtuals: true })

userSchema.pre<UserDocument>('save', async function (next) {
  if (this.isNew) {
    this.verificationToken = crypto.randomBytes(32).toString('hex')
    this.verificationTokenExpires = Date.now() + 2 * 24 * 60 * 60 * 1000 // 2 days
  }
  next()
})

// Password hashing middleware
userSchema.pre<UserDocument>('save', async function (next) {
  // Only hash the password if it has been modified or is new
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(10) // Generate salt

    this.password = await bcrypt.hash(this.password, salt) // Hash the password
    next() // Proceed to save the user
  } catch (error) {
    return next(error as CallbackError) // Pass any errors to the next middleware
  }
})

// Method to compare password
userSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password)
}
// Create the User model with the correct type
export const User = model<UserDocument>('User', userSchema)
