import { NextRequest, NextResponse } from "next/server";
import { db } from "@/index";
import { notificationsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

// DELETE /api/notifications/:id - Delete notification
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notificationId = parseInt(params.id);

    if (isNaN(notificationId)) {
      return NextResponse.json(
        { success: false, error: "Invalid notification ID" },
        { status: 400 }
      );
    }

    // Check if notification exists
    const existingNotification = await db
      .select()
      .from(notificationsTable)
      .where(eq(notificationsTable.id, notificationId))
      .limit(1);

    if (existingNotification.length === 0) {
      return NextResponse.json(
        { success: false, error: "Notification not found" },
        { status: 404 }
      );
    }

    // Delete notification
    await db.delete(notificationsTable).where(eq(notificationsTable.id, notificationId));

    return NextResponse.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete notification" },
      { status: 500 }
    );
  }
} 