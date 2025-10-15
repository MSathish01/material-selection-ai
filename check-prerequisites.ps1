# Prerequisites Checker for GenAI Material Selection Assistant

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Prerequisites Checker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check Node.js
Write-Host "Checking Node.js..." -NoNewline
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host " ✓ Installed ($nodeVersion)" -ForegroundColor Green
    } else {
        throw "Not found"
    }
} catch {
    Write-Host " ✗ Not installed" -ForegroundColor Red
    Write-Host "  → Download from: https://nodejs.org/" -ForegroundColor Yellow
    $allGood = $false
}

# Check npm
Write-Host "Checking npm..." -NoNewline
try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Host " ✓ Installed ($npmVersion)" -ForegroundColor Green
    } else {
        throw "Not found"
    }
} catch {
    Write-Host " ✗ Not installed" -ForegroundColor Red
    Write-Host "  → Comes with Node.js" -ForegroundColor Yellow
    $allGood = $false
}

# Check .env file
Write-Host "Checking .env file..." -NoNewline
if (Test-Path ".env") {
    Write-Host " ✓ Found" -ForegroundColor Green
    
    # Check if it has required values
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "OPENAI_API_KEY=sk-" -or $envContent -match "OPENAI_API_KEY=your") {
        Write-Host "  ⚠ Warning: OpenAI API key may not be set" -ForegroundColor Yellow
    }
    if ($envContent -match "MONGODB_URI=mongodb") {
        Write-Host "  ✓ MongoDB URI is configured" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Warning: MongoDB URI may not be set" -ForegroundColor Yellow
    }
} else {
    Write-Host " ✗ Not found" -ForegroundColor Red
    Write-Host "  → Run: Copy-Item .env.example .env" -ForegroundColor Yellow
    $allGood = $false
}

# Check if dependencies are installed
Write-Host "Checking dependencies..." -NoNewline
$depsInstalled = $true
if (-not (Test-Path "node_modules")) { $depsInstalled = $false }
if (-not (Test-Path "backend/node_modules")) { $depsInstalled = $false }
if (-not (Test-Path "frontend/node_modules")) { $depsInstalled = $false }

if ($depsInstalled) {
    Write-Host " ✓ Installed" -ForegroundColor Green
} else {
    Write-Host " ✗ Not installed" -ForegroundColor Yellow
    Write-Host "  → Run: npm install" -ForegroundColor Yellow
}

# Check MongoDB connection (optional)
Write-Host "Checking MongoDB..." -NoNewline
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "mongodb://localhost") {
        # Check if local MongoDB is running
        try {
            $mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
            if ($mongoService -and $mongoService.Status -eq "Running") {
                Write-Host " ✓ Local MongoDB is running" -ForegroundColor Green
            } else {
                Write-Host " ⚠ Local MongoDB service not found or not running" -ForegroundColor Yellow
                Write-Host "  → Start MongoDB service or use MongoDB Atlas" -ForegroundColor Yellow
            }
        } catch {
            Write-Host " ⚠ Cannot check MongoDB status" -ForegroundColor Yellow
        }
    } elseif ($envContent -match "mongodb\+srv://") {
        Write-Host " ℹ Using MongoDB Atlas (cloud)" -ForegroundColor Cyan
    } else {
        Write-Host " ⚠ MongoDB URI not configured" -ForegroundColor Yellow
    }
} else {
    Write-Host " ⚠ Cannot check (no .env file)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "✓ All prerequisites are met!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Make sure your .env file has valid credentials" -ForegroundColor White
    Write-Host "2. Run: powershell -ExecutionPolicy Bypass -File start.ps1" -ForegroundColor White
} else {
    Write-Host "✗ Some prerequisites are missing" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install the missing items and run this script again." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Quick Setup Guide:" -ForegroundColor Cyan
    Write-Host "1. Install Node.js from: https://nodejs.org/" -ForegroundColor White
    Write-Host "2. Copy .env.example to .env" -ForegroundColor White
    Write-Host "3. Add your OpenAI API key and MongoDB URI to .env" -ForegroundColor White
    Write-Host "4. Run this script again to verify" -ForegroundColor White
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"