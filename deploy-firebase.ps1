# Firebase Deployment Script for Windows PowerShell

Write-Host "🚀 Firebase Deployment Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Firebase CLI is installed
Write-Host "📋 Checking Firebase CLI..." -ForegroundColor Yellow
$firebaseVersion = firebase --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Firebase CLI not found!" -ForegroundColor Red
    Write-Host "Installing Firebase CLI..." -ForegroundColor Yellow
    npm install -g firebase-tools
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Firebase CLI" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Firebase CLI installed: $firebaseVersion" -ForegroundColor Green
Write-Host ""

# Check if logged in to Firebase
Write-Host "🔐 Checking Firebase authentication..." -ForegroundColor Yellow
firebase projects:list 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Not logged in to Firebase" -ForegroundColor Yellow
    Write-Host "Opening browser for authentication..." -ForegroundColor Yellow
    firebase login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Firebase login failed" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Authenticated with Firebase" -ForegroundColor Green
Write-Host ""

# Build Frontend
Write-Host "🎨 Building Frontend..." -ForegroundColor Yellow
Set-Location frontend
if (Test-Path "build") {
    Remove-Item -Recurse -Force build
}
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..
Write-Host "✅ Frontend built successfully" -ForegroundColor Green
Write-Host ""

# Build Backend
Write-Host "⚙️  Building Backend..." -ForegroundColor Yellow
Set-Location backend
if (Test-Path "lib") {
    Remove-Item -Recurse -Force lib
}
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend build failed" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..
Write-Host "✅ Backend built successfully" -ForegroundColor Green
Write-Host ""

# Deploy to Firebase
Write-Host "🚀 Deploying to Firebase..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Choose deployment option:" -ForegroundColor Cyan
Write-Host "1. Deploy Everything (Hosting + Functions)" -ForegroundColor White
Write-Host "2. Deploy Hosting Only (Frontend)" -ForegroundColor White
Write-Host "3. Deploy Functions Only (Backend)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host "Deploying everything..." -ForegroundColor Yellow
        firebase deploy
    }
    "2" {
        Write-Host "Deploying hosting only..." -ForegroundColor Yellow
        firebase deploy --only hosting
    }
    "3" {
        Write-Host "Deploying functions only..." -ForegroundColor Yellow
        firebase deploy --only functions
    }
    default {
        Write-Host "Invalid choice. Deploying everything..." -ForegroundColor Yellow
        firebase deploy
    }
}

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    Write-Host "Check the error messages above for details" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ Deployment Successful!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your app is now live at:" -ForegroundColor Yellow
Write-Host "Frontend: https://your-project-id.web.app" -ForegroundColor Cyan
Write-Host "API: https://us-central1-your-project-id.cloudfunctions.net/api" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update .firebaserc with your actual project ID" -ForegroundColor White
Write-Host "2. Set environment variables: firebase functions:config:set" -ForegroundColor White
Write-Host "3. Test your deployment" -ForegroundColor White
Write-Host ""
