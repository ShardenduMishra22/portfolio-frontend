import { db } from "@/index";
import { eq, desc } from "drizzle-orm";
import { user as usersTable } from "@/db/authSchema";
import { NextRequest, NextResponse } from "next/server";
import { followersTable, userProfilesTable } from "@/db/schema";

// GET /api/users/:id/following - Get users that a user is following
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = parseInt((await params).id);
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

    // Get following users with user information
    const following = await db
      .select({
        id: followersTable.id,
        followerId: followersTable.followerId,
        followingId: followersTable.followingId,
        createdAt: followersTable.createdAt,
        following: {
          id: usersTable.id,
          email: usersTable.email,
        },
        followingProfile: {
          firstName: userProfilesTable.firstName,
          lastName: userProfilesTable.lastName,
          avatar: userProfilesTable.avatar,
        },
      })
      .from(followersTable)
      .leftJoin(usersTable, eq(followersTable.followingId, usersTable.id))
      .leftJoin(userProfilesTable, eq(usersTable.id, userProfilesTable.userId))
      .where(eq(followersTable.followerId, userId.toString()))
      .orderBy(desc(followersTable.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCount = await db
      .select({ count: followersTable.id })
      .from(followersTable)
      .where(eq(followersTable.followerId, userId.toString()));

    return NextResponse.json({
      success: true,
      data: following,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        totalPages: Math.ceil(totalCount.length / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching following:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch following" },
      { status: 500 }
    );
  }
} 