import { RouteError } from '@src/common/route-errors';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import bcrypt from 'bcrypt';
import { PASSWORD_SALT_ROUNDS, SESSION_NAME } from '@src/common/settings';
import { getGenerateToken } from '@src/util/misc';

import UserRepo from '@src/repos/UserRepo';
import { IUser } from '@src/models/User';
import { IReq, IRes } from '@src/routes/common';
import { Response } from '@src/common/types';

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
function getAll(): Promise<IUser[]> {
  return UserRepo.getAll();
}

/**
 * Add one user.
 */
async function addOne(user: IUser): Promise<Response> {

  let _resp = <Response>{
    httpStatus: HttpStatusCodes.CREATED,
    status: true,
    message: 'User created',
  }

  // check if user already exists
  const exists = await UserRepo.getOne(user.email);
  if (exists) {
    _resp = {
      httpStatus: HttpStatusCodes.CONFLICT,
      status: false,
      message: 'User already exists',
    }
    return Promise.resolve(_resp);
  }

  // check name
  const _canValidateName = false;
  if (_canValidateName && !user.name) {
    _resp = {
      httpStatus: HttpStatusCodes.BAD_REQUEST,
      status: false,
      message: 'Name is required',
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
  user.password = _hashedPassword;
  user.sessionKey = getGenerateToken(user.email, user.password);
  _resp.data = user;

  await UserRepo.add(user);
  return Promise.resolve(_resp);
}

/**
 * Update one user.
 */
async function updateOne(user: IUser): Promise<void> {
  const persists = await UserRepo.persists(user.id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      USER_NOT_FOUND_ERR,
    );
  }
  // Return user
  return UserRepo.update(user);
}

/**
 * Delete a user by their id.
 */
async function _delete(id: number): Promise<void> {
  const persists = await UserRepo.persists(id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      USER_NOT_FOUND_ERR,
    );
  }
  // Delete user
  return UserRepo.delete(id);
}

/**
 * Login user
 */
async function login(
  email: IUser['email'] | undefined,
  password: IUser['password'],
): Promise<Response> {

  let _resp = <Response>{
    httpStatus: HttpStatusCodes.OK,
    status: true,
    message: 'User logged in successfully',
  }

  if(!email){
    _resp = {
      httpStatus: HttpStatusCodes.BAD_REQUEST,
      status: false,
      message: 'Email is required',
    }
    return Promise.resolve(_resp);
  }

  const user = await UserRepo.getOne(email);
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

  user.sessionKey = getGenerateToken(user.email, user.password);
  _resp.data = user;
  return Promise.resolve(_resp);
}

/**
 * Logout user
 */
async function logout(req: IReq, res: IRes):Promise<Response> {

  try {

    await new Promise<Response>((resolve, reject) => {
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

    res.clearCookie(SESSION_NAME);

    return Promise.resolve({
      httpStatus: HttpStatusCodes.OK,
      status: true,
      message: 'User logged out successfully',
    });
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




