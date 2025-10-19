# Shopee Product Upload API Tool 🛍️

A Node.js tool for uploading products to Shopee using their Open API.

## 📋 Features

- ✅ Upload product images
- ✅ Create new products with complete details
- ✅ Bulk product upload support
- ✅ Update existing products
- ✅ Error handling and retry mechanism
- ✅ Environment configuration support

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/shopee-product-upload.git
cd shopee-product-upload
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your Shopee API credentials
```

### 4. Run the application
```bash
# Basic upload
node shopee-upload-product.js

# Advanced version with batch upload
node shopee-advanced.js
```

## 📁 Project Structure

```
shopee-product-upload/
├── shopee-upload-product.js   # Basic upload functionality
├── shopee-advanced.js          # Advanced features with batch upload
├── package.json               # Project dependencies
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore file
├── README.md                  # This file
└── SHOPEE_SETUP_GUIDE.md     # Detailed setup instructions
```

## ⚙️ Configuration

Create a `.env` file with your Shopee API credentials:

```env
SHOP_ID=your_shop_id
PARTNER_ID=your_partner_id
PARTNER_KEY=your_partner_key
NODE_ENV=development
```

## 📖 Documentation

For detailed setup and usage instructions, see [SHOPEE_SETUP_GUIDE.md](./SHOPEE_SETUP_GUIDE.md)

## 🔑 Prerequisites

- Node.js 14.0 or higher
- Shopee Seller Account
- Approved Shopee Open Platform Developer Account

## 📝 License

MIT

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📧 Support

If you have any questions, feel free to open an issue in this repository.
