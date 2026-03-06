# 🚨 UPDATE GH-PAGES BRANCH - CRITICAL!

## Current Status
✅ GitHub Pages: Set to use gh-pages branch (CORRECT)
❌ gh-pages branch: Contains OLD terrible UI (WRONG)
✅ main branch: Contains NEW amazing Background Check Pro (CORRECT)

## 🎯 SOLUTION: Update gh-pages branch with NEW files

### Step 1: Switch to gh-pages branch locally
```bash
git checkout gh-pages
```

### Step 2: Pull latest from remote gh-pages
```bash
git pull origin gh-pages
```

### Step 3: Copy NEW files from main branch
```bash
git checkout main -- index.html
git checkout main -- script.js
git checkout main -- js/liveMining.js
git checkout main -- 404.html
git checkout main -- src/services/
```

### Step 4: Commit NEW files to gh-pages
```bash
git add .
git commit -m "Deploy Background Check Pro - Terminal Interface (Replace old UI)"
```

### Step 5: Push to gh-pages
```bash
git push origin gh-pages
```

### Step 6: Switch back to main
```bash
git checkout main
```

## 📁 Files Being Updated

### OLD (Currently on gh-pages - REMOVE):
❌ index.html (old consulate UI)
❌ script.js (old functionality)
❌ No liveMining.js
❌ No modern services
❌ Basic styling

### NEW (From main branch - ADD):
✅ index.html (Background Check Pro - 33KB)
✅ script.js (live functionality - 19KB)
✅ js/liveMining.js (live mining - 31KB)
✅ 404.html (SPA routing)
✅ src/services/ (all modern services)

## 🎮 Expected Result After Update

### Before Update (Current - Terrible):
- Blue/white consulate interface
- "Sistema OSINT - Análise Predial"
- Basic boxes
- No live features

### After Update (Amazing):
- Black background, green text (#00ff41)
- Terminal header with colored dots
- "Background Check Pro" branding
- Live mining with progress bars
- Instagram OSINT integration
- Real-time animations
- Risk assessment meter

## 🔍 Verification

After pushing, visit: https://quakeweb-repo.github.io/projeto-anti-consulado/

Should see:
- 🖥️ Terminal-style interface
- 🔍 "Deep Background Check" title
- 📱 Search options: Pessoa, Empresa, CPF, Instagram
- ⚫ Black background with green text
- ⚡ Live mining animations

## 🚨 If Git Commands Don't Work

### Alternative: Manual Upload via GitHub Web Interface

1. Go to: https://github.com/quakeweb-repo/projeto-anti-consulado
2. Switch to gh-pages branch
3. Click "Add file" → "Upload files"
4. Upload these files from your local project:
   - index.html (NEW - 33KB)
   - script.js (NEW - 19KB)
   - js/liveMining.js (NEW - 31KB)
   - src/services/ (entire folder)
   - 404.html (NEW)
5. Commit with title: "Deploy Background Check Pro"

## ⚡ DO THIS NOW!

The gh-pages branch has the wrong files! Update it immediately to show the amazing new Background Check Pro interface instead of that old consulate system.

GitHub Pages is correctly configured - it just needs the right files!
