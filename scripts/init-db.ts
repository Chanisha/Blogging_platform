#!/usr/bin/env node

/**
 * Simple Database Initialization
 * This script creates the necessary database tables
 */

import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env.local') });

async function initDatabase() {
  console.log('🗄️  Initializing database...');
  
  try {
    const { getDatabase } = await import('../src/lib/db');
    const { users, posts, comments } = await import('../src/lib/db/schema');
    
    const db = getDatabase();
    
    // Create default user
    console.log('👤 Creating default user...');
    const defaultUser = await db
      .insert(users)
      .values({
        email: 'admin@blog.com',
        username: 'admin',
        password: 'admin123',
        bio: 'Default administrator account',
        role: 'admin',
      })
      .onConflictDoNothing()
      .returning();
    
    console.log('✅ Database initialized successfully!');
    console.log('📋 Login credentials:');
    console.log('   Email: admin@blog.com');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error instanceof Error ? error.message : String(error));
  }
}

initDatabase();
