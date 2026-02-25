# Smart Mudik 2026 - Automation Script
# Usage: ./push-to-github.ps1 "Your commit message"

param (
    [Parameter(Mandatory = $true)]
    [string]$Message
)

$ErrorActionPreference = "Stop"

Write-Host "--- Starting Automation Flow ---" -ForegroundColor Cyan

# 0. Sync Files
Write-Host "[0/4] Staging all files..." -ForegroundColor Yellow
git add .
git add .github/*

# 1. Build Backend
Write-Host "[1/4] Building Backend..." -ForegroundColor Yellow
cd backend
npm run build
cd ..

# 2. Build Frontend
Write-Host "[2/4] Building Frontend..." -ForegroundColor Yellow
cd frontend
npm run build
cd ..

# 3. Git Operations
Write-Host "[3/4] committing changes..." -ForegroundColor Yellow
git add .
git commit -m "$Message"

# 4. Push
Write-Host "[4/4] Pushing to GitHub..." -ForegroundColor Yellow
try {
    # Try pushing and setting upstream to main
    git push -u origin main
    Write-Host "DONE! Code successfully built and pushed." -ForegroundColor Green
}
catch {
    Write-Host "PUSH FAILED. Make sure you have set up a remote origin (git remote add origin ...)" -ForegroundColor Red
}
