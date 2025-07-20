'use client'

import { authClient } from '@/lib/authClient'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { blogsService } from '@/services/blogs'
import { TiptapModalEditor } from '@/components/TipTap'

const CreateBlogPage = () => {
  const session = authClient.useSession()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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

    const userId = session?.data?.user?.id
    
    if (!userId) {
      setError('No user ID found in session. Please log in again.')
      console.log('Available session data:', session)
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      setSuccess('')
      
      const response = await blogsService.createBlog({
        title: title.trim(),
        content: content.trim(),
        tags: tags,
        authorId: userId,
      })

      if (response.success) {
        setSuccess('Blog post created successfully!')
        setTimeout(() => {
          router.push('/blog/dashboard')
        }, 1500)
      } else {
        setError(response.error || 'Failed to create blog post')
        console.error('Blog creation failed:', response)
      }
    } catch (error: any) {
      console.error('Error creating blog:', error)
      if (error?.response?.status === 400) {
        setError('Bad request - please check your input data')
      } else if (error?.response?.status === 401) {
        setError('Unauthorized - please log in again')
        setTimeout(() => router.push('/blog'), 2000)
      } else if (error?.response?.status === 404) {
        setError('Author not found - please check your session')
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto space-y-6 p-4">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <div className="h-8 w-48 bg-muted/50 rounded animate-pulse" />
            <div className="h-4 w-64 bg-muted/50 rounded animate-pulse" />
          </div>

          {/* Form Skeleton */}
          <div className="space-y-6">
            <div>
              <div className="h-4 w-16 bg-muted/50 rounded animate-pulse mb-2" />
              <div className="h-10 w-full bg-muted/50 rounded-lg animate-pulse" />
            </div>
            
            <div>
              <div className="h-4 w-24 bg-muted/50 rounded animate-pulse mb-2" />
              <div className="h-32 w-full bg-muted/50 rounded-lg animate-pulse" />
            </div>
            
            <div>
              <div className="h-4 w-20 bg-muted/50 rounded animate-pulse mb-2" />
              <div className="h-10 w-full bg-muted/50 rounded-lg animate-pulse" />
            </div>
            
            <div className="flex space-x-3">
              <div className="h-10 w-24 bg-muted/50 rounded-lg animate-pulse" />
              <div className="h-10 w-24 bg-muted/50 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!session.data?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-xl font-heading text-black dark:text-white">Create Blog Post</CardTitle>
            <CardDescription className="text-black dark:text-white">You need to be logged in to create a blog post</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => authClient.signIn.social({ provider: 'google' })}
              className="w-full h-10"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Login with Google
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/blog')}
              className="w-full h-10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </CardContent>
        </Card>
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
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-heading text-black dark:text-white">Create New Post</h1>
                  <p className="text-sm text-black dark:text-white">Share your thoughts</p>
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
                {isSubmitting ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Alert Messages */}
        {error && (
          <Alert className="mb-4 bg-destructive/10 border-destructive/20">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive text-sm">{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-4 bg-green-500/10 border-green-500/20">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600 text-sm">{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Input */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base font-heading text-black dark:text-white">
                  <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-primary" />
                  </div>
                  Post Title
                </CardTitle>
                <CardDescription className="text-sm text-black dark:text-white">
                  Write a compelling title for your post
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
                <CardTitle className="flex items-center space-x-2 text-base font-heading text-black dark:text-white">
                  <div className="w-6 h-6 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-3 h-3 text-secondary" />
                  </div>
                  Content
                </CardTitle>
                <CardDescription className="text-sm text-black dark:text-white">
                  Write your blog post content
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="min-h-[400px] bg-background rounded-lg p-4 ">
                  <TiptapModalEditor
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
                <CardTitle className="flex items-center space-x-2 text-base font-heading text-black dark:text-white">
                  <div className="w-6 h-6 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Tag className="w-3 h-3 text-accent" />
                  </div>
                  Tags
                </CardTitle>
                <CardDescription className="text-sm text-black dark:text-white">
                  Add relevant tags
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
                                  <CardTitle className="flex items-center space-x-2 text-base font-heading text-black dark:text-white">
                  <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Eye className="w-3 h-3 text-primary" />
                  </div>
                  Preview
                </CardTitle>
                <CardDescription className="text-sm text-black dark:text-white">
                  How your post will appear
                </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4 bg-muted/50 rounded-lg p-4">
                    <h1 className="text-xl font-bold font-heading text-black dark:text-white">
                      {title || 'Your post title will appear here'}
                    </h1>
                    <Separator />
                    <div 
                      className="prose prose-sm max-w-none text-black dark:text-white"
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

            {/* Publishing Tips */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base font-heading text-black dark:text-white">
                  <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-primary" />
                  </div>
                  Publishing Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-black dark:text-white">
                    Write a compelling title
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-black dark:text-white">
                    Use clear, engaging content
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-black dark:text-white">
                    Add relevant tags
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-black dark:text-white">
                    Preview before publishing
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

export default CreateBlogPage
