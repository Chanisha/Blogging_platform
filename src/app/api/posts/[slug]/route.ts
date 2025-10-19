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
    const body = await request.json()
    const { title, content, excerpt, tags, featuredImage, published } = body

    if (!slug) {
      return NextResponse.json(
        { error: 'Post slug is required' },
        { status: 400 }
      )
    }

    const db = getDatabase()

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

    const updateData: any = {
      title: title?.trim(),
      content: content?.trim(),
      excerpt: excerpt?.trim() || null,
      featuredImage: featuredImage?.trim() || null,
      published: Boolean(published),
      updatedAt: new Date(),
    }

    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        updateData.tags = tags.filter(Boolean)
      } else if (typeof tags === 'string') {
        updateData.tags = tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
      }
    }

    if (published !== undefined) {
      updateData.published = Boolean(published)
      updateData.publishedAt = published ? new Date() : null
    }

    const updatedPost = await db
      .update(posts)
      .set(updateData)
      .where(eq(posts.slug, slug))
      .returning()

    return NextResponse.json({
      message: 'Post updated successfully',
      post: updatedPost[0]
    })

  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
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
        { error: 'Post identifier is required' },
        { status: 400 }
      )
    }

    const db = getDatabase()

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)

    let existingPost
    if (isUUID) {
      existingPost = await db
        .select({ id: posts.id, title: posts.title })
        .from(posts)
        .where(eq(posts.id, slug))
        .limit(1)
    } else {
      existingPost = await db
        .select({ id: posts.id, title: posts.title })
        .from(posts)
        .where(eq(posts.slug, slug))
        .limit(1)
    }

    if (existingPost.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    if (isUUID) {
      await db
        .delete(posts)
        .where(eq(posts.id, slug))
    } else {
      await db
        .delete(posts)
        .where(eq(posts.slug, slug))
    }

    return NextResponse.json({
      message: 'Post deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
