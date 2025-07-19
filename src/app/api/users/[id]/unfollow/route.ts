import { db } from "@/index";
import { eq, and } from "drizzle-orm";
import { followersTable } from "@/db/schema";
import { user as usersTable } from "@/db/authSchema";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const followingId = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const followerId = parseInt(searchParams.get("followerId") || "");

    if (isNaN(followingId)) {
      return NextResponse.json(
        { success: false, error: "Invalid user ID" },
        { status: 400 }
      );
    }

    if (isNaN(followerId)) {
      return NextResponse.json(
        { success: false, error: "Valid followerId is required" },
        { status: 400 }
      );
    }

    // Check if user to unfollow exists
    const userToUnfollow = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, followingId.toString()))
      .limit(1);

    if (userToUnfollow.length === 0) {
      return NextResponse.json(
        { success: false, error: "User to unfollow not found" },
        { status: 404 }
      );
    }

    // Check if follower exists
    const follower = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, followerId.toString()))
      .limit(1);

    if (follower.length === 0) {
      return NextResponse.json(
        { success: false, error: "Follower not found" },
        { status: 404 }
      );
    }

    // Check if follow relationship exists
    const existingFollow = await db
      .select()
      .from(followersTable)
      .where(and(eq(followersTable.followerId, followerId.toString()), eq(followersTable.followingId, followingId.toString())))
      .limit(1);

    if (existingFollow.length === 0) {
      return NextResponse.json(
        { success: false, error: "Not following this user" },
        { status: 404 }
      );
    }

    // Remove follow relationship
    await db
      .delete(followersTable)
      .where(and(eq(followersTable.followerId, followerId.toString()), eq(followersTable.followingId, followingId.toString())));

    return NextResponse.json({
      success: true,
      message: "User unfollowed successfully",
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to unfollow user" },
      { status: 500 }
    );
  }
} 