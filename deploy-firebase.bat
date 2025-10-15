@echo off
REM Firebase Deployment Script for Windows CMD

echo ========================================
echo Firebase Deployment Script
echo ========================================
echo.

REM Check if Firebase CLI is installed
echo Checking Firebase CLI...
firebase --version >nul 2>&1
if errorlevel 1 (
    echo Firebase CLI not found!
    echo Installing Firebase CLI...
    npm install -g firebase-tools
    if errorlevel 1 (
        echo Failed to install Firebase CLI
        exit /b 1
    )
)
echo Firebase CLI installed
echo.

REM Check if logged in
echo Checking Firebase authentication...
firebase projects:list >nul 2>&1
if errorlevel 1 (
    echo Not logged in to Firebase
    echo Opening browser for authentication...
    firebase login
    if errorlevel 1 (
        echo Firebase login failed
        exit /b 1
    )
)
echo Authenticated with Firebase
echo.

REM Build Frontend
echo Building Frontend...
cd frontend
if exist build rmdir /s /q build
call npm run build
if errorlevel 1 (
    echo Frontend build failed
    cd ..
    exit /b 1
)
cd ..
echo Frontend built successfully
echo.

REM Build Backend
echo Building Backend...
cd backend
if exist lib rmdir /s /q lib
call npm run build
if errorlevel 1 (
    echo Backend build failed
    cd ..
    exit /b 1
)
cd ..
echo Backend built successfully
echo.

REM Deploy
echo Deploying to Firebase...
firebase deploy
if errorlevel 1 (
    echo Deployment failed
    exit /b 1
)

echo.
echo ========================================
echo Deployment Successful!
echo ========================================
echo.
echo Your app is now live!
echo Frontend: https://your-project-id.web.app
echo API: https://us-central1-your-project-id.cloudfunctions.net/api
echo.
pause
