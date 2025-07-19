import { db } from "@/index";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { historyTable, blogTable, userProfilesTable } from "@/db/schema";
import { user as usersTable } from "@/db/authSchema";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
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

    // Get history with blog and author information
    const history = await db
      .select({
        id: historyTable.id,
        userId: historyTable.userId,
        blogId: historyTable.blogId,
        createdAt: historyTable.createdAt,
        blog: {
          id: blogTable.id,
          title: blogTable.title,
          content: blogTable.content,
          tags: blogTable.tags,
          authorId: blogTable.authorId,
          createdAt: blogTable.createdAt,
          updatedAt: blogTable.updatedAt,
        },
        author: {
          id: usersTable.id,
          email: usersTable.email,
        },
        authorProfile: {
          firstName: userProfilesTable.firstName,
          lastName: userProfilesTable.lastName,
          avatar: userProfilesTable.avatar,
        },
      })
      .from(historyTable)
      .leftJoin(blogTable, eq(historyTable.blogId, blogTable.id))
      .leftJoin(usersTable, eq(blogTable.authorId, usersTable.id))
      .leftJoin(userProfilesTable, eq(usersTable.id, userProfilesTable.userId))
      .where(eq(historyTable.userId, userId.toString()))
      .orderBy(desc(historyTable.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCount = await db
      .select({ count: historyTable.id })
      .from(historyTable)
      .where(eq(historyTable.userId, userId.toString()));

    return NextResponse.json({
      success: true,
      data: history,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        totalPages: Math.ceil(totalCount.length / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching user history:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user history" },
      { status: 500 }
    );
  }
} 