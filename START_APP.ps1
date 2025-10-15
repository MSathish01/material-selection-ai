# GenAI Material Selection Assistant - Startup Script
# Run this script to start the application

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Starting Material Selection Assistant" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Not in the correct directory!" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ Error: .env file not found!" -ForegroundColor Red
    Write-Host "Please create .env file with your configuration." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✓ Configuration files found" -ForegroundColor Green
Write-Host "`nStarting servers..." -ForegroundColor Yellow
Write-Host "  - Backend will start on: http://localhost:5000" -ForegroundColor White
Write-Host "  - Frontend will start on: http://localhost:3000" -ForegroundColor White
Write-Host "`n⚠️  Keep this window open while using the app!" -ForegroundColor Yellow
Write-Host "⚠️  Press Ctrl+C to stop the servers`n" -ForegroundColor Yellow

# Start the application
npm run dev