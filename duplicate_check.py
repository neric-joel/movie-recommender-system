#!/usr/bin/env python3
"""
Duplicate File Checker
Scans the repository and identifies duplicate filenames with their full paths.
"""

import os
from collections import defaultdict
from pathlib import Path

def find_duplicates(root_dir):
    """Find all duplicate filenames in the directory tree"""
    file_dict = defaultdict(list)
    
    # Walk through directory
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Skip hidden directories and common ignore patterns
        dirnames[:] = [d for d in dirnames if not d.startswith('.') and d not in ['node_modules', '__pycache__', 'venv', '.git']]
        
        for filename in filenames:
            if not filename.startswith('.'):
                full_path = os.path.join(dirpath, filename)
                file_dict[filename].append(full_path)
    
    # Find duplicates
    duplicates = {name: paths for name, paths in file_dict.items() if len(paths) > 1}
    
    return duplicates

def main():
    # Get project root
    project_root = os.path.dirname(os.path.abspath(__file__))
    
    print("=" * 70)
    print("DUPLICATE FILE CHECKER")
    print("=" * 70)
    print(f"Scanning: {project_root}\n")
    
    duplicates = find_duplicates(project_root)
    
    if not duplicates:
        print("✅ No duplicate filenames found!")
    else:
        print(f"⚠️  Found {len(duplicates)} duplicate filename(s):\n")
        
        for filename, paths in sorted(duplicates.items()):
            print(f"📄 {filename} ({len(paths)} copies):")
            for path in sorted(paths):
                rel_path = os.path.relpath(path, project_root)
                print(f"   - {rel_path}")
            print()
    
    print("=" * 70)
    print(f"Total files scanned: {sum(len(paths) for paths in find_duplicates(project_root).values()) + len([f for f in os.listdir(project_root) if os.path.isfile(os.path.join(project_root, f))])}")
    print("=" * 70)

if __name__ == "__main__":
    main()
