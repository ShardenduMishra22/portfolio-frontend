'use client'

import { authClient } from '@/lib/authClient'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  EyeOff, 
  Tag, 
  Plus,
  X,
  BookOpen,
  Sparkles,
  AlertCircle
} from 'lucide-react'
import { blogsService } from '@/services/blogs'
import { Blog } from '@/services/types'
import TipTap from '@/components/TipTap'

const BlogEditPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = React.use(params)
  const session = authClient.useSession()
  const router = useRouter()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchBlogPost = useCallback(async () => {
    try {
      setLoading(true)
      const response = await blogsService.getBlogById(resolvedParams.id)
      if (response.success && response.data) {
        const blogData = response.data
        setBlog(blogData)
        setTitle(blogData.title)
        setContent(blogData.content)
        setTags(blogData.tags || [])
      }
    } catch (error) {
      console.error('Error fetching blog:', error)
    } finally {
      setLoading(false)
    }
  }, [resolvedParams.id]);

  useEffect(() => {
    if (resolvedParams.id) {
      fetchBlogPost()
    }
  }, [resolvedParams.id, fetchBlogPost])

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Please fill in both title and content')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      
      const response = await blogsService.updateBlog(resolvedParams.id, {
        title: title.trim(),
        content: content.trim(),
      })

      if (response.success) {
        router.push(`/blog/${resolvedParams.id}`)
      } else {
        setError('Failed to update blog post')
      }
    } catch (error) {
      console.error('Error updating blog:', error)
      setError('An error occurred while updating the blog post')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
          <p className="text-foreground">Loading blog post...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
          <p className="text-foreground">Please log in to edit blog posts.</p>
        </div>
      </div>
    )
  }

  if (error && error.includes('not authorized')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold font-heading text-foreground mb-2">Access Denied</h2>
          <p className="text-foreground mb-4">{error}</p>
          <Button onClick={() => router.push('/blog/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-bold font-heading text-foreground mb-2">Blog not found</h2>
          <p className="text-foreground mb-4">The blog post you&apos;re trying to edit doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/blog/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="h-9 px-3"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-secondary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-heading text-foreground">Edit Post</h1>
                  <p className="text-sm text-foreground">Update your blog post</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsPreview(!isPreview)}
                className="h-9 px-3"
              >
                {isPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {isPreview ? 'Edit' : 'Preview'}
              </Button>
              
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="h-9 px-4"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="container mx-auto px-4 py-3">
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Input */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base font-heading">
                  <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-primary" />
                  </div>
                  Post Title
                </CardTitle>
                <CardDescription className="text-sm">
                  Update your post title
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Input
                  placeholder="Enter your post title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-medium bg-background border-border h-12"
                />
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base font-heading">
                  <div className="w-6 h-6 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-3 h-3 text-secondary" />
                  </div>
                  Content
                </CardTitle>
                <CardDescription className="text-sm">
                  Update your blog post content
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="min-h-[350px] bg-background rounded-lg p-4 border border-border">
                  <TipTap
                    value={content}
                    onChange={setContent}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base font-heading">
                  <div className="w-6 h-6 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Tag className="w-3 h-3 text-accent" />
                  </div>
                  Tags
                </CardTitle>
                <CardDescription className="text-sm">
                  Update tags for better discoverability
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="bg-background border-border h-9"
                  />
                  <Button
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                    size="sm"
                    className="h-9 w-9 p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center space-x-1 text-xs"
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preview */}
            {isPreview && (
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-base font-heading">
                    <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Eye className="w-3 h-3 text-primary" />
                    </div>
                    Preview
                  </CardTitle>
                  <CardDescription className="text-sm">
                    How your updated post will appear
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4 bg-muted/50 rounded-lg p-4">
                    <h1 className="text-xl font-bold font-heading text-foreground">
                      {title || 'Your post title will appear here'}
                    </h1>
                    <Separator />
                    <div 
                      className="prose prose-sm max-w-none text-foreground"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4">
                        {tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Original Post Info */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-heading">Post Stats</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Created:</span>
                  <span className="text-sm font-medium">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Last Updated:</span>
                  <span className="text-sm font-medium">
                    {new Date(blog.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Views:</span>
                  <span className="text-sm font-medium">
                    {Array.isArray(blog.views) ? blog.views.length : blog.views || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Likes:</span>
                  <span className="text-sm font-medium">
                    {Array.isArray(blog.likes) ? blog.likes.length : blog.likes || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Comments:</span>
                  <span className="text-sm font-medium">
                    {Array.isArray(blog.comments) ? blog.comments.length : blog.comments || 0}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Editing Tips */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base font-heading">
                  <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-primary" />
                  </div>
                  Editing Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-foreground">
                    Update title to reflect content accurately
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-foreground">
                    Revise tags for better discoverability
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-foreground">
                    Preview changes before saving
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-foreground">
                    Consider impact on existing readers
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default BlogEditPage