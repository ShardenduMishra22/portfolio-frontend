import { db } from "@/index";
import { eq } from "drizzle-orm";
import { reportsTable } from "@/db/schema";
import { user as usersTable } from "@/db/authSchema";
import { NextRequest, NextResponse } from "next/server";

// GET /api/reports/:id - Get report by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const reportId = parseInt((await params).id);

    if (isNaN(reportId)) {
      return NextResponse.json(
        { success: false, error: "Invalid report ID" },
        { status: 400 }
      );
    }

    const report = await db
      .select({
        id: reportsTable.id,
        reporterId: reportsTable.reporterId,
        contentType: reportsTable.contentType,
        contentId: reportsTable.contentId,
        reason: reportsTable.reason,
        description: reportsTable.description,
        status: reportsTable.status,
        createdAt: reportsTable.createdAt,
        resolvedAt: reportsTable.resolvedAt,
        reporter: {
          id: usersTable.id,
          email: usersTable.email,
        },
      })
      .from(reportsTable)
      .leftJoin(usersTable, eq(reportsTable.reporterId, usersTable.id))
      .where(eq(reportsTable.id, reportId))
      .limit(1);

    if (report.length === 0) {
      return NextResponse.json(
        { success: false, error: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: report[0],
    });
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch report" },
      { status: 500 }
    );
  }
} 