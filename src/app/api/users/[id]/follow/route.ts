import { db } from "@/index";
import { eq, and } from "drizzle-orm";
import { followersTable } from "@/db/schema";
import { user as usersTable } from "@/db/authSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const followingId = parseInt((await params).id);
    const body = await request.json();
    const { followerId } = body;

    if (isNaN(followingId)) {
      return NextResponse.json(
        { success: false, error: "Invalid user ID" },
        { status: 400 }
      );
    }

    if (!followerId) {
      return NextResponse.json(
        { success: false, error: "FollowerId is required" },
        { status: 400 }
      );
    }

    // Prevent self-following
    if (followerId === followingId) {
      return NextResponse.json(
        { success: false, error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    // Check if user to follow exists
    const userToFollow = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, followingId.toString()))
      .limit(1);

    if (userToFollow.length === 0) {
      return NextResponse.json(
        { success: false, error: "User to follow not found" },
        { status: 404 }
      );
    }

    // Check if follower exists
    const follower = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, followerId))
      .limit(1);

    if (follower.length === 0) {
      return NextResponse.json(
        { success: false, error: "Follower not found" },
        { status: 404 }
      );
    }

    // Check if already following
    const existingFollow = await db
      .select()
      .from(followersTable)
      .where(and(eq(followersTable.followerId, followerId), eq(followersTable.followingId, followingId.toString())))
      .limit(1);

    if (existingFollow.length > 0) {
      return NextResponse.json(
        { success: false, error: "Already following this user" },
        { status: 409 }
      );
    }

    // Create follow relationship
    const [newFollow] = await db
      .insert(followersTable)
      .values({
        followerId: followerId.toString(),
        followingId: followingId.toString(),
      })
      .returning({
        id: followersTable.id,
        followerId: followersTable.followerId,
        followingId: followersTable.followingId,
        createdAt: followersTable.createdAt,
      });

    return NextResponse.json(
      { success: true, data: newFollow },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error following user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to follow user" },
      { status: 500 }
    );
  }
} 