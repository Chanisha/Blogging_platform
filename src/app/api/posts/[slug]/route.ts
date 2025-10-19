import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'
import { posts } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const db = getDatabase()
    
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1)

    if (post.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post[0])
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const body = await request.json()
    const { title, content, excerpt, tags, featuredImage, published } = body

    const db = getDatabase()
    
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)
    const whereCondition = isUuid ? eq(posts.id, slug) : eq(posts.slug, slug)

    const updatedPost = await db
      .update(posts)
      .set({
        ...(title && { title: title.trim() }),
        ...(content && { content: content.trim() }),
        ...(excerpt !== undefined && { excerpt: excerpt?.trim() || null }),
        ...(tags && { tags }),
        ...(featuredImage !== undefined && { featuredImage: featuredImage?.trim() || null }),
        ...(published !== undefined && { 
          published,
          publishedAt: published ? new Date() : null 
        }),
        updatedAt: new Date(),
      })
      .where(whereCondition)
      .returning()

    if (updatedPost.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedPost[0])
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const db = getDatabase()
    
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)
    const whereCondition = isUuid ? eq(posts.id, slug) : eq(posts.slug, slug)

    const deletedPost = await db
      .delete(posts)
      .where(whereCondition)
      .returning()

    if (deletedPost.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
