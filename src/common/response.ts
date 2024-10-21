import type { Response } from 'express';

interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

interface ErrorResponse {
  success: false;
  error: string;
  statusCode: number;
}

/**
 * Sends a success response.
 * @param res - The Express response object
 * @param data - The data to send in the response
 * @param message - Optional message to include in the response
 */
export const sendSuccessResponse = <T>(
  res: Response,
  data: T,
  message?: string,
): void => {
  res.status(200).json({
    success: true,
    data,
    message,
  });
  return;
};

/**
 * Sends an error response.
 * @param res - The Express response object
 * @param error - The error message to send in the response
 * @param statusCode - The HTTP status code (default is 500)
 */
export const sendErrorResponse = (
  res: Response,
  error: unknown,
  statusCode: number = 500,
): void => {
  console.debug('ℹ️ ~ file: response.ts:44 ~ error:', error);
  res.status(statusCode).json({
    success: false,
    error,
    statusCode,
  });
  return;
};
