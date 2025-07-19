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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center">
          <div className="relative mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-lg font-medium">Loading session...</p>
        </div>
      </div>
    )
  }

  if (!session.data?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Card className="w-full max-w-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-8">
            <div className="relative mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
              <BookOpen className="w-10 h-10 text-white" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-3 border-white dark:border-slate-800"></div>
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white">Create Blog Post</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400 text-lg mt-2">
              You need to be logged in to create a blog post
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            <div className="text-center space-y-6">
              <p className="text-slate-700 dark:text-slate-300 text-lg">Please log in to create a blog post.</p>
              <div className="flex flex-col space-y-4">
                <Button 
                  onClick={() => authClient.signIn.social({ provider: 'google' })}
                  className="h-14 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl shadow-blue-500/25 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
                >
                  <Sparkles className="w-6 h-6 mr-3" />
                  Login with Google
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/blog')}
                  className="h-12 px-6 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold"
                >
                  <ArrowLeft className="w-5 h-5 mr-3" />
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl h-12 px-4"
              >
                <ArrowLeft className="w-5 h-5 mr-3" />
                Back
              </Button>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-slate-800"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">Create New Post</h1>
                  <p className="text-base text-slate-600 dark:text-slate-400 mt-1">Share your thoughts with the world</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsPreview(!isPreview)}
                className="h-12 px-6 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold"
              >
                {isPreview ? <EyeOff className="w-5 h-5 mr-3" /> : <Eye className="w-5 h-5 mr-3" />}
                {isPreview ? 'Edit' : 'Preview'}
              </Button>
              
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl shadow-blue-500/25 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                <Save className="w-5 h-5 mr-3" />
                {isSubmitting ? 'Publishing...' : 'Publish Post'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-8 py-10">
        {/* Alert Messages */}
        {error && (
          <Alert className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-700 dark:text-red-300 font-medium">{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-700 dark:text-green-300 font-medium">{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Editor Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title Input */}
            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-slate-900 dark:text-white">Post Title</span>
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 text-base">
                  Write a compelling title that captures your readers&apos; attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Enter your post title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xl font-semibold bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 rounded-xl h-14 px-6"
                />
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-slate-900 dark:text-white">Content</span>
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 text-base">
                  Write your blog post content using the rich text editor below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[500px] bg-slate-50 dark:bg-slate-700 rounded-xl p-6">
                  <TiptapModalEditor
                    value={content}
                    onChange={setContent}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Tags */}
            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-slate-900 dark:text-white">Tags</span>
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 text-base">
                  Add relevant tags to help readers find your post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex space-x-3">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:border-violet-500 dark:focus:border-violet-400 transition-all duration-300 rounded-xl h-12 px-4"
                  />
                  <Button
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                    size="sm"
                    className="h-12 px-4 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg rounded-xl"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center space-x-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900/50 border-violet-200 dark:border-violet-700 font-medium px-4 py-2 rounded-xl"
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-violet-800 dark:hover:text-violet-200 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preview */}
            {isPreview && (
              <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-slate-900 dark:text-white">Preview</span>
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400 text-base">
                    How your post will appear to readers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 bg-slate-50 dark:bg-slate-700 rounded-xl p-6">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
                      {title || 'Your post title will appear here'}
                    </h1>
                    <Separator className="bg-slate-200 dark:bg-slate-600" />
                    <div 
                      className="prose prose-lg max-w-none text-slate-700 dark:text-slate-300"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-3 pt-6">
                        {tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-sm border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 font-medium px-3 py-1">
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
            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-slate-900 dark:text-white">Publishing Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    Write a compelling title that captures attention
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    Use clear, engaging content that provides value
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-violet-500 rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    Add relevant tags to help readers discover your post
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-amber-500 rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
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