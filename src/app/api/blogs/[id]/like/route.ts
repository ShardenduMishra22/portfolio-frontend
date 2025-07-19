import { NextRequest, NextResponse } from "next/server";
import { db } from "@/index";
import { likesTable, blogTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { user as usersTable } from "@/db/authSchema";

// POST /api/blogs/:id/like - Like a blog
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

    // Check if already liked
    const existingLike = await db
      .select()
      .from(likesTable)
      .where(and(eq(likesTable.blogId, blogId), eq(likesTable.userId, userId)))
      .limit(1);

    if (existingLike.length > 0) {
      return NextResponse.json(
        { success: false, error: "Blog already liked by this user" },
        { status: 409 }
      );
    }

    // Create like
    const [newLike] = await db
      .insert(likesTable)
      .values({
        userId,
        blogId,
      })
      .returning({
        id: likesTable.id,
        userId: likesTable.userId,
        blogId: likesTable.blogId,
        createdAt: likesTable.createdAt,
      });

    return NextResponse.json(
      { success: true, data: newLike },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error liking blog:", error);
    return NextResponse.json(
      { success: false, error: "Failed to like blog" },
      { status: 500 }
    );
  }
} 