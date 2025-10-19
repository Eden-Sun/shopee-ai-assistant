import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AIGeneratedContent } from '@/types'

export class GeminiService {
  private genAI: GoogleGenerativeAI
  private model: any

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      throw new Error('Missing GEMINI_API_KEY in environment variables')
    }

    this.genAI = new GoogleGenerativeAI(apiKey)
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
  }

  /**
   * Convert image file to base64 data
   */
  private async fileToGenerativePart(file: Buffer, mimeType: string) {
    return {
      inlineData: {
        data: file.toString('base64'),
        mimeType,
      },
    }
  }

  /**
   * Generate product description from images
   */
  async generateProductDescription(
    images: Array<{ buffer: Buffer; mimeType: string }>,
    userInput?: {
      category?: string
      keywords?: string[]
    }
  ): Promise<AIGeneratedContent> {
    const imageParts = await Promise.all(
      images.map((img) => this.fileToGenerativePart(img.buffer, img.mimeType))
    )

    const prompt = this.buildPrompt(userInput)

    const result = await this.model.generateContent([prompt, ...imageParts])
    const response = await result.response
    const text = response.text()

    return this.parseResponse(text)
  }

  /**
   * Build prompt for Gemini
   */
  private buildPrompt(userInput?: { category?: string; keywords?: string[] }): string {
    let prompt = `你是一個專業的電商商品文案撰寫專家。請根據這些商品圖片，生成一個吸引人的商品標題和詳細描述。

要求：
1. 標題：簡潔有力，30-50字，包含關鍵賣點
2. 描述：詳細完整，150-300字，包含：
   - 產品特色（至少3點）
   - 適用場景
   - 規格說明
   - 使用建議

`

    if (userInput?.category) {
      prompt += `商品類別：${userInput.category}\n`
    }

    if (userInput?.keywords && userInput.keywords.length > 0) {
      prompt += `關鍵字：${userInput.keywords.join(', ')}\n`
    }

    prompt += `
請以 JSON 格式回覆，結構如下：
{
  "title": "商品標題",
  "description": "商品描述",
  "tags": ["標籤1", "標籤2", "標籤3"]
}
`

    return prompt
  }

  /**
   * Parse AI response
   */
  private parseResponse(text: string): AIGeneratedContent {
    try {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/)
      const jsonText = jsonMatch ? jsonMatch[1] : text

      const parsed = JSON.parse(jsonText)

      return {
        title: parsed.title || '',
        description: parsed.description || '',
        tags: parsed.tags || [],
      }
    } catch (error) {
      // Fallback: use the raw text as description
      console.error('Failed to parse AI response:', error)
      return {
        title: '請編輯商品標題',
        description: text,
        tags: [],
      }
    }
  }
}

export const geminiService = new GeminiService()
