import { NextRequest, NextResponse } from "next/server";
import { db } from "@/index";
import { blogViewsTable, blogTable } from "@/db/schema";
import { eq } from "drizzle-orm";

// POST /api/blogs/:id/views - Add view to blog
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blogId = parseInt(params.id);
    const body = await request.json();
    const { userId, ipAddress, userAgent } = body;

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

    // Create view entry
    const [newView] = await db
      .insert(blogViewsTable)
      .values({
        blogId,
        userId: userId || null,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      })
      .returning({
        id: blogViewsTable.id,
        blogId: blogViewsTable.blogId,
        userId: blogViewsTable.userId,
        ipAddress: blogViewsTable.ipAddress,
        userAgent: blogViewsTable.userAgent,
        createdAt: blogViewsTable.createdAt,
      });

    return NextResponse.json(
      { success: true, data: newView },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding view:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add view" },
      { status: 500 }
    );
  }
}

// GET /api/blogs/:id/views - Get views for a blog
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

    // Get views for the blog
    const views = await db
      .select({
        id: blogViewsTable.id,
        blogId: blogViewsTable.blogId,
        userId: blogViewsTable.userId,
        ipAddress: blogViewsTable.ipAddress,
        userAgent: blogViewsTable.userAgent,
        createdAt: blogViewsTable.createdAt,
      })
      .from(blogViewsTable)
      .where(eq(blogViewsTable.blogId, blogId))
      .orderBy(blogViewsTable.createdAt)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCount = await db
      .select({ count: blogViewsTable.id })
      .from(blogViewsTable)
      .where(eq(blogViewsTable.blogId, blogId));

    return NextResponse.json({
      success: true,
      data: views,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        totalPages: Math.ceil(totalCount.length / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching views:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch views" },
      { status: 500 }
    );
  }
} 