import type { Request, Response } from 'express';

import { sendErrorResponse, sendSuccessResponse } from '@/common/response';

export const Create = (req: Request, res: Response) => {
  try {
    sendSuccessResponse(res, {}, 'Success');
    return;
  } catch (e) {
    sendErrorResponse(res, e, 500);
    return;
  }
};
