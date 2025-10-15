# 🚀 Firebase Deployment Guide

## Complete Guide to Deploy Your AI Material Selection Platform to Firebase

---

## 📋 Prerequisites

1. **Node.js 18+** installed
2. **Firebase CLI** installed
3. **Google Account** for Firebase
4. **MongoDB Atlas** account (for database)
5. **Gemini/OpenAI API Key**

---

## 🔧 Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

Verify installation:
```bash
firebase --version
```

---

## 🔐 Step 2: Login to Firebase

```bash
firebase login
```

This will open your browser for authentication.

---

## 🆕 Step 3: Create Firebase Project

### Option A: Using Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `material-selection-ai`
4. Enable Google Analytics (optional)
5. Click **"Create project"**

### Option B: Using CLI

```bash
firebase projects:create material-selection-ai
```

---

## 🔗 Step 4: Initialize Firebase in Your Project

```bash
# In your project root directory
firebase init
```

Select the following options:

1. **Which Firebase features?**
   - ☑ Hosting
   - ☑ Functions (for backend API)

2. **Use an existing project?**
   - Select your project: `material-selection-ai`

3. **What do you want to use as your public directory?**
   - Enter: `frontend/build`

4. **Configure as a single-page app?**
   - Yes

5. **Set up automatic builds and deploys with GitHub?**
   - No (we'll do manual deployment first)

6. **What language for Cloud Functions?**
   - TypeScript

7. **Use ESLint?**
   - Yes

8. **Install dependencies now?**
   - Yes

---

## 📝 Step 5: Update Firebase Configuration

The `firebase.json` and `.firebaserc` files have been created for you.

Update `.firebaserc` with your actual project ID:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

---

## 🗄️ Step 6: Set Up MongoDB Atlas

Since Firebase doesn't include MongoDB, use MongoDB Atlas:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP: `0.0.0.0/0` (allow from anywhere)
5. Get connection string

---

## 🔑 Step 7: Configure Environment Variables

### For Firebase Functions (Backend)

```bash
# Set environment variables for Firebase Functions
firebase functions:config:set \
  mongodb.uri="your-mongodb-atlas-connection-string" \
  gemini.api_key="your-gemini-api-key" \
  frontend.url="https://your-project-id.web.app"
```

Or set them individually:

```bash
firebase functions:config:set mongodb.uri="mongodb+srv://..."
firebase functions:config:set gemini.api_key="your-key"
firebase functions:config:set openai.api_key="your-key"
```

View current config:
```bash
firebase functions:config:get
```

---

## 🏗️ Step 8: Prepare Backend for Firebase Functions

Create a new file for Firebase Functions:

**backend/src/index-firebase.ts** (already created below)

Update **backend/package.json** to include build script:

```json
{
  "scripts": {
    "build": "tsc",
    "serve": "npm run build && firebase emulators:start --only functions",
    "deploy": "firebase deploy --only functions"
  }
}
```

---

## 🎨 Step 9: Build Frontend

```bash
cd frontend
npm run build
cd ..
```

This creates an optimized production build in `frontend/build/`

---

## 🚀 Step 10: Deploy to Firebase

### Deploy Everything

```bash
firebase deploy
```

### Deploy Only Hosting (Frontend)

```bash
firebase deploy --only hosting
```

### Deploy Only Functions (Backend)

```bash
firebase deploy --only functions
```

---

## 🔍 Step 11: Update Frontend API URL

After deployment, update the frontend to use your Firebase Functions URL.

**frontend/src/config.ts** (create this file):

```typescript
export const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://us-central1-your-project-id.cloudfunctions.net/api'
  : 'http://localhost:5000/api';
```

Update API calls in your components to use this URL.

---

## 📱 Step 12: Access Your Deployed App

After successful deployment:

- **Frontend URL**: `https://your-project-id.web.app`
- **Functions URL**: `https://us-central1-your-project-id.cloudfunctions.net/api`

---

## 🔄 Step 13: Continuous Deployment (Optional)

### Set Up GitHub Actions

Create `.github/workflows/firebase-deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          npm install
          cd frontend && npm install
          cd ../backend && npm install
      
      - name: Build frontend
        run: cd frontend && npm run build
      
      - name: Build backend
        run: cd backend && npm run build
      
      - name: Deploy to Firebase
        uses: w9jds/firebase-action@master
        with:
          args: deploy
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

Get Firebase token:
```bash
firebase login:ci
```

Add the token to GitHub Secrets as `FIREBASE_TOKEN`.

---

## 🧪 Step 14: Test Your Deployment

1. **Test Frontend**:
   - Visit: `https://your-project-id.web.app`
   - Navigate through all pages
   - Check console for errors

2. **Test Backend API**:
   ```bash
   curl https://us-central1-your-project-id.cloudfunctions.net/api/health
   ```

3. **Test Database Connection**:
   - Try searching for materials
   - Check if data loads correctly

---

## 🐛 Troubleshooting

### Issue: Functions not deploying

**Solution:**
```bash
cd backend
npm run build
cd ..
firebase deploy --only functions --debug
```

### Issue: Frontend shows blank page

**Solution:**
1. Check browser console for errors
2. Verify `frontend/build` directory exists
3. Rebuild: `cd frontend && npm run build`

### Issue: CORS errors

**Solution:**
Update backend CORS configuration:

```typescript
app.use(cors({
  origin: [
    'https://your-project-id.web.app',
    'https://your-project-id.firebaseapp.com',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

### Issue: Environment variables not working

**Solution:**
```bash
# Check current config
firebase functions:config:get

# Set again
firebase functions:config:set mongodb.uri="your-uri"

# Redeploy
firebase deploy --only functions
```

### Issue: MongoDB connection timeout

**Solution:**
1. Check MongoDB Atlas IP whitelist
2. Add `0.0.0.0/0` to allow all IPs
3. Verify connection string is correct

---

## 💰 Cost Estimation

### Firebase Free Tier (Spark Plan)

**Hosting:**
- 10 GB storage
- 360 MB/day transfer
- Free SSL certificate

**Functions:**
- 125K invocations/month
- 40K GB-seconds compute time
- 40K CPU-seconds

**Typical Usage:**
- Small to medium traffic: **FREE**
- High traffic: ~$25-50/month

### MongoDB Atlas Free Tier

- 512 MB storage
- Shared cluster
- **FREE forever**

---

## 📊 Monitoring & Analytics

### Enable Firebase Analytics

```bash
firebase init analytics
```

### View Logs

```bash
# View function logs
firebase functions:log

# View specific function
firebase functions:log --only api
```

### Performance Monitoring

1. Go to Firebase Console
2. Navigate to Performance
3. Enable monitoring

---

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit API keys
   - Use Firebase Functions config
   - Rotate keys regularly

2. **Database Security**
   - Use MongoDB Atlas with authentication
   - Whitelist only necessary IPs
   - Enable encryption at rest

3. **CORS Configuration**
   - Restrict to your domains only
   - Don't use wildcard (*) in production

4. **Rate Limiting**
   - Already implemented in backend
   - Monitor usage in Firebase Console

---

## 🚀 Quick Deploy Commands

### First Time Deployment

```bash
# 1. Build frontend
cd frontend && npm run build && cd ..

# 2. Build backend
cd backend && npm run build && cd ..

# 3. Deploy everything
firebase deploy
```

### Update Deployment

```bash
# Frontend only
cd frontend && npm run build && cd ..
firebase deploy --only hosting

# Backend only
cd backend && npm run build && cd ..
firebase deploy --only functions

# Both
firebase deploy
```

---

## 📝 Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] All pages are accessible
- [ ] API endpoints respond
- [ ] Database connection works
- [ ] Material search functions
- [ ] AI chat works
- [ ] Advanced features accessible
- [ ] Mobile responsive
- [ ] SSL certificate active
- [ ] Analytics tracking
- [ ] Error monitoring setup

---

## 🎉 Success!

Your AI Material Selection Platform is now live on Firebase!

**Access your app:**
- Frontend: `https://your-project-id.web.app`
- API: `https://us-central1-your-project-id.cloudfunctions.net/api`

---

## 📞 Support

- **Firebase Docs**: https://firebase.google.com/docs
- **Firebase Console**: https://console.firebase.google.com
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Project Issues**: Check TROUBLESHOOTING.md

---

## 🔄 Next Steps

1. **Custom Domain**: Add your own domain in Firebase Console
2. **CI/CD**: Set up GitHub Actions for automatic deployment
3. **Monitoring**: Enable Firebase Performance Monitoring
4. **Backup**: Set up MongoDB Atlas backups
5. **Scaling**: Monitor usage and upgrade plans as needed

---

**Deployment Date**: $(date)
**Status**: ✅ Ready to Deploy
**Platform**: Firebase Hosting + Cloud Functions
**Database**: MongoDB Atlas
