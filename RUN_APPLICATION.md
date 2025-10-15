# 🚀 Run the Application - Final Step!

## ✅ Everything is Ready!

You've successfully:
- ✅ Installed Node.js v22.20.0
- ✅ Installed all dependencies
- ✅ Configured Gemini API key (FREE!)
- ✅ Configured MongoDB connection

## 🎯 Final Step: Start the Application

### Open a NEW PowerShell window and run:

```powershell
cd "C:\Users\os E18\Desktop\GenAi"
npm run dev
```

### What will happen:

1. **Backend server** will start on port 5000
2. **Frontend server** will start on port 3000
3. **Database** will be seeded with sample materials automatically
4. **Browser** will open automatically to http://localhost:3000

### Expected Output:

```
[backend] Server running on port 5000
[backend] Connected to MongoDB
[frontend] webpack compiled successfully
[frontend] Compiled successfully!
[frontend] You can now view material-selection-frontend in the browser.
[frontend] Local: http://localhost:3000
```

### ⚠️ Important:

- **Keep the PowerShell window open** while using the app
- **Don't close it** - this will stop the servers
- To stop the app, press **Ctrl+C** in the PowerShell window

## 🌐 Access the Application

Once it's running, open your browser and go to:

```
http://localhost:3000
```

You should see the **Material Selection Assistant Dashboard**!

## 🎓 What to Try First

1. **Dashboard** - See overview and statistics
2. **Material Search** - Search for "stainless steel"
3. **AI Assistant** - Ask: "Find materials for offshore platforms"
4. **Standards** - Browse ASTM, ISO standards
5. **Sustainability** - View environmental metrics
6. **Comparison** - Compare multiple materials

## 🆘 If You See Errors

### MongoDB Connection Error

The seed script might fail initially, but the main app should work. If you see MongoDB errors:

1. Check your .env file has the correct MongoDB URI
2. Make sure the password is URL-encoded (@ becomes %40)
3. Restart the application

### Port Already in Use

If port 5000 or 3000 is already in use:

```powershell
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Frontend Won't Start

If only the backend starts:

```powershell
# Stop the current process (Ctrl+C)
# Then start frontend separately
cd frontend
npm start
```

## 📊 System Status

```
✅ Node.js v22.20.0 - INSTALLED
✅ npm v10.9.3 - INSTALLED
✅ Root dependencies - INSTALLED (29 packages)
✅ Backend dependencies - INSTALLED (612 packages)
✅ Frontend dependencies - INSTALLED (1426 packages)
✅ Gemini API Key - CONFIGURED (FREE!)
✅ MongoDB Atlas - CONFIGURED
✅ .env file - CONFIGURED
```

## 🎉 You're All Set!

Just run this command in a NEW PowerShell window:

```powershell
cd "C:\Users\os E18\Desktop\GenAi"
npm run dev
```

Then open: **http://localhost:3000**

---

## 💡 Quick Commands Reference

```powershell
# Start application
npm run dev

# Stop application
# Press Ctrl+C in the PowerShell window

# Restart application
# Press Ctrl+C, then run npm run dev again

# Check if ports are in use
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# View backend logs
Get-Content backend/logs/combined.log -Tail 50 -Wait
```

---

**Congratulations!** 🎊

You've successfully set up the GenAI Material Selection Assistant with:
- FREE Gemini AI
- Cloud MongoDB
- Full-stack application
- 2,800+ materials database

**Enjoy exploring the platform!** 🚀