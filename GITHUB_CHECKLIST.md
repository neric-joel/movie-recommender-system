# GitHub Deployment Checklist for CSE 573

## Pre-Deployment Validation

### ✅ Directory Structure Verified
```
movie-recommender-system/
│
├── CODE/
│   ├── data_loader.py          ✅
│   ├── models.py                ✅
│   ├── train.py                 ✅
│   ├── hybrid.py                ✅
│   ├── evaluate.py              ✅
│   ├── full_evaluation.py       ✅
│   └── recommend.py             ✅
│
├── DATA/
│   ├── README.md                ✅
│   └── [CSV files - ignored]    ✅
│
├── EVALUATIONS/
│   ├── evaluation_metrics.csv   ✅
│   ├── rmse_mae_comparison.png  ✅
│   ├── ranking_metrics_comparison.png  ✅
│   └── analysis_report.txt      ✅
│
├── .gitignore                   ✅
├── GIT_COMMANDS.md              ✅
├── README.md                    ✅
└── requirements.txt             ✅
```

---

## Step-by-Step Deployment Checklist

### Phase 1: Local Git Setup
- [ ] Open PowerShell/Terminal
- [ ] Navigate to project directory:
  ```bash
  cd C:\Users\VICTUS\.gemini\antigravity\playground\pyro-nova\movie-recommender-system
  ```
- [ ] Configure Git (if not done):
  ```bash
  git config --global user.name "Joel Narul"
  git config --global user.email "naruljoe@asu.edu"
  ```
- [ ] Initialize repository:
  ```bash
  git init
  ```
- [ ] Add all files:
  ```bash
  git add .
  ```
- [ ] Check status:
  ```bash
  git status
  ```
- [ ] Create initial commit:
  ```bash
  git commit -m "Initial commit: Hybrid Movie Recommendation System for CSE 573"
  ```

### Phase 2: GitHub Repository Creation
- [ ] Go to [GitHub.com](https://github.com)
- [ ] Click **+** → **New repository**
- [ ] Repository name: `movie-recommender-system`
- [ ] Description: `Hybrid Movie Recommendation System - CSE 573 Fall 2025`
- [ ] Visibility: **Public**
- [ ] **DO NOT** check "Initialize with README"
- [ ] Click **Create repository**
- [ ] Copy repository URL

### Phase 3: Personal Access Token (PAT)
- [ ] Go to GitHub → Profile → **Settings**
- [ ] **Developer settings** → **Personal access tokens** → **Tokens (classic)**
- [ ] Click **Generate new token (classic)**
- [ ] Note: `CSE 573 Project Upload`
- [ ] Expiration: `90 days`
- [ ] Scopes: Check **repo** (all sub-options)
- [ ] Click **Generate token**
- [ ] **COPY TOKEN IMMEDIATELY** and save it securely

### Phase 4: Connect and Push
- [ ] Add remote origin:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/movie-recommender-system.git
  ```
- [ ] Verify remote:
  ```bash
  git remote -v
  ```
- [ ] Set branch to main:
  ```bash
  git branch -M main
  ```
- [ ] Push to GitHub:
  ```bash
  git push -u origin main
  ```
- [ ] When prompted:
  - Username: `YOUR_GITHUB_USERNAME`
  - Password: **PASTE YOUR PAT** (not GitHub password!)

### Phase 5: Verification
- [ ] Visit repository URL: `https://github.com/YOUR_USERNAME/movie-recommender-system`
- [ ] Verify all files are uploaded
- [ ] Check README renders correctly
- [ ] Verify images display in README
- [ ] Confirm CSV files are NOT uploaded (gitignore working)
- [ ] Check evaluation PNG files ARE uploaded

### Phase 6: PPT Integration
- [ ] Open your PowerPoint presentation
- [ ] Go to **last slide**
- [ ] Add section: "GitHub Repository"
- [ ] Insert repository URL:
  ```
  https://github.com/YOUR_USERNAME/movie-recommender-system
  ```
- [ ] Add course info:
  ```
  CSE 573 - Semantic Web Mining
  Fall 2025
  Arizona State University
  ```
- [ ] Save PPT

### Phase 7: Final Checks
- [ ] Repository is **Public**
- [ ] README.md is complete and professional
- [ ] All evaluation results are visible
- [ ] .gitignore is working (no large CSV files)
- [ ] GIT_COMMANDS.md is accessible
- [ ] requirements.txt is complete
- [ ] Repository URL is in PPT
- [ ] Team members are listed in README

---

## Quick Command Reference

```bash
# Check what will be committed
git status

# View commit history
git log --oneline

# Make changes and update
git add .
git commit -m "Updated evaluation results"
git push

# If you need to pull changes
git pull origin main
```

---

## Troubleshooting

### Issue: "remote origin already exists"
**Solution:**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/movie-recommender-system.git
```

### Issue: "Authentication failed"
**Solution:**
- Use Personal Access Token, NOT password
- Regenerate token if expired
- Check token has `repo` scope

### Issue: "failed to push some refs"
**Solution:**
```bash
git pull origin main --rebase
git push -u origin main
```

---

## Post-Deployment

### Update Repository (After Changes)
```bash
git add .
git commit -m "Description of changes"
git push
```

### Share Repository
- Copy URL: `https://github.com/YOUR_USERNAME/movie-recommender-system`
- Share with instructor/TAs
- Include in project submission

---

## Final Submission Checklist for CSE 573

- [ ] GitHub repository is live and public
- [ ] Repository URL added to PPT last slide
- [ ] README includes team members
- [ ] All evaluation results are visible
- [ ] Code is well-documented
- [ ] Requirements.txt is complete
- [ ] Project runs successfully (tested)
- [ ] PPT references GitHub repo
- [ ] Submitted on time

---

## Contact

For issues with this deployment:
- Email: naruljoe@asu.edu
- GitHub: [Your GitHub Profile]

**Good luck with your CSE 573 submission! 🎓**
