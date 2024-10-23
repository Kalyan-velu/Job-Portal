import type { Request, Response } from 'express';
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '../../../common/response';

export const getCurrentUser = (req: Request, res: Response) => {
  try {
    sendSuccessResponse(res, req.user);
  } catch (e) {
    sendErrorResponse(res, e, 500);
  }
};
export const getAllUser = (req: Request, res: Response) => {
  try {
    sendSuccessResponse(res, {});
  } catch (e) {
    sendErrorResponse(res, e, 500);
  }
};
