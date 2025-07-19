import { NextRequest, NextResponse } from "next/server";
import { db } from "@/index";
import { likesTable, blogTable, usersTable, userProfilesTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// GET /api/blogs/:id/likes - Get likes for a blog
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

    // Get likes with user information
    const likes = await db
      .select({
        id: likesTable.id,
        userId: likesTable.userId,
        blogId: likesTable.blogId,
        createdAt: likesTable.createdAt,
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
      .from(likesTable)
      .leftJoin(usersTable, eq(likesTable.userId, usersTable.id))
      .leftJoin(userProfilesTable, eq(usersTable.id, userProfilesTable.userId))
      .where(eq(likesTable.blogId, blogId))
      .orderBy(desc(likesTable.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCount = await db
      .select({ count: likesTable.id })
      .from(likesTable)
      .where(eq(likesTable.blogId, blogId));

    return NextResponse.json({
      success: true,
      data: likes,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        totalPages: Math.ceil(totalCount.length / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching likes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch likes" },
      { status: 500 }
    );
  }
} 