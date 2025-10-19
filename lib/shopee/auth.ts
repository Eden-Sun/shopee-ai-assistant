import crypto from 'crypto'
import type { ShopeeAuthParams } from '@/types'

const SHOPEE_API_BASE = 'https://partner.shopeemobile.com'

export class ShopeeAuth {
  private partnerId: number
  private partnerKey: string

  constructor() {
    const partnerId = process.env.SHOPEE_PARTNER_ID
    const partnerKey = process.env.SHOPEE_PARTNER_KEY

    if (!partnerId || !partnerKey) {
      throw new Error('Missing Shopee credentials in environment variables')
    }

    this.partnerId = parseInt(partnerId, 10)
    this.partnerKey = partnerKey
  }

  /**
   * Generate signature for Shopee API requests
   */
  private generateSignature(path: string, timestamp: number, accessToken?: string): string {
    const baseString = `${this.partnerId}${path}${timestamp}${accessToken || ''}${this.shopId || ''}`
    return crypto
      .createHmac('sha256', this.partnerKey)
      .update(baseString)
      .digest('hex')
  }

  /**
   * Get OAuth authorization URL
   */
  getAuthUrl(redirectUrl: string): string {
    const path = '/api/v2/shop/auth_partner'
    const timestamp = Math.floor(Date.now() / 1000)
    const sign = this.generateSignature(path, timestamp)

    const params: ShopeeAuthParams = {
      partner_id: this.partnerId,
      timestamp,
      sign,
      redirect: redirectUrl,
    }

    const query = new URLSearchParams(params as any).toString()
    return `${SHOPEE_API_BASE}${path}?${query}`
  }

  /**
   * Exchange auth code for access token
   */
  async getAccessToken(code: string, shopId: number) {
    const path = '/api/v2/auth/token/get'
    const timestamp = Math.floor(Date.now() / 1000)
    const sign = this.generateSignature(path, timestamp)

    const url = `${SHOPEE_API_BASE}${path}`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        shop_id: shopId,
        partner_id: this.partnerId,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string, shopId: number) {
    const path = '/api/v2/auth/access_token/get'
    const timestamp = Math.floor(Date.now() / 1000)
    const sign = this.generateSignature(path, timestamp)

    const url = `${SHOPEE_API_BASE}${path}`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
        shop_id: shopId,
        partner_id: this.partnerId,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to refresh access token: ${response.statusText}`)
    }

    return response.json()
  }

  private get shopId(): number | undefined {
    const shopId = process.env.SHOPEE_SHOP_ID
    return shopId ? parseInt(shopId, 10) : undefined
  }
}

export const shopeeAuth = new ShopeeAuth()
