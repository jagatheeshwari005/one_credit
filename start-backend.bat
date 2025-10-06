@echo off
echo Starting Event Management Backend Server...
echo.

REM Check if MongoDB service is running
echo Checking MongoDB service...
net start | findstr /i "MongoDB" >nul
if %errorlevel% == 0 (
    echo MongoDB service is already running.
) else (
    echo Starting MongoDB service...
    net start MongoDB
    if %errorlevel% neq 0 (
        echo Warning: Could not start MongoDB service automatically.
        echo Please start MongoDB manually or check if it's installed.
        echo.
    )
)

echo.
echo Starting backend server on port 5001...
echo Press Ctrl+C to stop the server
echo.

npm run server

pause
