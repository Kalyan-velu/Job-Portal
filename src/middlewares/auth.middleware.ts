import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { sendErrorResponse } from '../common/response';
import type { User } from '../types';

const jwtSecret = process.env.JWT_SECRET; // Store this securely

export const createSession = (req: Request, res: Response): string => {
  // Define the payload for the token
  const payload = req.user;

  // Define your JWT secret and options
  const secret = process.env.JWT_SECRET; // Use environment variables for security
  const options = { expiresIn: '1h' }; // Token expiration time

  // Generate the token
  const token = jwt.sign(payload, secret, options);
  res.cookie('auth_token', token, {
    httpOnly: true, // Helps mitigate XSS attacks
    secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
    maxAge: 3600000, // 1 hour in milliseconds
  });

  // Set the token in the response header (optional)
  res.setHeader('Authorization', `Bearer ${token}`);

  // Optionally, store the session in your database here
  // e.g., sessionStore.createSession(user.id, token);

  return token; // Return the token for further use if needed
};

export const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    sendErrorResponse(res, 'Access denied. No token provided.', 401);
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid token.');
    }
    req.user = decoded; // Attach user information to the request
    next();
  });
};

export const sessionAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //@ts-ignore
  if (req.session && req.session.user) {
    //@ts-ignore
    req.user = req.session.user; // Attach user information to the request
    next();
  }
  sendErrorResponse(res, 'Unauthorized access. No active session.', 401);
};

export const oauthAuth = (req: Request, res: Response, next: NextFunction) => {
  // Implement your OAuth verification logic here
  const accessToken = req.headers['authorization'];

  if (isValidOAuthToken(accessToken)) {
    req.user = getUserFromToken(accessToken); // Mock function
    next();
  }
  sendErrorResponse(res, 'Invalid OAuth token.', 401);
};

// Mock functions for OAuth validation
const isValidOAuthToken = (token: string) => {
  // Implement validation logic
  return true; // Replace with actual validation
};

const getUserFromToken = (token: string) => {
  // Mock user retrieval from token
  return { id: '123', name: 'John Doe' } as User & { id: string };
};
