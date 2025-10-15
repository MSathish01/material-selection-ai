@echo off
echo ========================================
echo Starting AI Material Selection Platform
echo ========================================
echo.

echo Step 1: Starting Backend Server...
echo.
start cmd /k "cd backend && npm run dev"

timeout /t 5 /nobreak >nul

echo Step 2: Starting Frontend...
echo.
start cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo Application Starting!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Two windows will open:
echo 1. Backend Server (keep running)
echo 2. Frontend App (keep running)
echo.
echo Your browser will open automatically.
echo.
pause
