'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Tag, Filter } from 'lucide-react'

interface Category {
  id: string
  name: string
  color: string
  count: number
}

interface EditTarget {
  id: string
  name: string
}

export default function CategoryManager() {
  const [categoryList, setCategoryList] = useState<Category[]>([
    { id: '1', name: 'Technology', color: 'bg-blue-100 text-blue-800', count: 5 },
    { id: '2', name: 'Lifestyle', color: 'bg-green-100 text-green-800', count: 3 },
    { id: '3', name: 'Travel', color: 'bg-purple-100 text-purple-800', count: 2 },
    { id: '4', name: 'Food', color: 'bg-orange-100 text-orange-800', count: 1 },
  ])

  const [draftCategory, setDraftCategory] = useState<string>('')
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null)
  const [isAdding, setIsAdding] = useState<boolean>(false)

  const handleAddCategory = () => {
    const trimmed = draftCategory.trim()
    if (!trimmed) return

    const newId = (categoryList.length + 1).toString()

    const colorPalette = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-red-100 text-red-800',
      'bg-yellow-100 text-yellow-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800'
    ]
    const colorPick = colorPalette[Math.floor(Math.random() * colorPalette.length)]

    const newCat = {
      id: newId,
      name: trimmed,
      color: colorPick,
      count: 0
    }

    setCategoryList([...categoryList, newCat])
    setDraftCategory('')
    setIsAdding(false)
  }

  const handleEditCategory = (catId: string) => {
    const found = categoryList.find(c => c.id === catId)
    if (found) {
      setEditTarget({ id: catId, name: found.name })
    }
  }

  const saveEditedCategory = () => {
    if (!editTarget || !editTarget.name.trim()) return

    setCategoryList(prev =>
      prev.map(cat => cat.id === editTarget.id
        ? { ...cat, name: editTarget.name.trim() }
        : cat
      )
    )
    setEditTarget(null)
  }

  const handleDelete = (catId: string) => {
    if (window.confirm('Delete this category? It will be removed from all posts.')) {
      setCategoryList(categoryList.filter(cat => cat.id !== catId))
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Tag className="h-6 w-6 mr-2" />
          Manage Categories
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>{isAdding ? 'Close' : 'Add Category'}</span>
        </button>
      </div>

      {isAdding && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex space-x-2">
            <input
              type="text"
              value={draftCategory}
              onChange={(e) => setDraftCategory(e.target.value)}
              placeholder="e.g. Productivity"
              className="flex-1 input-field"
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <button onClick={handleAddCategory} className="btn-primary">Add</button>
            <button
              onClick={() => {
                setIsAdding(false)
                setDraftCategory('')
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryList.map((cat) => (
          <div key={cat.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${cat.color}`}>
                {cat.name}
              </span>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEditCategory(cat.id)}
                  className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {editTarget && editTarget.id === cat.id ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={editTarget.name}
                  onChange={(e) => {
                    if (editTarget) {
                      setEditTarget({ ...editTarget, name: e.target.value })
                    }
                  }}
                  className="flex-1 input-field text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && saveEditedCategory()}
                />
                <button onClick={saveEditedCategory} className="btn-primary text-sm px-2 py-1">
                  Save
                </button>
                <button onClick={() => setEditTarget(null)} className="btn-secondary text-sm px-2 py-1">
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {cat.count} posts
                </span>
                <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  <Filter className="h-3 w-3 mr-1" />
                  Filter
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {categoryList.length === 0 && (
        <div className="text-center py-8">
          <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No categories yet. Time to add one!</p>
        </div>
      )}
    </div>
  )
}
