import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/index'
import { blogRevisionsTable, blogTable } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

// GET /api/blogs/:id/revisions - Get revisions for a blog
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const blogId = parseInt((await params).id)
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    if (isNaN(blogId)) {
      return NextResponse.json({ success: false, error: 'Invalid blog ID' }, { status: 400 })
    }

    // Check if blog exists
    const blog = await db.select().from(blogTable).where(eq(blogTable.id, blogId)).limit(1)

    if (blog.length === 0) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 })
    }

    // Get revisions for the blog
    const revisions = await db
      .select({
        id: blogRevisionsTable.id,
        blogId: blogRevisionsTable.blogId,
        title: blogRevisionsTable.title,
        content: blogRevisionsTable.content,
        tags: blogRevisionsTable.tags,
        version: blogRevisionsTable.version,
        createdAt: blogRevisionsTable.createdAt,
      })
      .from(blogRevisionsTable)
      .where(eq(blogRevisionsTable.blogId, blogId))
      .orderBy(desc(blogRevisionsTable.version))
      .limit(limit)
      .offset(offset)

    // Get total count for pagination
    const totalCount = await db
      .select({ count: blogRevisionsTable.id })
      .from(blogRevisionsTable)
      .where(eq(blogRevisionsTable.blogId, blogId))

    return NextResponse.json({
      success: true,
      data: revisions,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        totalPages: Math.ceil(totalCount.length / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching revisions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch revisions' },
      { status: 500 }
    )
  }
}

// POST /api/blogs/:id/revisions - Create a new revision
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const blogId = parseInt((await params).id)
    const body = await request.json()
    const { title, content, tags } = body

    if (isNaN(blogId)) {
      return NextResponse.json({ success: false, error: 'Invalid blog ID' }, { status: 400 })
    }

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Check if blog exists
    const blog = await db.select().from(blogTable).where(eq(blogTable.id, blogId)).limit(1)

    if (blog.length === 0) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 })
    }

    // Get the latest version number
    const latestRevision = await db
      .select({ version: blogRevisionsTable.version })
      .from(blogRevisionsTable)
      .where(eq(blogRevisionsTable.blogId, blogId))
      .orderBy(desc(blogRevisionsTable.version))
      .limit(1)

    const nextVersion = latestRevision.length > 0 ? latestRevision[0].version + 1 : 1

    // Create new revision
    const [newRevision] = await db
      .insert(blogRevisionsTable)
      .values({
        blogId,
        title,
        content,
        tags: tags || [],
        version: nextVersion,
      })
      .returning({
        id: blogRevisionsTable.id,
        blogId: blogRevisionsTable.blogId,
        title: blogRevisionsTable.title,
        content: blogRevisionsTable.content,
        tags: blogRevisionsTable.tags,
        version: blogRevisionsTable.version,
        createdAt: blogRevisionsTable.createdAt,
      })

    return NextResponse.json({ success: true, data: newRevision }, { status: 201 })
  } catch (error) {
    console.error('Error creating revision:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create revision' },
      { status: 500 }
    )
  }
}
