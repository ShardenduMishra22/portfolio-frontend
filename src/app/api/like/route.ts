import { likesTable } from '@/db/schema'
import { db } from '@/index'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const likes = await db.select().from(likesTable)

    if (likes.length === 0) {
      return NextResponse.json({ success: false, error: 'No likes found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: likes,
      count: likes.length,
    })
  } catch (error) {
    console.error('Error fetching likes:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch likes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, postId } = await request.json()
    if (!userId || !postId) {
      return NextResponse.json(
        { success: false, error: 'User ID and Post ID are required' },
        { status: 400 }
      )
    }

    const blogId = postId

    const existLike = await db
      .select()
      .from(likesTable)
      .where((likesTable as any).userId.eq(userId).and((likesTable as any).blogId.eq(blogId)))

    if (existLike && existLike.length > 0) {
      await db
        .delete(likesTable)
        .where((likesTable as any).userId.eq(userId).and((likesTable as any).blogId.eq(blogId)))

      return NextResponse.json(
        { success: true, message: 'Like removed successfully' },
        { status: 200 }
      )
    }

    const newLike = await db.insert(likesTable).values({ userId, blogId })

    return NextResponse.json({ success: true, data: newLike }, { status: 201 })
  } catch (error) {
    console.error('Error creating like:', error)
    return NextResponse.json({ success: false, error: 'Failed to create like' }, { status: 500 })
  }
}
