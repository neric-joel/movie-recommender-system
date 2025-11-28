@echo off
REM Clean and Format Script for Windows
REM CSE 573 - Movie Recommender System

echo ========================================
echo CLEAN AND FORMAT - CSE 573 PROJECT
echo ========================================
echo.

echo [1/6] Removing __pycache__ directories...
for /d /r . %%d in (__pycache__) do @if exist "%%d" rd /s /q "%%d"
echo Done.
echo.

echo [2/6] Removing .pyc files...
del /s /q *.pyc 2>nul
echo Done.
echo.

echo [3/6] Removing node_modules (if present)...
if exist "node_modules" (
    rd /s /q "node_modules"
    echo Removed node_modules
) else (
    echo No node_modules found
)
echo.

echo [4/6] Checking for duplicate files...
python duplicate_check.py
echo.

echo [5/6] Formatting Python code with black...
python -m black CODE/ --line-length 100 --quiet 2>nul
if %errorlevel% neq 0 (
    echo Black not installed. Skipping formatting.
    echo Install with: pip install black
) else (
    echo Python code formatted.
)
echo.

echo [6/6] Sorting imports with isort...
python -m isort CODE/ --profile black 2>nul
if %errorlevel% neq 0 (
    echo isort not installed. Skipping import sorting.
    echo Install with: pip install isort
) else (
    echo Imports sorted.
)
echo.

echo ========================================
echo CLEANUP COMPLETE!
echo ========================================
echo.
echo Next steps:
echo 1. Review changes with: git status
echo 2. Run validation: python validate_structure.py
echo 3. Commit changes: git add . ^&^& git commit -m "Your message"
echo.

pause
