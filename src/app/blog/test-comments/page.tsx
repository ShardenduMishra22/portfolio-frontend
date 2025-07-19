'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Send, User } from 'lucide-react'
import { blogsService } from '@/services/blogs'
import { authClient } from '@/lib/authClient'

interface Comment {
  id: number
  content: string
  createdAt: string
  user: {
    id: string
    email: string
  }
  userProfile: {
    firstName: string
    lastName: string
    avatar: string
  }
}

export default function TestCommentsPage() {
  const session = authClient.useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [testResults, setTestResults] = useState<any>({})

  const blogId = '1' // Test with blog ID 1

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await blogsService.getBlogComments(blogId)
      console.log('Comments API Response:', response)
      
      if (response.success && response.data) {
        setComments(Array.isArray(response.data) ? response.data : [])
        setTestResults(prev => ({
          ...prev,
          fetchSuccess: true,
          commentsCount: Array.isArray(response.data) ? response.data.length : 0
        }))
      } else {
        setTestResults(prev => ({
          ...prev,
          fetchSuccess: false,
          fetchError: response.error
        }))
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
      setTestResults(prev => ({
        ...prev,
        fetchSuccess: false,
        fetchError: error
      }))
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!session?.user?.id || !newComment.trim()) return
    
    try {
      setLoading(true)
      const response = await blogsService.addBlogComment(blogId, {
        content: newComment.trim(),
        userId: session.user.id
      })
      
      console.log('Add Comment API Response:', response)
      
      if (response.success) {
        setNewComment('')
        setTestResults(prev => ({
          ...prev,
          addSuccess: true,
          addedComment: response.data
        }))
        // Refresh comments
        fetchComments()
      } else {
        setTestResults(prev => ({
          ...prev,
          addSuccess: false,
          addError: response.error
        }))
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      setTestResults(prev => ({
        ...prev,
        addSuccess: false,
        addError: error
      }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted/20 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Test Results */}
        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <span>Comments Test Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Fetch Comments</h3>
                <div className="space-y-1">
                  <p className="text-sm">
                    Status: {testResults.fetchSuccess ? (
                      <Badge variant="default" className="text-xs">✅ Success</Badge>
                    ) : testResults.fetchError ? (
                      <Badge variant="destructive" className="text-xs">❌ Failed</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">⏳ Pending</Badge>
                    )}
                  </p>
                  <p className="text-sm">Comments Found: {testResults.commentsCount || 0}</p>
                  {testResults.fetchError && (
                    <p className="text-sm text-red-500">Error: {JSON.stringify(testResults.fetchError)}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Add Comment</h3>
                <div className="space-y-1">
                  <p className="text-sm">
                    Status: {testResults.addSuccess ? (
                      <Badge variant="default" className="text-xs">✅ Success</Badge>
                    ) : testResults.addError ? (
                      <Badge variant="destructive" className="text-xs">❌ Failed</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">⏳ Pending</Badge>
                    )}
                  </p>
                  {testResults.addedComment && (
                    <p className="text-sm">Added Comment ID: {testResults.addedComment.id}</p>
                  )}
                  {testResults.addError && (
                    <p className="text-sm text-red-500">Error: {JSON.stringify(testResults.addError)}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Comment Form */}
        {session ? (
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-primary" />
                <span>Add Test Comment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Write a test comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] bg-card/60 backdrop-blur-sm border-border/50"
                />
                <div className="flex items-center justify-between">
                  <p className="text-sm text-foreground">
                    User: {session.user?.email}
                  </p>
                  <Button
                    onClick={handleAddComment}
                    disabled={loading || !newComment.trim()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {loading ? 'Adding...' : 'Add Comment'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="py-8">
              <p className="text-center text-foreground">
                Please log in to test adding comments
              </p>
            </CardContent>
          </Card>
        )}

        {/* Comments List */}
        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <span>Comments ({comments.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-foreground mx-auto mb-4" />
                  <p className="text-foreground">No comments found for this blog.</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="p-4 border border-border/50 rounded-lg bg-card/40">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <p className="font-medium text-foreground">
                            {comment.userProfile?.firstName} {comment.userProfile?.lastName}
                          </p>
                          <p className="text-xs text-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-foreground">{comment.content}</p>
                        <div className="mt-2 text-xs text-foreground">
                          User ID: {comment.user.id} | Comment ID: {comment.id}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Debug Info */}
        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Blog ID:</strong> {blogId}</p>
              <p><strong>Session:</strong> {session ? 'Logged In' : 'Not Logged In'}</p>
              <p><strong>User ID:</strong> {session?.user?.id || 'N/A'}</p>
              <p><strong>User Email:</strong> {session?.user?.email || 'N/A'}</p>
              <p><strong>Comments Count:</strong> {comments.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 