@echo off
echo Setting up Ticketing System...

echo.
echo [1/5] Installing Backend Dependencies...
call composer install

echo.
echo [2/5] Setting up Environment...
if not exist .env copy .env.example .env
call php artisan key:generate

echo.
echo [3/5] Running Database Migrations...
call php artisan migrate

echo.
echo [4/5] Installing Frontend Dependencies...
cd frontend
call npm install
cd ..

echo.
echo [5/5] Setup Complete!
echo.
echo To start the application:
echo 1. Backend: php artisan serve (runs on http://localhost:8000)
echo 2. Frontend: cd frontend && npm start (runs on http://localhost:3000)
echo.
pause