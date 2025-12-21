import {
  type Options,
  rateLimit,
  type RateLimitRequestHandler,
} from 'express-rate-limit'

type RateLimiterOptions = Partial<Options>

/**
 * Creates a rate limiter function with configurable options.
 *
 * This function sets up a middleware to limit incoming requests
 * to a specified number within a given time window. It uses
 * default settings but allows overriding or extending them
 * through the `options` parameter.
 *
 * @param {RateLimiterOptions} [options] - Optional configuration for the rate limiter.
 * @returns {RateLimitRequestHandler} A middleware function to apply the rate limiting.
 */
export const limiter = (
  options?: RateLimiterOptions,
): RateLimitRequestHandler =>
  rateLimit({
    windowMs: 15 * 60 * 100,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    ...(options ?? {}),
  })
