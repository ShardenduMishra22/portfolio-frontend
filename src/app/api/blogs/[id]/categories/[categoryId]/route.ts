import { NextRequest, NextResponse } from "next/server";
import { db } from "@/index";
import { blogCategoriesTable, blogTable, categoriesTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// DELETE /api/blogs/:id/categories/:categoryId - Remove category from blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; categoryId: string } }
) {
  try {
    const blogId = parseInt(params.id);
    const categoryId = parseInt(params.categoryId);

    if (isNaN(blogId)) {
      return NextResponse.json(
        { success: false, error: "Invalid blog ID" },
        { status: 400 }
      );
    }

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { success: false, error: "Invalid category ID" },
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

    // Check if category exists
    const category = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, categoryId))
      .limit(1);

    if (category.length === 0) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if blog category assignment exists
    const existingBlogCategory = await db
      .select()
      .from(blogCategoriesTable)
      .where(and(eq(blogCategoriesTable.blogId, blogId), eq(blogCategoriesTable.categoryId, categoryId)))
      .limit(1);

    if (existingBlogCategory.length === 0) {
      return NextResponse.json(
        { success: false, error: "Category not assigned to this blog" },
        { status: 404 }
      );
    }

    // Remove blog category assignment
    await db
      .delete(blogCategoriesTable)
      .where(and(eq(blogCategoriesTable.blogId, blogId), eq(blogCategoriesTable.categoryId, categoryId)));

    return NextResponse.json({
      success: true,
      message: "Category removed from blog successfully",
    });
  } catch (error) {
    console.error("Error removing category from blog:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove category from blog" },
      { status: 500 }
    );
  }
} 