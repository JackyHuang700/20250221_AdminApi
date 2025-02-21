import { MongoClient } from 'mongodb';
import type { Collection, CollectionOptions, Db, Document } from 'mongodb';

const dbConnection = process.env.DB_CONNECTION;
if (!dbConnection) {
  throw new Error('DB_CONNECTION environment variable is not set.');
}

const client = new MongoClient(dbConnection);

/******************************************************************************
                                Types
******************************************************************************/

interface IDb extends Db {
  collection<TSchema extends Document = Document>(name: 'users' | string, options?: CollectionOptions): Collection<TSchema>;
}

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * open the database.
 */
async function openDb(): Promise<IDb> {

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        await client.connect();
        const db = client.db('admin_test');

        resolve(db);
      } catch (error) {
        reject(new Error('Failed to connect to the database: ' + error.message));
      }
    })();
  });
}

/**
 * close the database.
 */
function closeDb(): Promise<void> {
    return new Promise( (resolve, reject) => {
    (async () => {
      try {
        await client.close();
        resolve();
      } catch (error) {
        reject(new Error('Failed to close the database connection: ' + error.message));
      }
    })();
  });
}

/******************************************************************************
                                Export default
******************************************************************************/
export default {
  openDb,
  closeDb,
} as const




