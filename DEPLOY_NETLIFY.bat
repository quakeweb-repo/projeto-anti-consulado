@echo off
REM =====================================================
REM NETLIFY DEPLOYMENT SCRIPT
REM Background Check Pro
REM =====================================================

echo =====================================================
echo NETLIFY DEPLOYMENT - Background Check Pro
echo =====================================================

REM Check if netlify-cli is installed
echo.
echo [1/4] Checking Netlify CLI...
npm list -g netlify-cli >nul 2>&1
if errorlevel 1 (
    echo Installing Netlify CLI...
    npm install -g netlify-cli
)

REM Change to project directory
cd /d %~dp0

echo.
echo [2/4] Deploying to Netlify...
echo.
echo IMPORTANT: You need to be logged in to Netlify
echo Run: netlify login
echo.
echo To deploy, run:
echo   netlify deploy --prod
echo.
echo OR use direct link:
echo   https://app.netlify.com/start/deploy?repository=https://github.com/quakeweb-repo/projeto-anti-consulado
echo.

REM Show current configuration
echo.
echo [3/4] Current Configuration:
echo.
echo API Base URL: https://background-check-pro.netlify.app/.netlify/functions
echo GitHub Pages: https://quakeweb-repo.github.io/projeto-anti-consulado/
echo.
echo AFTER deployment, update script.js with your actual Netlify URL:
echo   netlifyUrl: 'https://[your-site-name].netlify.app'
echo   apiBase: 'https://[your-site-name].netlify.app/.netlify/functions'

echo.
echo [4/4] Deployment Status
echo.
echo GitHub Pages: DEPLOYED
echo   URL: https://quakeweb-repo.github.io/projeto-anti-consulado/
echo.
echo Netlify Backend: NOT DEPLOYED
echo   Run: netlify deploy --prod
echo.
echo =====================================================
echo DEPLOYMENT INSTRUCTIONS:
echo =====================================================
echo.
echo OPTION 1 - Netlify CLI:
echo   1. netlify login
echo   2. netlify deploy --prod
echo.
echo OPTION 2 - Netlify Dashboard:
echo   1. Go to https://app.netlify.com
echo   2. Click "Add new site" -> "Import existing project"
echo   3. Select: quakeweb-repo/projeto-anti-consulado
echo   4. Click "Deploy site"
echo.
echo OPTION 3 - Direct Link:
echo   https://app.netlify.com/start/deploy?repository=https://github.com/quakeweb-repo/projeto-anti-consulado
echo.
echo =====================================================

pause
