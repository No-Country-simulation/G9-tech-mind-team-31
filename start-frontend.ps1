Set-Location "c:\Users\Michael\Downloads\G9-tech-mind-team-31-feature-frontend\G9-tech-mind-team-31-feature-frontend\frontend"

Write-Host "Starting frontend dev server..."
Write-Host "Current directory: $(Get-Location)"
Write-Host "Node version: $(node --version)"
Write-Host "NPM version: $(npm --version)"

Write-Host "`nInstalling dependencies if needed..."
npm install

Write-Host "`nStarting dev server..."
npm run dev
