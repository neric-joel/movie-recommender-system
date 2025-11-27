# Git Commands for GitHub Deployment

## Step-by-Step Guide to Upload Your Project to GitHub

### Prerequisites
- Git installed on your system
- GitHub account created
- Project folder: `C:\Users\VICTUS\.gemini\antigravity\playground\pyro-nova\movie-recommender-system`

---

## 1. Configure Git (First Time Setup)

Open PowerShell or Command Prompt and run:

```bash
git config --global user.name "Joel Narul"
git config --global user.email "naruljoe@asu.edu"
```

Verify configuration:
```bash
git config --global --list
```

---

## 2. Initialize Git Repository

Navigate to your project folder:
```bash
cd C:\Users\VICTUS\.gemini\antigravity\playground\pyro-nova\movie-recommender-system
```

Initialize Git:
```bash
git init
```

---

## 3. Add Files to Git

Add all files to staging:
```bash
git add .
```

Check what will be committed:
```bash
git status
```

---

## 4. Create Initial Commit

```bash
git commit -m "Initial commit: Hybrid Movie Recommendation System for CSE 573"
```

---

## 5. Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **+** icon (top right) → **New repository**
3. Repository name: `movie-recommender-system`
4. Description: `Hybrid Movie Recommendation System - CSE 573 Fall 2025`
5. **Keep it Public** (for course submission)
6. **DO NOT** initialize with README (you already have one)
7. Click **Create repository**

---

## 6. Connect Local Repository to GitHub

Copy the repository URL from GitHub (should look like):
```
https://github.com/YOUR_USERNAME/movie-recommender-system.git
```

Add remote origin:
```bash
git remote add origin https://github.com/YOUR_USERNAME/movie-recommender-system.git
```

Verify remote:
```bash
git remote -v
```

---

## 7. Create Personal Access Token (PAT)

GitHub no longer accepts passwords for Git operations. You need a Personal Access Token.

### Steps to Create PAT:
1. Go to GitHub → Click your profile picture → **Settings**
2. Scroll down → Click **Developer settings** (left sidebar)
3. Click **Personal access tokens** → **Tokens (classic)**
4. Click **Generate new token** → **Generate new token (classic)**
5. Note: `CSE 573 Project Upload`
6. Expiration: `90 days` (or custom)
7. Select scopes:
   - ✅ `repo` (all sub-options)
8. Click **Generate token**
9. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)

---

## 8. Push to GitHub

Set the default branch to `main`:
```bash
git branch -M main
```

Push to GitHub:
```bash
git push -u origin main
```

**When prompted for credentials:**
- Username: `YOUR_GITHUB_USERNAME`
- Password: **PASTE YOUR PERSONAL ACCESS TOKEN** (not your GitHub password!)

---

## 9. Verify Upload

Go to your GitHub repository URL:
```
https://github.com/YOUR_USERNAME/movie-recommender-system
```

You should see all your files uploaded!

---

## 10. Future Updates

After making changes to your code:

```bash
# Stage changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push
```

---

## Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/movie-recommender-system.git
```

### Error: "failed to push some refs"
```bash
git pull origin main --rebase
git push -u origin main
```

### Error: "Authentication failed"
- Make sure you're using your **Personal Access Token**, not your password
- Regenerate token if expired

---

## Final Checklist for CSE 573 Submission

- ✅ Repository is **Public**
- ✅ README.md is professional and complete
- ✅ All code files are uploaded
- ✅ Evaluation results (CSV, PNG) are included
- ✅ .gitignore is working (large CSV files excluded)
- ✅ Repository URL added to PPT last slide
- ✅ Commit messages are descriptive

---

## Add GitHub Link to PPT (Last Slide)

**Format:**
```
GitHub Repository:
https://github.com/YOUR_USERNAME/movie-recommender-system

Course: CSE 573 - Semantic Web Mining
Team: Joel Narul, [Team Members]
Fall 2025
```

---

## Quick Reference Commands

```bash
# Check status
git status

# View commit history
git log --oneline

# View remote URL
git remote -v

# Pull latest changes
git pull origin main

# Push changes
git push origin main
```
