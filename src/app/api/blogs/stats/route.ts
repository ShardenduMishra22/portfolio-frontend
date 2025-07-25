import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/index'
import {
  blogTable,
  userProfilesTable,
  likesTable,
  commentsTable,
  blogViewsTable,
} from '@/db/schema'
import { eq, count, desc, sql } from 'drizzle-orm'
import { user as usersTable } from '@/db/authSchema'

// GET /api/blogs/stats - Get aggregated blog statistics
export async function GET(request: NextRequest) {
  try {
    // Get total counts
    const [totalPosts, totalLikes, totalComments, totalViews] = await Promise.all([
      db.select({ count: count() }).from(blogTable),
      db.select({ count: count() }).from(likesTable),
      db.select({ count: count() }).from(commentsTable),
      db.select({ count: count() }).from(blogViewsTable),
    ])

    // Get top performing blog
    const topBlog = await db
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
        },
        authorProfile: {
          firstName: userProfilesTable.firstName,
          lastName: userProfilesTable.lastName,
          avatar: userProfilesTable.avatar,
        },
        viewCount: sql<number>`(
          SELECT COUNT(*) FROM ${blogViewsTable} 
          WHERE ${blogViewsTable.blogId} = ${blogTable.id}
        )`,
      })
      .from(blogTable)
      .leftJoin(usersTable, eq(blogTable.authorId, usersTable.id))
      .leftJoin(userProfilesTable, eq(usersTable.id, userProfilesTable.userId))
      .orderBy(
        desc(sql<number>`(
        SELECT COUNT(*) FROM ${blogViewsTable} 
        WHERE ${blogViewsTable.blogId} = ${blogTable.id}
      )`)
      )
      .limit(1)

    // Get recent posts (last 5)
    const recentPosts = await db
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
      .orderBy(desc(blogTable.createdAt))
      .limit(5)

    // Get author statistics
    const authorStats = await db
      .select({
        authorId: blogTable.authorId,
        authorEmail: usersTable.email,
        firstName: userProfilesTable.firstName,
        lastName: userProfilesTable.lastName,
        avatar: userProfilesTable.avatar,
        postCount: count(blogTable.id),
        totalViews: sql<number>`(
          SELECT COUNT(*) FROM ${blogViewsTable} 
          WHERE ${blogViewsTable.blogId} IN (
            SELECT id FROM ${blogTable} WHERE author_id = ${blogTable.authorId}
          )
        )`,
        totalLikes: sql<number>`(
          SELECT COUNT(*) FROM ${likesTable} 
          WHERE ${likesTable.blogId} IN (
            SELECT id FROM ${blogTable} WHERE author_id = ${blogTable.authorId}
          )
        )`,
      })
      .from(blogTable)
      .leftJoin(usersTable, eq(blogTable.authorId, usersTable.id))
      .leftJoin(userProfilesTable, eq(usersTable.id, userProfilesTable.userId))
      .groupBy(
        blogTable.authorId,
        usersTable.email,
        userProfilesTable.firstName,
        userProfilesTable.lastName,
        userProfilesTable.avatar
      )
      .orderBy(
        desc(sql<number>`(
        SELECT COUNT(*) FROM ${blogViewsTable} 
        WHERE ${blogViewsTable.blogId} IN (
          SELECT id FROM ${blogTable} WHERE author_id = ${blogTable.authorId}
        )
      )`)
      )

    // Get tag statistics
    const tagStats = await db
      .select({
        tag: sql<string>`unnest(${blogTable.tags})`,
        count: count(blogTable.id),
      })
      .from(blogTable)
      .groupBy(sql`unnest(${blogTable.tags})`)
      .orderBy(desc(count(blogTable.id)))

    const stats = {
      totalPosts: totalPosts[0]?.count || 0,
      totalLikes: totalLikes[0]?.count || 0,
      totalComments: totalComments[0]?.count || 0,
      totalViews: totalViews[0]?.count || 0,
      averageViewsPerPost: totalPosts[0]?.count
        ? Math.round((totalViews[0]?.count || 0) / totalPosts[0]?.count)
        : 0,
      averageLikesPerPost: totalPosts[0]?.count
        ? Math.round((totalLikes[0]?.count || 0) / totalPosts[0]?.count)
        : 0,
      averageCommentsPerPost: totalPosts[0]?.count
        ? Math.round((totalComments[0]?.count || 0) / totalPosts[0]?.count)
        : 0,
      topPerformingPost: topBlog[0] || null,
      recentPosts: recentPosts,
      authorStats: authorStats,
      tagStats: tagStats,
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching blog stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog statistics' },
      { status: 500 }
    )
  }
}
