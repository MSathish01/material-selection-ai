# Fix: npm is not recognized

## Problem
You're seeing: `npm : The term 'npm' is not recognized`

## Solution

### Option 1: Restart Your Terminal (Most Common Fix)

**If you just installed Node.js or Git:**

1. **Close ALL PowerShell/Terminal windows**
2. **Open a NEW PowerShell window**
3. **Navigate to your project:**
   ```powershell
   cd "C:\Users\os E18\Desktop\GenAi"
   ```
4. **Try again:**
   ```powershell
   npm --version
   ```

### Option 2: Install/Reinstall Node.js

**Check if Node.js is installed:**
```powershell
node --version
```

**If you see "not recognized", install Node.js:**

#### Method A - Using winget (Recommended):
```powershell
winget install OpenJS.NodeJS.LTS
```

#### Method B - Manual Download:
1. Go to: https://nodejs.org/
2. Download the LTS version (recommended)
3. Run the installer
4. Use default settings
5. **Restart your terminal after installation**

### Option 3: Add Node.js to PATH Manually

**If Node.js is installed but not recognized:**

1. Find Node.js installation path (usually):
   - `C:\Program Files\nodejs\`
   - `C:\Program Files (x86)\nodejs\`

2. Add to PATH:
   - Press `Win + X` → System
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables", find "Path"
   - Click "Edit"
   - Click "New"
   - Add: `C:\Program Files\nodejs\`
   - Click OK on all windows
   - **Restart your terminal**

## Verify Installation

After restarting your terminal, check:

```powershell
# Check Node.js
node --version
# Should show: v18.x.x or v20.x.x

# Check npm
npm --version
# Should show: 9.x.x or 10.x.x

# Check Git
git --version
# Should show: git version 2.x.x
```

## Then Install Firebase Tools

Once npm is working:

```powershell
npm install -g firebase-tools
```

## Push to GitHub

After everything is working:

```powershell
# Navigate to project
cd "C:\Users\os E18\Desktop\GenAi"

# Run the push script
.\push-to-github.bat
```

Or manually:

```powershell
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
git init
git add .
git commit -m "Initial commit: Material Selection AI"
git remote add origin https://github.com/MSathish01/material-selection-ai.git
git branch -M main
git push -u origin main
```

## Quick Checklist

- [ ] Node.js installed
- [ ] Git installed
- [ ] Terminal restarted
- [ ] `node --version` works
- [ ] `npm --version` works
- [ ] `git --version` works
- [ ] Ready to push to GitHub!

## Common Issues

### Issue: "npm not recognized" after installing Node.js
**Solution**: Restart your terminal

### Issue: "git not recognized" after installing Git
**Solution**: Restart your terminal

### Issue: Both npm and git not recognized
**Solution**: 
1. Install both Node.js and Git
2. Restart your computer
3. Open new terminal
4. Try again

## Need Help?

If you're still having issues:

1. **Restart your computer** (this fixes most PATH issues)
2. **Reinstall Node.js** from https://nodejs.org/
3. **Reinstall Git** from https://git-scm.com/download/win
4. **Open a NEW terminal** after each installation

## Summary

**Most likely solution:**
1. Close this terminal
2. Open a new terminal
3. Try `npm --version` again

If that doesn't work:
1. Install Node.js from https://nodejs.org/
2. Restart your terminal
3. Try again

---

**Your Goal**: Push to https://github.com/MSathish01/material-selection-ai.git

**After fixing npm/git**: Run `.\push-to-github.bat`
