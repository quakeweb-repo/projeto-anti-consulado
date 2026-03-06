# Manual Deployment Instructions for Background Check Pro

## Problem
GitHub Pages is showing the old UI instead of the new Background Check Pro interface because the latest commits haven't been pushed due to permission issues.

## Solution: Manual Deployment

### Option 1: GitHub Web Interface (Recommended)

1. **Go to GitHub Repository**
   - Visit: https://github.com/quakeweb-repo/projeto-anti-consulado
   - Switch to `gh-pages` branch (or create it if it doesn't exist)

2. **Upload Files Manually**
   - Click "Add file" → "Upload files"
   - Upload these files from your local project:
     ```
     index.html (NEW Background Check Pro version)
     script.js
     js/liveMining.js
     src/services/ (entire folder)
     404.html
     ```

3. **File Structure on GitHub Pages**
   ```
     root/
     ├── index.html (NEW - Background Check Pro)
     ├── script.js
     ├── js/
     │   └── liveMining.js
     ├── src/
     │   └── services/
     │       ├── cpfGeneratorService.js
     │       ├── enrichedMiningService.js
     │       ├── instagramService.js
     │       ├── miningService.js
     │       └── osintBrazucaService.js
     └── 404.html
   ```

### Option 2: Git Push with Personal Access Token

1. **Create Personal Access Token**
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token with `repo` permissions

2. **Push Changes**
   ```bash
   git remote set-url origin https://YOUR_TOKEN@github.com/quakeweb-repo/projeto-anti-consulado.git
   git push origin main
   ```

### Option 3: Force Deploy to gh-pages

```bash
# Create gh-pages branch with new files
git checkout --orphan gh-pages
git add index.html script.js public/
git commit -m "Deploy Background Check Pro to GitHub Pages"
git push origin gh-pages --force
```

## What Should Be Deployed

The NEW files contain:
- ✅ **Terminal-style UI** (green/black hacker theme)
- ✅ **Background Check Pro** branding
- ✅ **Live mining system** with progress bars
- ✅ **Instagram OSINT integration**
- ✅ **CPF generation and validation**
- ✅ **Mock data for GitHub Pages**
- ✅ **Real-time animations and effects**

## Verification

After deployment, visit: https://quakeweb-repo.github.io/projeto-anti-consulado/

You should see:
- Black background with green text
- "Background Check Pro" title
- Terminal-style interface
- Search options for Person, Company, CPF, Instagram, etc.
- NOT the old blue/white consulate interface

## If Still Showing Old UI

1. **Clear browser cache**
2. **Hard refresh**: Ctrl+F5 or Cmd+Shift+R
3. **Check GitHub Pages settings** in repository
4. **Wait 5-10 minutes** for GitHub Pages to update

## Emergency Fix

If nothing works, create a new repository and deploy there, then update the GitHub Pages settings.
