import { db } from "@/index";
import { eq } from "drizzle-orm";
import { user as usersTable } from "@/db/authSchema";
import { userProfilesTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = (await params).id;

    const user = await db
      .select({
        id: userProfilesTable.id,
        bio: userProfilesTable.bio,
        avatar: userProfilesTable.avatar,
        userId: userProfilesTable.userId,
        dob: userProfilesTable.dateOfBirth,
        website: userProfilesTable.website,
        lastName: userProfilesTable.lastName,
        firstName: userProfilesTable.firstName,
        createdAt: userProfilesTable.createdAt,
        updatedAt: userProfilesTable.updatedAt,
      })
      .from(userProfilesTable)
      .where(eq(userProfilesTable.id, Number(userId)))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user[0],
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = (await params).id;
    const body = await request.json();

    const existingProfile = await db
      .select()
      .from(userProfilesTable)
      .where(eq(userProfilesTable.userId, userId))
      .limit(1);

    if (existingProfile.length === 0) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    const [updatedProfile] = await db
      .update(userProfilesTable)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(userProfilesTable.userId, userId))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = (await params).id;

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    await db.delete(usersTable).where(eq(usersTable.id, userId));

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}