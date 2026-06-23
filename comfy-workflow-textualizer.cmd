@echo off
setlocal
set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PROJECT_DIR%comfy-workflow-textualizer.ps1"
if errorlevel 1 pause

endlocal
