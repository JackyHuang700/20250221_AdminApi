import { isNumber, isString, isOptionalString } from 'jet-validators';
import { transform } from 'jet-validators/utils';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import User, { IUser } from '@src/models/User';
import UserService from '@src/services/UserService';
import CommonUserService from '@src/services/CommonUserService';

import { parseReq, IReq, IRes } from './common';
import { SESSION_KEY } from '@src/common/settings';


/******************************************************************************
                                Variables
******************************************************************************/

const Validators = {
  add: parseReq({ user: User.test }),
  update: parseReq({ user: User.test }),
  delete: parseReq({ id: transform(Number, isNumber) }),
  login: parseReq({ email: transform(String, isOptionalString), name: transform(String, isOptionalString), password: transform(String, isString) }),
} as const;


/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get all users.
 */
async function getAll(req: IReq, res: IRes) {

  const {
    httpStatus,
    ...params
  } = await CommonUserService.getValidateSessionIsExist(req, res);

  if(!params.status){
     res.status(httpStatus).json(params);
     return;
  }

  const users = await UserService.getAll();

  res.status(HttpStatusCodes.OK).json({ users });
}

/**
 * Add one user.
 */
async function add(req: IReq, res: IRes) {
  const { user } = Validators.add(req.body);

  const {
    httpStatus,
    ...params
  } = await UserService.addOne(user);

    if(params.status){
      req.session[SESSION_KEY] = (params.data as IUser).sessionKey;

  }

  res.status(httpStatus).json(params);
}

/**
 * Update one user.
 */
async function update(req: IReq, res: IRes) {
  const { user } = Validators.update(req.body);
  await UserService.updateOne(user);
  res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one user.
 */
async function delete_(req: IReq, res: IRes) {
  const { id } = Validators.delete(req.params);
  await UserService.delete(id);
  res.status(HttpStatusCodes.OK).end();
}

/**
 * Login user
 */
async function login(req: IReq, res: IRes) {

  const {
    email,
    password
   } = Validators.login(req.body);

  const {
    httpStatus,
    ...params
  } = await UserService.login(email, password);

  if(params.status){
    req.session[SESSION_KEY] = (params.data as IUser).sessionKey;
  }

  res.status(httpStatus).json(params);
}

/**
 * Logout user
 */
async function logout(req: IReq, res: IRes) {

  const {
    httpStatus,
    ...params
  } = await UserService.logout(req, res);

  res.status(httpStatus).json(params);
}


/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getAll,
  add,
  update,
  delete: delete_,
  login,
  logout,
} as const;


