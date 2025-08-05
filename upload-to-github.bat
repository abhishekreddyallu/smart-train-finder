@echo off
echo 🚄 Smart Train Finder - GitHub Upload Script
echo ============================================
echo.

echo 📋 Step 1: Initialize Git Repository
git init
if %errorlevel% neq 0 (
    echo ❌ Error: Git initialization failed
    pause
    exit /b 1
)

echo ✅ Git repository initialized
echo.

echo 📦 Step 2: Add all files to Git
git add .
if %errorlevel% neq 0 (
    echo ❌ Error: Failed to add files
    pause
    exit /b 1
)

echo ✅ Files added to Git
echo.

echo 💬 Step 3: Create initial commit
git commit -m "🎉 Initial commit: Smart Train Finder v1.0.0

✨ Features:
- Hamburg ⇄ Amsterdam train search
- Smart filtering (fastest, cheapest, least changes)
- Roundtrip planning with overnight stays
- Responsive design for all devices
- Comprehensive test suite
- Multiple deployment options

🛠 Tech Stack:
- React 17 + TypeScript
- Jest + React Testing Library
- Docker + CI/CD ready
- Vercel/Netlify deployment configs"

if %errorlevel% neq 0 (
    echo ❌ Error: Failed to create commit
    pause
    exit /b 1
)

echo ✅ Initial commit created
echo.

echo 🌐 Step 4: Connect to GitHub
echo.
echo ⚠️  IMPORTANT: Before running the next commands:
echo    1. Go to https://github.com
echo    2. Create a new repository named: smart-train-finder
echo    3. Make it PUBLIC for portfolio visibility
echo    4. DON'T initialize with README
echo    5. Copy the repository URL
echo.
set /p github_url="Enter your GitHub repository URL (e.g., https://github.com/username/smart-train-finder.git): "

if "%github_url%"=="" (
    echo ❌ Error: No GitHub URL provided
    pause
    exit /b 1
)

git remote add origin %github_url%
if %errorlevel% neq 0 (
    echo ❌ Error: Failed to add remote origin
    pause
    exit /b 1
)

echo ✅ Remote origin added
echo.

echo 🚀 Step 5: Push to GitHub
git branch -M main
git push -u origin main

if %errorlevel% neq 0 (
    echo ❌ Error: Failed to push to GitHub
    echo    Make sure you have:
    echo    - Created the repository on GitHub
    echo    - Have proper Git credentials configured
    pause
    exit /b 1
)

echo.
echo 🎉 SUCCESS! Your Smart Train Finder is now on GitHub!
echo.
echo 📋 Next Steps:
echo    1. Visit your repository: %github_url%
echo    2. Add repository topics: react, typescript, train-finder, travel-app
echo    3. Enable GitHub Pages in Settings → Pages
echo    4. Deploy to Vercel or Netlify using the deploy buttons
echo    5. Update README.md with your live demo URL
echo.
echo 🏷️  Recommended Repository Description:
echo "🚄 Smart Train Finder - Modern web app for Hamburg-Amsterdam train connections with intelligent filtering, roundtrip planning, and responsive design. Built with React + TypeScript."
echo.
pause
