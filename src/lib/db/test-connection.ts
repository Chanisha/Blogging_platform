import { getDatabaseClient } from './index';

/**
 * Test the PostgreSQL database connection
 * @returns Promise<boolean> - true if connection is successful, false otherwise
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    // Get the client instance
    const client = getDatabaseClient();
    
    // Simple query to test the connection
    const result = await client`SELECT NOW() as current_time`;
    console.log('✅ Database connection successful:', result[0]);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

/**
 * Get database information
 * @returns Promise<object> - Database version and connection info
 */
export async function getDatabaseInfo(): Promise<{
  version: string;
  currentTime: string;
  database: string;
}> {
  try {
    const client = getDatabaseClient();
    
    const [versionResult, timeResult, dbResult] = await Promise.all([
      client`SELECT version() as version`,
      client`SELECT NOW() as current_time`,
      client`SELECT current_database() as database`,
    ]);

    return {
      version: versionResult[0].version,
      currentTime: timeResult[0].current_time,
      database: dbResult[0].database,
    };
  } catch (error) {
    console.error('Error getting database info:', error);
    throw error;
  }
}
