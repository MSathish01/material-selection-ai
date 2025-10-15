# 🚀 START HERE - GenAI Material Selection Assistant

Welcome! This guide will get you up and running in **15 minutes**.

## ⚡ Quick Overview

This is an AI-powered platform that helps engineers select the right materials for their projects. It uses artificial intelligence to analyze requirements and recommend suitable materials from a database of 2,800+ materials with global standards.

## 📋 What You Need

Before starting, you need these three things:

1. **Node.js** - JavaScript runtime (free)
2. **MongoDB** - Database (free cloud option available)
3. **OpenAI API Key** - For AI features (requires payment, ~$5 minimum)

## 🎯 Installation Steps

### Step 1: Check Prerequisites

Run this command in PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File check-prerequisites.ps1
```

This will tell you what's missing.

### Step 2: Install Missing Items

#### If Node.js is missing:
1. Go to: https://nodejs.org/
2. Download and install the LTS version
3. **Restart your computer**
4. Run Step 1 again

#### If .env file is missing:
```powershell
Copy-Item .env.example .env
```

Then edit `.env` file and add:
- Your OpenAI API key
- Your MongoDB connection string

#### If MongoDB is not set up:
**Easiest option - MongoDB Atlas (Cloud):**
1. Sign up: https://www.mongodb.com/cloud/atlas/register
2. Create free cluster (M0)
3. Create database user
4. Get connection string
5. Add to .env file

#### If OpenAI API key is missing:
1. Sign up: https://platform.openai.com/signup
2. Add payment method
3. Create API key: https://platform.openai.com/api-keys
4. Add to .env file

### Step 3: Start the Application

```powershell
powershell -ExecutionPolicy Bypass -File start.ps1
```

This will:
- Install all dependencies
- Seed the database with sample materials
- Start both frontend and backend servers

### Step 4: Open the Application

Go to: http://localhost:3000

## 📚 Documentation

- **[INSTALL.md](INSTALL.md)** - Detailed installation guide with troubleshooting
- **[QUICK_START.md](QUICK_START.md)** - Quick reference guide
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup instructions
- **[README.md](README.md)** - Project overview and features

## 🎓 First Steps After Installation

1. **Dashboard** - See overview and statistics
2. **Material Search** - Try searching for "stainless steel"
3. **AI Assistant** - Ask: "Find materials for offshore platforms"
4. **Standards** - Browse ASTM, ISO, DIN standards
5. **Sustainability** - View environmental impact metrics
6. **Comparison** - Compare multiple materials side-by-side

## 🆘 Common Issues

### "node is not recognized"
- Node.js not installed or not in PATH
- Install from nodejs.org and restart computer

### "Cannot connect to MongoDB"
- Check connection string in .env file
- For Atlas: Verify IP whitelist and credentials
- For local: Check MongoDB service is running

### "OpenAI API error"
- Verify API key in .env (starts with sk-)
- Check you have credits at platform.openai.com/usage
- Remove any extra spaces around the key

### "Port already in use"
```powershell
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

## 💡 Tips

1. **Use MongoDB Atlas** - Easier than local installation
2. **Start with $5 OpenAI credit** - Enough for testing
3. **Check logs** - `backend/logs/combined.log` for errors
4. **Browser console** - Press F12 to see frontend errors
5. **Restart services** - If something breaks, restart with `npm run dev`

## 🎯 What This Application Does

### For Engineers:
- Find materials based on requirements (strength, temperature, corrosion resistance)
- Get AI-powered recommendations with explanations
- Check compliance with global standards (ASTM, ISO, DIN, EN)
- Analyze environmental impact and sustainability
- Compare materials side-by-side
- Simulate material behavior under different conditions

### Key Features:
- **2,800+ materials** in database
- **AI-powered search** with natural language
- **Global standards** integration
- **Sustainability metrics** and carbon footprint
- **Real-time recommendations**
- **Multi-domain support** (oil & gas, mining, aerospace, etc.)

### Performance Benefits:
- **20-30% faster** material selection
- **Automated compliance** checking
- **Sustainable choices** prioritized
- **Expert reasoning** for every recommendation

## 📞 Need Help?

1. **Check documentation** - See links above
2. **Review error messages** - They usually tell you what's wrong
3. **Check logs** - `backend/logs/combined.log`
4. **Browser console** - Press F12 in browser
5. **Verify prerequisites** - Run check-prerequisites.ps1

## 🚀 Ready to Start?

1. Make sure you have Node.js, MongoDB, and OpenAI API key
2. Run: `powershell -ExecutionPolicy Bypass -File check-prerequisites.ps1`
3. Fix any missing items
4. Run: `powershell -ExecutionPolicy Bypass -File start.ps1`
5. Open: http://localhost:3000

## 📊 System Requirements

- **OS**: Windows 10/11, macOS, or Linux
- **RAM**: 4GB minimum (8GB recommended)
- **Disk**: 2GB free space
- **Internet**: Required for AI features
- **Browser**: Chrome, Firefox, Safari, or Edge (latest)

---

## ✅ Quick Checklist

Before running the application:

- [ ] Node.js installed (v18+)
- [ ] MongoDB set up (Atlas or local)
- [ ] OpenAI API key obtained
- [ ] .env file created and configured
- [ ] Dependencies installed
- [ ] Database seeded
- [ ] Ports 3000 and 5000 available

---

**Ready? Let's go!** 🚀

Run this command to start:
```powershell
powershell -ExecutionPolicy Bypass -File start.ps1
```

Then open: http://localhost:3000

Enjoy exploring the GenAI Material Selection Assistant!