#!/usr/bin/env python3
"""
Project Structure Validator
Verifies that all required folders and files exist for CSE 573 submission.
"""

import os
import sys

def validate_structure(root_dir):
    """Validate the project structure"""
    
    required_items = {
        'directories': ['CODE', 'DATA', 'EVALUATIONS'],
        'files': ['README.md', '.gitignore']
    }
    
    print("=" * 70)
    print("PROJECT STRUCTURE VALIDATION - CSE 573")
    print("=" * 70)
    print(f"Project Root: {root_dir}\n")
    
    all_valid = True
    
    # Check directories
    print("📁 Required Directories:")
    for dir_name in required_items['directories']:
        dir_path = os.path.join(root_dir, dir_name)
        exists = os.path.isdir(dir_path)
        status = "✅ OK" if exists else "❌ MISSING"
        print(f"   {status}  {dir_name}/")
        if not exists:
            all_valid = False
    
    print()
    
    # Check files
    print("📄 Required Files:")
    for file_name in required_items['files']:
        file_path = os.path.join(root_dir, file_name)
        exists = os.path.isfile(file_path)
        status = "✅ OK" if exists else "❌ MISSING"
        print(f"   {status}  {file_name}")
        if not exists:
            all_valid = False
    
    print()
    print("=" * 70)
    
    if all_valid:
        print("✅ ALL REQUIRED ITEMS PRESENT")
        print("✅ Project structure is valid for CSE 573 submission")
    else:
        print("❌ VALIDATION FAILED")
        print("❌ Some required items are missing")
        sys.exit(1)
    
    print("=" * 70)
    
    # Additional checks
    print("\n📊 Additional Information:")
    
    # Count files in each directory
    for dir_name in required_items['directories']:
        dir_path = os.path.join(root_dir, dir_name)
        if os.path.isdir(dir_path):
            file_count = sum([len(files) for _, _, files in os.walk(dir_path)])
            print(f"   {dir_name}/: {file_count} files")
    
    print()

if __name__ == "__main__":
    project_root = os.path.dirname(os.path.abspath(__file__))
    validate_structure(project_root)
