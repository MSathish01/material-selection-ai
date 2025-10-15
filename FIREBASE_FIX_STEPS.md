# 🔧 Firebase Setup - Fix Steps

## Issue 1: Backend Not Running (ECONNREFUSED)

The backend server isn't running. Let's fix this first.

### Start Backend Server

```powershell
# Open a new PowerShell terminal
cd backend
npm install
npm run dev
```

Keep this terminal open - backend should run on http://localhost:5000

### Start Frontend (in another terminal)

```powershell
# Open another PowerShell terminal
cd frontend
npm install
npm start
```

Frontend will run on http://localhost:3000

---

## Issue 2: Firebase Project ID

You're using "your-project-id" which doesn't exist. You need to create a real Firebase project.

### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project" or "Create a project"
3. Enter project name: `material-selection-ai` (or any name you want)
4. Click Continue
5. Disable Google Analytics (optional, you can enable later)
6. Click "Create project"
7. Wait for project creation
8. **COPY THE PROJECT ID** (shown in project settings)

### Step 2: Update .firebaserc

Replace the content with your actual project ID:

```json
{
  "projects": {
    "default": "material-selection-ai"
  }
}
```

Replace `material-selection-ai` with your actual project ID from Firebase Console.

### Step 3: Initialize Firebase

```powershell
firebase init
```

When prompted:
1. **Are you ready to proceed?** → Yes
2. **Which Firebase features?** → Select:
   - ☑ Hosting (use spacebar to select)
   - Press Enter
3. **Use an existing project?** → Yes
4. **Select a project** → Choose your project from the list
5. **What do you want to use as your public directory?** → `frontend/build`
6. **Configure as a single-page app?** → Yes
7. **Set up automatic builds?** → No
8. **File already exists. Overwrite?** → No

---

## Issue 3: Set Environment Variables

After creating the project, set the environment variables:

```powershell
# Replace with your actual project ID
firebase use material-selection-ai

# Set MongoDB URI
firebase functions:config:set mongodb.uri="mongodb+srv://sathish23td0718_db_user:Sathish19%40@rockfallpredictionsyste.fsd5xqu.mongodb.net/material-selection?retryWrites=true&w=majority&appName=rockfallpredictionsystem"

# Set Gemini API key (get from .env file)
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY"
```

---

## Complete Setup Steps

### 1. First, Run Locally

```powershell
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend (new terminal)
cd frontend
npm install
npm start
```

Visit http://localhost:3000 - should work now!

### 2. Create Firebase Project

- Go to https://console.firebase.google.com/
- Create new project
- Copy the project ID

### 3. Update Configuration

Edit `.firebaserc`:
```json
{
  "projects": {
    "default": "YOUR_ACTUAL_PROJECT_ID"
  }
}
```

Edit `frontend/src/config.ts`:
```typescript
const FIREBASE_FUNCTIONS_URL = 'https://us-central1-YOUR_ACTUAL_PROJECT_ID.cloudfunctions.net/api';
```

### 4. Initialize Firebase

```powershell
firebase init
```

Select your actual project from the list.

### 5. Build and Deploy

```powershell
# Build frontend
cd frontend
npm run build
cd ..

# Deploy
firebase deploy --only hosting
```

---

## Quick Commands Reference

```powershell
# Check Firebase login
firebase login

# List your projects
firebase projects:list

# Use a specific project
firebase use YOUR_PROJECT_ID

# Deploy hosting only
firebase deploy --only hosting

# View logs
firebase functions:log
```

---

## Troubleshooting

### Backend won't start?

```powershell
cd backend
npm install
# Check .env file has GEMINI_API_KEY or OPENAI_API_KEY
npm run dev
```

### Frontend shows proxy errors?

Make sure backend is running on port 5000 first!

### Firebase project not found?

1. Create project in Firebase Console first
2. Copy the exact project ID
3. Update .firebaserc with that ID
4. Run `firebase use YOUR_PROJECT_ID`

### Permission denied errors?

Your Firebase project needs to enable the required APIs:
1. Go to Firebase Console
2. Go to Project Settings
3. Enable required services

---

## What You Need Right Now

1. **Start backend**: `cd backend && npm run dev`
2. **Start frontend**: `cd frontend && npm start` (in new terminal)
3. **Create Firebase project** at https://console.firebase.google.com/
4. **Update .firebaserc** with real project ID
5. **Then deploy**: `firebase deploy --only hosting`

---

## Your MongoDB Connection String

I see you have MongoDB Atlas set up:
```
mongodb+srv://sathish23td0718_db_user:Sathish19%40@rockfallpredictionsyste.fsd5xqu.mongodb.net/material-selection
```

Make sure this is in your `backend/.env` file:
```
MONGODB_URI=mongodb+srv://sathish23td0718_db_user:Sathish19%40@rockfallpredictionsyste.fsd5xqu.mongodb.net/material-selection?retryWrites=true&w=majority&appName=rockfallpredictionsystem
```

---

## Next Steps

1. ✅ Fix local development (start backend + frontend)
2. ✅ Create real Firebase project
3. ✅ Update .firebaserc with real project ID
4. ✅ Deploy to Firebase

Let's get your local development working first!
