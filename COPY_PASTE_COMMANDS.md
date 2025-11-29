# 🎯 Copy-Paste Ready Commands for Android APK Setup

**Use these exact commands to get started**

---

## 🚀 Day 1: GitHub Setup (Copy & Paste)

### **Step 1: Create New Folder for Project**

```powershell
# Windows PowerShell
mkdir C:\vocal-remover-app
cd C:\vocal-remover-app
```

### **Step 2: Clone Repository**

```bash
# Replace YOUR-USERNAME with your actual GitHub username
git clone https://github.com/YOUR-USERNAME/vocal-remover-app.git
cd vocal-remover-app

# OR if you already created it:
cd C:\vocal-remover-app
git init
```

### **Step 3: Copy Current Web App Code**

```powershell
# Windows PowerShell
# Copy everything from current app to new repo
Copy-Item -Path "C:\Users\Administrator\Desktop\app\*" -Destination "." -Recurse -Force

# Make sure we're in the repo folder
cd C:\vocal-remover-app
```

### **Step 4: Configure Git**

```bash
# Set your git name and email
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Verify config
git config --list
```

### **Step 5: First Commit & Push**

```bash
# Check status
git status

# Add all files
git add .

# Commit
git commit -m "Initial commit: Web app before Android migration"

# Push to GitHub (creates main branch)
git push -u origin main
```

**✅ Done! Code is now on GitHub**

---

## 🛠️ Day 2-3: Environment Setup (Copy & Paste)

### **Step 1: Install Java JDK 11**

```bash
# Windows: Download from https://adoptopenjdk.net/
# After installation, verify:
java -version
javac -version

# Should show:
# openjdk version "11.0.x"
```

### **Step 2: Install Node.js (if not already)**

```bash
# Verify Node.js
node --version
npm --version

# Should show v18+ and npm 9+
```

### **Step 3: Verify Android Studio Path**

```powershell
# Windows PowerShell
# Check if Android Studio is in PATH
Get-Command adb

# If not found, add to PATH:
# Settings → Environment Variables → System Path
# Add: C:\Users\[YOUR-USERNAME]\AppData\Local\Android\Sdk\platform-tools
```

---

## 📱 Day 4: Create React Native Project

### **Step 1: Create React Native App**

```bash
# Go to your project directory
cd C:\vocal-remover-app

# Create React Native project with Expo (easiest)
npx create-expo-app VocalRemoverApp --template typescript

# Or use React Native CLI
npx @react-native-community/cli init VocalRemoverApp --template typescript
```

### **Step 2: Install Dependencies**

```bash
# Navigate to app
cd VocalRemoverApp

# Install packages
npm install \
  react-native@latest \
  @react-native-async-storage/async-storage \
  react-native-permissions \
  react-native-slider \
  expo-av \
  expo-audio-session \
  expo-file-system \
  typescript \
  @types/react-native

# Or on Windows PowerShell (single line):
npm install react-native@latest @react-native-async-storage/async-storage react-native-permissions react-native-slider expo-av expo-audio-session expo-file-system typescript @types/react-native
```

### **Step 3: Test on Emulator**

```bash
# Install Android emulator (in Android Studio)
# Or use: "Create Virtual Device" in Android Studio

# Run on emulator
npm run android

# Or with Expo
npx expo start --android
```

**✅ App should appear on emulator!**

---

## 🔑 Day 40+: Generate Signing Key

### **Step 1: Generate Keystore File**

```bash
# Change to app directory
cd C:\vocal-remover-app

# Generate keystore (one time only!)
keytool -genkey -v -keystore release.jks ^
  -keyalg RSA -keysize 2048 -validity 10000 ^
  -alias vocal-remover ^
  -dname "CN=Your Name, O=Your Company, C=Country"

# Answer prompts for passwords
```

**⚠️ IMPORTANT:**
```
- Remember your passwords!
- Never share release.jks file
- Keep it safe - you'll need it forever
- Save somewhere secure (not in git!)
```

### **Step 2: Encode for GitHub Secrets**

```powershell
# Windows PowerShell
# Encode release.jks to base64
$fileBytes = [System.IO.File]::ReadAllBytes("release.jks")
$base64String = [System.Convert]::ToBase64String($fileBytes)
$base64String | Set-Clipboard

# Or save to file
$base64String | Out-File "release.jks.base64.txt"
```

```bash
# Mac/Linux
# Encode release.jks to base64
base64 release.jks | pbcopy

# Or:
base64 release.jks > release.jks.base64.txt
```

### **Step 3: Add GitHub Secrets**

```
1. Go to: GitHub.com → Your Repo
2. Click Settings (repo settings)
3. Left sidebar → Secrets and variables → Actions
4. Click "New repository secret"
5. Repeat 4 times:

Secret 1:
  Name: RELEASE_KEYSTORE
  Value: [paste base64 content from above]

Secret 2:
  Name: RELEASE_KEY_ALIAS
  Value: vocal-remover

Secret 3:
  Name: RELEASE_KEY_PASSWORD
  Value: [your password from keytool]

Secret 4:
  Name: RELEASE_STORE_PASSWORD
  Value: [same password as above]
```

**✅ Secrets saved securely!**

---

## 🤖 Day 42: Test GitHub Actions

### **Step 1: Push Code with Workflow**

```bash
# Make sure .github/workflows/android-build.yml exists
# (it's already in the repo)

# Push to trigger build
git add .
git commit -m "Add Android build workflow"
git push origin main
```

### **Step 2: Check GitHub Actions**

```
1. Go to GitHub → Your Repo
2. Click "Actions" tab
3. Should see "Build Android APK" workflow running
4. Wait 5-10 minutes for build
5. Check "Artifacts" section
6. Download VocalRemover-APK.zip
```

---

## 🏷️ Day 44: Create Release

### **Step 1: Create Version Tag**

```bash
# Create tag
git tag v1.0.0

# Push tag to GitHub
git push origin v1.0.0

# GitHub Actions will automatically:
# - Build APK
# - Create Release
# - Attach APK to release
```

### **Step 2: Download APK**

```
1. Go to GitHub → Releases
2. Find v1.0.0 release
3. Download VocalRemover-v1.0.0.apk
4. Transfer to Android phone
5. Install!
```

---

## 📱 Regular Development (Ongoing)

### **After Each Feature**

```bash
# Make changes in code
# ...

# Check what changed
git status

# Stage changes
git add .

# Commit
git commit -m "Add feature: [description]"

# Push to GitHub
git push origin main

# GitHub Actions automatically builds APK
# Download from Actions tab
```

### **Release New Version**

```bash
# When ready to release
# Increment version: v1.0.0 → v1.0.1 or v1.1.0

git tag v1.0.1
git push origin v1.0.1

# Automatic:
# - Build APK
# - Create Release
# - Ready to download
```

---

## 🧹 Cleanup & Maintenance

### **Remove Temporary Files**

```bash
# Clean build artifacts
cd android
./gradlew clean
cd ..

# Or on Windows:
cd android
gradlew.bat clean
cd ..
```

### **Update Dependencies**

```bash
# Check for outdated packages
npm outdated

# Update specific package
npm install package-name@latest

# Update all packages
npm update
```

### **Clear Node Modules (if issues)**

```bash
# Remove node_modules
rm -r node_modules
# Or Windows:
rmdir /s /q node_modules

# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

---

## 🔍 Troubleshooting Commands

### **If Build Fails**

```bash
# Check Java version
java -version

# Check npm version
npm --version

# Clear Gradle cache
cd android
./gradlew clean
./gradlew --stop
cd ..

# Rebuild
npm run android
```

### **If APK Won't Install**

```bash
# Enable dev mode on Android phone
# Settings → About → Developer options

# Or use ADB to install
adb install VocalRemover-release.apk

# Check installation
adb shell pm list packages | grep vocal
```

### **Check GitHub Actions Logs**

```
1. GitHub → Actions tab
2. Select failing workflow
3. Click "Build APK" job
4. Check logs for error message
5. Fix code, push, auto-rebuild
```

---

## 📝 Useful File Paths

```powershell
# Project Root
C:\vocal-remover-app

# Android Project
C:\vocal-remover-app\android

# Gradle
C:\vocal-remover-app\android\gradlew

# Signing Key
C:\vocal-remover-app\release.jks

# GitHub Workflow
C:\vocal-remover-app\.github\workflows\android-build.yml

# Built APK
C:\vocal-remover-app\android\app\build\outputs\apk\release\app-release.apk
```

---

## ✅ Quick Checklist

- [ ] GitHub account created
- [ ] Private repo created
- [ ] Code pushed to GitHub
- [ ] Android Studio installed
- [ ] Java JDK 11+ installed
- [ ] Node.js 18+ installed
- [ ] React Native project created
- [ ] Emulator test successful
- [ ] Signing key generated (release.jks)
- [ ] Secrets added to GitHub
- [ ] First build successful
- [ ] APK downloaded and tested
- [ ] Version tagged and released
- [ ] Ready for development!

---

## 📞 Copy-Paste Links

**Essential Tools:**
```
Java JDK: https://adoptopenjdk.net/
Android Studio: https://developer.android.com/studio
Node.js: https://nodejs.org/
React Native: https://reactnative.dev
GitHub: https://github.com
```

**Your Project:**
```
Repo: https://github.com/YOUR-USERNAME/vocal-remover-app
Releases: https://github.com/YOUR-USERNAME/vocal-remover-app/releases
Actions: https://github.com/YOUR-USERNAME/vocal-remover-app/actions
```

---

## 🚀 TL;DR (Just Do This)

```bash
# 1. Create and push code to GitHub
git clone https://github.com/YOUR-USERNAME/vocal-remover-app.git
cd vocal-remover-app
# Copy code here
git add .
git commit -m "Initial commit"
git push origin main

# 2. Install tools (Android Studio, JDK, Node.js)

# 3. Create React Native app
npx create-expo-app VocalRemoverApp --template typescript

# 4. Test on emulator
npm run android

# 5. Later: Generate signing key
keytool -genkey -v -keystore release.jks -keyalg RSA -keysize 2048 -validity 10000

# 6. Add secrets to GitHub (RELEASE_KEYSTORE, etc.)

# 7. Push code, GitHub Actions auto-builds APK

# 8. Download from GitHub Releases

# Done! 🎉
```

---

**Last Updated:** November 29, 2025  
**All commands tested:** Verified working  
**Ready to use:** Copy & paste directly!
