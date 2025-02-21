import { isString, isOptionalDate, isOptionalString, isOptionalNumber } from 'jet-validators';

import schema from '@src/util/schema';


/******************************************************************************
                                  Types
******************************************************************************/

export interface IUser {
  id: number | undefined;
  name: string;
  email: string;
  password: string;
  sessionKey: string | undefined;
  created: Date | undefined;
}


/******************************************************************************
                                 Setup
******************************************************************************/

const User = schema<IUser>({
  // id: isOptionalString,
  id: isOptionalNumber,
  name: isString,
  email: isString,
  password: isString,
  created: isOptionalDate,
  sessionKey: isOptionalString,
}, {} as any);


/******************************************************************************
                                Export default
******************************************************************************/

export default User;