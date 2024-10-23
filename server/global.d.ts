import { Mongoose } from 'mongoose';
import { User } from './types/index';

declare global {
  namespace Express {
    interface Request {
      user?: User; // Optional user object
      mongoose?: Mongoose; // Optional Mongoose instance
    }
  }
}
