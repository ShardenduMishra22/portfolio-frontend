import { db } from "@/index";
import { eq, desc } from "drizzle-orm";
import { user as usersTable } from "@/db/authSchema";
import { NextRequest, NextResponse } from "next/server";
import { bookmarksTable, blogTable, userProfilesTable } from "@/db/schema";
// GET /api/users/:id/bookmarks - Get bookmarks for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid user ID" },
        { status: 400 }
      );
    }

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

    const bookmarks = await db
      .select({
        id: bookmarksTable.id,
        userId: bookmarksTable.userId,
        blogId: bookmarksTable.blogId,
        createdAt: bookmarksTable.createdAt,
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
      .from(bookmarksTable)
      .leftJoin(blogTable, eq(bookmarksTable.blogId, blogTable.id))
      .leftJoin(usersTable, eq(blogTable.authorId, usersTable.id))
      .leftJoin(userProfilesTable, eq(usersTable.id, userProfilesTable.userId))
      .where(eq(bookmarksTable.userId, userId))
      .orderBy(desc(bookmarksTable.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCount = await db
      .select({ count: bookmarksTable.id })
      .from(bookmarksTable)
      .where(eq(bookmarksTable.userId, userId));

    return NextResponse.json({
      success: true,
      data: bookmarks,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        totalPages: Math.ceil(totalCount.length / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching user bookmarks:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user bookmarks" },
      { status: 500 }
    );
  }
} 