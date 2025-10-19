import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'
import { posts } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
  try {
    const db = getDatabase()
    
    const allPosts = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))

    return NextResponse.json(allPosts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, excerpt, slug, authorId, tags, featuredImage, published } = body

    if (!title || !content || !slug || !authorId) {
      return NextResponse.json(
        { error: 'Title, content, slug, and authorId are required' },
        { status: 400 }
      )
    }

    const db = getDatabase()
    
    const newPost = await db
      .insert(posts)
      .values({
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt?.trim() || null,
        slug: slug.trim(),
        authorId,
        tags: tags || [],
        featuredImage: featuredImage?.trim() || null,
        published: published || false,
        publishedAt: published ? new Date() : null,
      })
      .returning()

    return NextResponse.json(newPost[0], { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
