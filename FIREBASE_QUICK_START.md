# 🚀 Firebase Quick Start - 5 Minutes to Deploy

## Super Fast Deployment Guide

### Step 1: Install Firebase CLI (1 minute)

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase (1 minute)

```bash
firebase login
```

### Step 3: Create Firebase Project (1 minute)

Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.

### Step 4: Update Project ID (30 seconds)

Edit `.firebaserc`:
```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

### Step 5: Set Environment Variables (1 minute)

```bash
firebase functions:config:set mongodb.uri="your-mongodb-atlas-uri"
firebase functions:config:set gemini.api_key="your-gemini-key"
```

### Step 6: Deploy! (1 minute)

**Windows PowerShell:**
```powershell
powershell -ExecutionPolicy Bypass -File deploy-firebase.ps1
```

**Windows CMD:**
```cmd
deploy-firebase.bat
```

**Manual:**
```bash
# Build frontend
cd frontend && npm run build && cd ..

# Build backend  
cd backend && npm run build && cd ..

# Deploy
firebase deploy
```

---

## ✅ Done!

Your app is live at:
- **Frontend**: `https://your-project-id.web.app`
- **API**: `https://us-central1-your-project-id.cloudfunctions.net/api`

---

## 🔧 Update Frontend API URL

Create `frontend/src/config.ts`:

```typescript
export const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://us-central1-your-project-id.cloudfunctions.net/api'
  : 'http://localhost:5000/api';
```

Then update your API calls to use `API_URL`.

---

## 📝 Common Commands

```bash
# Deploy everything
firebase deploy

# Deploy frontend only
firebase deploy --only hosting

# Deploy backend only
firebase deploy --only functions

# View logs
firebase functions:log

# View config
firebase functions:config:get
```

---

## 🐛 Troubleshooting

**Issue: Deployment fails**
```bash
firebase deploy --debug
```

**Issue: Functions not working**
```bash
# Check logs
firebase functions:log

# Verify config
firebase functions:config:get
```

**Issue: Frontend blank page**
```bash
# Rebuild
cd frontend && npm run build && cd ..
firebase deploy --only hosting
```

---

## 💡 Pro Tips

1. **Use deployment script** for easier deployment
2. **Set up MongoDB Atlas** for free database
3. **Enable Firebase Analytics** for monitoring
4. **Add custom domain** in Firebase Console
5. **Set up CI/CD** with GitHub Actions

---

## 📚 Full Documentation

See `FIREBASE_DEPLOYMENT.md` for complete guide.

---

**That's it! You're deployed! 🎉**
