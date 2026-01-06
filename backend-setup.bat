@echo off
echo ========================================
echo    BACKEND TEAM SETUP
echo ========================================
echo.

echo [1/5] Installing Composer Dependencies...
call composer install
if %errorlevel% neq 0 (
    echo Error: Composer install failed
    pause
    exit /b 1
)

echo.
echo [2/5] Setting up Environment...
if not exist .env (
    copy .env.example .env
    echo Environment file created
) else (
    echo Environment file already exists
)

echo.
echo [3/5] Generating Application Key...
call php artisan key:generate

echo.
echo [4/5] Running Database Migrations...
call php artisan migrate
if %errorlevel% neq 0 (
    echo Warning: Migration failed - check database connection
)

echo.
echo [5/5] Setup Complete!
echo.
echo ========================================
echo    BACKEND DEVELOPMENT READY
echo ========================================
echo.
echo To start backend server:
echo   php artisan serve
echo.
echo Backend will run on: http://localhost:8000
echo API endpoints: http://localhost:8000/api
echo.
echo Next steps:
echo 1. Configure database in .env file
echo 2. Run migrations: php artisan migrate
echo 3. Start development: php artisan serve
echo.
pause