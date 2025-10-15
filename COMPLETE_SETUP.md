# Complete Your Setup - Final Steps

## ✅ What's Already Done

- ✅ Node.js v22.20.0 installed
- ✅ npm v10.9.3 installed
- ✅ .env file created
- ✅ MongoDB connection string added

## 🎯 What You Need to Do Now

### Step 1: Replace MongoDB Password (1 minute)

Your MongoDB connection string is already in the .env file, but you need to replace `<db_password>` with your actual password.

1. Open the .env file:
   ```powershell
   notepad .env
   ```

2. Find this line:
   ```
   MONGODB_URI=mongodb+srv://sathish23td0718_db_user:<db_password>@rockfallpredictionsyste.fsd5xqu.mongodb.net/material-selection?retryWrites=true&w=majority&appName=rockfallpredictionsystem
   ```

3. Replace `<db_password>` with your actual MongoDB password (remove the `<>` brackets)
   ```
   MONGODB_URI=mongodb+srv://sathish23td0718_db_user:YourActualPassword@rockfallpredictionsyste.fsd5xqu.mongodb.net/material-selection?retryWrites=true&w=majority&appName=rockfallpredictionsystem
   ```

4. Save and close (Ctrl+S)

### Step 2: Get FREE Gemini API Key (5 minutes)

1. **Open your browser and go to:**
   ```
   https://makersuite.google.com/app/apikey
   ```
   Or: https://aistudio.google.com/app/apikey

2. **Sign in with your Google account** (Gmail)

3. **Click "Create API Key"** or "Get API Key"

4. **Choose "Create API key in new project"**

5. **Copy the API key** (starts with `AIza`)

6. **Add it to .env file:**
   ```powershell
   notepad .env
   ```
   
   Find this line:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   Replace with your actual key:
   ```
   GEMINI_API_KEY=AIzaSyC...your-actual-key-here
   ```

7. **Save and close** (Ctrl+S)

### Step 3: Install Dependencies (10 minutes)

Run these commands in PowerShell:

```powershell
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

**Note:** This will take 5-10 minutes. You'll see lots of text - that's normal!

### Step 4: Seed the Database (2 minutes)

```powershell
cd backend
npm run seed
cd ..
```

**Expected output:**
```
Connected to MongoDB
Cleared existing materials
Inserted 5 sample materials
Inserted 11 additional materials
Database seeded successfully with 16 total materials
```

### Step 5: Start the Application

```powershell
npm run dev
```

**Keep this PowerShell window open!**

### Step 6: Open the Application

Open your browser and go to:
```
http://localhost:3000
```

You should see the Material Selection Assistant dashboard! 🎉

---

## 🆘 Quick Troubleshooting

### MongoDB Connection Error

**Check:**
- Did you replace `<db_password>` with your actual password?
- No `<>` brackets around the password
- Password doesn't contain special characters that need encoding

**If password has special characters:**
- Use URL encoding: https://www.urlencoder.org/
- Example: `p@ssw0rd` becomes `p%40ssw0rd`

### Gemini API Error

**Check:**
- API key starts with `AIza`
- No extra spaces in .env file
- Restart the app after changing .env

### Dependencies Installation Error

**Solution:**
```powershell
npm cache clean --force
npm install
```

---

## 📋 Complete Command Sequence

Here's everything in order:

```powershell
# 1. Edit .env and add your MongoDB password and Gemini API key
notepad .env

# 2. Install dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 3. Seed database
cd backend && npm run seed && cd ..

# 4. Start application
npm run dev

# 5. Open browser to http://localhost:3000
```

---

## 🎓 What to Try First

Once the app is running, try these:

1. **Dashboard** - See overview and statistics
2. **Material Search** - Search for "stainless steel"
3. **AI Assistant** - Ask: "Find materials for offshore platforms"
4. **Standards** - Browse ASTM, ISO standards
5. **Sustainability** - View environmental metrics
6. **Comparison** - Compare multiple materials

---

## 💡 Pro Tips

1. **Gemini is FREE** - No credit card needed!
2. **Keep PowerShell open** - Don't close it while app runs
3. **Check logs** - `backend/logs/combined.log` for errors
4. **Browser console** - Press F12 to see frontend errors

---

## ✨ You're Almost There!

Just need to:
1. ✅ Replace MongoDB password in .env
2. ✅ Get FREE Gemini API key
3. ✅ Run the commands above

**Total time: ~20 minutes**

Let's do this! 🚀