import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/index'
import { bookmarksTable, blogTable } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { user as usersTable } from '@/db/authSchema'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const blogId = parseInt(id)
    const body = await request.json()
    const { userId } = body

    if (isNaN(blogId)) {
      return NextResponse.json({ success: false, error: 'Invalid blog ID' }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ success: false, error: 'UserId is required' }, { status: 400 })
    }

    // Check if blog exists
    const blog = await db.select().from(blogTable).where(eq(blogTable.id, blogId)).limit(1)

    if (blog.length === 0) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 })
    }

    // Check if user exists
    const user = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1)

    if (user.length === 0) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // Check if already bookmarked
    const existingBookmark = await db
      .select()
      .from(bookmarksTable)
      .where(and(eq(bookmarksTable.blogId, blogId), eq(bookmarksTable.userId, userId)))
      .limit(1)

    if (existingBookmark.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Blog already bookmarked by this user' },
        { status: 409 }
      )
    }

    // Create bookmark
    const [newBookmark] = await db
      .insert(bookmarksTable)
      .values({
        userId,
        blogId,
      })
      .returning({
        id: bookmarksTable.id,
        userId: bookmarksTable.userId,
        blogId: bookmarksTable.blogId,
        createdAt: bookmarksTable.createdAt,
      })

    return NextResponse.json({ success: true, data: newBookmark }, { status: 201 })
  } catch (error) {
    console.error('Error bookmarking blog:', error)
    return NextResponse.json({ success: false, error: 'Failed to bookmark blog' }, { status: 500 })
  }
}
