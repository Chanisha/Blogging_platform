'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Edit, Trash2, Eye, Calendar, Heart, Plus, Search, Filter, Tag, Clock, User } from 'lucide-react'

interface Post {
  id: string
  title: string
  excerpt: string | null
  slug: string
  featuredImage: string | null
  publishedAt: string | null
  views: number
  likes: string[]
  tags: string[]
  author: {
    id: string
    username: string
    avatar: string | null
  }
  content: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export default function Dashboard() {
  const router = useRouter()
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const categories = ['Technology', 'Travel', 'Food', 'Lifestyle', 'Business', 'Health', 'Education', 'Entertainment']

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const params = new URLSearchParams({
        filter,
        sortBy,
        ...(filterCategory && { category: filterCategory }),
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch(`/api/posts?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      const data = await response.json()
      setPosts(data.posts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [filter, sortBy, filterCategory, searchTerm])

  const handleDelete = async (postId: string, title: string, slug: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return
    }

    setActionLoading(postId)
    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete post')
      }

      setPosts(prev => prev.filter(post => post.id !== postId))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete post')
    } finally {
      setActionLoading(null)
    }
  }

  const handleTogglePublish = async (postId: string, slug: string, currentStatus: boolean) => {
    const action = currentStatus ? 'unpublish' : 'publish'
    if (!window.confirm(`Are you sure you want to ${action} this post?`)) {
      return
    }

    setActionLoading(postId)
    try {
      const post = posts.find(p => p.id === postId)
      if (!post) throw new Error('Post not found')

      const response = await fetch(`/api/posts/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          tags: post.tags,
          featuredImage: post.featuredImage,
          published: !currentStatus,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${action} post`)
      }

      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, published: !currentStatus, publishedAt: !currentStatus ? new Date().toISOString() : null }
          : p
      ))
    } catch (err) {
      alert(err instanceof Error ? err.message : `Failed to ${action} post`)
    } finally {
      setActionLoading(null)
    }
  }

  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = filter === 'all' || 
                           (filter === 'published' && post.published) ||
                           (filter === 'draft' && !post.published)
      
      return matchesSearch && matchesStatus
    })

  const stats = {
    totalPosts: posts.length,
    publishedPosts: posts.filter(p => p.published).length,
    draftPosts: posts.filter(p => !p.published).length,
    totalViews: posts.reduce((sum, p) => sum + p.views, 0)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Manage your blog posts</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="card animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Edit className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">{stats.publishedPosts}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.draftPosts}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div className="lg:w-48">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="views">Most Views</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>

          <Link
            href="/create"
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Post</span>
          </Link>
        </div>

        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Posts ({posts.length})
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'published'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Published ({stats.publishedPosts})
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'draft'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Drafts ({stats.draftPosts})
          </button>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="card text-center py-12">
          <Edit className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? "You haven't written any posts yet." 
              : `You don't have any ${filter} posts.`
            }
          </p>
          <Link href="/create" className="btn-primary">
            Write Your First Post
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div key={post.id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      <Link 
                        href={`/post/${post.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      post.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {post.published 
                          ? formatDate(post.publishedAt!) 
                          : formatDate(post.createdAt!)
                        }
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.views} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes?.length || 0} likes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Tag className="h-4 w-4" />
                      <span>{post.tags?.join(', ') || 'No tags'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 ml-4">
                  <Link
                    href={`/post/${post.slug}`}
                    className="btn-secondary text-sm flex items-center space-x-1"
                    title="View post"
                  >
                    <Eye className="h-3 w-3" />
                    <span>View</span>
                  </Link>
                  
                  <Link
                    href={`/edit/${post.slug}`}
                    className="btn-primary text-sm flex items-center space-x-1"
                    title="Edit post"
                  >
                    <Edit className="h-3 w-3" />
                    <span>Edit</span>
                  </Link>
                  
                  <button
                    onClick={() => handleTogglePublish(post.id, post.slug, post.published)}
                    disabled={actionLoading === post.id}
                    className={`text-sm px-3 py-1 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                      post.published
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                    title={post.published ? 'Unpublish post' : 'Publish post'}
                  >
                    {actionLoading === post.id ? 'Processing...' : (post.published ? 'Unpublish' : 'Publish')}
                  </button>
                  
                  <button
                    onClick={() => handleDelete(post.id, post.title, post.slug)}
                    disabled={actionLoading === post.id}
                    className="btn-danger text-sm flex items-center space-x-1 disabled:opacity-50"
                    title="Delete post"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>{actionLoading === post.id ? 'Deleting...' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
        </>
      )}
    </div>
  )
}
