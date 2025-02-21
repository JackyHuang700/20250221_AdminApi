
import { NextFunction } from 'express';
import { SESSION_KEY } from '@src/common/settings';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

import { IReq, IRes } from './common';

/**
 * Middleware to verify if user is authenticated.
 */
async function getAuthVerify(req: IReq, res: IRes, next: NextFunction) {

  if(!req.session[SESSION_KEY]){
     res.status(HttpStatusCodes.UNAUTHORIZED).json({ status: false, message: 'Unauthorized' });
     return;
  }

  next();
}

export default {
  getAuthVerify,
} as const;