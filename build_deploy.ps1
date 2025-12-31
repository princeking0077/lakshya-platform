$ErrorActionPreference = "Stop"

Write-Host "------------------------------------------------"
Write-Host "   LAKSHYA LMS - DEPLOYMENT BUILD SCRIPT"
Write-Host "------------------------------------------------"

# 1. Build Client
Write-Host "Step 1: Building Client (Next.js)..."
cd client
npm install
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Client build failed!"
    exit 1
}
cd ..

# 2. Prepare Server Directory
Write-Host "Step 2: Updating Server Static Files..."
$ServerClientBuildPath = "server/client_build"

if (Test-Path $ServerClientBuildPath) {
    Write-Host "Cleaning old build files..."
    Remove-Item -Recurse -Force $ServerClientBuildPath
}

# 3. Copy Build Artifacts
Write-Host "Step 3: Copying new build to $ServerClientBuildPath..."
# 'out' is the default folder for 'next export' (output: 'export')
Copy-Item -Recurse "client/out" $ServerClientBuildPath

Write-Host "------------------------------------------------"
Write-Host "   BUILD SUCCESSFUL!"
Write-Host "------------------------------------------------"
Write-Host "Ready to Deploy:"
Write-Host "1. Commit 'server/client_build' to Git."
Write-Host "2. Push to GitHub."
Write-Host "3. Ensure Hostinger is connected to GitHub repo."
Write-Host "------------------------------------------------"
