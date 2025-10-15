# Complete Setup Guide for GenAI Material Selection Assistant

## Prerequisites Installation

### Step 1: Install Node.js

1. **Download Node.js:**
   - Visit: https://nodejs.org/
   - Download the LTS version (v20.x or later)
   - Run the installer and follow the installation wizard
   - Make sure to check "Add to PATH" during installation

2. **Verify Installation:**
   Open a new PowerShell window and run:
   ```powershell
   node --version
   npm --version
   ```
   You should see version numbers (e.g., v20.10.0 and 10.2.3)

### Step 2: Install MongoDB

**Option A: MongoDB Community Server (Local)**

1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a Service
5. Install MongoDB Compass (GUI tool)

**Option B: MongoDB Atlas (Cloud - Recommended for Quick Start)**

1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free cluster (M0)
4. Create a database user
5. Whitelist your IP address (or use 0.0.0.0/0 for testing)
6. Get your connection string

### Step 3: Get OpenAI API Key

1. Visit: https://platform.openai.com/signup
2. Create an account or sign in
3. Go to: https://platform.openai.com/api-keys
4. Create a new API key
5. Copy and save it securely

## Project Setup

### Step 1: Configure Environment Variables

1. **Copy the example environment file:**
   ```powershell
   Copy-Item .env.example .env
   ```

2. **Edit the .env file:**
   Open `.env` in a text editor and update:
   ```env
   # Required: Add your OpenAI API key
   OPENAI_API_KEY=sk-your-actual-api-key-here

   # If using MongoDB Atlas, update this:
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/material-selection?retryWrites=true&w=majority

   # If using local MongoDB, use:
   MONGODB_URI=mongodb://localhost:27017/material-selection

   # Other settings
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

### Step 2: Install Dependencies

Open PowerShell in the project directory and run:

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

### Step 3: Seed the Database

```powershell
cd backend
npm run seed
cd ..
```

This will populate the database with sample materials.

### Step 4: Start the Application

**Option A: Start Both Services Together**
```powershell
npm run dev
```

**Option B: Start Services Separately**

In one PowerShell window (Backend):
```powershell
cd backend
npm run dev
```

In another PowerShell window (Frontend):
```powershell
cd frontend
npm start
```

### Step 5: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## Troubleshooting

### Issue: "Cannot find module" errors

**Solution:**
```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force backend/node_modules
Remove-Item -Recurse -Force frontend/node_modules
npm run install:all
```

### Issue: MongoDB connection failed

**Solution:**
1. Check if MongoDB is running:
   ```powershell
   # For local MongoDB
   Get-Service MongoDB
   ```
2. Verify connection string in `.env`
3. Check firewall settings
4. For Atlas: Verify IP whitelist and credentials

### Issue: Port already in use

**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change the port in backend/.env
PORT=5001
```

### Issue: OpenAI API errors

**Solution:**
1. Verify API key is correct in `.env`
2. Check API key has credits: https://platform.openai.com/usage
3. Ensure no extra spaces in the API key

### Issue: Frontend won't start

**Solution:**
```powershell
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm start
```

## Quick Start (Minimal Setup)

If you want to get started quickly without OpenAI:

1. **Install Node.js** (see Step 1 above)

2. **Use MongoDB Atlas** (free cloud database):
   - Sign up at mongodb.com/cloud/atlas
   - Create free cluster
   - Get connection string

3. **Skip OpenAI** (optional features will be disabled):
   ```env
   OPENAI_API_KEY=sk-dummy-key-for-testing
   MONGODB_URI=your-atlas-connection-string
   ```

4. **Install and run:**
   ```powershell
   npm install
   cd backend && npm install && cd ..
   cd frontend && npm install && cd ..
   cd backend && npm run seed && cd ..
   npm run dev
   ```

## Development Tips

### Useful Commands

```powershell
# Check if services are running
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# View backend logs
cd backend
Get-Content logs/combined.log -Tail 50 -Wait

# Clear all data and reseed
cd backend
npm run seed
cd ..

# Build for production
npm run build

# Run tests
npm test
```

### VS Code Extensions (Recommended)

- ESLint
- Prettier
- MongoDB for VS Code
- REST Client
- Docker (if using Docker)

## Alternative: Docker Setup (If Docker is Installed)

If you have Docker Desktop installed:

```powershell
# Start all services
docker-compose up -d

# Seed database
docker-compose exec backend npm run seed

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Next Steps

1. **Explore the Application:**
   - Dashboard: Overview and quick actions
   - Material Search: Find and filter materials
   - AI Assistant: Chat interface for material selection
   - Standards: Browse global material standards
   - Sustainability: Environmental impact analysis
   - Comparison: Compare multiple materials

2. **Test API Endpoints:**
   - Use Postman or REST Client
   - See `docs/API.md` for endpoint documentation

3. **Customize:**
   - Add more materials to the database
   - Modify UI components in `frontend/src/`
   - Extend API endpoints in `backend/src/routes/`

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review logs in `backend/logs/`
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

## Production Deployment

See `docs/DEPLOYMENT.md` for detailed production deployment instructions.

---

**Important Notes:**
- Keep your OpenAI API key secure and never commit it to version control
- Use MongoDB Atlas for easier setup (no local installation needed)
- The application requires an active internet connection for AI features
- Sample data includes 5 detailed materials and additional generated materials