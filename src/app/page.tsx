'use client'

import { useState, useEffect } from 'react'
import { Calendar, User, Eye, Heart, Clock, Search, Plus, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
  }, [])

  const handleDeletePost = (postId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      console.log('Deleting post:', postId)
    }
  }

  const handleTogglePublish = (postId: string, currentStatus: boolean) => {
    const action = currentStatus ? 'unpublish' : 'publish'
    if (window.confirm(`Are you sure you want to ${action} this post?`)) {
      console.log(`${action}ing post:`, postId)
    }
  }

  const mockPosts = [
    {
      id: '1',
      title: 'Welcome to BlogHub',
      excerpt: 'This is a sample blog post to get you started with your new modern blogging platform built with Next.js, tRPC, and Tailwind CSS.',
      slug: 'welcome-to-bloghub',
      featuredImage: '',
      publishedAt: new Date().toISOString(),
      views: 42,
      likes: [],
      tags: ['welcome', 'getting-started', 'nextjs'],
      author: {
        id: '1',
        username: 'admin',
        avatar: '',
      },
      content: '# Welcome to BlogHub\n\nThis is a sample blog post to demonstrate the features of your new blogging platform.',
      published: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Modern Web Development with Next.js',
      excerpt: 'Learn about the latest features in Next.js 14 and how to build modern web applications with the App Router.',
      slug: 'modern-web-development-nextjs',
      featuredImage: '',
      publishedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      views: 28,
      likes: [],
      tags: ['nextjs', 'react', 'web-development'],
      author: {
        id: '2',
        username: 'developer',
        avatar: '',
      },
      content: '# Modern Web Development\n\nNext.js 14 brings exciting new features...',
      published: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '3',
      title: 'Building Type-Safe APIs with tRPC',
      excerpt: 'Discover how tRPC provides end-to-end type safety for your API calls and eliminates the need for code generation.',
      slug: 'building-type-safe-apis-trpc',
      featuredImage: '',
      publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      views: 15,
      likes: [],
      tags: ['trpc', 'typescript', 'api'],
      author: {
        id: '3',
        username: 'typescript-expert',
        avatar: '',
      },
      content: '# Building Type-Safe APIs\n\ntRPC is revolutionizing how we build APIs...',
      published: true,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
    }
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(' ').length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  const filteredPosts = searchTerm 
    ? mockPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : mockPosts

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                BlogHub
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {user.username}!</span>
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem('user')
                      setUser(null)
                      window.location.reload()
                    }}
                    className="text-gray-600 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="btn-primary"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-blue-600">BlogHub</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover amazing stories, share your thoughts, and connect with a community of writers and readers.
        </p>
        
        <form onSubmit={handleSearch} className="max-w-md mx-auto">
          <div className="flex">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 input-field rounded-r-none"
            />
            <button
              type="submit"
              className="btn-primary rounded-l-none"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>
        
        {user && (
          <div className="mt-6">
            <Link
              href="/create"
              className="btn-primary flex items-center space-x-2 mx-auto w-fit"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Post</span>
            </Link>
          </div>
        )}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No posts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredPosts.map((post) => (
            <article key={post.id} className="card hover:shadow-lg transition-shadow duration-200">
              {post.featuredImage && (
                <div className="mb-4">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{post.author?.username || 'Unknown'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.publishedAt || post.createdAt || new Date().toISOString())}</span>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                <Link 
                  href={`/post/${post.slug}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {post.title}
                </Link>
              </h2>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes?.length || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{getReadingTime(post.content || post.excerpt || '')} min read</span>
                  </div>
                </div>
                
                {user && (
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/edit/${post.slug}`}
                      className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit post"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeletePost(post.id, post.title)}
                      className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete post"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {user && (
                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={() => handleTogglePublish(post.id, post.published)}
                    className={`w-full text-sm px-3 py-2 rounded-lg font-medium transition-colors ${
                      post.published
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {post.published ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}