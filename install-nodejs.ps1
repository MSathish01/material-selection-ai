# Node.js Installation Helper Script

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Node.js Installation Helper" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script will help you install Node.js" -ForegroundColor Yellow
Write-Host ""

# Check if winget is available (Windows Package Manager)
try {
    $wingetVersion = winget --version 2>$null
    if ($wingetVersion) {
        Write-Host "✓ Windows Package Manager (winget) is available" -ForegroundColor Green
        Write-Host ""
        Write-Host "Do you want to install Node.js using winget? (Y/N)" -ForegroundColor Yellow
        $choice = Read-Host
        
        if ($choice -eq "Y" -or $choice -eq "y") {
            Write-Host ""
            Write-Host "Installing Node.js LTS..." -ForegroundColor Yellow
            winget install OpenJS.NodeJS.LTS
            
            Write-Host ""
            Write-Host "✓ Node.js installation completed!" -ForegroundColor Green
            Write-Host ""
            Write-Host "IMPORTANT: Please restart your computer for changes to take effect." -ForegroundColor Yellow
            Write-Host "After restart, run: check-prerequisites.ps1" -ForegroundColor Yellow
            Write-Host ""
            Read-Host "Press Enter to exit"
            exit 0
        }
    }
} catch {
    Write-Host "Windows Package Manager (winget) is not available" -ForegroundColor Yellow
}

# Manual installation instructions
Write-Host ""
Write-Host "Manual Installation Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open your web browser" -ForegroundColor White
Write-Host "2. Go to: https://nodejs.org/" -ForegroundColor Green
Write-Host "3. Click the big green button: 'Download Node.js (LTS)'" -ForegroundColor White
Write-Host "4. Run the downloaded installer" -ForegroundColor White
Write-Host "5. Click 'Next' through all steps (accept defaults)" -ForegroundColor White
Write-Host "6. Make sure 'Add to PATH' is checked" -ForegroundColor Yellow
Write-Host "7. Click 'Install' and wait for completion" -ForegroundColor White
Write-Host "8. RESTART YOUR COMPUTER" -ForegroundColor Red
Write-Host "9. After restart, run: check-prerequisites.ps1" -ForegroundColor White
Write-Host ""

Write-Host "Would you like to open the Node.js download page now? (Y/N)" -ForegroundColor Yellow
$openBrowser = Read-Host

if ($openBrowser -eq "Y" -or $openBrowser -eq "y") {
    Start-Process "https://nodejs.org/"
    Write-Host ""
    Write-Host "✓ Browser opened to Node.js download page" -ForegroundColor Green
    Write-Host ""
    Write-Host "After installing Node.js and restarting your computer," -ForegroundColor Yellow
    Write-Host "run this command to continue:" -ForegroundColor Yellow
    Write-Host "  powershell -ExecutionPolicy Bypass -File check-prerequisites.ps1" -ForegroundColor Green
}

Write-Host ""
Read-Host "Press Enter to exit"