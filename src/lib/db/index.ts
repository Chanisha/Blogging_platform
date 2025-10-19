import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let client: postgres.Sql | null = null;
let db: ReturnType<typeof drizzle> | null = null;

function getClient() {
  if (!client) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    client = postgres(connectionString, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
    });
  }
  return client;
}

function getDb() {
  if (!db) {
    db = drizzle(getClient(), { schema });
  }
  return db;
}

export const getDatabaseClient = getClient;
export const getDatabase = getDb;

export { getClient as client, getDb as db };
