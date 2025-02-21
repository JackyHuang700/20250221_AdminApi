import HttpStatusCodes from '@src/common/HttpStatusCodes';
import MongoUserRepo from '@src/repos/MongoUserRepo';
import bcrypt from 'bcrypt';
import { PASSWORD_SALT_ROUNDS, SESSION_NAME } from '@src/common/settings';
import { SESSION_KEY } from '@src/common/settings';
import { getGenerateToken } from '@src/util/misc';

import { IReq, IRes } from '@src/routes/common';
import { IUser } from '@src/models/User';
import { Response } from '@src/common/types';
import { Document } from 'mongodb';
/******************************************************************************
                                Variables
******************************************************************************/

export const USER_NOT_FOUND_ERR = 'User not found';

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get all users.
 */
function getAll(): Promise<Document[]> {
  return MongoUserRepo.getAll();
}

/**
 * Add one user.
 */
async function addOne(user: IUser, req: IReq): Promise<Response> {

  let _resp = <Response>{
    httpStatus: HttpStatusCodes.CREATED,
    status: true,
    message: 'User created',
  }

  // check if user already exists
  const exists = await MongoUserRepo.getOne(user.email);
  if (exists) {
    _resp = {
      httpStatus: HttpStatusCodes.CONFLICT,
      status: false,
      message: 'User already exists',
    }
    return Promise.resolve(_resp);
  }

  // check password
  if (!user.password) {
    _resp = {
      httpStatus: HttpStatusCodes.BAD_REQUEST,
      status: false,
      message: 'Password is required',
    }
    return Promise.resolve(_resp);
  }

  const _hashedPassword = await bcrypt.hash(user.password, PASSWORD_SALT_ROUNDS);

  user.created = new Date();
  user.sessionKey = getGenerateToken(user.email, user.password);
  user.password = _hashedPassword;

  // add user
  const _user = await MongoUserRepo.add(user);

  _resp.data = _user;

  req.session[SESSION_KEY] = getGenerateToken(user.email, user.password);

  return Promise.resolve(_resp);
}

/**
 * Update one user.
 */
async function updateOne(user: IUser): Promise<Response> {
  let _resp = <Response>{
    httpStatus: HttpStatusCodes.OK,
    status: true,
    message: 'User updated',
  }

  // check if user already exists
  const exists = await MongoUserRepo.getOne(user.email);
  if (!exists) {
    _resp = {
      httpStatus: HttpStatusCodes.CONFLICT,
      status: false,
      message: 'User not found',
    }
    return Promise.resolve(_resp);
  }

  // check id
  if (user.id !== exists.id) {
    _resp = {
      httpStatus: HttpStatusCodes.BAD_REQUEST,
      status: false,
      message: 'Id are different',
    }
    return Promise.resolve(_resp);
  }

  // check password
  if (user.password !== exists.password) {
    _resp = {
      httpStatus: HttpStatusCodes.BAD_REQUEST,
      status: false,
      message: 'Passwords are different',
    }
    return Promise.resolve(_resp);
  }

  exists.name = user.name;
  exists.password = user.password;

  await MongoUserRepo.update(user);
  return Promise.resolve(_resp);
}

/**
 * Delete a user by their id.
 */
async function _delete(id: IUser['id']): Promise<Response> {
  let _resp = <Response>{
    httpStatus: HttpStatusCodes.OK,
    status: true,
    message: 'User deleted',
  }

  if(!id){
    _resp = {
      httpStatus: HttpStatusCodes.BAD_REQUEST,
      status: false,
      message: 'Id is required',
    }
    return Promise.resolve(_resp);
  }

  // check if user already exists
  const exists = await MongoUserRepo.persists(id);
  if (!exists) {
    _resp = {
      httpStatus: HttpStatusCodes.CONFLICT,
      status: false,
      message: 'User not found',
    }
    return Promise.resolve(_resp);
  }

  await MongoUserRepo.delete(id);
  return Promise.resolve(_resp);
}

/**
 * Login user
 */
async function login(
  email: IUser['email'] | undefined,
  password: IUser['password'],
  req: IReq
): Promise<Response> {

  let _resp = <Response>{
    httpStatus: HttpStatusCodes.OK,
    status: true,
    message: 'User logged in successfully',
  }

  if (!email) {
    _resp = {
      httpStatus: HttpStatusCodes.BAD_REQUEST,
      status: false,
      message: 'Email is required',
    }
    return Promise.resolve(_resp);
  }

  const user = await MongoUserRepo.getOne(email);
  if (!user) {
    _resp = {
      httpStatus: HttpStatusCodes.NOT_FOUND,
      status: false,
      message: 'User not found',
    }
    return Promise.resolve(_resp);
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    _resp = {
      httpStatus: HttpStatusCodes.UNAUTHORIZED,
      status: false,
      message: 'Invalid password',
    }
    return Promise.resolve(_resp);
  }

  req.session[SESSION_KEY] = getGenerateToken(email, password);


  return Promise.resolve(_resp);
}

/**
 * Logout user
 */
async function logout(req: IReq, res: IRes): Promise<Response> {

  try {
    const _resp = await new Promise<Response>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject({
            httpStatus: HttpStatusCodes.INTERNAL_SERVER_ERROR,
            status: false,
            message: 'Error while logging out',
            data: err
          });
        } else {
          resolve({
            httpStatus: HttpStatusCodes.OK,
            status: true,
            message: 'User logged out successfully',
          });
        }
      });
    });


    if(!_resp.status){
      return _resp;
    }

    res?.clearCookie(SESSION_NAME);

    return {
        httpStatus: HttpStatusCodes.OK,
        status: true,
        message: 'User logged out successfully',
      }
  } catch (error) {
    return {
      httpStatus: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      status: false,
      message: 'Error while logging out',
    }
  }
}

/******************************************************************************
 Export default
 ******************************************************************************/

 export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
  login,
  logout,
} as const;
