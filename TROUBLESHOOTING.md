# Troubleshooting Guide - Localhost Not Working

## 🔍 Quick Diagnosis

Let's figure out what's wrong and fix it!

---

## Step 1: Make Sure You're in the Right Directory

Open PowerShell and navigate to the project folder:

```powershell
cd "C:\Users\os E18\Desktop\GenAi"
```

Verify you're in the right place:

```powershell
dir
```

You should see these folders: `backend`, `frontend`, `docs`, and files like `package.json`, `.env`

---

## Step 2: Try Starting the Application

### Method 1: Using the Startup Script

```powershell
powershell -ExecutionPolicy Bypass -File START_APP.ps1
```

### Method 2: Manual Start

```powershell
npm run dev
```

---

## Step 3: What Errors Are You Seeing?

### Error: "Cannot find module"

**Solution:**
```powershell
# Reinstall dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install --legacy-peer-deps && cd ..

# Try again
npm run dev
```

### Error: "MongoDB connection failed"

**Possible causes:**

1. **Wrong password in .env file**
   
   Open .env and check:
   ```
   MONGODB_URI=mongodb+srv://sathish23td0718_db_user:Sathish19%40@...
   ```
   
   Make sure:
   - Password is correct
   - Special characters are URL-encoded (@ becomes %40)
   - No spaces or extra characters

2. **IP not whitelisted in MongoDB Atlas**
   
   - Go to: https://cloud.mongodb.com/
   - Click "Network Access"
   - Make sure "0.0.0.0/0" is in the IP whitelist
   - Or add your current IP address

3. **Wrong connection string**
   
   - Go to MongoDB Atlas
   - Click "Connect" → "Connect your application"
   - Copy the connection string again
   - Update .env file

### Error: "Port 5000 already in use"

**Solution:**
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace 1234 with actual PID)
taskkill /PID 1234 /F

# Try again
npm run dev
```

### Error: "Port 3000 already in use"

**Solution:**
```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace 1234 with actual PID)
taskkill /PID 1234 /F

# Try again
npm run dev
```

### Error: "GEMINI_API_KEY not found"

**Solution:**
```powershell
# Edit .env file
notepad .env

# Make sure this line exists and has your key:
# GEMINI_API_KEY=AIzaSyC...your-key-here

# Save and try again
npm run dev
```

---

## Step 4: Start Backend and Frontend Separately

If `npm run dev` doesn't work, try starting them separately:

### Terminal 1 (Backend):

```powershell
cd "C:\Users\os E18\Desktop\GenAi\backend"
npm run dev
```

Wait for: `Server running on port 5000`

### Terminal 2 (Frontend):

Open a NEW PowerShell window:

```powershell
cd "C:\Users\os E18\Desktop\GenAi\frontend"
npm start
```

Wait for: `Compiled successfully!`

Then open: http://localhost:3000

---

## Step 5: Check if Services Are Running

```powershell
# Check if backend is running
curl http://localhost:5000/health

# Check if frontend is running
curl http://localhost:3000
```

---

## Step 6: View Logs for Errors

### Backend Logs:

```powershell
Get-Content backend/logs/combined.log -Tail 50
```

### Frontend Errors:

Open browser, press F12, check Console tab

---

## Common Issues and Solutions

### Issue: "npm: command not found"

**Solution:**
- Node.js not installed or not in PATH
- Restart your computer
- Reinstall Node.js from nodejs.org

### Issue: "Cannot read .env file"

**Solution:**
```powershell
# Make sure .env exists
Test-Path .env

# If not, create it
Copy-Item .env.example .env
notepad .env
```

### Issue: "Compilation failed"

**Solution:**
```powershell
# Clear cache and reinstall
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install --legacy-peer-deps
npm start
```

### Issue: "Backend starts but frontend doesn't"

**Solution:**
```powershell
# Start frontend manually
cd frontend
npm start
```

### Issue: "Frontend starts but shows blank page"

**Solution:**
1. Check browser console (F12)
2. Make sure backend is running on port 5000
3. Check CORS settings

### Issue: "Database seeding fails"

**Solution:**
- This is OK! The app will still work
- Database will be empty initially
- You can add materials manually through the UI

---

## Step 7: Nuclear Option - Complete Reset

If nothing works, try this:

```powershell
# 1. Stop all Node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Delete all node_modules
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force backend/node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force frontend/node_modules -ErrorAction SilentlyContinue

# 3. Clear npm cache
npm cache clean --force

# 4. Reinstall everything
npm install
cd backend && npm install && cd ..
cd frontend && npm install --legacy-peer-deps && cd ..

# 5. Try again
npm run dev
```

---

## Step 8: Manual Testing

### Test Backend Only:

```powershell
cd backend
npm run dev
```

Open browser: http://localhost:5000/health

Should see: `{"status":"OK","timestamp":"..."}`

### Test Frontend Only:

```powershell
cd frontend
npm start
```

Open browser: http://localhost:3000

Should see the React app (even if it can't connect to backend)

---

## Step 9: Check System Requirements

```powershell
# Check Node version (should be 18+)
node --version

# Check npm version
npm --version

# Check if ports are available
netstat -ano | findstr ":3000 :5000"
```

---

## Step 10: Get Help

If you're still stuck, provide these details:

1. **What command did you run?**
   ```
   npm run dev
   ```

2. **What error message did you see?**
   ```
   Copy the exact error message here
   ```

3. **What's in your .env file?** (hide passwords)
   ```
   GEMINI_API_KEY=AIza... (first 10 characters)
   MONGODB_URI=mongodb+srv://user:***@...
   ```

4. **Are the ports free?**
   ```powershell
   netstat -ano | findstr ":3000 :5000"
   ```

5. **Node version:**
   ```powershell
   node --version
   ```

---

## Quick Reference Commands

```powershell
# Start application
cd "C:\Users\os E18\Desktop\GenAi"
npm run dev

# Stop application
# Press Ctrl+C

# Check if running
netstat -ano | findstr ":3000 :5000"

# View backend logs
Get-Content backend/logs/combined.log -Tail 50

# Kill process on port
taskkill /PID <PID> /F

# Reinstall dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install --legacy-peer-deps && cd ..
```

---

## Success Indicators

You'll know it's working when you see:

### In PowerShell:
```
[backend] Server running on port 5000
[backend] Connected to MongoDB
[frontend] webpack compiled successfully
[frontend] Compiled successfully!
[frontend] Local: http://localhost:3000
```

### In Browser (http://localhost:3000):
- Material Selection Assistant Dashboard
- Navigation menu on the left
- Statistics and charts
- No error messages

---

**Still not working?** Try starting backend and frontend separately (Step 4) - this often helps identify which part is failing!