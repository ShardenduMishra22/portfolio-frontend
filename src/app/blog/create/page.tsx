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

    // Get user ID from session
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
        authorId: userId, // Add the authorId to the request
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
      // Handle specific error cases
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading session...</p>
        </div>
      </div>
    )
  }

  if (!session.data?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-muted/20">
        <Card className="w-full max-w-md bg-card/60 backdrop-blur-sm border-border/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Create Blog Post</CardTitle>
            <CardDescription className="text-foreground">
              You need to be logged in to create a blog post
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <p className="text-foreground">Please log in to create a blog post.</p>
              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={() => authClient.signIn.social({ provider: 'google' })}
                  className="bg-primary hover:bg-primary/90 w-full"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Login with Google
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/blog')}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
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
                <h1 className="text-2xl font-bold text-foreground font-heading">Create New Post</h1>
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
                {isSubmitting ? 'Publishing...' : 'Publish Post'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Alert Messages */}
        {error && (
          <Alert className="mb-6 border-destructive bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 border-green-500 bg-green-500/10">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

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
                  Write a compelling title that captures your readers&apos; attention
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
                  Write your blog post content using the rich text editor below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[400px]">
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
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Tag className="w-5 h-5 text-primary" />
                  <span>Tags</span>
                </CardTitle>
                <CardDescription>
                  Add relevant tags to help readers find your post
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
                    How your post will appear to readers
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

            {/* Publishing Tips */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Publishing Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-foreground">
                    Write a compelling title that captures attention
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-foreground">
                    Use clear, engaging content that provides value
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-foreground">
                    Add relevant tags to help readers discover your post
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-muted rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-foreground">
                    Preview your post before publishing
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