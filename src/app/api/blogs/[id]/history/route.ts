import { NextRequest, NextResponse } from "next/server";
import { db } from "@/index";
import { historyTable, blogTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { user as usersTable } from "@/db/authSchema";

// POST /api/blogs/:id/history - Add blog to user history
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

    // Check if already in history
    const existingHistory = await db
      .select()
      .from(historyTable)
      .where(and(eq(historyTable.blogId, blogId), eq(historyTable.userId, userId)))
      .limit(1);

    let historyEntry;

    if (existingHistory.length > 0) {
      // Update existing history entry (update timestamp)
      [historyEntry] = await db
        .update(historyTable)
        .set({
          createdAt: new Date(),
        })
        .where(and(eq(historyTable.blogId, blogId), eq(historyTable.userId, userId)))
        .returning({
          id: historyTable.id,
          userId: historyTable.userId,
          blogId: historyTable.blogId,
          createdAt: historyTable.createdAt,
        });
    } else {
      // Create new history entry
      [historyEntry] = await db
        .insert(historyTable)
        .values({
          userId,
          blogId,
        })
        .returning({
          id: historyTable.id,
          userId: historyTable.userId,
          blogId: historyTable.blogId,
          createdAt: historyTable.createdAt,
        });
    }

    return NextResponse.json(
      { success: true, data: historyEntry },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding to history:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add to history" },
      { status: 500 }
    );
  }
} 