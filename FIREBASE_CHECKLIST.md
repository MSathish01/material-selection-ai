# ✅ Firebase Deployment Checklist

## Pre-Deployment

- [ ] Node.js 18+ installed
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Logged in to Firebase (`firebase login`)
- [ ] Firebase project created in console
- [ ] MongoDB Atlas cluster created
- [ ] Gemini/OpenAI API key obtained

## Configuration

- [ ] Updated `.firebaserc` with actual project ID
- [ ] Updated `firebase.json` configuration
- [ ] Updated `frontend/src/config.ts` with Firebase Functions URL
- [ ] Set Firebase Functions environment variables:
  ```bash
  firebase functions:config:set mongodb.uri="..."
  firebase functions:config:set gemini.api_key="..."
  ```

## Build & Test Locally

- [ ] Frontend builds successfully (`cd frontend && npm run build`)
- [ ] Backend builds successfully (`cd backend && npm run build`)
- [ ] All tests pass
- [ ] Local development works

## Deployment

- [ ] Run deployment script:
  - Windows PowerShell: `powershell -ExecutionPolicy Bypass -File deploy-firebase.ps1`
  - Windows CMD: `deploy-firebase.bat`
  - Manual: `firebase deploy`

## Post-Deployment Verification

- [ ] Frontend loads at `https://your-project-id.web.app`
- [ ] Health check works: `https://us-central1-your-project-id.cloudfunctions.net/api/health`
- [ ] Material search works
- [ ] AI chat responds
- [ ] Advanced features accessible
- [ ] Mobile responsive
- [ ] No console errors

## Security

- [ ] CORS configured correctly
- [ ] Environment variables secured
- [ ] MongoDB IP whitelist configured
- [ ] Rate limiting active
- [ ] SSL certificate active (automatic with Firebase)

## Monitoring

- [ ] Firebase Analytics enabled
- [ ] Function logs accessible (`firebase functions:log`)
- [ ] Error tracking configured
- [ ] Performance monitoring enabled

## Optional Enhancements

- [ ] Custom domain added
- [ ] GitHub Actions CI/CD configured
- [ ] Backup strategy implemented
- [ ] Monitoring alerts set up

## Troubleshooting Commands

```bash
# View deployment status
firebase projects:list

# Check function logs
firebase functions:log

# View configuration
firebase functions:config:get

# Redeploy specific service
firebase deploy --only hosting
firebase deploy --only functions

# Debug deployment
firebase deploy --debug
```

## Success Criteria

✅ All pages load correctly
✅ API responds to requests
✅ Database connection works
✅ AI features functional
✅ No critical errors in logs
✅ Performance acceptable
✅ Mobile experience good

---

**Deployment Date**: _____________
**Deployed By**: _____________
**Project ID**: _____________
**Status**: ⬜ Pending | ⬜ In Progress | ⬜ Complete
