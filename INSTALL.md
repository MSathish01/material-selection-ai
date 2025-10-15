# Installation Guide

## Step-by-Step Installation

### Step 1: Install Node.js

1. **Download Node.js:**
   - Go to: https://nodejs.org/
   - Download the **LTS version** (Long Term Support)
   - Current recommended version: v20.x or later

2. **Install Node.js:**
   - Run the downloaded installer
   - Follow the installation wizard
   - **Important**: Make sure "Add to PATH" is checked
   - Accept all default settings

3. **Verify Installation:**
   - Open a **NEW** PowerShell window (important!)
   - Run these commands:
   ```powershell
   node --version
   npm --version
   ```
   - You should see version numbers like:
     ```
     v20.10.0
     10.2.3
     ```
   - If you see "command not found", restart your computer and try again

### Step 2: Get MongoDB

You have two options:

#### Option A: MongoDB Atlas (Recommended - Easiest)

1. **Sign up for MongoDB Atlas:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create a free account
   - Verify your email

2. **Create a Free Cluster:**
   - Click "Build a Database"
   - Choose "FREE" (M0 Sandbox)
   - Select a cloud provider and region (choose closest to you)
   - Click "Create Cluster"
   - Wait 3-5 minutes for cluster creation

3. **Create Database User:**
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `materialuser`
   - Password: Create a strong password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access:**
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for testing)
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://materialuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<password>` with your actual password

#### Option B: Local MongoDB (Advanced)

1. **Download MongoDB:**
   - Go to: https://www.mongodb.com/try/download/community
   - Download MongoDB Community Server
   - Choose Windows version

2. **Install MongoDB:**
   - Run the installer
   - Choose "Complete" installation
   - Install as a Windows Service
   - Install MongoDB Compass (GUI tool)

3. **Verify Installation:**
   ```powershell
   Get-Service MongoDB
   ```
   - Should show "Running" status

4. **Connection String:**
   - Use: `mongodb://localhost:27017/material-selection`

### Step 3: Get OpenAI API Key

1. **Sign up for OpenAI:**
   - Go to: https://platform.openai.com/signup
   - Create an account or sign in

2. **Add Payment Method:**
   - Go to: https://platform.openai.com/account/billing
   - Add a payment method (required for API access)
   - Add at least $5 credit

3. **Create API Key:**
   - Go to: https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Give it a name: "Material Selection App"
   - Copy the key (starts with `sk-`)
   - **Important**: Save it securely - you won't see it again!

### Step 4: Download and Setup Project

1. **Download the Project:**
   - If you have Git:
     ```powershell
     git clone <repository-url>
     cd genai-material-selection-assistant
     ```
   - Or download ZIP and extract it

2. **Open PowerShell in Project Folder:**
   - Navigate to the project folder
   - Hold Shift + Right-click in the folder
   - Choose "Open PowerShell window here"

3. **Check Prerequisites:**
   ```powershell
   powershell -ExecutionPolicy Bypass -File check-prerequisites.ps1
   ```
   - This will verify everything is installed correctly

### Step 5: Configure Environment

1. **Create .env file:**
   ```powershell
   Copy-Item .env.example .env
   ```

2. **Edit .env file:**
   - Open `.env` in Notepad or any text editor
   - Update these values:

   ```env
   # Add your OpenAI API key (starts with sk-)
   OPENAI_API_KEY=sk-your-actual-key-here

   # Add your MongoDB connection string
   # For Atlas:
   MONGODB_URI=mongodb+srv://materialuser:yourpassword@cluster0.xxxxx.mongodb.net/material-selection?retryWrites=true&w=majority
   
   # For Local MongoDB:
   # MONGODB_URI=mongodb://localhost:27017/material-selection

   # Leave these as default
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   PORT=5000
   LOG_LEVEL=info
   ```

3. **Save the file**

### Step 6: Install Dependencies

Run this command in PowerShell:

```powershell
# Install all dependencies (this may take 5-10 minutes)
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

**Note**: You may see some warnings - this is normal. Only worry about errors.

### Step 7: Seed the Database

```powershell
cd backend
npm run seed
cd ..
```

You should see:
```
Connected to MongoDB
Cleared existing materials
Inserted 5 sample materials
Inserted 11 additional materials
Database seeded successfully with 16 total materials
```

### Step 8: Start the Application

**Option A: Use the startup script (Recommended):**
```powershell
powershell -ExecutionPolicy Bypass -File start.ps1
```

**Option B: Manual start:**
```powershell
npm run dev
```

You should see:
```
Backend running on port 5000
Frontend running on port 3000
```

### Step 9: Access the Application

Open your web browser and go to:
- **Main Application**: http://localhost:3000
- **API Health Check**: http://localhost:5000/health

You should see the Material Selection Assistant dashboard!

## Troubleshooting

### Problem: "node is not recognized"

**Solution:**
1. Node.js is not installed or not in PATH
2. Install Node.js from nodejs.org
3. **Restart your computer** after installation
4. Open a NEW PowerShell window
5. Try again

### Problem: "Cannot connect to MongoDB"

**Solution for Atlas:**
1. Check your connection string in .env
2. Make sure you replaced `<password>` with actual password
3. Verify IP whitelist in MongoDB Atlas (Network Access)
4. Check username and password are correct

**Solution for Local:**
1. Check if MongoDB service is running:
   ```powershell
   Get-Service MongoDB
   ```
2. If not running, start it:
   ```powershell
   Start-Service MongoDB
   ```

### Problem: "OpenAI API error"

**Solution:**
1. Verify API key in .env file (should start with `sk-`)
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

Or change the port in `backend/.env`:
```env
PORT=5001
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

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# Reinstall
npm install

# Try starting
npm start
```

## Verification Checklist

Before running the application, verify:

- [ ] Node.js is installed (run `node --version`)
- [ ] npm is installed (run `npm --version`)
- [ ] .env file exists and has valid credentials
- [ ] MongoDB is accessible (Atlas or local)
- [ ] OpenAI API key is valid and has credits
- [ ] All dependencies are installed (node_modules folders exist)
- [ ] Database is seeded (ran `npm run seed`)
- [ ] Ports 3000 and 5000 are available

## Next Steps

Once the application is running:

1. **Explore the Dashboard** - Get an overview of the system
2. **Try Material Search** - Search for materials by properties
3. **Chat with AI** - Ask the AI assistant for recommendations
4. **Browse Standards** - Explore global material standards
5. **View Sustainability** - Check environmental impact metrics
6. **Compare Materials** - Compare multiple materials side-by-side

## Getting Help

If you're still having issues:

1. Check the error messages carefully
2. Review the troubleshooting section above
3. Check `backend/logs/combined.log` for backend errors
4. Check browser console (F12) for frontend errors
5. Make sure all prerequisites are installed correctly

## System Requirements

- **Operating System**: Windows 10/11, macOS, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 2GB free space
- **Internet**: Required for AI features and MongoDB Atlas
- **Browser**: Chrome, Firefox, Safari, or Edge (latest version)

## Security Notes

- Never commit your .env file to version control
- Keep your OpenAI API key secure
- Use strong passwords for MongoDB
- In production, use proper authentication and HTTPS

---

**Congratulations!** You've successfully installed the GenAI Material Selection Assistant. Enjoy exploring the platform!