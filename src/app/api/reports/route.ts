import { NextRequest, NextResponse } from "next/server";
import { db } from "@/index";
import { reportsTable, usersTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// GET /api/reports - List reports (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const offset = (page - 1) * limit;

    // Build where conditions
    let whereCondition = undefined;
    if (status) {
      whereCondition = eq(reportsTable.status, status);
    }

    const reports = await db
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
      .where(whereCondition)
      .orderBy(desc(reportsTable.createdAt))
      .limit(limit)
      .offset(offset);

    const totalCount = await db
      .select({ count: reportsTable.id })
      .from(reportsTable)
      .where(whereCondition);

    return NextResponse.json({
      success: true,
      data: reports,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        totalPages: Math.ceil(totalCount.length / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

// POST /api/reports - Create a new report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reporterId, contentType, contentId, reason, description } = body;

    if (!reporterId || !contentType || !contentId || !reason) {
      return NextResponse.json(
        { success: false, error: "ReporterId, contentType, contentId, and reason are required" },
        { status: 400 }
      );
    }

    // Check if reporter exists
    const reporter = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, reporterId))
      .limit(1);

    if (reporter.length === 0) {
      return NextResponse.json(
        { success: false, error: "Reporter not found" },
        { status: 404 }
      );
    }

    // Create new report
    const [newReport] = await db
      .insert(reportsTable)
      .values({
        reporterId,
        contentType,
        contentId,
        reason,
        description,
        status: "pending",
      })
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

    return NextResponse.json(
      { success: true, data: newReport },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create report" },
      { status: 500 }
    );
  }
} 