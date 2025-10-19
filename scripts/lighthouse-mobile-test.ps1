# Phase 5 Mobile Lighthouse Test Script for Windows
Write-Host "🚀 Starting Phase 5 Week 1 Mobile Performance Test..." -ForegroundColor Green

# Start the server in background
Write-Host "📡 Starting development server..." -ForegroundColor Yellow
$serverProcess = Start-Process npm -ArgumentList "start" -PassThru -WindowStyle Hidden

# Wait for server to start
Write-Host "⏳ Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Run Lighthouse mobile audit
Write-Host "🔍 Running Lighthouse mobile audit..." -ForegroundColor Cyan
npx lighthouse http://localhost:3000 --form-factor=mobile --output html --output-path ./lighthouse-mobile-week1.html --chrome-flags="--headless --no-sandbox" --quiet

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Lighthouse audit complete! Check lighthouse-mobile-week1.html for results." -ForegroundColor Green
}
else {
    Write-Host "❌ Lighthouse audit failed with exit code: $LASTEXITCODE" -ForegroundColor Red
}

# Kill the server
Write-Host "🛑 Stopping server..." -ForegroundColor Yellow
if ($serverProcess -and !$serverProcess.HasExited) {
    Stop-Process -Id $serverProcess.Id -Force
}