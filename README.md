# Shopee AI Assistant 🤖

AI-powered Shopee product listing assistant - Upload photos, get AI-generated descriptions, and list products instantly.

## 🎯 Features

- 📸 **Smart Image Upload** - Support single or multiple product photos
- 🤖 **AI-Powered Descriptions** - Gemini 2.5 Flash generates compelling product titles and descriptions
- 🔐 **Shopee OAuth** - Secure authentication with Shopee Open API
- 🚀 **One-Click Listing** - Direct product listing to your Shopee store
- 💡 **Simple & Fast** - Minimal input required, AI handles the rest

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **AI**: Google Gemini 2.5 Flash (Vision)
- **Backend**: Next.js API Routes
- **Integration**: Shopee Open API v2

## 📋 Prerequisites

- Node.js 18+
- Shopee Seller Account
- Shopee Open Platform App (Partner ID & Key)
- Google AI Studio API Key (Gemini)

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/Eden-Sun/shopee-ai-assistant.git
cd shopee-ai-assistant
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Shopee API
SHOPEE_PARTNER_ID=your_partner_id
SHOPEE_PARTNER_KEY=your_partner_key
SHOPEE_SHOP_ID=your_shop_id

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 How to Use

1. **Authorize Shopee Account**
   - Click "授權 Shopee 帳號" button
   - Complete OAuth flow

2. **Upload Product Images**
   - Click or drag & drop images
   - Support JPG, PNG, WEBP

3. **Generate AI Description**
   - Click "🤖 AI 自動生成"
   - AI analyzes images and creates title + description

4. **Edit & Publish**
   - Review and edit AI-generated content
   - Fill in price, stock, category
   - Click "🚀 立即上架到 Shopee"

## 🗂️ Project Structure

```
shopee-ai-assistant/
├── app/
│   ├── api/
│   │   ├── auth/shopee/       # OAuth flow
│   │   ├── upload/            # Image upload
│   │   ├── ai/generate/       # AI description generation
│   │   └── product/create/    # Product listing
│   ├── page.tsx               # Main page
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── lib/
│   ├── shopee/
│   │   ├── auth.ts            # Shopee OAuth
│   │   └── api.ts             # Shopee API client
│   └── ai/
│       └── gemini.ts          # Gemini AI service
├── components/
│   └── ImageUploader.tsx      # Image upload component
├── types/
│   ├── shopee.ts              # Shopee types
│   └── product.ts             # Product types
└── public/
    └── uploads/               # Temporary image storage
```

## 🔑 Getting API Credentials

### Shopee Open Platform

1. Register at [Shopee Open Platform](https://open.shopee.com/)
2. Create a new app
3. Get your Partner ID and Partner Key
4. Set OAuth Redirect URL to `http://localhost:3000/api/auth/shopee/callback`

### Google AI Studio

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create API Key
3. Copy the key to `.env.local`

## 🔒 Security Notes

- Never commit `.env.local` to version control
- Access tokens are stored in HTTP-only cookies
- In production, use a database to store tokens
- Enable HTTPS for OAuth redirect URLs

## 🚧 Roadmap

- [ ] AI price suggestions based on market analysis
- [ ] Batch product upload
- [ ] Product category auto-detection
- [ ] Multi-language support
- [ ] Cloud image storage (AWS S3/Cloudinary)
- [ ] Product performance analytics

## 📝 License

MIT

## 🙏 Credits

- [Shopee Open API](https://open.shopee.com/documents)
- [Google Gemini](https://ai.google.dev/)
- [Next.js](https://nextjs.org/)

## 🐛 Issues

Found a bug? Please [open an issue](https://github.com/Eden-Sun/shopee-ai-assistant/issues).
