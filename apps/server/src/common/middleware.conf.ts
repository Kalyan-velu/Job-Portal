import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Express, NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import { jwtAuth, oauthAuth, sessionAuth } from '../middlewares/auth.middleware'
import { sendErrorResponse } from './response'

type AuthMethod = 'jwt' | 'session' | 'oauth'

interface AuthConfig {
  method: AuthMethod
}

class Middleware {
  constructor(private app: Express) {
    this.configureMiddleware()
  }

  configureMiddleware() {
    const production = process.env.NODE_ENV === 'production'
    this.app.use(
      cors({
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        origin: production
          ? [
              'https://job-portal-production-8920.up.railway.app',
              'https://jobs.kalyanjyotiborah.pro',
            ]
          : [
              'http://localhost:3000',
              'https://job-portal-production-8920.up.railway.app',
              'https://jobs.kalyanjyotiborah.pro',
            ],
      }),
    )
    this.app.use(cookieParser())
    this.app.use(
      morgan(':method :url :status :res[content-length] - :response-time ms'),
    )
    this.app.use(express.json())

    this.app.use(compression())
    this.app.use(express.urlencoded({ extended: true }))
    this.errorHandlingMiddleware()
    this.staticFileServerMiddleware()
  }

  staticFileServerMiddleware() {
    this.app.use(express.static('public')) // Serve static files from 'public' directory
  }

  errorHandlingMiddleware() {
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack)
        return res
          .status(500)
          .json({ status: false, error: 'Something broke!' })
      },
    )
  }

  /**
   * Middleware to authenticate based on specified method.
   * @param {AuthConfig} config - Configuration for authentication method.
   * @returns {VoidFunction} - Express middleware function.
   */
  static AuthMiddleware = (config: AuthConfig) => {
    return (req: Request, res: Response, next: NextFunction) => {
      switch (config.method) {
        case 'jwt':
          jwtAuth(req, res, next)
          break
        case 'session':
          sessionAuth(req, res, next)
          break
        case 'oauth':
          oauthAuth(req, res, next)
          break
        default:
          sendErrorResponse(res, 'Invalid authentication method', 400)
      }
    }
  }
}

export default Middleware
