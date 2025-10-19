import { NextRequest, NextResponse } from 'next/server'
import { geminiService } from '@/lib/ai/gemini'
import { readFile } from 'fs/promises'
import path from 'path'

/**
 * Generate product description using AI
 * POST /api/ai/generate
 * Body: { imageIds: string[], category?: string, keywords?: string[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageIds, category, keywords } = body

    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      )
    }

    // Read image files
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    const images = await Promise.all(
      imageIds.map(async (id: string) => {
        const filepath = path.join(uploadDir, id)
        const buffer = await readFile(filepath)

        // Determine MIME type from extension
        const ext = path.extname(id).toLowerCase()
        const mimeType =
          ext === '.png' ? 'image/png' :
          ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
          ext === '.webp' ? 'image/webp' :
          'image/jpeg'

        return { buffer, mimeType }
      })
    )

    // Generate description using Gemini
    const result = await geminiService.generateProductDescription(images, {
      category,
      keywords,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate description', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
