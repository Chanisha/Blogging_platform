import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'
import { posts, users } from '@/lib/db/schema'
import { eq, desc, asc } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/posts - Starting request processing')
    const body = await request.json()
    console.log('POST /api/posts - Request body:', body)
    const { title, content, excerpt, category, tags, featuredImage, published } = body

    if (!title?.trim()) {
      console.log('POST /api/posts - Title validation failed')
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    if (!content?.trim()) {
      console.log('POST /api/posts - Content validation failed')
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }


    console.log('POST /api/posts - Getting database connection')
    const db = getDatabase()
    console.log('POST /api/posts - Database connection established')

    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    let finalSlug = slug
    let counter = 1
    while (true) {
      const existingPost = await db
        .select({ slug: posts.slug })
        .from(posts)
        .where(eq(posts.slug, finalSlug))
        .limit(1)

      if (existingPost.length === 0) {
        break
      }
      finalSlug = `${slug}-${counter}`
      counter++
    }

    let defaultUser
    try {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, 'admin@blog.com'))
        .limit(1)

      if (existingUser.length > 0) {
        defaultUser = existingUser[0]
      } else {
        const newUser = await db
          .insert(users)
          .values({
            email: 'admin@blog.com',
            username: 'admin',
            password: 'admin123',
            bio: 'Default administrator account',
            role: 'admin',
          })
          .returning()
        defaultUser = newUser[0]
      }
    } catch (userError) {
      console.error('Error handling user:', userError)
      defaultUser = null
    }

    const newPost = await db
      .insert(posts)
      .values({
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt?.trim() || null,
        slug: finalSlug,
        authorId: defaultUser?.id,
        tags: tags ? (Array.isArray(tags) ? tags.filter(Boolean) : tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)) : [],
        featuredImage: featuredImage?.trim() || null,
        published: Boolean(published),
        publishedAt: published ? new Date() : null,
      })
      .returning()

    console.log('POST /api/posts - Post created successfully:', newPost[0])

    return NextResponse.json(
      { 
        message: 'Post created successfully',
        post: newPost[0]
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating post:', error)
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'
    const sortBy = searchParams.get('sortBy') || 'newest'
    const category = searchParams.get('category') || ''
    const search = searchParams.get('search') || ''

    const db = getDatabase()
    console.log('Database connection established for GET posts')
    
    let query = db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        excerpt: posts.excerpt,
        slug: posts.slug,
        featuredImage: posts.featuredImage,
        published: posts.published,
        publishedAt: posts.publishedAt,
        views: posts.views,
        likes: posts.likes,
        tags: posts.tags,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: {
          id: users.id,
          username: users.username,
          avatar: users.avatar,
        }
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))

    if (filter === 'published') {
      query = query.where(eq(posts.published, true))
    } else if (filter === 'draft') {
      query = query.where(eq(posts.published, false))
    }

    switch (sortBy) {
      case 'newest':
        query = query.orderBy(desc(posts.updatedAt))
        break
      case 'oldest':
        query = query.orderBy(asc(posts.updatedAt))
        break
      case 'views':
        query = query.orderBy(desc(posts.views))
        break
      case 'title':
        query = query.orderBy(asc(posts.title))
        break
      default:
        query = query.orderBy(desc(posts.updatedAt))
    }

    const allPosts = await query

    let filteredPosts = allPosts

    if (search) {
      const searchLower = search.toLowerCase()
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt?.toLowerCase().includes(searchLower) ||
        post.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
      )
    }

    if (category) {
    }

    return NextResponse.json({
      posts: filteredPosts,
      total: filteredPosts.length,
      published: filteredPosts.filter(p => p.published).length,
      drafts: filteredPosts.filter(p => !p.published).length,
    })

  } catch (error) {
    console.error('Error fetching posts:', error)
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
