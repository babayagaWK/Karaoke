# 🚀 Quick Start - GitHub APK Build & Deployment

## ✅ What's Done

- ✅ React Native app created with Expo
- ✅ UI components (Controls, Visualizer)
- ✅ Code pushed to GitHub: https://github.com/babayagaWK/Karaoke
- ✅ GitHub Actions workflow ready: `.github/workflows/android-build.yml`
- ✅ Documentation created

## 🎯 Next Steps (5 minutes)

### Step 1: Create Expo Account (if you don't have one)
1. Go to https://expo.dev/signup
2. Sign up with email or GitHub account
3. Verify email

### Step 2: Create Expo Access Token
1. Log in to https://expo.dev
2. Go to Settings → Access Tokens
3. Click "Create token"
4. Name: "GitHub Build"
5. Type: "Build server"
6. Copy the token (starts with `expo_...`)

### Step 3: Add Token to GitHub Secrets
1. Go to your repo: https://github.com/babayagaWK/Karaoke
2. Click Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `EXPO_TOKEN`
5. Value: Paste your token from Step 2
6. Click "Add secret"

### Step 4: Trigger First Build
Open terminal and run:
```bash
cd C:\vocal-remover-app
git tag v1.0.0
git push origin v1.0.0
```

Or push normally to trigger build:
```bash
git add .
git commit -m "trigger build"
git push origin master
```

### Step 5: Monitor Build
1. Go to https://github.com/babayagaWK/Karaoke/actions
2. Watch the "Build Android APK" workflow
3. Wait for green checkmark (takes ~10 minutes)

### Step 6: Download APK
**If you pushed a tag (v1.0.0):**
1. Go to https://github.com/babayagaWK/Karaoke/releases
2. Click the release
3. Download the APK file

**If you pushed normally:**
1. Go to https://github.com/babayagaWK/Karaoke/actions
2. Click the successful workflow run
3. Scroll down to "Artifacts"
4. Download the APK

## 📦 APK Installation on Android

### Method 1: USB Cable (Windows)
```bash
# Enable USB Debugging on phone (Settings → Developer Options)
# Connect phone with USB

# Install APK:
adb install path\to\app-release.apk

# Launch app:
adb shell am start -n com.vocalremover/.MainActivity
```

### Method 2: Manual Installation
1. Enable "Install from Unknown Sources" (Settings → Security)
2. Copy APK to phone (email, USB, or cloud)
3. Open file manager
4. Tap the APK file
5. Follow installation prompts

### Method 3: Expo Go (Testing)
```bash
# Terminal:
cd C:\vocal-remover-app
npm start

# On phone:
# - Open Expo Go app
# - Scan QR code
# - App loads instantly
```

## 🔧 Common Commands

```bash
# View build status
git log --oneline | head -10

# Push changes and trigger build
git push origin master

# Create a release
git tag v1.0.1
git push origin v1.0.1

# Check workflow status
# Visit: https://github.com/babayagaWK/Karaoke/actions

# Pull latest changes
git pull origin master

# Stop Expo server (if running)
# Press Ctrl+C in terminal
```

## 📊 Build Status

```
GitHub: https://github.com/babayagaWK/Karaoke ✅
Workflow: .github/workflows/android-build.yml ✅
Status: Ready to build (waiting for Expo Token)
APK: Will be generated automatically after token is added
```

## ❓ FAQs

**Q: Build failed - what do I do?**
A: Check the workflow logs at https://github.com/babayagaWK/Karaoke/actions

**Q: Can I test without building APK?**
A: Yes! Use Expo Go app (instant testing, no build needed)

**Q: How long does APK build take?**
A: Usually 8-12 minutes depending on Expo servers

**Q: Can I automate version updates?**
A: Yes, but requires additional workflow setup

**Q: Is the APK ready to distribute?**
A: Yes! Works on Android 8.0+

## ⚠️ Important Notes

- Keep `EXPO_TOKEN` secret (never commit to git)
- Token allows anyone to build your app
- Regenerate token if compromised
- APK is unsigned (testing only)
  - For Play Store, need proper signing setup

## 🎉 Success Indicators

✅ Expo Token added to GitHub Secrets
✅ GitHub Actions workflow runs green
✅ APK file appears in releases/artifacts
✅ APK installs on Android device
✅ App launches without errors

## 📞 Support

- **Expo Docs**: https://docs.expo.dev
- **GitHub Issues**: https://github.com/babayagaWK/Karaoke/issues
- **Troubleshooting**: See GITHUB_SECRETS_SETUP.md

---

**Estimated time to first APK**: 15 minutes
**Complexity**: Beginner-friendly
**Next steps**: Add Expo Token → Build → Test on device
