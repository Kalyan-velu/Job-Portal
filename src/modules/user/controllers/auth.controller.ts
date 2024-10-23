import type { Request, Response } from 'express';
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '../../../common/response';
import { createSession } from '../../../middlewares/auth.middleware';
import { User } from '../../../models/user.model';
import type {
  BaseUserRegisterSchemaType,
  LoginType,
} from '../../../zod/user.schema';

interface LoginRequest extends Request {
  body: LoginType;
}

interface RegisterRequest extends Request {
  body: BaseUserRegisterSchemaType;
}

export const Login = async (req: LoginRequest, res: Response) => {
  try {
    const userDoc = await User.findOne({ email: req.body.email });
    if (!userDoc) {
      sendErrorResponse(res, "User doesn't  exist", 402);
      return;
    }
    // Verify the password (assuming you have a method on your User model)
    const isPasswordValid = await userDoc.comparePassword(req.body.password); // Assuming you have this method

    if (!isPasswordValid) {
      sendErrorResponse(res, 'Invalid password', 401); // Unauthorized
      return;
    }
    const user = userDoc.toJSON();
    req.user = { ...user };

    const token = createSession(req, res);
    if (user.role === 'employer' && !user.companyId) {
      sendSuccessResponse(res, {
        token,
        message: 'Please complete your company profile',
        redirectTo: '/app/company/create',
      });
      return;
    } else if (user.role === 'applicant' && !user.applicantId) {
      sendSuccessResponse(res, {
        token,
        message: 'Please complete your profile',
        redirectTo: '/app/applicant/update',
      });
      return;
    }

    sendSuccessResponse(res, { token, type: 'authorization' }, 'Success');
    return;
  } catch (e) {
    sendErrorResponse(res, e, 500);
    return;
  }
};
export const Register = async (req: RegisterRequest, res: Response) => {
  try {
    const { role, email, password, name, phoneNumber } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return sendErrorResponse(res, 'User already exists.', 400);
    }

    const newUser = new User({
      name,
      phoneNumber,
      email,
      password, // Remember to hash the password
      role,
    });

    await newUser.save();

    // Return the user without the password
    const user = newUser.toJSON();
    delete user.password;

    return sendSuccessResponse(res, user, 'User registered successfully.');
  } catch (e) {
    return sendErrorResponse(res, e.message || 'Internal server error', 500);
  }
};
