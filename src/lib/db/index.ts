import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Lazy initialization of database connection
let client: postgres.Sql | null = null;
let db: ReturnType<typeof drizzle> | null = null;

function getClient() {
  if (!client) {
    // Get database URL from environment variables
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    // Configure postgres client with connection pooling and SSL
    client = postgres(connectionString, {
      max: 10, // Maximum number of connections in the pool
      idle_timeout: 20, // Close idle connections after 20 seconds
      connect_timeout: 10, // Connection timeout in seconds
      ssl: 'require', // Always require SSL for Neon PostgreSQL
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

// Export functions that return the client/db instances
export const getDatabaseClient = getClient;
export const getDatabase = getDb;

// For backward compatibility, export the instances directly
export { getClient as client, getDb as db };
