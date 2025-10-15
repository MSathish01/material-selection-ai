# GenAI Material Selection Assistant - Startup Script
# This script helps you start the application

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GenAI Material Selection Assistant" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "After installation, restart PowerShell and run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "✗ .env file not found!" -ForegroundColor Red
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created" -ForegroundColor Green
    Write-Host ""
    Write-Host "IMPORTANT: Please edit the .env file and add your:" -ForegroundColor Yellow
    Write-Host "  1. OpenAI API Key (get from: https://platform.openai.com/api-keys)" -ForegroundColor Yellow
    Write-Host "  2. MongoDB connection string" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "After updating .env, run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing root dependencies..." -ForegroundColor Yellow
    npm install
}

if (-not (Test-Path "backend/node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}

if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
}

Write-Host "✓ All dependencies installed" -ForegroundColor Green
Write-Host ""

# Ask if user wants to seed the database
Write-Host "Do you want to seed the database with sample materials? (Y/N)" -ForegroundColor Yellow
$seedChoice = Read-Host
if ($seedChoice -eq "Y" -or $seedChoice -eq "y") {
    Write-Host "Seeding database..." -ForegroundColor Yellow
    Set-Location backend
    npm run seed
    Set-Location ..
    Write-Host "✓ Database seeded successfully" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Application..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend will start on: http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend will start on: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the application" -ForegroundColor Yellow
Write-Host ""

# Start the application
npm run dev