@echo off
echo Starting Event Management Backend Server...
echo.

REM Check if port 5001 is available
netstat -ano | findstr :5001 >nul
if %errorlevel% == 0 (
    echo Port 5001 is already in use. Killing existing process...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5001') do taskkill /PID %%a /F
    timeout /t 2 /nobreak >nul
)

REM Start MongoDB if not running
echo Checking MongoDB service...
sc query MongoDB | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo Starting MongoDB service...
    net start MongoDB
    if %errorlevel% neq 0 (
        echo Warning: Could not start MongoDB service.
        echo Trying to start mongod manually...
        start "MongoDB" cmd /k "mongod --dbpath C:\data\db"
        timeout /t 3 /nobreak >nul
    )
)

echo.
echo Setting PORT=5001 in environment...
set PORT=5001

echo Starting backend server...
echo Backend will be available at: http://localhost:5001
echo Press Ctrl+C to stop the server
echo.

npm run server

pause
