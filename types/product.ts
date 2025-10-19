export interface ProductFormData {
  // Basic info
  title: string
  description: string
  category_id: number

  // Pricing
  price: number
  original_price?: number

  // Inventory
  stock: number

  // Shipping
  weight: number
  package_length: number
  package_width: number
  package_height: number

  // Images
  images: File[]

  // Optional
  brand_name?: string
  pre_order?: boolean
  days_to_ship?: number
}

export interface AIGeneratedContent {
  title: string
  description: string
  suggested_category?: string
  tags?: string[]
}

export interface UploadedImage {
  id: string
  url: string
  file: File
}
