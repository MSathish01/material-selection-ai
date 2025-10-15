# How to Get Google Gemini API Key (FREE!)

## 🎉 Good News: Gemini API is FREE!

Google's Gemini API has a generous free tier that's perfect for this application. No credit card required!

---

## 📋 Step-by-Step Guide (5 minutes)

### Step 1: Go to Google AI Studio

Open your browser and go to:
**https://makersuite.google.com/app/apikey**

Or:
**https://aistudio.google.com/app/apikey**

### Step 2: Sign In

- Click "Sign in" or "Get API Key"
- Use your Google account (Gmail)
- If you don't have one, create a free Google account

### Step 3: Create API Key

1. You'll see the Google AI Studio page
2. Click **"Get API Key"** or **"Create API Key"**
3. Choose **"Create API key in new project"** (recommended)
   - Or select an existing Google Cloud project if you have one
4. Click **"Create API Key"**

### Step 4: Copy Your API Key

1. Your API key will be displayed
2. It looks like: `AIzaSyC...` (starts with AIza)
3. Click the **Copy** button
4. **Save it somewhere safe!** (Notepad, password manager, etc.)

### Step 5: Configure the Application

1. Open PowerShell in your project folder
2. Edit the .env file:
   ```powershell
   notepad .env
   ```

3. Find this line:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Replace `your_gemini_api_key_here` with your actual API key:
   ```
   GEMINI_API_KEY=AIzaSyC...your-actual-key-here
   ```

5. Save and close (Ctrl+S)

---

## ✅ That's It!

You now have a FREE AI API key that works with this application!

---

## 🆚 Gemini vs OpenAI

| Feature | Google Gemini | OpenAI |
|---------|---------------|--------|
| **Cost** | FREE (generous limits) | $5 minimum |
| **Free Tier** | 60 requests/minute | None |
| **Quality** | Excellent | Excellent |
| **Setup** | 5 minutes | 10 minutes + payment |
| **Best For** | Testing & Development | Production |

---

## 📊 Gemini Free Tier Limits

- **60 requests per minute**
- **1,500 requests per day**
- **1 million tokens per month**

This is MORE than enough for testing and even moderate production use!

---

## 🔄 Switching Between Gemini and OpenAI

The application automatically detects which API key you have:

1. **If you have GEMINI_API_KEY** → Uses Gemini (FREE)
2. **If you have OPENAI_API_KEY** → Uses OpenAI (Paid)
3. **If you have both** → Uses Gemini (FREE option preferred)

To switch:
- Just comment out one and uncomment the other in .env file
- Restart the application

---

## 🚀 Quick Start with Gemini

```powershell
# 1. Get Gemini API key from: https://makersuite.google.com/app/apikey

# 2. Edit .env file
notepad .env

# 3. Add your Gemini API key:
# GEMINI_API_KEY=AIzaSyC...your-key-here

# 4. Install dependencies (if not done already)
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 5. Seed database
cd backend && npm run seed && cd ..

# 6. Start application
npm run dev

# 7. Open browser
# http://localhost:3000
```

---

## 🆘 Troubleshooting

### Problem: "Can't access Google AI Studio"

**Solution:**
- Make sure you're signed in to a Google account
- Try this alternative link: https://aistudio.google.com/
- Clear browser cache and try again

### Problem: "API key doesn't work"

**Solution:**
1. Check the key starts with `AIza`
2. Make sure there are no extra spaces in .env file
3. Restart the application after changing .env
4. Check you copied the entire key

### Problem: "Rate limit exceeded"

**Solution:**
- Free tier: 60 requests/minute, 1,500/day
- Wait a minute and try again
- For production, consider upgrading or using OpenAI

---

## 💡 Tips

1. **Keep your API key secure** - Don't share it publicly
2. **Don't commit .env to git** - It's already in .gitignore
3. **Monitor usage** - Check Google AI Studio dashboard
4. **Test first** - Use Gemini for free testing before paying for OpenAI

---

## 📚 Additional Resources

- **Google AI Studio**: https://aistudio.google.com/
- **Gemini API Docs**: https://ai.google.dev/docs
- **Pricing**: https://ai.google.dev/pricing
- **Quickstart**: https://ai.google.dev/tutorials/get_started_web

---

## 🎓 What You Can Do with Gemini

All AI features in this application work with Gemini:

✅ Natural language material search
✅ AI-powered recommendations
✅ Material behavior simulation
✅ Requirements extraction
✅ Chat assistant
✅ Expert reasoning and explanations

---

## 🌟 Recommended Approach

1. **Start with Gemini** (FREE)
   - Get API key in 5 minutes
   - Test all features
   - No payment required

2. **Upgrade to OpenAI later** (if needed)
   - Only if you need higher rate limits
   - Or prefer OpenAI's specific capabilities
   - For production deployments

---

**You're all set!** Get your free Gemini API key and start using AI-powered material selection! 🚀