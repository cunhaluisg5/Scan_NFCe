@echo off
setlocal
set "NODE16_DIR=%~dp0.tools\node16\node-v16.20.2-win-x64"
if not exist "%NODE16_DIR%\node.exe" (
  echo Node 16.20.2 local nao encontrado em "%NODE16_DIR%".
  exit /b 1
)

set "PATH=%NODE16_DIR%;%PATH%"
set "NODE_OPTIONS=--openssl-legacy-provider"
set "__UNSAFE_EXPO_HOME_DIRECTORY=%~dp0\.expo-home"
set "XDG_CACHE_HOME=%~dp0\.expo-cache"
echo Usando Node:
"%NODE16_DIR%\node.exe" -v
call "%NODE16_DIR%\npm.cmd" start
