import { NextRequest, NextResponse } from "next/server";
import { db } from "@/index";
import { categoriesTable } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/categories/:slug - Get category by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug is required" },
        { status: 400 }
      );
    }

    const category = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
        slug: categoriesTable.slug,
        description: categoriesTable.description,
        createdAt: categoriesTable.createdAt,
      })
      .from(categoriesTable)
      .where(eq(categoriesTable.slug, slug))
      .limit(1);

    if (category.length === 0) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category[0],
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch category" },
      { status: 500 }
    );
  }
} 