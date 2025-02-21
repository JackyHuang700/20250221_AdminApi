
import MongoOrm from '@src/repos/MongoOrm';
import { getRandomInt } from '@src/util/misc';

import { IUser } from '@src/models/User';
import { Document } from 'mongodb';

/******************************************************************************
                                Functions
******************************************************************************/


async function getUserCollection() {
    return await (await MongoOrm.openDb()).collection('users');
}

/**
 * Get one user.
 */
async function getOne(email: IUser['email']): Promise<Document | null | IUser> {
  return await (await getUserCollection()).findOne({ email });
}

/**
 * See if a user with the given id exists.
 */
async function persists(id: IUser['id']): Promise<boolean> {
  return await (await getUserCollection()).findOne({ id }) !== null;
}

/**
 * Get all users.
 */
async function getAll(): Promise<Document[]> {
  return await (await getUserCollection()).find().toArray();
}

/**
 * Add one user.
 */
async function add(user: IUser): Promise<Document | undefined> {

  try {
    const collection = await getUserCollection();
    user.id = getRandomInt();
    return await collection.insertOne(user);
  } catch (error) {
    return undefined;
  } finally {
    MongoOrm.closeDb();
  }
}

/**
 * Update a user.
 */
async function update(user: IUser): Promise<Document | null> {

  const collection = await getUserCollection();
  return await collection.updateOne({ id: user.id }, { $set: user });
}

/**
 * Delete one user.
 */
async function delete_(id: number): Promise<void> {

  const collection = await getUserCollection();
  await collection.deleteOne({ id });
}

export default {
  getOne,
  persists,
  getAll,
  add,
  update,
  delete: delete_
}