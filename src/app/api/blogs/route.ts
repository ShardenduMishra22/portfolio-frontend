import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/index'
import {
  blogTable,
  userProfilesTable,
  likesTable,
  commentsTable,
  blogViewsTable,
} from '@/db/schema'
import { eq, desc, like, and, or, count } from 'drizzle-orm'
import { user as usersTable } from '@/db/authSchema'

// GET /api/blogs - List blogs with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const tag = searchParams.get('tag')
    const category = searchParams.get('category')
    const author = searchParams.get('author')
    const search = searchParams.get('search')
    const offset = (page - 1) * limit

    // Build where conditions
    const conditions = []

    if (tag) {
      conditions.push(like(blogTable.tags, `%${tag}%`))
    }

    if (search) {
      conditions.push(
        or(like(blogTable.title, `%${search}%`), like(blogTable.content, `%${search}%`))
      )
    }

    if (author) {
      // Join with users and profiles to search by author name
      // This is a simplified version - you might want to add a proper join
      conditions.push(eq(blogTable.authorId, author))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    // Get blogs with author information
    const blogs = await db
      .select({
        id: blogTable.id,
        title: blogTable.title,
        content: blogTable.content,
        tags: blogTable.tags,
        authorId: blogTable.authorId,
        createdAt: blogTable.createdAt,
        updatedAt: blogTable.updatedAt,
        author: {
          id: usersTable.id,
          email: usersTable.email,
          avatar: usersTable.image,
          name: usersTable.name,
        },
        authorProfile: {
          firstName: userProfilesTable.firstName,
          lastName: userProfilesTable.lastName,
          avatar: userProfilesTable.avatar,
        },
      })
      .from(blogTable)
      .leftJoin(usersTable, eq(blogTable.authorId, usersTable.id))
      .leftJoin(userProfilesTable, eq(usersTable.id, userProfilesTable.userId))
      .where(whereClause)
      .orderBy(desc(blogTable.createdAt))
      .limit(limit)
      .offset(offset)

    // Get counts for each blog
    const blogsWithCounts = await Promise.all(
      blogs.map(async (blog) => {
        const [likesCount, commentsCount, viewsCount] = await Promise.all([
          db.select({ count: count() }).from(likesTable).where(eq(likesTable.blogId, blog.id)),
          db
            .select({ count: count() })
            .from(commentsTable)
            .where(eq(commentsTable.blogId, blog.id)),
          db
            .select({ count: count() })
            .from(blogViewsTable)
            .where(eq(blogViewsTable.blogId, blog.id)),
        ])

        return {
          ...blog,
          likes: likesCount[0]?.count || 0,
          comments: commentsCount[0]?.count || 0,
          views: viewsCount[0]?.count || 0,
        }
      })
    )

    // Get total count for pagination
    const totalCount = await db.select({ count: count() }).from(blogTable).where(whereClause)

    return NextResponse.json({
      success: true,
      data: blogsWithCounts,
      pagination: {
        page,
        limit,
        total: totalCount[0]?.count || 0,
        totalPages: Math.ceil((totalCount[0]?.count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

// POST /api/blogs - Create a new blog
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, tags, authorId } = body

    if (!title || !content || !authorId) {
      return NextResponse.json(
        { success: false, error: 'Title, content, and authorId are required' },
        { status: 400 }
      )
    }

    // Check if author exists
    const author = await db.select().from(usersTable).where(eq(usersTable.id, authorId)).limit(1)

    if (author.length === 0) {
      return NextResponse.json({ success: false, error: 'Author not found' }, { status: 404 })
    }

    // Create new blog
    const [newBlog] = await db
      .insert(blogTable)
      .values({
        title,
        content,
        tags: tags || [],
        authorId,
      })
      .returning({
        id: blogTable.id,
        title: blogTable.title,
        content: blogTable.content,
        tags: blogTable.tags,
        authorId: blogTable.authorId,
        createdAt: blogTable.createdAt,
        updatedAt: blogTable.updatedAt,
      })

    return NextResponse.json({ success: true, data: newBlog }, { status: 201 })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json({ success: false, error: 'Failed to create blog' }, { status: 500 })
  }
}
