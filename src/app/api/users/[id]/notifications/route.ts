import { db } from "@/index";
import { eq, desc } from "drizzle-orm";
import { notificationsTable } from "@/db/schema";
import { user as usersTable } from "@/db/authSchema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const unreadOnly = searchParams.get("unread") === "true";
    const offset = (page - 1) * limit;

    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: "Invalid user ID" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId.toString()))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Build where conditions
    let whereCondition = eq(notificationsTable.userId, userId.toString());
    if (unreadOnly) {
      whereCondition = eq(notificationsTable.isRead, 0);
    }

    // Get notifications
    const notifications = await db
      .select({
        id: notificationsTable.id,
        userId: notificationsTable.userId,
        type: notificationsTable.type,
        title: notificationsTable.title,
        message: notificationsTable.message,
        relatedId: notificationsTable.relatedId,
        isRead: notificationsTable.isRead,
        createdAt: notificationsTable.createdAt,
      })
      .from(notificationsTable)
      .where(whereCondition)
      .orderBy(desc(notificationsTable.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCount = await db
      .select({ count: notificationsTable.id })
      .from(notificationsTable)
      .where(whereCondition);

    return NextResponse.json({
      success: true,
      data: notifications,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        totalPages: Math.ceil(totalCount.length / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
} 