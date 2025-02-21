import { IUser } from "@src/models/User";
import jwt from 'jsonwebtoken';

/**
 * Get a random number between 1 and 1,000,000,000,000
 */
export function getRandomInt(): number {
  return Math.floor(Math.random() * 1_000_000_000_000);
}

/**
 * Generate token
 */
export function getGenerateToken(
  email: IUser['email'],
  password: IUser['password']
){

  if (!email || !password) {
    throw new Error('Name and password must be provided');
  }

  return jwt.sign(
    { nameOrEmail: email, password },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}