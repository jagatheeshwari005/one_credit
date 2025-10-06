@echo off
echo Starting Event Management Application...
echo.

REM Start MongoDB if not running
echo Checking MongoDB...
sc query MongoDB | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo Starting MongoDB service...
    net start MongoDB
)

echo.
echo Starting backend server...
start "Backend Server" cmd /k "npm run server"

echo.
echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo.
echo Starting frontend...
start "Frontend" cmd /k "npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5001
echo Frontend: http://localhost:3000
echo.
pause
