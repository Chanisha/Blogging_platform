import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'
import { posts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Post slug is required' },
        { status: 400 }
      )
    }

    const { title, content, tags, featuredImage, category, published, excerpt } = await request.json()

    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const db = getDatabase()
    
    // Check if post exists
    const existingPost = await db
      .select({ slug: posts.slug, publishedAt: posts.publishedAt })
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1)

    if (existingPost.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt?.trim() || null,
      featuredImage: featuredImage?.trim() || null,
      updatedAt: new Date(),
    }

    // Handle tags - support both array and comma-separated string
    if (tags) {
      if (Array.isArray(tags)) {
        updateData.tags = tags.filter(Boolean)
      } else {
        updateData.tags = tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
      }
    }

    // Handle published status
    if (typeof published === 'boolean') {
      updateData.published = published
      if (published && !existingPost[0].publishedAt) {
        updateData.publishedAt = new Date()
      } else if (!published) {
        updateData.publishedAt = null
      }
    }

    // Update the post
    const updatedPost = await db
      .update(posts)
      .set(updateData)
      .where(eq(posts.slug, slug))
      .returning()

    return NextResponse.json(
      { 
        message: 'Post updated successfully',
        post: updatedPost[0]
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
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
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Post slug is required' },
        { status: 400 }
      )
    }

    const db = getDatabase()
    
    // Check if post exists
    const existingPost = await db
      .select({ slug: posts.slug, publishedAt: posts.publishedAt })
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1)

    if (existingPost.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Delete the post
    await db
      .delete(posts)
      .where(eq(posts.slug, slug))

    return NextResponse.json(
      { 
        message: 'Post deleted successfully'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
