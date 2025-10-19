import { NextRequest, NextResponse } from 'next/server'
import { shopeeAuth } from '@/lib/shopee/auth'

/**
 * Initiate Shopee OAuth flow
 * GET /api/auth/shopee
 */
export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const redirectUrl = `${baseUrl}/api/auth/shopee/callback`

    const authUrl = shopeeAuth.getAuthUrl(redirectUrl)

    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('OAuth initiation error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate OAuth' },
      { status: 500 }
    )
  }
}
