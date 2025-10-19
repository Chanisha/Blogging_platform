import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'
import { posts, users } from '@/lib/db/schema'
import { eq, desc, asc } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, tags, featuredImage, category, published, excerpt } = body

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
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Check if slug already exists
    const existingPost = await db
      .select({ slug: posts.slug })
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1)

    let finalSlug = slug
    if (existingPost.length > 0) {
      // Add timestamp to make it unique
      finalSlug = `${slug}-${Date.now()}`
    }

    // Get or create a default user
    let defaultUser
    try {
      // Try to get existing default user
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, 'admin@blog.com'))
        .limit(1)

      if (existingUser.length > 0) {
        defaultUser = existingUser[0]
      } else {
        // Create default user if it doesn't exist
        const newUser = await db
          .insert(users)
          .values({
            email: 'admin@blog.com',
            username: 'admin',
            password: 'admin123', // In production, this should be hashed
            bio: 'Default administrator account',
            role: 'admin',
          })
          .returning()
        defaultUser = newUser[0]
      }
    } catch (userError) {
      console.error('Error handling user:', userError)
      // If user creation fails, we'll skip the authorId for now
      defaultUser = null
    }

    // Create the post
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
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    })
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
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
    
    // Build query with joins to get author information
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

    // Apply filters
    if (filter === 'published') {
      query = query.where(eq(posts.published, true))
    } else if (filter === 'draft') {
      query = query.where(eq(posts.published, false))
    }

    // Apply sorting
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

    // Apply client-side filters (search, category) since they're more complex
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
      // Note: We'll need to add category field to posts table later
      // For now, we'll skip category filtering
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
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    })
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
