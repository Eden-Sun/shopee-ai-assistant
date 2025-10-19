import { NextRequest, NextResponse } from 'next/server'
import { shopeeAuth } from '@/lib/shopee/auth'
import { cookies } from 'next/headers'

/**
 * Handle Shopee OAuth callback
 * GET /api/auth/shopee/callback?code=xxx&shop_id=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const shopIdStr = searchParams.get('shop_id')

    if (!code || !shopIdStr) {
      return NextResponse.redirect(
        new URL('/?error=missing_params', request.url)
      )
    }

    const shopId = parseInt(shopIdStr, 10)

    // Exchange code for access token
    const tokenData = await shopeeAuth.getAccessToken(code, shopId)

    // Store tokens in cookies (in production, use a database)
    const cookieStore = await cookies()
    cookieStore.set('shopee_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokenData.expire_in,
    })
    cookieStore.set('shopee_refresh_token', tokenData.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })
    cookieStore.set('shopee_shop_id', shopId.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60,
    })

    // Redirect to home page with success message
    return NextResponse.redirect(new URL('/?auth=success', request.url))
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(
      new URL('/?error=auth_failed', request.url)
    )
  }
}
