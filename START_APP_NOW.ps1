# Start AI Material Selection Platform

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting AI Material Selection Platform" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start Backend
Write-Host "Step 1: Starting Backend Server..." -ForegroundColor Yellow
Write-Host ""
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Wait a bit for backend to start
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "Step 2: Starting Frontend..." -ForegroundColor Yellow
Write-Host ""
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm start"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Application Starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend: http://localhost:5000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Two PowerShell windows will open:" -ForegroundColor White
Write-Host "1. Backend Server (keep running)" -ForegroundColor White
Write-Host "2. Frontend App (keep running)" -ForegroundColor White
Write-Host ""
Write-Host "Your browser will open automatically." -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
