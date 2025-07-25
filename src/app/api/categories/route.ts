import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/index'
import { categoriesTable } from '@/db/schema'
import { desc, eq, or } from 'drizzle-orm'

// GET /api/categories - List categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const categories = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
        slug: categoriesTable.slug,
        description: categoriesTable.description,
        createdAt: categoriesTable.createdAt,
      })
      .from(categoriesTable)
      .orderBy(desc(categoriesTable.createdAt))
      .limit(limit)
      .offset(offset)

    const totalCount = await db.select({ count: categoriesTable.id }).from(categoriesTable)

    return NextResponse.json({
      success: true,
      data: categories,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        totalPages: Math.ceil(totalCount.length / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, description } = body

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if category with same name or slug already exists
    const existingCategory = await db
      .select()
      .from(categoriesTable)
      .where(or(eq(categoriesTable.name, name), eq(categoriesTable.slug, slug)))
      .limit(1)

    if (existingCategory.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Category with this name or slug already exists' },
        { status: 409 }
      )
    }

    // Create new category
    const [newCategory] = await db
      .insert(categoriesTable)
      .values({
        name,
        slug,
        description,
      })
      .returning({
        id: categoriesTable.id,
        name: categoriesTable.name,
        slug: categoriesTable.slug,
        description: categoriesTable.description,
        createdAt: categoriesTable.createdAt,
      })

    return NextResponse.json({ success: true, data: newCategory }, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
