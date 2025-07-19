'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { blogsService } from '@/services/blogs'
import { Blog } from '@/services/types'
import BlogList from '@/components/blog/BlogList'

const BlogTestPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [testResults, setTestResults] = useState<{
    apiWorking: boolean
    dataReceived: boolean
    blogsCount: number
    hasContent: boolean
  } | null>(null)

  useEffect(() => {
    runTest()
  }, [])

  const runTest = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log('🧪 Starting blog display test...')
      
      const response = await blogsService.getBlogs()
      console.log('📡 API Response:', response)
      
      const results = {
        apiWorking: response.success,
        dataReceived: !!response.data,
        blogsCount: Array.isArray(response.data) ? response.data.length : 0,
        hasContent: !!(Array.isArray(response.data) && response.data.length > 0)
      }
      
      setTestResults(results)
      setBlogs(Array.isArray(response.data) ? response.data : [])
      
      console.log('✅ Test Results:', results)
      
      if (response.success && response.data) {
        console.log('📊 Found blogs:', Array.isArray(response.data) ? response.data.length : 0)
        if (Array.isArray(response.data)) {
          response.data.forEach((blog, index) => {
            console.log(`📝 Blog ${index + 1}:`, {
              id: blog.id,
              title: blog.title,
              authorId: blog.authorId,
              tags: blog.tags
            })
          })
        }
      }
      
    } catch (error) {
      console.error('❌ Test failed:', error)
      setError('Failed to load blogs')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-foreground">Running blog display test...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted/20 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Blog Display Test</h1>
          <p className="text-foreground/80">Testing blog fetching and display functionality</p>
        </div>

        {/* Test Results */}
        {testResults && (
          <Card className="mb-8 bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Test Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  {testResults.apiWorking ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-sm">API Working</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {testResults.dataReceived ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-sm">Data Received</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{testResults.blogsCount}</Badge>
                  <span className="text-sm">Blogs Found</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {testResults.hasContent ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-sm">Has Content</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card className="mb-8 bg-destructive/10 border-destructive">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <span className="text-destructive">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Blog Display */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Blog Display Test</h2>
            <Button onClick={runTest} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Run Test Again
            </Button>
          </div>
          
          <BlogList 
            blogs={blogs}
            onReadMore={(blogId) => console.log('Read more clicked for blog:', blogId)}
            layout="grid"
            showStats={true}
            emptyMessage="No blogs found in database"
          />
        </div>

        {/* Debug Information */}
        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Total Blogs:</strong> {blogs.length}</p>
              <p><strong>API Success:</strong> {testResults?.apiWorking ? 'Yes' : 'No'}</p>
              <p><strong>Data Structure:</strong> {blogs.length > 0 ? 'Valid' : 'Empty'}</p>
              <p><strong>Sample Blog:</strong> {blogs[0] ? `ID: ${blogs[0].id}, Title: ${blogs[0].title}` : 'None'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BlogTestPage 