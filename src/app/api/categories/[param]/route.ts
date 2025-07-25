import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/index'
import { categoriesTable } from '@/db/schema'
import { eq, or } from 'drizzle-orm'

// GET /api/categories/:param - Get category by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ param: string }> }
) {
  try {
    const { param } = await params

    if (!param) {
      return NextResponse.json({ success: false, error: 'Parameter is required' }, { status: 400 })
    }

    // Check if param is a number (ID) or string (slug)
    const isId = !isNaN(parseInt(param))

    let category
    if (isId) {
      // Search by ID
      category = await db
        .select({
          id: categoriesTable.id,
          name: categoriesTable.name,
          slug: categoriesTable.slug,
          description: categoriesTable.description,
          createdAt: categoriesTable.createdAt,
        })
        .from(categoriesTable)
        .where(eq(categoriesTable.id, parseInt(param)))
        .limit(1)
    } else {
      // Search by slug
      category = await db
        .select({
          id: categoriesTable.id,
          name: categoriesTable.name,
          slug: categoriesTable.slug,
          description: categoriesTable.description,
          createdAt: categoriesTable.createdAt,
        })
        .from(categoriesTable)
        .where(eq(categoriesTable.slug, param))
        .limit(1)
    }

    if (category.length === 0) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: category[0],
    })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch category' }, { status: 500 })
  }
}

// PATCH /api/categories/:param - Update category by ID
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ param: string }> }
) {
  try {
    const { param } = await params
    const categoryId = parseInt(param)
    const body = await request.json()
    const { name, slug, description } = body

    if (isNaN(categoryId)) {
      return NextResponse.json({ success: false, error: 'Invalid category ID' }, { status: 400 })
    }

    // Check if category exists
    const existingCategory = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, categoryId))
      .limit(1)

    if (existingCategory.length === 0) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 })
    }

    // Check for duplicate name or slug if being updated
    if (name || slug) {
      const duplicateCategory = await db
        .select()
        .from(categoriesTable)
        .where(
          or(
            name ? eq(categoriesTable.name, name) : undefined,
            slug ? eq(categoriesTable.slug, slug) : undefined
          )
        )
        .limit(1)

      if (duplicateCategory.length > 0 && duplicateCategory[0].id !== categoryId) {
        return NextResponse.json(
          { success: false, error: 'Category with this name or slug already exists' },
          { status: 409 }
        )
      }
    }

    // Update category
    const [updatedCategory] = await db
      .update(categoriesTable)
      .set({
        name: name || existingCategory[0].name,
        slug: slug || existingCategory[0].slug,
        description: description || existingCategory[0].description,
      })
      .where(eq(categoriesTable.id, categoryId))
      .returning({
        id: categoriesTable.id,
        name: categoriesTable.name,
        slug: categoriesTable.slug,
        description: categoriesTable.description,
        createdAt: categoriesTable.createdAt,
      })

    return NextResponse.json({
      success: true,
      data: updatedCategory,
    })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE /api/categories/:param - Delete category by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ param: string }> }
) {
  try {
    const { param } = await params
    const categoryId = parseInt(param)

    if (isNaN(categoryId)) {
      return NextResponse.json({ success: false, error: 'Invalid category ID' }, { status: 400 })
    }

    // Check if category exists
    const existingCategory = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, categoryId))
      .limit(1)

    if (existingCategory.length === 0) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 })
    }

    // Delete category
    await db.delete(categoriesTable).where(eq(categoriesTable.id, categoryId))

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
