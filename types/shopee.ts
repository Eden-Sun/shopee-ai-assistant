export interface ShopeeAuthParams {
  partner_id: number
  timestamp: number
  sign: string
  redirect: string
}

export interface ShopeeAuthResponse {
  code: string
  shop_id: number
}

export interface ShopeeTokenResponse {
  access_token: string
  refresh_token: string
  expire_in: number
  shop_id_list: number[]
}

export interface ShopeeProductImage {
  image_id: string
  image_url?: string
}

export interface ShopeeProductAttribute {
  attribute_id: number
  attribute_value_list: Array<{
    value_id?: number
    original_value_name?: string
    value_unit?: string
  }>
}

export interface ShopeeProductVariation {
  tier_index: number[]
  stock: number
  price: number
  original_price?: number
}

export interface ShopeeProductRequest {
  original_price: number
  description: string
  weight: number
  item_name: string
  item_status: 'NORMAL' | 'UNLIST'
  dimension: {
    package_length: number
    package_width: number
    package_height: number
  }
  normal_stock: number
  attribute_list?: ShopeeProductAttribute[]
  category_id: number
  image: {
    image_id_list: string[]
  }
  pre_order?: {
    is_pre_order: boolean
    days_to_ship: number
  }
  brand?: {
    brand_id: number
    original_brand_name?: string
  }
}

export interface ShopeeProductResponse {
  item_id: number
  item_status: string
  create_time: number
}

export interface ShopeeCategory {
  category_id: number
  parent_category_id: number
  original_category_name: string
  display_category_name: string
  has_children: boolean
}
