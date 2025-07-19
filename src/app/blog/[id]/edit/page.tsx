'use client'

import { authClient } from '@/lib/authClient'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (resolvedParams.id) {
      fetchBlogPost()
    }
  }, [resolvedParams.id])

  const fetchBlogPost = async () => {
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
  }

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Please log in to edit blog posts.</p>
        </div>
      </div>
    )
  }

  if (error && error.includes('not authorized')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Blog not found</h2>
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
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/60 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="text-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground font-heading">Edit Post</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsPreview(!isPreview)}
                className="bg-card/60 backdrop-blur-sm border-border/50"
              >
                {isPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {isPreview ? 'Edit' : 'Preview'}
              </Button>
              
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
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
        <div className="container mx-auto px-6 py-4">
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="py-4">
              <div className="flex items-center space-x-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Input */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span>Post Title</span>
                </CardTitle>
                <CardDescription>
                  Update your post title to better reflect the content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Enter your post title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-medium bg-card/60 backdrop-blur-sm border-border/50"
                />
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Content</CardTitle>
                <CardDescription>
                  Update your blog post content using the rich text editor below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[400px]">
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
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Tag className="w-5 h-5 text-primary" />
                  <span>Tags</span>
                </CardTitle>
                <CardDescription>
                  Update tags to help readers find your post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="bg-card/60 backdrop-blur-sm border-border/50"
                  />
                  <Button
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
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
                        className="flex items-center space-x-1 bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-primary/80"
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
              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    How your updated post will appear to readers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h1 className="text-2xl font-bold text-foreground font-heading">
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
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Original Post Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Editing Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-foreground">
                    Make sure your title accurately reflects the content
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-foreground">
                    Update tags to improve discoverability
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-foreground">
                    Preview your changes before saving
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-muted rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-foreground">
                    Consider the impact on existing readers
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