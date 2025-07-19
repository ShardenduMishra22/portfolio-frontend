import { NextRequest, NextResponse } from "next/server";
import { db } from "@/index";
import { blogCategoriesTable, blogTable, categoriesTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// GET /api/blogs/:id/categories - Get categories for a blog
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blogId = parseInt(params.id);

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

    // Get categories for the blog
    const blogCategories = await db
      .select({
        id: blogCategoriesTable.id,
        blogId: blogCategoriesTable.blogId,
        categoryId: blogCategoriesTable.categoryId,
        createdAt: blogCategoriesTable.createdAt,
        category: {
          id: categoriesTable.id,
          name: categoriesTable.name,
          slug: categoriesTable.slug,
          description: categoriesTable.description,
        },
      })
      .from(blogCategoriesTable)
      .leftJoin(categoriesTable, eq(blogCategoriesTable.categoryId, categoriesTable.id))
      .where(eq(blogCategoriesTable.blogId, blogId));

    return NextResponse.json({
      success: true,
      data: blogCategories,
    });
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog categories" },
      { status: 500 }
    );
  }
}

// POST /api/blogs/:id/categories - Add category to blog
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blogId = parseInt(params.id);
    const body = await request.json();
    const { categoryId } = body;

    if (isNaN(blogId)) {
      return NextResponse.json(
        { success: false, error: "Invalid blog ID" },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { success: false, error: "CategoryId is required" },
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

    // Check if already assigned
    const existingBlogCategory = await db
      .select()
      .from(blogCategoriesTable)
      .where(and(eq(blogCategoriesTable.blogId, blogId), eq(blogCategoriesTable.categoryId, categoryId)))
      .limit(1);

    if (existingBlogCategory.length > 0) {
      return NextResponse.json(
        { success: false, error: "Category already assigned to this blog" },
        { status: 409 }
      );
    }

    // Create blog category assignment
    const [newBlogCategory] = await db
      .insert(blogCategoriesTable)
      .values({
        blogId,
        categoryId,
      })
      .returning({
        id: blogCategoriesTable.id,
        blogId: blogCategoriesTable.blogId,
        categoryId: blogCategoriesTable.categoryId,
        createdAt: blogCategoriesTable.createdAt,
      });

    return NextResponse.json(
      { success: true, data: newBlogCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding category to blog:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add category to blog" },
      { status: 500 }
    );
  }
} 