import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ShopeeAPI } from '@/lib/shopee/api'
import { readFile } from 'fs/promises'
import path from 'path'
import type { ShopeeProductRequest } from '@/types'

/**
 * Create a new product on Shopee
 * POST /api/product/create
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('shopee_access_token')?.value
    const shopIdStr = cookieStore.get('shopee_shop_id')?.value

    if (!accessToken || !shopIdStr) {
      return NextResponse.json(
        { error: 'Not authenticated. Please authorize with Shopee first.' },
        { status: 401 }
      )
    }

    const shopId = parseInt(shopIdStr, 10)
    const shopeeAPI = new ShopeeAPI(accessToken, shopId)

    const body = await request.json()
    const {
      title,
      description,
      category_id,
      price,
      original_price,
      stock,
      weight,
      package_length,
      package_width,
      package_height,
      imageIds,
      brand_name,
      pre_order,
      days_to_ship,
    } = body

    // Validate required fields
    if (!title || !description || !category_id || !price || !stock || !imageIds) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Upload images to Shopee
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    const imageIdList = await Promise.all(
      imageIds.map(async (id: string) => {
        const filepath = path.join(uploadDir, id)
        const buffer = await readFile(filepath)
        const result = await shopeeAPI.uploadImage(buffer)
        return result.image_id
      })
    )

    // Prepare product data
    const productData: ShopeeProductRequest = {
      item_name: title,
      description,
      category_id,
      original_price: original_price || price,
      normal_stock: stock,
      weight: weight || 1000, // Default 1kg
      dimension: {
        package_length: package_length || 10,
        package_width: package_width || 10,
        package_height: package_height || 10,
      },
      item_status: 'NORMAL',
      image: {
        image_id_list: imageIdList,
      },
    }

    // Add optional fields
    if (brand_name) {
      productData.brand = {
        brand_id: 0,
        original_brand_name: brand_name,
      }
    }

    if (pre_order && days_to_ship) {
      productData.pre_order = {
        is_pre_order: true,
        days_to_ship,
      }
    }

    // Create product
    const result = await shopeeAPI.createProduct(productData)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      {
        error: 'Failed to create product',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
