# Complete Installation Guide - Step by Step

## 🎯 Goal
Get the GenAI Material Selection Assistant running on your computer.

## ⏱️ Time Required
Approximately 1 hour (including downloads and installations)

---

## 📋 Step 1: Install Node.js (20 minutes)

### Option A: Automatic Installation (Windows 10/11 with winget)

1. Open PowerShell as Administrator (right-click PowerShell → Run as Administrator)
2. Run this command:
   ```powershell
   powershell -ExecutionPolicy Bypass -File install-nodejs.ps1
   ```
3. Follow the prompts
4. **Restart your computer**

### Option B: Manual Installation (All Windows versions)

1. **Download Node.js:**
   - Open your browser
   - Go to: **https://nodejs.org/**
   - You'll see two big green buttons
   - Click the one that says **"LTS"** (Long Term Support)
   - Current version should be v20.x or v22.x
   - The file will be named something like: `node-v20.10.0-x64.msi`

2. **Install Node.js:**
   - Find the downloaded file (usually in Downloads folder)
   - Double-click to run the installer
   - Click "Next" on the welcome screen
   - Accept the license agreement
   - Keep the default installation location
   - **IMPORTANT**: Make sure "Add to PATH" is checked ✓
   - Click "Next" through remaining screens
   - Click "Install" (may ask for admin permission)
   - Wait for installation to complete (2-3 minutes)
   - Click "Finish"

3. **Restart Your Computer:**
   - This is CRITICAL - Node.js won't work until you restart
   - Save any work and restart now

4. **Verify Installation:**
   - After restart, open PowerShell
   - Type: `node --version`
   - You should see: `v20.10.0` (or similar)
   - Type: `npm --version`
   - You should see: `10.2.3` (or similar)
   - If you see version numbers, SUCCESS! ✅
   - If you see "not recognized", restart again and try

---

## 📋 Step 2: Set Up MongoDB (15 minutes)

### Option A: MongoDB Atlas (Cloud - RECOMMENDED)

This is easier and doesn't require installing anything locally.

1. **Sign Up:**
   - Go to: **https://www.mongodb.com/cloud/atlas/register**
   - Click "Sign up"
   - Use your email or Google/GitHub account
   - Verify your email

2. **Create a Free Cluster:**
   - After login, click **"Build a Database"**
   - Choose **"M0 FREE"** (don't pay anything!)
   - Select a cloud provider: **AWS** is fine
   - Select a region: Choose one close to you
   - Cluster Name: Leave as default or name it "MaterialSelection"
   - Click **"Create Cluster"**
   - Wait 3-5 minutes for cluster creation

3. **Create Database User:**
   - In left menu, click **"Database Access"**
   - Click **"Add New Database User"**
   - Authentication Method: **Password**
   - Username: `materialuser`
   - Password: Click "Autogenerate Secure Password" OR create your own
   - **IMPORTANT**: Copy and save this password somewhere safe!
   - Database User Privileges: **"Read and write to any database"**
   - Click **"Add User"**

4. **Configure Network Access:**
   - In left menu, click **"Network Access"**
   - Click **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** (for testing)
   - Click **"Confirm"**
   - Wait for status to become "Active"

5. **Get Connection String:**
   - In left menu, click **"Database"**
   - Click **"Connect"** button on your cluster
   - Choose **"Connect your application"**
   - Driver: **Node.js**
   - Version: **5.5 or later**
   - Copy the connection string
   - It looks like: `mongodb+srv://materialuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - **IMPORTANT**: Replace `<password>` with your actual password (no < > brackets)
   - Save this connection string - you'll need it soon!

### Option B: Local MongoDB (Advanced - Not Recommended)

Only choose this if you can't use MongoDB Atlas.

1. Download from: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. Install as Windows Service
4. Connection string will be: `mongodb://localhost:27017/material-selection`

---

## 📋 Step 3: Get OpenAI API Key (10 minutes)

1. **Sign Up for OpenAI:**
   - Go to: **https://platform.openai.com/signup**
   - Sign up with email or Google/Microsoft account
   - Verify your email

2. **Add Payment Method:**
   - Go to: **https://platform.openai.com/account/billing**
   - Click **"Add payment method"**
   - Enter credit card details
   - Add at least **$5 credit** (this will last a long time)
   - Note: OpenAI requires payment for API access

3. **Create API Key:**
   - Go to: **https://platform.openai.com/api-keys**
   - Click **"Create new secret key"**
   - Name: `Material Selection App`
   - Click **"Create secret key"**
   - **IMPORTANT**: Copy the key immediately (starts with `sk-`)
   - You won't be able to see it again!
   - Save it somewhere safe (Notepad, password manager, etc.)

---

## 📋 Step 4: Configure the Project (10 minutes)

1. **Open PowerShell in Project Folder:**
   - Navigate to the project folder in File Explorer
   - Hold **Shift** and **right-click** in the folder
   - Choose **"Open PowerShell window here"**

2. **Create Configuration File:**
   ```powershell
   Copy-Item .env.example .env
   ```

3. **Edit Configuration File:**
   ```powershell
   notepad .env
   ```

4. **Update the .env File:**
   
   Find these lines and update them:

   ```env
   # Replace with your actual OpenAI API key
   OPENAI_API_KEY=sk-your-actual-key-here
   
   # Replace with your MongoDB connection string
   # For Atlas (cloud):
   MONGODB_URI=mongodb+srv://materialuser:yourpassword@cluster0.xxxxx.mongodb.net/material-selection?retryWrites=true&w=majority
   
   # For local MongoDB:
   # MONGODB_URI=mongodb://localhost:27017/material-selection
   
   # Leave these as default:
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   PORT=5000
   LOG_LEVEL=info
   ```

5. **Save and Close:**
   - Press **Ctrl+S** to save
   - Close Notepad

---

## 📋 Step 5: Install Project Dependencies (10 minutes)

In PowerShell (in the project folder):

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

**Note**: This will take 5-10 minutes. You'll see lots of text scrolling - this is normal.
You may see some warnings - that's okay. Only worry about errors.

---

## 📋 Step 6: Seed the Database (2 minutes)

```powershell
cd backend
npm run seed
cd ..
```

**Expected Output:**
```
Connected to MongoDB
Cleared existing materials
Inserted 5 sample materials
Inserted 11 additional materials
Database seeded successfully with 16 total materials
Disconnected from MongoDB
```

If you see this, great! ✅

---

## 📋 Step 7: Start the Application (2 minutes)

```powershell
npm run dev
```

**Expected Output:**
```
> genai-material-selection-assistant@1.0.0 dev
> concurrently "npm run dev:backend" "npm run dev:frontend"

[backend] Server running on port 5000
[frontend] webpack compiled successfully
[frontend] Compiled successfully!
[frontend] 
[frontend] You can now view material-selection-frontend in the browser.
[frontend] 
[frontend]   Local:            http://localhost:3000
```

**Keep this PowerShell window open!** Don't close it.

---

## 📋 Step 8: Access the Application

1. **Open Your Browser:**
   - Chrome, Firefox, Edge, or Safari
   - Go to: **http://localhost:3000**

2. **You Should See:**
   - The Material Selection Assistant dashboard
   - Statistics and charts
   - Navigation menu on the left
   - Quick action buttons

3. **If It Works:**
   - 🎉 **Congratulations!** You've successfully installed and run the application!

---

## 🎓 What to Do Next

### Explore the Features:

1. **Dashboard** (http://localhost:3000)
   - Overview of materials and statistics
   - Quick action buttons

2. **Material Search** (click in sidebar)
   - Try searching for "stainless steel"
   - Apply filters
   - Click on a material to see details

3. **AI Assistant** (click in sidebar)
   - Try asking: "Find corrosion-resistant materials for offshore platforms"
   - See AI recommendations with reasoning

4. **Standards** (click in sidebar)
   - Browse ASTM, ISO, DIN standards
   - Search for specific standards

5. **Sustainability** (click in sidebar)
   - View environmental impact metrics
   - Check recyclability statistics

6. **Comparison** (click in sidebar)
   - Select 2-3 materials
   - Compare properties side-by-side

---

## 🆘 Troubleshooting

### Problem: "node is not recognized"
**Solution:**
1. Node.js not installed or not in PATH
2. Install Node.js from nodejs.org
3. **Restart your computer** (critical!)
4. Open a NEW PowerShell window
5. Try again

### Problem: "Cannot connect to MongoDB"
**Solution:**
1. Check your connection string in .env
2. Make sure you replaced `<password>` with actual password
3. Verify IP whitelist in MongoDB Atlas (Network Access)
4. Check username and password are correct
5. Try connecting with MongoDB Compass to test

### Problem: "OpenAI API error"
**Solution:**
1. Verify API key in .env (should start with `sk-`)
2. Check for extra spaces or quotes around the key
3. Verify you have credits: https://platform.openai.com/usage
4. Make sure billing is set up

### Problem: "Port 5000 already in use"
**Solution:**
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace 1234 with actual PID)
taskkill /PID 1234 /F
```

### Problem: "npm install" fails
**Solution:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force backend/node_modules
Remove-Item -Recurse -Force frontend/node_modules

# Try again
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### Problem: Frontend won't start
**Solution:**
```powershell
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install
npm start
```

---

## ✅ Success Checklist

You're successful when:

- [ ] Node.js is installed (run `node --version`)
- [ ] MongoDB is set up (Atlas or local)
- [ ] OpenAI API key is obtained
- [ ] .env file is created and configured
- [ ] Dependencies are installed (node_modules folders exist)
- [ ] Database is seeded (ran `npm run seed`)
- [ ] Application starts without errors
- [ ] http://localhost:3000 shows the dashboard
- [ ] Material search returns results
- [ ] AI assistant responds to queries

---

## 💡 Tips

1. **Use MongoDB Atlas** - Much easier than local installation
2. **Start with $5 OpenAI credit** - Enough for extensive testing
3. **Keep PowerShell window open** - Don't close it while app is running
4. **Check logs** - `backend/logs/combined.log` for backend errors
5. **Browser console** - Press F12 to see frontend errors
6. **Restart if stuck** - Close PowerShell, restart, run `npm run dev` again

---

## 📞 Need More Help?

- Check error messages carefully - they usually tell you what's wrong
- Review logs: `backend/logs/combined.log`
- Check browser console (F12)
- Verify all environment variables in .env
- Make sure all prerequisites are installed

---

## 🎉 You Did It!

Once you see the dashboard at http://localhost:3000, you've successfully installed and run the GenAI Material Selection Assistant!

Enjoy exploring the platform and discovering how AI can revolutionize material selection! 🚀