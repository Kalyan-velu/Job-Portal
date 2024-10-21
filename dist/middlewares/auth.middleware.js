"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthAuth = exports.sessionAuth = exports.jwtAuth = exports.createSession = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_1 = require("../common/response");
const jwtSecret = process.env.JWT_SECRET; // Store this securely
const createSession = (req, res) => {
    // Define the payload for the token
    const payload = req.user;
    // Define your JWT secret and options
    const secret = process.env.JWT_SECRET; // Use environment variables for security
    const options = { expiresIn: '1h' }; // Token expiration time
    // Generate the token
    const token = jsonwebtoken_1.default.sign(payload, secret, options);
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
exports.createSession = createSession;
const jwtAuth = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        (0, response_1.sendErrorResponse)(res, 'Access denied. No token provided.', 401);
    }
    jsonwebtoken_1.default.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid token.');
        }
        req.user = decoded; // Attach user information to the request
        next();
    });
};
exports.jwtAuth = jwtAuth;
const sessionAuth = (req, res, next) => {
    //@ts-ignore
    if (req.session && req.session.user) {
        //@ts-ignore
        req.user = req.session.user; // Attach user information to the request
        next();
    }
    (0, response_1.sendErrorResponse)(res, 'Unauthorized access. No active session.', 401);
};
exports.sessionAuth = sessionAuth;
const oauthAuth = (req, res, next) => {
    // Implement your OAuth verification logic here
    const accessToken = req.headers['authorization'];
    if (isValidOAuthToken(accessToken)) {
        req.user = getUserFromToken(accessToken); // Mock function
        next();
    }
    (0, response_1.sendErrorResponse)(res, 'Invalid OAuth token.', 401);
};
exports.oauthAuth = oauthAuth;
// Mock functions for OAuth validation
const isValidOAuthToken = (token) => {
    // Implement validation logic
    return true; // Replace with actual validation
};
const getUserFromToken = (token) => {
    // Mock user retrieval from token
    return { id: '123', name: 'John Doe' };
};
