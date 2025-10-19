import { getDatabaseClient } from './index';

export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const client = getDatabaseClient();
    
    const result = await client`SELECT NOW() as current_time`;
    console.log('✅ Database connection successful:', result[0]);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

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
