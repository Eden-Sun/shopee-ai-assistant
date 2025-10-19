#!/bin/bash

# GitHub Upload Script for Shopee Product Upload Tool
# This script helps you upload your project to GitHub

echo "======================================"
echo "   GitHub Upload Helper Script        "
echo "======================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    echo "   Visit: https://git-scm.com/downloads"
    exit 1
fi

# Check if .env exists and warn
if [ -f ".env" ]; then
    echo "⚠️  Warning: .env file detected!"
    echo "   This file contains sensitive information and should NOT be uploaded."
    echo "   Making sure it's in .gitignore..."
    
    # Ensure .env is in .gitignore
    if ! grep -q "^\.env$" .gitignore 2>/dev/null; then
        echo ".env" >> .gitignore
        echo "   ✅ Added .env to .gitignore"
    fi
fi

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    echo "   ✅ Git repository initialized"
else
    echo "✅ Git repository already initialized"
fi

# Get GitHub username
echo ""
read -p "Enter your GitHub username: " github_username
if [ -z "$github_username" ]; then
    echo "❌ GitHub username cannot be empty"
    exit 1
fi

# Get repository name
read -p "Enter repository name (default: shopee-product-upload): " repo_name
repo_name=${repo_name:-shopee-product-upload}

# Check if remote already exists
if git remote get-url origin &>/dev/null; then
    echo ""
    echo "⚠️  Remote 'origin' already exists"
    read -p "Do you want to update it? (y/n): " update_remote
    if [ "$update_remote" = "y" ]; then
        git remote remove origin
    else
        echo "Keeping existing remote"
    fi
fi

# Add remote if not exists
if ! git remote get-url origin &>/dev/null; then
    echo ""
    echo "🔗 Adding GitHub remote..."
    git remote add origin "https://github.com/${github_username}/${repo_name}.git"
    echo "   ✅ Remote added: https://github.com/${github_username}/${repo_name}.git"
fi

# Stage files
echo ""
echo "📦 Staging files..."
git add .
echo "   ✅ Files staged"

# Show status
echo ""
echo "📊 Git Status:"
git status --short

# Commit
echo ""
read -p "Enter commit message (default: 'Initial commit - Shopee product upload tool'): " commit_msg
commit_msg=${commit_msg:-"Initial commit - Shopee product upload tool"}

git commit -m "$commit_msg"
echo "   ✅ Changes committed"

# Push to GitHub
echo ""
echo "🚀 Pushing to GitHub..."
echo "   This may ask for your GitHub credentials."
echo ""

# Set main as default branch
git branch -M main

# Push
if git push -u origin main; then
    echo ""
    echo "======================================"
    echo "   ✅ Successfully uploaded to GitHub!"
    echo "======================================"
    echo ""
    echo "🎉 Your repository is now available at:"
    echo "   https://github.com/${github_username}/${repo_name}"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Visit your repository on GitHub"
    echo "   2. Add a description"
    echo "   3. Add topics (tags) like: nodejs, shopee, api, ecommerce"
    echo "   4. Consider adding a license"
    echo ""
else
    echo ""
    echo "❌ Failed to push to GitHub"
    echo ""
    echo "Possible issues:"
    echo "1. Repository doesn't exist on GitHub yet"
    echo "   → Create it at: https://github.com/new"
    echo ""
    echo "2. Authentication failed"
    echo "   → You may need to set up a personal access token"
    echo "   → Guide: https://docs.github.com/en/authentication"
    echo ""
    echo "3. Repository already has content"
    echo "   → Try: git push -f origin main (⚠️ this will overwrite)"
    echo ""
fi

echo "======================================"
echo "   Script Complete"
echo "======================================"
