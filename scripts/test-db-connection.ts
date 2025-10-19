#!/usr/bin/env node

/**
 * Database connection test script
 * Run this script to test your PostgreSQL connection
 * Usage: npx tsx scripts/test-db-connection.ts
 */

import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env file
config({ path: path.resolve(process.cwd(), '.env') });

import { testDatabaseConnection, getDatabaseInfo } from '../src/lib/db/test-connection';

async function main() {
  console.log('🔍 Testing PostgreSQL database connection...\n');

  // Test basic connection
  const isConnected = await testDatabaseConnection();
  
  if (isConnected) {
    console.log('\n📊 Getting database information...');
    try {
      const dbInfo = await getDatabaseInfo();
      console.log('📋 Database Information:');
      console.log(`   Database: ${dbInfo.database}`);
      console.log(`   Version: ${dbInfo.version.split(' ')[0]} ${dbInfo.version.split(' ')[1]}`);
      console.log(`   Current Time: ${dbInfo.currentTime}`);
      console.log('\n✅ PostgreSQL database is ready to use!');
    } catch (error) {
      console.error('❌ Error getting database info:', error);
    }
  } else {
    console.log('\n❌ Database connection failed. Please check your DATABASE_URL in .env file');
    process.exit(1);
  }
}

main().catch(console.error);
