import { NextRequest, NextResponse } from "next/server";
import { db } from "@/index";
import { commentsTable, blogTable, usersTable, userProfilesTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// GET /api/blogs/:id/comments - Get comments for a blog
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blogId = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    if (isNaN(blogId)) {
      return NextResponse.json(
        { success: false, error: "Invalid blog ID" },
        { status: 400 }
      );
    }

    // Check if blog exists
    const blog = await db
      .select()
      .from(blogTable)
      .where(eq(blogTable.id, blogId))
      .limit(1);

    if (blog.length === 0) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    // Get comments with user information
    const comments = await db
      .select({
        id: commentsTable.id,
        content: commentsTable.content,
        userId: commentsTable.userId,
        blogId: commentsTable.blogId,
        createdAt: commentsTable.createdAt,
        user: {
          id: usersTable.id,
          email: usersTable.email,
        },
        userProfile: {
          firstName: userProfilesTable.firstName,
          lastName: userProfilesTable.lastName,
          avatar: userProfilesTable.avatar,
        },
      })
      .from(commentsTable)
      .leftJoin(usersTable, eq(commentsTable.userId, usersTable.id))
      .leftJoin(userProfilesTable, eq(usersTable.id, userProfilesTable.userId))
      .where(eq(commentsTable.blogId, blogId))
      .orderBy(desc(commentsTable.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCount = await db
      .select({ count: commentsTable.id })
      .from(commentsTable)
      .where(eq(commentsTable.blogId, blogId));

    return NextResponse.json({
      success: true,
      data: comments,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        totalPages: Math.ceil(totalCount.length / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST /api/blogs/:id/comments - Create a new comment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blogId = parseInt(params.id);
    const body = await request.json();
    const { content, userId } = body;

    if (isNaN(blogId)) {
      return NextResponse.json(
        { success: false, error: "Invalid blog ID" },
        { status: 400 }
      );
    }

    if (!content || !userId) {
      return NextResponse.json(
        { success: false, error: "Content and userId are required" },
        { status: 400 }
      );
    }

    // Check if blog exists
    const blog = await db
      .select()
      .from(blogTable)
      .where(eq(blogTable.id, blogId))
      .limit(1);

    if (blog.length === 0) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    // Check if user exists
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Create new comment
    const [newComment] = await db
      .insert(commentsTable)
      .values({
        content,
        userId,
        blogId,
      })
      .returning({
        id: commentsTable.id,
        content: commentsTable.content,
        userId: commentsTable.userId,
        blogId: commentsTable.blogId,
        createdAt: commentsTable.createdAt,
      });

    return NextResponse.json(
      { success: true, data: newComment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create comment" },
      { status: 500 }
    );
  }
} 