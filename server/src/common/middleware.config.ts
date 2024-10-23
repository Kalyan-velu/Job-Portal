import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import {
  jwtAuth,
  oauthAuth,
  sessionAuth,
} from '../middlewares/auth.middleware';
import { sendErrorResponse } from './response';

type AuthMethod = 'jwt' | 'session' | 'oauth';

interface AuthConfig {
  method: AuthMethod;
}

class MiddlewareConfig {
  private app: Express;

  configureMiddleware(app: Express) {
    this.app = app;
    console.debug('ℹ️ ~ Configuring middleware...');
    this.app.use(cors());
    this.app.use(cookieParser());
    this.app.use(morgan('combined'));
    this.app.use(express.json());

    this.app.use(compression());
    this.app.use(express.urlencoded({ extended: true }));
    this.errorHandlingMiddleware();
    this.staticFileServerMiddleware();
  }

  staticFileServerMiddleware() {
    this.app.use(express.static('public')); // Serve static files from 'public' directory
  }

  errorHandlingMiddleware() {
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack);
        res.status(500).send({ error: 'Something broke!' });
      },
    );
  }

  /**
   * Middleware to authenticate based on specified method.
   * @param {AuthConfig} config - Configuration for authentication method.
   * @returns {Function} - Express middleware function.
   */
  authMiddleware = (config: AuthConfig) => {
    return (req: Request, res: Response, next: NextFunction) => {
      switch (config.method) {
        case 'jwt':
          jwtAuth(req, res, next);
          break;
        case 'session':
          sessionAuth(req, res, next);
          break;
        case 'oauth':
          oauthAuth(req, res, next);
          break;
        default:
          sendErrorResponse(res, 'Invalid authentication method', 400);
      }
    };
  };

  attach({ name, property }: { name: string | 'mongoose'; property: unknown }) {
    this.app.use((req, res, next) => {
      req[name] = property; // Attach the property to the request object
      next(); // Call the next middleware in the stack
    });
  }

  log() {
    console.log('s');
  }
}

export const middleware = new MiddlewareConfig();
export default MiddlewareConfig;
