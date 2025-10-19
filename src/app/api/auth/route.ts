import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, action } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    console.log('Auth API called with:', { email, action })
    
    const db = getDatabase()
    console.log('Database connection established')

    if (action === 'login') {
      // Login
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

      if (user.length === 0) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }

      // Simple password check (in production, use bcrypt)
      if (user[0].password !== password) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }

      return NextResponse.json({
        message: 'Login successful',
        user: {
          id: user[0].id,
          email: user[0].email,
          username: user[0].username,
          role: user[0].role,
        }
      })

    } else if (action === 'register') {
      // Register
      const { username } = body

      if (!username) {
        return NextResponse.json(
          { error: 'Username is required' },
          { status: 400 }
        )
      }

      // Check if user already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

      if (existingUser.length > 0) {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 409 }
        )
      }

      // Create new user
      const newUser = await db
        .insert(users)
        .values({
          email,
          username,
          password, // In production, hash this password
          role: 'user',
        })
        .returning()

      return NextResponse.json({
        message: 'Registration successful',
        user: {
          id: newUser[0].id,
          email: newUser[0].email,
          username: newUser[0].username,
          role: newUser[0].role,
        }
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Auth error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
