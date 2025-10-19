import { getDatabase } from '../src/lib/db'
import { users } from '../src/lib/db/schema'

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing database...')
    
    const db = getDatabase()
    console.log('✅ Database connection established')
    
    const existingUsers = await db.select().from(users).limit(1)
    
    if (existingUsers.length > 0) {
      console.log('✅ Database already initialized with users')
      return
    }
    
    const defaultUser = await db.insert(users).values({
      email: 'admin@example.com',
      username: 'admin',
      password: 'password123',
      role: 'admin',
    }).returning()
    
    console.log('✅ Default admin user created:', {
      id: defaultUser[0].id,
      email: defaultUser[0].email,
      username: defaultUser[0].username,
      role: defaultUser[0].role,
    })
    
    console.log('🎉 Database initialization completed successfully!')
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error instanceof Error ? error.message : String(error));
  }
}

initializeDatabase()