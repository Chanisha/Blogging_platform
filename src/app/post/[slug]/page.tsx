'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Calendar, User, Eye, Heart, Clock, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PostPageProps {
  params: {
    slug: string
  }
}

export default function PostPage({ params }: PostPageProps) {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [user, setUser] = useState(null) // This would come from auth context

  const mockPost = {
    id: '1',
    title: 'Welcome to BlogHub',
    content: `# Welcome to BlogHub

This is a sample blog post to demonstrate the features of your new blogging platform built with modern web technologies.

## Features

- **Modern UI** with Tailwind CSS
- **Type-safe API** with tRPC
- **Rich text editing** with Tiptap
- **PostgreSQL database** with Drizzle ORM
- **Real-time updates** with TanStack Query

## Getting Started

To get started with your new blog:

1. Create an account
2. Write your first post
3. Customize your profile
4. Share your content

## Code Example

Here's a simple React component:

\`\`\`jsx
function BlogPost({ title, content }) {
  return (
    <article>
      <h1>{title}</h1>
      <div>{content}</div>
    </article>
  )
}
\`\`\`

Enjoy building your blog!`,
    excerpt: 'This is a sample blog post to get you started with your new modern blogging platform built with Next.js, tRPC, and Tailwind CSS.',
    slug: params.slug,
    featuredImage: '',
    publishedAt: new Date().toISOString(),
    views: 42,
    likes: [],
    tags: ['welcome', 'getting-started', 'nextjs'],
    author: {
      id: '1',
      username: 'admin',
      avatar: '',
      bio: 'Platform administrator and developer',
    },
  }

  const handleLike = () => {
    if (!user) {
      window.location.href = '/login'
      return
    }
    setLiked(!liked)
    setLikesCount(liked ? likesCount - 1 : likesCount + 1)
  }

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return
    }
    window.location.href = '/'
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

  const isAuthor = user && mockPost && mockPost.author?.id === (user as any)?.id

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {mockPost.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{mockPost.author?.username}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(mockPost.publishedAt!)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span>{mockPost.views} views</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{getReadingTime(mockPost.content)} min read</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              liked 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            <span>{likesCount || mockPost.likes?.length || 0} likes</span>
          </button>

          {isAuthor && (
            <div className="flex space-x-2">
              <Link
                href={`/edit/${mockPost.slug}`}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Link>
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {mockPost.featuredImage && (
          <div className="mb-8">
            <img
              src={mockPost.featuredImage}
              alt={mockPost.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {mockPost.tags && mockPost.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {mockPost.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <article className="prose prose-lg max-w-none">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={tomorrow}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {mockPost.content}
        </ReactMarkdown>
      </article>

      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-4">
          {mockPost.author?.avatar ? (
            <img
              src={mockPost.author.avatar}
              alt={mockPost.author.username}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {mockPost.author?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {mockPost.author?.username}
            </h3>
            {mockPost.author?.bio && (
              <p className="text-gray-600">{mockPost.author.bio}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
