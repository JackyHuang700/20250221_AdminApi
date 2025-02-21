import { isNumber, isString, isOptionalString } from 'jet-validators';
import { transform } from 'jet-validators/utils';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import MongoUserService from '@src/services/MongoUserService';
import CommonUserService from '@src/services/CommonUserService';
import User from '@src/models/User';

import { parseReq, IReq, IRes } from './common';


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

 const _canRun = false
 if(_canRun){
  const {
    httpStatus,
    ...params
  } = await CommonUserService.getValidateSessionIsExist(req, res);

  if(!params.status){
     res.status(httpStatus).json(params);
     return;
  }
 }

  const users = await MongoUserService.getAll();

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
  } = await MongoUserService.addOne(user, req);

  res.status(httpStatus).json(params);
}

/**
 * Update one user.
 */
async function update(req: IReq, res: IRes) {
  const { user } = Validators.update(req.body);

  const {
    httpStatus,
    ...params
  } = await MongoUserService.updateOne(user);

  res.status(httpStatus).json(params);
}

/**
 * Delete one user.
 */
async function delete_(req: IReq, res: IRes) {
  const { id } = Validators.delete(req.body);

  const {
    httpStatus,
    ...params
  } = await MongoUserService.delete(id);

  res.status(httpStatus).json(params);
}

/**
 * Login user
 */
async function login(req: IReq, res: IRes) {
  const { email, password } = Validators.login(req.body);

  const {
    httpStatus,
    ...params
  } = await MongoUserService.login(email, password, req);

  res.status(httpStatus).json(params);
}

/**
 * Logout user
 */
async function logout(req: IReq, res: IRes) {
  const {
    httpStatus,
    ...params
  } = await MongoUserService.logout(req, res);

  res.status(httpStatus).json(params);
}

export default {
  getAll,
  add,
  update,
  delete: delete_,
  login,
  logout,
}