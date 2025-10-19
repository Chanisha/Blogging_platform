'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Eye, Calendar, Tag, Image, AlertCircle, CheckCircle, Edit } from 'lucide-react'
import MarkdownEditor from '@/components/MarkdownEditor'

interface EditPostPageProps {
  params: {
    slug: string
  }
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const router = useRouter()
  
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    tags: '',
    featuredImage: '',
    category: '',
    published: false
  })
  
  const [isSaving, setIsSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [tempMessage, setTempMessage] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const availableCategories = [
    'Technology', 'Lifestyle', 'Travel', 'Food',
    'Business', 'Health', 'Education', 'Entertainment'
  ]

  const dummyPost = {
    id: '1',
    title: 'Welcome to BlogHub',
    content: `# Welcome to BlogHub

This is a demo post so you can see how everything fits together.

- Markdown preview works
- You can edit and save

Try publishing this or saving as a draft.`,
    category: 'Technology',
    tags: 'welcome, demo',
    featuredImage: '',
    published: true,
    slug: params.slug
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setPostData({
        title: dummyPost.title,
        content: dummyPost.content,
        tags: dummyPost.tags,
        featuredImage: dummyPost.featuredImage,
        category: dummyPost.category,
        published: dummyPost.published
      })
      setIsLoading(false)
    }, 600)

    return () => clearTimeout(timer)
  }, [params.slug])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setPostData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    setErrorMsg('')
    setTempMessage('')

    try {
      if (!postData.title.trim()) throw new Error('Title is required.')
      if (!postData.content.trim()) throw new Error('Content cannot be empty.')
      if (!postData.category) throw new Error('Select a category please.')

      console.log('Saving post...', postData)
      await new Promise(r => setTimeout(r, 1000))

      setTempMessage('Post updated successfully 🎉')
      setTimeout(() => router.push('/dashboard'), 1500)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong while updating.'
      setErrorMsg(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const saveAsDraft = async () => {
    setPostData(prev => ({ ...prev, published: false }))
    setIsSaving(true)
    setErrorMsg('')
    setTempMessage('')

    try {
      if (!postData.title.trim()) throw new Error('Title is required.')
      if (!postData.content.trim()) throw new Error('Content cannot be empty.')
      if (!postData.category) throw new Error('Select a category please.')

      console.log('Saving post as draft...', { ...postData, published: false })
      await new Promise(r => setTimeout(r, 1000))

      setTempMessage('Draft saved successfully 🎉')
      setTimeout(() => router.push('/dashboard'), 1500)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong while saving draft.'
      setErrorMsg(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const publishNow = async () => {
    setPostData(prev => ({ ...prev, published: true }))
    setIsSaving(true)
    setErrorMsg('')
    setTempMessage('')

    try {
      if (!postData.title.trim()) throw new Error('Title is required.')
      if (!postData.content.trim()) throw new Error('Content cannot be empty.')
      if (!postData.category) throw new Error('Select a category please.')

      console.log('Publishing post...', { ...postData, published: true })
      await new Promise(r => setTimeout(r, 1000))

      setTempMessage('Post published successfully 🎉')
      setTimeout(() => router.push('/dashboard'), 1500)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong while publishing.'
      setErrorMsg(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const deletePost = () => {
    if (window.confirm('Really delete this post? It can’t be undone.')) {
      console.log('Deleting post:', params.slug)
      router.push('/dashboard')
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Edit className="h-8 w-8 mr-2" />
            Edit Post
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>{showPreview ? 'Edit' : 'Preview'}</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {errorMsg}
          </div>
        )}

        {tempMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {tempMessage}
          </div>
        )}

        {showPreview ? (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{postData.title || 'Untitled Post'}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date().toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  {postData.category || 'Uncategorized'}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  postData.published 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {postData.published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-gray-700">
                {postData.content || 'No content yet...'}
              </pre>
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
                value={postData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter a catchy title..."
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={postData.category}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select one</option>
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-2">
                <Image className="h-4 w-4 inline mr-1" />
                Featured Image URL
              </label>
              <input
                type="url"
                id="featuredImage"
                name="featuredImage"
                value={postData.featuredImage}
                onChange={handleChange}
                className="input-field"
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="h-4 w-4 inline mr-1" /> Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={postData.tags}
                onChange={handleChange}
                className="input-field"
                placeholder="react, javascript, tips"
              />
              <p className="mt-1 text-sm text-gray-500">Separate tags with commas</p>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <MarkdownEditor
                content={postData.content}
                onChange={(content) => setPostData(prev => ({ ...prev, content }))}
                placeholder="Write something great..."
              />
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={saveAsDraft}
                disabled={isSaving}
                className="btn-secondary flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
              </button>

              <button
                type="button"
                onClick={publishNow}
                disabled={isSaving}
                className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Calendar className="h-4 w-4" />
                <span>{isSaving ? 'Publishing...' : 'Publish'}</span>
              </button>

              <button
                type="button"
                onClick={deletePost}
                className="btn-danger flex items-center justify-center space-x-2"
              >
                Delete Post
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
