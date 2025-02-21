import HttpStatusCodes from '@src/common/HttpStatusCodes';

import { IReq, IRes } from '@src/routes/common';
import { Response } from '@src/common/types';

/**
 * Validate session
 */
async function getValidateSessionIsExist(req: IReq, _: IRes): Promise<Response> {
  return new Promise((resolve) => {

    req.sessionStore.get(req.sessionID, async (err, session) => {

      let _resp = <Response>{
        httpStatus: HttpStatusCodes.OK,
        status: true,
        message: 'Session is valid',
      }

      if (err) {
        _resp = {
          httpStatus: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          status: false,
          message: 'Session retrieval error',
        }
      }
      else if (!session) {
        _resp = {
          httpStatus: HttpStatusCodes.UNAUTHORIZED,
          status: false,
          message: 'Unauthorized',
        }
      }
      resolve(_resp);
  });
});
}


export default {
  getValidateSessionIsExist,
} as const;