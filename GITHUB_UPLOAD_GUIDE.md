# 📤 How to Upload Your Project to GitHub

## Option 1: Upload via GitHub Website (Easiest)

1. **Create a new repository on GitHub:**
   - Go to https://github.com
   - Click the "+" icon in the top right
   - Select "New repository"
   - Name it: `shopee-product-upload`
   - Choose "Public" or "Private"
   - DON'T initialize with README (we already have one)
   - Click "Create repository"

2. **Upload files:**
   - Click "uploading an existing file" link
   - Drag and drop all your files EXCEPT `.env`
   - Add commit message: "Initial commit - Shopee product upload tool"
   - Click "Commit changes"

## Option 2: Using Git Command Line

1. **Initialize Git in your local folder:**
```bash
# Navigate to your project folder
cd /path/to/your/project

# Initialize git
git init

# Add all files (gitignore will exclude .env)
git add .

# Create first commit
git commit -m "Initial commit - Shopee product upload tool"
```

2. **Create repository on GitHub:**
   - Go to https://github.com/new
   - Create a new repository named `shopee-product-upload`
   - DON'T initialize with README

3. **Connect and push to GitHub:**
```bash
# Add your GitHub repository as origin
git remote add origin https://github.com/YOUR_USERNAME/shopee-product-upload.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Option 3: Using GitHub Desktop

1. **Download GitHub Desktop:**
   - https://desktop.github.com/

2. **Create new repository:**
   - Click "Create a New Repository on your hard drive"
   - Name: `shopee-product-upload`
   - Choose your local path
   - Click "Create Repository"

3. **Add files and publish:**
   - Copy all your files to the repository folder
   - In GitHub Desktop, review changes
   - Add commit message
   - Click "Commit to main"
   - Click "Publish repository"

## 📁 Files to Upload

✅ **Include these files:**
- `shopee-upload-product.js`
- `shopee-advanced.js`
- `package.json`
- `SHOPEE_SETUP_GUIDE.md`
- `README.md`
- `.gitignore`
- `.env.example`

❌ **NEVER upload these:**
- `.env` (contains your secret keys!)
- `node_modules/` (will be installed via npm install)

## 🔐 Security Tips

1. **Never commit `.env` file** - It contains your API keys!
2. **Use `.env.example`** as a template without actual credentials
3. **If you accidentally pushed secrets:**
   ```bash
   # Remove from history
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch .env" \
   --prune-empty --tag-name-filter cat -- --all
   
   # Force push
   git push origin --force --all
   
   # Regenerate your API keys immediately!
   ```

## 🔄 Updating Your Repository

After making changes:
```bash
# Check status
git status

# Add changes
git add .

# Commit with message
git commit -m "Description of changes"

# Push to GitHub
git push
```

## 📝 Adding Collaborators

1. Go to your repository on GitHub
2. Click "Settings" → "Manage access"
3. Click "Invite a collaborator"
4. Enter their GitHub username or email

## 🌟 Best Practices

1. **Write clear commit messages:**
   - ✅ "Add bulk upload functionality"
   - ❌ "Update"

2. **Use branches for new features:**
   ```bash
   git checkout -b feature/bulk-upload
   # Make changes
   git push origin feature/bulk-upload
   # Create Pull Request on GitHub
   ```

3. **Keep README updated** with any new features or changes

4. **Tag releases:**
   ```bash
   git tag -a v1.0.0 -m "First stable release"
   git push origin v1.0.0
   ```

## 🎉 Done!

Your project will be available at:
`https://github.com/YOUR_USERNAME/shopee-product-upload`

Share the link with others or use it as your portfolio project!
