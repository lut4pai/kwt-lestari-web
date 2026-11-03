@echo off
title Sistem E-Commerce KWT Lestari - Desa Sumber Makmur
set "PATH=%LOCALAPPDATA%\nodejs\node-v22.14.0-win-x64;%PATH%"
cd /d "%~dp0"

echo ============================================================================
echo   SISTEM INFORMASI E-COMMERCE KWT LESTARI - DESA SUMBER MAKMUR
echo   Kec. Mentaya Hilir Utara, Kab. Kotawaringin Timur, Kalimantan Tengah
echo ============================================================================
echo.
echo Menyalakan server Next.js di http://localhost:3000 ...
echo Browser akan terbuka otomatis dalam beberapa detik.
echo (Tekan Ctrl + C pada jendela ini untuk menghentikan server)
echo.

start "" cmd /c "timeout /t 4 /nobreak >nul && start http://localhost:3000"
call npm.cmd run dev
pause
