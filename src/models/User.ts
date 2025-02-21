import { isString, isOptionalDate, isOptionalString } from 'jet-validators';

import schema from '@src/util/schema';


/******************************************************************************
                                  Types
******************************************************************************/

export interface IUser {
  id: number | string;
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
  id: isOptionalString,
  name: isString,
  email: isString,
  password: isString,
  created: isOptionalDate,
  sessionKey: isOptionalString,
});


/******************************************************************************
                                Export default
******************************************************************************/

export default User;