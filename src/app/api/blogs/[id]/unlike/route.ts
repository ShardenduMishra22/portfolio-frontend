import { NextRequest, NextResponse } from "next/server";
import { db } from "@/index";
import { likesTable, blogTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { user as usersTable } from "@/db/authSchema";

// POST /api/blogs/:id/unlike - Unlike a blog
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const blogId = parseInt((await params).id);
    const body = await request.json();
    const { userId } = body;

    if (isNaN(blogId)) {
      return NextResponse.json(
        { success: false, error: "Invalid blog ID" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "UserId is required" },
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

    // Check if like exists
    const existingLike = await db
      .select()
      .from(likesTable)
      .where(and(eq(likesTable.blogId, blogId), eq(likesTable.userId, userId)))
      .limit(1);

    if (existingLike.length === 0) {
      return NextResponse.json(
        { success: false, error: "Blog not liked by this user" },
        { status: 404 }
      );
    }

    // Remove like
    await db
      .delete(likesTable)
      .where(and(eq(likesTable.blogId, blogId), eq(likesTable.userId, userId)));

    return NextResponse.json({
      success: true,
      message: "Blog unliked successfully",
    });
  } catch (error) {
    console.error("Error unliking blog:", error);
    return NextResponse.json(
      { success: false, error: "Failed to unlike blog" },
      { status: 500 }
    );
  }
} 