import { NextRequest, NextResponse } from "next/server";
import { db } from "@/index";
import { bookmarksTable, blogTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { user as usersTable } from "@/db/authSchema";

// POST /api/blogs/:id/unbookmark - Unbookmark a blog
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

    // Check if bookmark exists
    const existingBookmark = await db
      .select()
      .from(bookmarksTable)
      .where(and(eq(bookmarksTable.blogId, blogId), eq(bookmarksTable.userId, userId)))
      .limit(1);

    if (existingBookmark.length === 0) {
      return NextResponse.json(
        { success: false, error: "Blog not bookmarked by this user" },
        { status: 404 }
      );
    }

    // Remove bookmark
    await db
      .delete(bookmarksTable)
      .where(and(eq(bookmarksTable.blogId, blogId), eq(bookmarksTable.userId, userId)));

    return NextResponse.json({
      success: true,
      message: "Blog unbookmarked successfully",
    });
  } catch (error) {
    console.error("Error unbookmarking blog:", error);
    return NextResponse.json(
      { success: false, error: "Failed to unbookmark blog" },
      { status: 500 }
    );
  }
} 