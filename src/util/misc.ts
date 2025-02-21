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
) {
  if (!email || !password) {
    throw new Error('Email and password must be provided');
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT secret is not defined');
  }

  return jwt.sign(
    { nameOrEmail: email, password },
    secret,
    { expiresIn: '1h' }
  );
}