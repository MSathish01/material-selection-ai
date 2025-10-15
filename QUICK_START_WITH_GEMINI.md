# Quick Start with FREE Gemini API

## 🎉 Use This Application for FREE!

This guide shows you how to run the Material Selection Assistant using Google's FREE Gemini API instead of paid OpenAI.

---

## ⚡ Super Quick Setup (30 minutes total)

### 1. Get Gemini API Key (5 minutes) - FREE!

1. Go to: **https://makersuite.google.com/app/apikey**
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIza`)
5. Save it!

### 2. Get MongoDB (15 minutes) - FREE!

1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up (FREE)
3. Create FREE cluster (M0)
4. Create database user
5. Whitelist IP: "Allow Access from Anywhere"
6. Get connection string

### 3. Configure (2 minutes)

```powershell
# Edit .env file
notepad .env
```

Update these lines:
```env
GEMINI_API_KEY=AIza...your-key-here
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/material-selection
```

### 4. Install & Run (10 minutes)

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

### 5. Open Browser

Go to: **http://localhost:3000**

---

## 💰 Cost Comparison

| Service | Gemini | OpenAI |
|---------|--------|--------|
| **Setup Cost** | $0 | $5 minimum |
| **Monthly Cost** | $0 (free tier) | Pay per use |
| **Credit Card** | Not required | Required |
| **Rate Limits** | 60/min, 1500/day | Depends on plan |
| **Perfect For** | Testing, Development, Small Projects | Production, High Volume |

---

## ✅ What Works with Gemini

Everything! All features work with the free Gemini API:

- ✅ Material search with AI
- ✅ Natural language queries
- ✅ AI chat assistant
- ✅ Material recommendations
- ✅ Behavior simulation
- ✅ Requirements extraction
- ✅ Expert reasoning

---

## 🚀 Complete Commands

```powershell
# 1. Get Gemini API key
# Go to: https://makersuite.google.com/app/apikey

# 2. Get MongoDB connection string
# Go to: https://www.mongodb.com/cloud/atlas/register

# 3. Configure
notepad .env
# Add: GEMINI_API_KEY=AIza...
# Add: MONGODB_URI=mongodb+srv://...

# 4. Install
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 5. Seed
cd backend && npm run seed && cd ..

# 6. Run
npm run dev

# 7. Open http://localhost:3000
```

---

## 🎓 Try These Queries

Once the app is running, try asking the AI assistant:

1. "Find corrosion-resistant materials for offshore platforms"
2. "I need lightweight materials for aerospace applications"
3. "Recommend sustainable materials for construction"
4. "What materials work well in cryogenic conditions?"
5. "Find materials that can withstand high temperatures"

---

## 🆘 Troubleshooting

### Gemini API Error

**Check:**
- API key starts with `AIza`
- No extra spaces in .env
- Restart app after changing .env

### MongoDB Connection Error

**Check:**
- Connection string is correct
- Password doesn't have `<>` brackets
- IP is whitelisted in Atlas

### Dependencies Error

**Solution:**
```powershell
npm cache clean --force
Remove-Item -Recurse -Force node_modules
npm install
```

---

## 💡 Pro Tips

1. **Start with Gemini** - It's free and works great
2. **Monitor usage** - Check Google AI Studio dashboard
3. **Upgrade later** - Switch to OpenAI if you need higher limits
4. **Keep keys secure** - Never commit .env to git

---

## 🔄 Switching to OpenAI Later

If you want to switch to OpenAI later:

1. Get OpenAI API key
2. Edit .env:
   ```env
   # Comment out Gemini
   # GEMINI_API_KEY=AIza...
   
   # Add OpenAI
   OPENAI_API_KEY=sk-...
   ```
3. Restart the app

The application automatically detects which API to use!

---

## 📊 Gemini Free Tier Details

- **60 requests per minute**
- **1,500 requests per day**
- **1 million tokens per month**
- **No credit card required**
- **No expiration**

Perfect for:
- Testing and development
- Small to medium projects
- Learning and experimentation
- Personal use

---

## 🌟 Why Gemini?

1. **FREE** - No payment required
2. **Fast** - Quick response times
3. **Powerful** - Comparable to GPT-4
4. **Easy** - 5-minute setup
5. **Generous** - High free tier limits

---

## ✨ You're Ready!

With Gemini API, you can:
- Test all features for FREE
- Develop without costs
- Deploy small projects at no cost
- Upgrade to OpenAI only if needed

**Get started now with FREE AI!** 🚀

---

## 📚 Resources

- **Get Gemini API Key**: https://makersuite.google.com/app/apikey
- **Gemini Documentation**: https://ai.google.dev/docs
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Detailed Guide**: See GET_GEMINI_API_KEY.md

---

**Total Cost: $0** 💰
**Total Time: 30 minutes** ⏱️
**Total Awesomeness: 100%** 🎉