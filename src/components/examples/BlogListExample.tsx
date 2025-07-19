'use client'

import React, { useState, useEffect } from 'react'
import { blogsService, categoriesService, type Blog, type Category, type ApiResponse } from '@/services'

interface BlogListExampleProps {
  className?: string
}

export const BlogListExample: React.FC<BlogListExampleProps> = ({ className }) => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch blogs and categories in parallel
        const [blogsResponse, categoriesResponse] = await Promise.all([
          blogsService.getBlogs({ page: 1, limit: 10 }),
          categoriesService.getCategories({ page: 1, limit: 50 })
        ])

        if (blogsResponse.success && blogsResponse.data) {
          setBlogs(blogsResponse.data.data)
        }

        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data.data)
        }

      } catch (err) {
        setError('Failed to fetch data')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleLikeBlog = async (blogId: string) => {
    try {
      const response = await blogsService.likeBlog(blogId)
      if (response.success) {
        // Update the blog in the list to reflect the like
        setBlogs(prevBlogs => 
          prevBlogs.map(blog => 
            blog.id.toString() === blogId 
              ? { ...blog, likes: [...(blog.likes || []), { id: Date.now(), blogId: parseInt(blogId), userId: 1, createdAt: new Date().toISOString() }] }
              : blog
          )
        )
      }
    } catch (err) {
      console.error('Error liking blog:', err)
    }
  }

  const handleBookmarkBlog = async (blogId: string) => {
    try {
      const response = await blogsService.bookmarkBlog(blogId)
      if (response.success) {
        // Update the blog in the list to reflect the bookmark
        setBlogs(prevBlogs => 
          prevBlogs.map(blog => 
            blog.id.toString() === blogId 
              ? { ...blog, bookmarks: [...(blog.bookmarks || []), { id: Date.now(), blogId: parseInt(blogId), userId: 1, createdAt: new Date().toISOString() }] }
              : blog
          )
        )
      }
    } catch (err) {
      console.error('Error bookmarking blog:', err)
    }
  }

  if (loading) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-4 text-red-600 ${className}`}>
        <p>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-2xl font-bold">Blog Posts</h2>
      
      {blogs.length === 0 ? (
        <p className="text-gray-500">No blogs found.</p>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div key={blog.id} className="border rounded-lg p-4 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
              {blog.excerpt && (
                <p className="text-gray-600 mb-3">{blog.excerpt}</p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span>By {blog.author?.username || 'Unknown'}</span>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                {blog.categories && blog.categories.length > 0 && (
                  <div className="flex gap-1">
                    {blog.categories.map((category) => (
                      <span key={category.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {category.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLikeBlog(blog.id.toString())}
                  className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <span>❤️</span>
                  <span>{blog.likes?.length || 0} likes</span>
                </button>
                
                <button
                  onClick={() => handleBookmarkBlog(blog.id.toString())}
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors"
                >
                  <span>🔖</span>
                  <span>Bookmark</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {categories.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span key={category.id} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {category.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 