'use client'

import { useState } from 'react'
import ImageUploader from '@/components/ImageUploader'
import type { AIGeneratedContent } from '@/types'

interface UploadedImage {
  id: string
  url: string
  name: string
}

export default function Home() {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [aiContent, setAiContent] = useState<AIGeneratedContent | null>(null)
  const [generating, setGenerating] = useState(false)
  const [creating, setCreating] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Form data
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [weight, setWeight] = useState('1000')

  const handleGenerateDescription = async () => {
    if (images.length === 0) {
      alert('請先上傳商品圖片')
      return
    }

    setGenerating(true)
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageIds: images.map((img) => img.id),
        }),
      })

      if (!response.ok) {
        throw new Error('AI 生成失敗')
      }

      const data = await response.json()
      setAiContent(data.data)
      setTitle(data.data.title)
      setDescription(data.data.description)
    } catch (error) {
      console.error('Generation error:', error)
      alert('AI 生成失敗，請重試')
    } finally {
      setGenerating(false)
    }
  }

  const handleCreateProduct = async () => {
    if (!title || !description || !categoryId || !price || !stock) {
      alert('請填寫所有必填欄位')
      return
    }

    setCreating(true)
    try {
      const response = await fetch('/api/product/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category_id: parseInt(categoryId, 10),
          price: parseFloat(price),
          stock: parseInt(stock, 10),
          weight: parseInt(weight, 10),
          package_length: 10,
          package_width: 10,
          package_height: 10,
          imageIds: images.map((img) => img.id),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || '上架失敗')
      }

      alert('商品上架成功！')

      // Reset form
      setImages([])
      setAiContent(null)
      setTitle('')
      setDescription('')
      setCategoryId('')
      setPrice('')
      setStock('')
    } catch (error) {
      console.error('Creation error:', error)
      alert(error instanceof Error ? error.message : '上架失敗，請重試')
    } finally {
      setCreating(false)
    }
  }

  const handleShopeeAuth = () => {
    window.location.href = '/api/auth/shopee'
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopee AI Assistant</h1>
          <p className="text-gray-600">AI 智能商品上架助手</p>
        </div>

        {!isAuthenticated && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm mb-3">
              請先授權 Shopee 帳號才能上架商品
            </p>
            <button
              onClick={handleShopeeAuth}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              授權 Shopee 帳號
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <h2 className="text-xl font-semibold mb-4">1. 上傳商品圖片</h2>
            <ImageUploader onImagesUploaded={setImages} />
          </div>

          {/* AI Generate */}
          {images.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">2. AI 生成商品描述</h2>
              <button
                onClick={handleGenerateDescription}
                disabled={generating}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {generating ? 'AI 生成中...' : '🤖 AI 自動生成'}
              </button>
            </div>
          )}

          {/* Product Form */}
          {(aiContent || title || description) && (
            <div>
              <h2 className="text-xl font-semibold mb-4">3. 編輯商品資訊</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    商品標題 *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="請輸入商品標題"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    商品描述 *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="請輸入商品描述"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      類目 ID *
                    </label>
                    <input
                      type="number"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例如: 100636"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      價格 (TWD) *
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例如: 299"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      庫存 *
                    </label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例如: 100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      重量 (g)
                    </label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例如: 1000"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleCreateProduct}
                    disabled={creating || !isAuthenticated}
                    className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {creating ? '上架中...' : '🚀 立即上架到 Shopee'}
                  </button>
                  {!isAuthenticated && (
                    <p className="text-sm text-red-500 mt-2 text-center">
                      請先授權 Shopee 帳號
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by Gemini 2.5 Flash & Shopee Open API</p>
        </div>
      </div>
    </main>
  )
}
