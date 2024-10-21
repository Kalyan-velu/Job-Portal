"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorResponse = exports.sendSuccessResponse = void 0;
/**
 * Sends a success response.
 * @param res - The Express response object
 * @param data - The data to send in the response
 * @param message - Optional message to include in the response
 */
const sendSuccessResponse = (res, data, message) => {
    res.status(200).json({
        success: true,
        data,
        message,
    });
    return;
};
exports.sendSuccessResponse = sendSuccessResponse;
/**
 * Sends an error response.
 * @param res - The Express response object
 * @param error - The error message to send in the response
 * @param statusCode - The HTTP status code (default is 500)
 */
const sendErrorResponse = (res, error, statusCode = 500) => {
    console.debug('ℹ️ ~ file: response.ts:44 ~ error:', error);
    res.status(statusCode).json({
        success: false,
        error,
        statusCode,
    });
    return;
};
exports.sendErrorResponse = sendErrorResponse;
