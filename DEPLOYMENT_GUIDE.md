# CSE 573 - GitHub Deployment Guide

Complete guide for cleaning, validating, and pushing your Movie Recommender System to GitHub.

## 📁 Project Location
```
C:\Users\VICTUS\.gemini\antigravity\playground\pyro-nova\movie-recommender-system
```

## 🎯 Required Structure (CSE 573)
```
movie-recommender-system/
├── CODE/                    # Source code
├── DATA/                    # Dataset files
├── EVALUATIONS/             # Evaluation results
├── README.md                # Project documentation
└── .gitignore               # Git ignore rules
```

---

## STEP 1: Clean the Project

### Option A: Windows (CMD/PowerShell)
```cmd
cd C:\Users\VICTUS\.gemini\antigravity\playground\pyro-nova\movie-recommender-system
clean_and_format.bat
```

### Option B: Git Bash
```bash
cd /c/Users/VICTUS/.gemini/antigravity/playground/pyro-nova/movie-recommender-system
bash clean_and_format.sh
```

**What this does:**
- ✅ Removes all `__pycache__` directories
- ✅ Deletes all `.pyc` files
- ✅ Removes `node_modules` if present
- ✅ Runs duplicate file check
- ✅ Formats Python code with `black` (if installed)
- ✅ Sorts imports with `isort` (if installed)

---

## STEP 2: Check for Duplicates

```cmd
python duplicate_check.py
```

**Expected output:**
```
======================================================================
DUPLICATE FILE CHECKER
======================================================================
Scanning: C:\Users\VICTUS\.gemini\antigravity\playground\pyro-nova\movie-recommender-system

✅ No duplicate filenames found!
======================================================================
```

---

## STEP 3: Validate Structure

```cmd
python validate_structure.py
```

**Expected output:**
```
======================================================================
PROJECT STRUCTURE VALIDATION - CSE 573
======================================================================

📁 Required Directories:
   ✅ OK  CODE/
   ✅ OK  DATA/
   ✅ OK  EVALUATIONS/

📄 Required Files:
   ✅ OK  README.md
   ✅ OK  .gitignore

======================================================================
✅ ALL REQUIRED ITEMS PRESENT
✅ Project structure is valid for CSE 573 submission
======================================================================
```

---

## STEP 4: Configure Git (First Time Only)

```cmd
git config --global user.name "Joel Narul"
git config --global user.email "naruljoe@asu.edu"
```

Verify:
```cmd
git config --global --list
```

---

## STEP 5: Review Changes

```cmd
cd C:\Users\VICTUS\.gemini\antigravity\playground\pyro-nova\movie-recommender-system
git status
```

This shows all modified, added, and deleted files.

---

## STEP 6: Stage Files for Commit

### Option A: Add All Files
```cmd
git add .
```

### Option B: Add Specific Directories
```cmd
git add CODE/
git add EVALUATIONS/
git add cinescope-ui/
git add README.md
git add .gitignore
git add GIT_COMMANDS.md
git add GITHUB_CHECKLIST.md
```

---

## STEP 7: Review Staged Changes

```cmd
git status
```

**Expected output:**
```
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   CODE/...
        new file:   cinescope-ui/...
        ...
```

---

## STEP 8: Commit Changes

```cmd
git commit -m "Cleaned repository and integrated UI with backend:
- Added CineScope UI with autocomplete search
- Implemented TF-IDF similarity recommendations
- Optimized memory usage (on-demand similarity computation)
- Fixed memory overflow issue (15GB -> 500MB)
- Cleaned redundant files and __pycache__
- Ensured CSE 573 required structure
- Added comprehensive evaluation metrics
- Created GitHub deployment scripts"
```

**Note:** For multi-line commit messages in CMD, use `^` at line breaks:
```cmd
git commit -m "Cleaned repository and integrated UI with backend: ^
- Added CineScope UI with autocomplete search ^
- Implemented TF-IDF similarity recommendations ^
- Optimized memory usage ^
- Fixed memory overflow issue ^
- Cleaned redundant files ^
- Ensured CSE 573 structure"
```

---

## STEP 9: Connect to GitHub (If Not Already Connected)

Check current remote:
```cmd
git remote -v
```

If no remote exists, add it:
```cmd
git remote add origin https://github.com/neric-joel/movie-recommender-system.git
```

If remote exists but is wrong:
```cmd
git remote set-url origin https://github.com/neric-joel/movie-recommender-system.git
```

---

## STEP 10: Pull Latest Changes (If Any)

```cmd
git pull origin main --rebase
```

**If there are conflicts:**
1. Resolve conflicts in the files
2. Stage resolved files: `git add <file>`
3. Continue rebase: `git rebase --continue`

---

## STEP 11: Push to GitHub

```cmd
git branch -M main
git push -u origin main
```

**If prompted for credentials:**
- Username: `neric-joel`
- Password: **Use Personal Access Token** (not your GitHub password)

### Create Personal Access Token (if needed):
1. Go to GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. Select scope: `repo` (all sub-options)
5. Generate and **copy the token**
6. Use token as password when pushing

---

## STEP 12: Verify Upload

Visit your repository:
```
https://github.com/neric-joel/movie-recommender-system
```

Check that all files are present:
- ✅ CODE/
- ✅ DATA/ (README.md only, CSV files ignored)
- ✅ EVALUATIONS/
- ✅ cinescope-ui/
- ✅ README.md
- ✅ .gitignore

---

## 🔥 Quick Command Sequence (All Steps)

```cmd
REM Navigate to project
cd C:\Users\VICTUS\.gemini\antigravity\playground\pyro-nova\movie-recommender-system

REM Clean project
clean_and_format.bat

REM Validate structure
python validate_structure.py

REM Check duplicates
python duplicate_check.py

REM Git workflow
git status
git add .
git status
git commit -m "Cleaned repository and integrated UI with backend"
git pull origin main --rebase
git push -u origin main
```

---

## 📋 CSE 573 Submission Checklist

- ✅ Repository is **Public**
- ✅ Required structure (CODE, DATA, EVALUATIONS)
- ✅ README.md is complete and professional
- ✅ .gitignore excludes large files
- ✅ No `__pycache__` or `.pyc` files
- ✅ No duplicate files
- ✅ Code is formatted and clean
- ✅ Evaluation results are included
- ✅ All commits have descriptive messages
- ✅ Repository URL added to PPT

---

## 🐛 Troubleshooting

### Error: "remote origin already exists"
```cmd
git remote remove origin
git remote add origin https://github.com/neric-joel/movie-recommender-system.git
```

### Error: "failed to push some refs"
```cmd
git pull origin main --rebase
git push -u origin main
```

### Error: "Authentication failed"
- Use **Personal Access Token**, not password
- Regenerate token if expired

### Large files rejected
- Check `.gitignore` includes CSV files
- Remove from staging: `git rm --cached DATA/*.csv`

---

## 📧 Contact

**Student:** Joel Narul  
**Email:** naruljoe@asu.edu  
**Course:** CSE 573 - Semantic Web Mining  
**Semester:** Fall 2025

---

## 🎓 Final Submission

After pushing to GitHub:
1. ✅ Verify repository is accessible
2. ✅ Add GitHub URL to PPT last slide
3. ✅ Test clone on another machine (optional)
4. ✅ Submit repository link to Canvas/Blackboard

**GitHub URL for PPT:**
```
https://github.com/neric-joel/movie-recommender-system
```

---

**Good luck with your CSE 573 submission! 🎓**
