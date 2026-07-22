@echo off
echo ===================================================
echo Iniciando servidor local para el proyecto KB...
echo ===================================================
echo.

:: Abre el navegador inmediatamente
start http://localhost:8000

:: Intenta iniciar el servidor PHP. 
:: Primero verifica si PHP esta en la ruta de XAMPP por defecto.
if exist "C:\xampp\php\php.exe" (
    "C:\xampp\php\php.exe" -S localhost:8000
) else (
    php -S localhost:8000
)
