@echo off
echo Starting MongoDB for Event Management...
echo.

REM Try different MongoDB installation paths
if exist "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" (
    echo Found MongoDB 7.0, starting...
    "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"
) else if exist "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" (
    echo Found MongoDB 6.0, starting...
    "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath "C:\data\db"
) else if exist "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe" (
    echo Found MongoDB 5.0, starting...
    "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe" --dbpath "C:\data\db"
) else (
    echo MongoDB not found in standard locations.
    echo Trying to start as Windows service...
    net start MongoDB
    if %errorlevel% neq 0 (
        echo Error: MongoDB could not be started.
        echo Please install MongoDB or check your installation.
        echo Visit: https://www.mongodb.com/try/download/community
    )
)

pause
