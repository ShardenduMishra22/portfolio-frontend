import { historyTable } from "@/db/schema";
import { db } from "@/index";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const history = await db.select().from(historyTable);
    
        if (history.length === 0) {
        return NextResponse.json(
            { success: false, error: "No history found" },
            { status: 404 }
        );
        }
    
        return NextResponse.json({
        success: true,
        data: history,
        count: history.length,
        });
    } catch (error) {
        console.error("Error fetching history:", error);
        return NextResponse.json(
        { success: false, error: "Failed to fetch history" },
        { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId, action, relatedId, blogId } = await request.json();
        if (!userId || !action || !relatedId || !blogId) {
            return NextResponse.json(
                { success: false, error: "User ID, action, related ID, and blog ID are required" },
                { status: 400 }
            );
        }

        const newHistory = {
            userId,
            blogId,
            createdAt: new Date(),
        };

        const [createdHistory] = await db
            .insert(historyTable)
            .values(newHistory)
            .returning();

        return NextResponse.json({
            success: true,
            data: createdHistory,
        });
    } catch (error) {
        console.error("Error creating history:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create history" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json(
                { success: false, error: "ID is required" },
                { status: 400 }
            );
        }

        const deletedHistory = await db
            .delete(historyTable)
            .where(eq(historyTable.id, id))
            .returning();

        if (deletedHistory.length === 0) {
            return NextResponse.json(
                { success: false, error: "History not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: deletedHistory,
        });
    } catch (error) {
        console.error("Error deleting history:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete history" },
            { status: 500 }
        );
    }
}