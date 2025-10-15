@echo off
echo ========================================
echo   Push to GitHub Repository
echo ========================================
echo.
echo Repository: https://github.com/MSathish01/material-selection-ai.git
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo.
    echo Please install Git first:
    echo 1. Download from: https://git-scm.com/download/win
    echo 2. Or run: winget install --id Git.Git -e --source winget
    echo.
    echo After installing, restart your terminal and run this script again.
    pause
    exit /b 1
)

echo Git is installed!
echo.

REM Initialize git if needed
if not exist ".git" (
    echo Initializing Git repository...
    git init
    echo.
)

REM Check git config
git config user.name >nul 2>&1
if errorlevel 1 (
    echo Please enter your name:
    set /p username="Name: "
    git config --global user.name "%username%"
)

git config user.email >nul 2>&1
if errorlevel 1 (
    echo Please enter your email:
    set /p useremail="Email: "
    git config --global user.email "%useremail%"
)

echo Adding all files...
git add .
echo.

echo Creating commit...
git commit -m "feat: Material Selection AI with modern UI/UX - Modern gradient theme - Full mobile responsiveness - Optimized spacing and layout - Enhanced user experience - Material search and filtering - AI chat interface - Sustainability dashboard - Standards viewer - Comparison tool - Interactive charts"
echo.

REM Remove existing remote if any
git remote remove origin >nul 2>&1

echo Adding remote repository...
git remote add origin https://github.com/MSathish01/material-selection-ai.git
echo.

echo Setting branch to main...
git branch -M main
echo.

echo Pushing to GitHub...
echo.
echo NOTE: You will be asked for credentials:
echo - Username: MSathish01
echo - Password: Use your Personal Access Token (not your GitHub password)
echo.
echo If you don't have a token, create one at:
echo https://github.com/settings/tokens
echo.

git push -u origin main

if errorlevel 1 (
    echo.
    echo ========================================
    echo   Push Failed!
    echo ========================================
    echo.
    echo Common solutions:
    echo 1. Make sure you're using a Personal Access Token as password
    echo 2. Check your internet connection
    echo 3. Verify the repository exists on GitHub
    echo.
    echo For help, see: PUSH_TO_YOUR_REPO.md
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Success!
echo ========================================
echo.
echo Your code is now on GitHub!
echo.
echo View your repository at:
echo https://github.com/MSathish01/material-selection-ai
echo.
pause
