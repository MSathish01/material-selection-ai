# Quick Start Guide

## Prerequisites

Before you begin, you need to install:

1. **Node.js** (v18 or later)
   - Download from: https://nodejs.org/
   - Choose the LTS (Long Term Support) version
   - During installation, make sure "Add to PATH" is checked

2. **MongoDB** (Choose one option):
   
   **Option A: MongoDB Atlas (Recommended - No installation needed)**
   - Sign up at: https://www.mongodb.com/cloud/atlas/register
   - Create a free cluster (M0)
   - Get your connection string
   
   **Option B: Local MongoDB**
   - Download from: https://www.mongodb.com/try/download/community
   - Install and run as a service

3. **OpenAI API Key**
   - Sign up at: https://platform.openai.com/signup
   - Get API key from: https://platform.openai.com/api-keys

## Installation Steps

### Step 1: Verify Node.js Installation

Open PowerShell and run:
```powershell
node --version
npm --version
```

You should see version numbers. If not, restart your computer after installing Node.js.

### Step 2: Configure Environment

1. Copy the environment template:
```powershell
Copy-Item .env.example .env
```

2. Open `.env` file in a text editor and update:
```env
OPENAI_API_KEY=your-actual-api-key-here
MONGODB_URI=your-mongodb-connection-string
```

### Step 3: Run the Startup Script

```powershell
powershell -ExecutionPolicy Bypass -File start.ps1
```

Or manually:

```powershell
# Install dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Seed database
cd backend && npm run seed && cd ..

# Start application
npm run dev
```

### Step 4: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## Troubleshooting

### "node is not recognized"
- Node.js is not installed or not in PATH
- Install Node.js from nodejs.org
- Restart PowerShell after installation

### "Cannot connect to MongoDB"
- Check your MONGODB_URI in .env file
- For Atlas: Verify IP whitelist and credentials
- For local: Ensure MongoDB service is running

### "OpenAI API error"
- Verify your API key in .env file
- Check you have credits at: https://platform.openai.com/usage
- Ensure no extra spaces in the API key

### Port already in use
```powershell
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

## What's Next?

1. **Explore the Dashboard** - Overview of materials and quick actions
2. **Try Material Search** - Find materials by properties and applications
3. **Chat with AI Assistant** - Natural language material selection
4. **Browse Standards** - Global material standards database
5. **View Sustainability** - Environmental impact analysis
6. **Compare Materials** - Side-by-side comparison

## Sample Queries to Try

In the AI Assistant chat:
- "Find corrosion-resistant materials for offshore platforms"
- "I need lightweight materials for aerospace applications"
- "Recommend sustainable materials for construction"
- "What materials work well in cryogenic conditions?"

## Features Overview

✅ **2,800+ Materials** in the database
✅ **AI-Powered Search** with natural language
✅ **Global Standards** (ASTM, ISO, DIN, EN)
✅ **Sustainability Metrics** and carbon footprint
✅ **Real-time Recommendations** during design
✅ **Multi-domain Support** (oil & gas, mining, aerospace, etc.)

## Need Help?

- Check `SETUP_GUIDE.md` for detailed instructions
- Review `docs/API.md` for API documentation
- See `docs/DEPLOYMENT.md` for production deployment

## Development

To modify the application:

- **Backend code**: `backend/src/`
- **Frontend code**: `frontend/src/`
- **Database models**: `backend/src/models/`
- **API routes**: `backend/src/routes/`

After making changes, the development server will auto-reload.

---

**Important**: Keep your OpenAI API key secure and never commit it to version control!