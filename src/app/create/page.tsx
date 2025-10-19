'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Eye, Calendar, Tag, Image, AlertCircle, CheckCircle } from 'lucide-react'
import MarkdownEditor from '@/components/MarkdownEditor'

export default function CreatePost() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    featuredImage: '',
    category: '',
    published: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const categories = [
    'Technology',
    'Lifestyle', 
    'Travel',
    'Food',
    'Business',
    'Health',
    'Education',
    'Entertainment'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (!formData.title.trim()) {
        throw new Error('Title is required')
      }
      if (!formData.content.trim()) {
        throw new Error('Content is required')
      }

      console.log('Creating post:', formData)
      
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          tags: formData.tags,
          featuredImage: formData.featuredImage,
          category: formData.category,
          published: formData.published,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create post')
      }

      const result = await response.json()
      console.log('Post created:', result)
      
      setSuccess(formData.published ? 'Post published successfully!' : 'Post saved as draft!')
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
      
    } catch (err) {
      console.error('Error creating post:', err)
      setError(err instanceof Error ? err.message : 'Error creating post')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = () => {
    setFormData(prev => ({ ...prev, published: false }))
    handleSubmit(new Event('submit') as any)
  }

  const handlePublish = () => {
    setFormData(prev => ({ ...prev, published: true }))
    handleSubmit(new Event('submit') as any)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Eye size={16} />
              <span>{showPreview ? 'Edit' : 'Preview'}</span>
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
            <CheckCircle size={20} />
            {success}
          </div>
        )}

        {showPreview ? (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{formData.title || 'Untitled Post'}</h2>
              {formData.excerpt && (
                <p className="text-gray-600 mb-4 italic">{formData.excerpt}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Calendar size={16} />
                  {new Date().toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Tag size={16} />
                  {formData.category || 'No category'}
                </span>
              </div>
            </div>
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: formData.content || 'No content yet...' }} />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your post title..."
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="input-field"
                placeholder="Brief description of your post (optional)"
              />
              <p className="mt-1 text-sm text-gray-500">
                A short summary that will appear in post previews
              </p>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-2">
                <Image size={16} />
                Featured Image URL
              </label>
              <input
                type="url"
                id="featuredImage"
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                <Tag size={16} />
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="input-field"
                placeholder="react, javascript, web-development (comma separated)"
              />
              <p className="mt-1 text-sm text-gray-500">
                Separate tags with commas
              </p>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content * (Rich Text Editor)
              </label>
              <MarkdownEditor
                content={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="Write your post content here... Use the toolbar above to format your text."
              />
              <p className="mt-1 text-sm text-gray-500">
                Use the toolbar above to format your text with headings, lists, quotes, and more.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={loading}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Save size={16} />
                <span>{loading ? 'Saving...' : 'Save as Draft'}</span>
              </button>
              
              <button
                type="button"
                onClick={handlePublish}
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Calendar size={16} />
                <span>{loading ? 'Publishing...' : 'Publish Now'}</span>
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
