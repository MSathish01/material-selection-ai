# Quick Push to GitHub Script
# This script helps you quickly commit and push changes to GitHub

Write-Host "🚀 Material Selection AI - Quick Push to GitHub" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
try {
    $gitVersion = git --version
    Write-Host "✅ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "2. Or run: winget install --id Git.Git -e --source winget" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit
}

Write-Host ""

# Check if this is a git repository
if (-not (Test-Path ".git")) {
    Write-Host "📁 Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
    Write-Host ""
}

# Show current status
Write-Host "📊 Current Git Status:" -ForegroundColor Cyan
git status --short
Write-Host ""

# Ask for commit message
Write-Host "💬 Enter commit message (or press Enter for default):" -ForegroundColor Cyan
$commitMessage = Read-Host "Message"

if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "feat: UI/UX improvements with mobile responsiveness

- Modern gradient theme
- Full mobile responsiveness
- Optimized spacing and layout
- Enhanced user experience
- Bug fixes and improvements"
}

Write-Host ""
Write-Host "📝 Commit message:" -ForegroundColor Yellow
Write-Host $commitMessage -ForegroundColor White
Write-Host ""

# Add all files
Write-Host "➕ Adding all files..." -ForegroundColor Yellow
git add .
Write-Host "✅ Files added" -ForegroundColor Green
Write-Host ""

# Commit
Write-Host "💾 Creating commit..." -ForegroundColor Yellow
git commit -m $commitMessage
Write-Host "✅ Commit created" -ForegroundColor Green
Write-Host ""

# Check if remote exists
$remoteUrl = git remote get-url origin 2>$null

if ([string]::IsNullOrWhiteSpace($remoteUrl)) {
    Write-Host "🔗 No remote repository configured" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please enter your GitHub repository URL:" -ForegroundColor Cyan
    Write-Host "Example: https://github.com/username/repo-name.git" -ForegroundColor Gray
    $repoUrl = Read-Host "URL"
    
    if (-not [string]::IsNullOrWhiteSpace($repoUrl)) {
        git remote add origin $repoUrl
        Write-Host "✅ Remote repository added" -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host "❌ No URL provided. Skipping push." -ForegroundColor Red
        Write-Host ""
        Read-Host "Press Enter to exit"
        exit
    }
}

# Get current branch
$currentBranch = git branch --show-current

if ([string]::IsNullOrWhiteSpace($currentBranch)) {
    $currentBranch = "main"
    git branch -M main
}

# Push to GitHub
Write-Host "🚀 Pushing to GitHub (branch: $currentBranch)..." -ForegroundColor Yellow
Write-Host ""

try {
    git push -u origin $currentBranch
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Your code is now on GitHub!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "View your repository at:" -ForegroundColor Yellow
    $remoteUrl = git remote get-url origin
    $webUrl = $remoteUrl -replace "\.git$", "" -replace "git@github.com:", "https://github.com/"
    Write-Host $webUrl -ForegroundColor Blue
} catch {
    Write-Host ""
    Write-Host "❌ Push failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common solutions:" -ForegroundColor Yellow
    Write-Host "1. Make sure you're logged in to GitHub" -ForegroundColor White
    Write-Host "2. Use a Personal Access Token instead of password" -ForegroundColor White
    Write-Host "3. Check your repository URL is correct" -ForegroundColor White
    Write-Host "4. Try: git pull origin $currentBranch --rebase" -ForegroundColor White
    Write-Host ""
    Write-Host "Error details:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Read-Host "Press Enter to exit"
