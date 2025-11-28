#!/bin/bash
# Clean and Format Script for Git Bash
# CSE 573 - Movie Recommender System

echo "========================================"
echo "CLEAN AND FORMAT - CSE 573 PROJECT"
echo "========================================"
echo ""

echo "[1/6] Removing __pycache__ directories..."
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null
echo "Done."
echo ""

echo "[2/6] Removing .pyc files..."
find . -type f -name "*.pyc" -delete 2>/dev/null
echo "Done."
echo ""

echo "[3/6] Removing node_modules (if present)..."
if [ -d "node_modules" ]; then
    rm -rf node_modules
    echo "Removed node_modules"
else
    echo "No node_modules found"
fi
echo ""

echo "[4/6] Checking for duplicate files..."
python duplicate_check.py
echo ""

echo "[5/6] Formatting Python code with black..."
if python -m black CODE/ --line-length 100 --quiet 2>/dev/null; then
    echo "Python code formatted."
else
    echo "Black not installed. Skipping formatting."
    echo "Install with: pip install black"
fi
echo ""

echo "[6/6] Sorting imports with isort..."
if python -m isort CODE/ --profile black 2>/dev/null; then
    echo "Imports sorted."
else
    echo "isort not installed. Skipping import sorting."
    echo "Install with: pip install isort"
fi
echo ""

echo "========================================"
echo "CLEANUP COMPLETE!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Review changes with: git status"
echo "2. Run validation: python validate_structure.py"
echo "3. Commit changes: git add . && git commit -m 'Your message'"
echo ""
