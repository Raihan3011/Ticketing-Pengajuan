@echo off
echo ========================================
echo    FRONTEND TEAM SETUP
echo ========================================
echo.

if not exist frontend (
    echo Error: Frontend folder not found!
    pause
    exit /b 1
)

cd frontend

echo [1/3] Installing NPM Dependencies...
call npm install

echo.
echo [2/3] Checking Environment Configuration...
if not exist .env (
    echo REACT_APP_API_URL=http://localhost:8000/api > .env
    echo REACT_APP_NAME=Ticketing System >> .env
)

echo.
echo [3/3] Setup Complete!
echo.
echo To start frontend: npm start
echo Frontend: http://localhost:3000
echo.
cd ..
pause