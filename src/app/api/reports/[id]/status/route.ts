import { db } from "@/index";
import { eq } from "drizzle-orm";
import { reportsTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reportId = parseInt(params.id);
    const body = await request.json();
    const { status } = body;

    if (isNaN(reportId)) {
      return NextResponse.json(
        { success: false, error: "Invalid report ID" },
        { status: 400 }
      );
    }

    if (!status || !["pending", "investigating", "resolved", "dismissed"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Valid status is required (pending, investigating, resolved, dismissed)" },
        { status: 400 }
      );
    }

    // Check if report exists
    const existingReport = await db
      .select()
      .from(reportsTable)
      .where(eq(reportsTable.id, reportId))
      .limit(1);

    if (existingReport.length === 0) {
      return NextResponse.json(
        { success: false, error: "Report not found" },
        { status: 404 }
      );
    }

    // Update report status
    const [updatedReport] = await db
      .update(reportsTable)
      .set({
        status,
        resolvedAt: status === "resolved" || status === "dismissed" ? new Date() : null,
      })
      .where(eq(reportsTable.id, reportId))
      .returning({
        id: reportsTable.id,
        reporterId: reportsTable.reporterId,
        contentType: reportsTable.contentType,
        contentId: reportsTable.contentId,
        reason: reportsTable.reason,
        description: reportsTable.description,
        status: reportsTable.status,
        createdAt: reportsTable.createdAt,
        resolvedAt: reportsTable.resolvedAt,
      });

    return NextResponse.json({
      success: true,
      data: updatedReport,
    });
  } catch (error) {
    console.error("Error updating report status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update report status" },
      { status: 500 }
    );
  }
} 