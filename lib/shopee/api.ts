import crypto from 'crypto'
import type { ShopeeProductRequest, ShopeeCategory } from '@/types'

const SHOPEE_API_BASE = 'https://partner.shopeemobile.com'

export class ShopeeAPI {
  private partnerId: number
  private partnerKey: string
  private accessToken: string
  private shopId: number

  constructor(accessToken: string, shopId: number) {
    const partnerId = process.env.SHOPEE_PARTNER_ID
    const partnerKey = process.env.SHOPEE_PARTNER_KEY

    if (!partnerId || !partnerKey) {
      throw new Error('Missing Shopee credentials')
    }

    this.partnerId = parseInt(partnerId, 10)
    this.partnerKey = partnerKey
    this.accessToken = accessToken
    this.shopId = shopId
  }

  /**
   * Generate signature for API requests
   */
  private generateSignature(path: string, timestamp: number): string {
    const baseString = `${this.partnerId}${path}${timestamp}${this.accessToken}${this.shopId}`
    return crypto
      .createHmac('sha256', this.partnerKey)
      .update(baseString)
      .digest('hex')
  }

  /**
   * Make authenticated API request
   */
  private async request<T>(path: string, method: 'GET' | 'POST', body?: any): Promise<T> {
    const timestamp = Math.floor(Date.now() / 1000)
    const sign = this.generateSignature(path, timestamp)

    const url = new URL(`${SHOPEE_API_BASE}${path}`)
    url.searchParams.append('partner_id', this.partnerId.toString())
    url.searchParams.append('timestamp', timestamp.toString())
    url.searchParams.append('access_token', this.accessToken)
    url.searchParams.append('shop_id', this.shopId.toString())
    url.searchParams.append('sign', sign)

    const response = await fetch(url.toString(), {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Shopee API error: ${error}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(`Shopee API error: ${data.message || data.error}`)
    }

    return data
  }

  /**
   * Upload image to Shopee
   */
  async uploadImage(imageBuffer: Buffer): Promise<{ image_id: string }> {
    const path = '/api/v2/media_space/upload_image'
    const timestamp = Math.floor(Date.now() / 1000)
    const sign = this.generateSignature(path, timestamp)

    const url = new URL(`${SHOPEE_API_BASE}${path}`)
    url.searchParams.append('partner_id', this.partnerId.toString())
    url.searchParams.append('timestamp', timestamp.toString())
    url.searchParams.append('access_token', this.accessToken)
    url.searchParams.append('shop_id', this.shopId.toString())
    url.searchParams.append('sign', sign)

    const formData = new FormData()
    formData.append('image', new Blob([new Uint8Array(imageBuffer)], { type: 'image/jpeg' }), 'image.jpg')

    const response = await fetch(url.toString(), {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(`Image upload error: ${data.message}`)
    }

    return data.response
  }

  /**
   * Create a new product
   */
  async createProduct(productData: ShopeeProductRequest) {
    const path = '/api/v2/product/add_item'
    return this.request(path, 'POST', productData)
  }

  /**
   * Get category list
   */
  async getCategories(language: string = 'zh-hant'): Promise<ShopeeCategory[]> {
    const path = '/api/v2/product/get_category'
    const result = await this.request<{ response: { category_list: ShopeeCategory[] } }>(
      path,
      'GET'
    )
    return result.response.category_list
  }

  /**
   * Get category attributes
   */
  async getCategoryAttributes(categoryId: number) {
    const path = '/api/v2/product/get_attributes'
    return this.request(path, 'GET', { category_id: categoryId })
  }
}
