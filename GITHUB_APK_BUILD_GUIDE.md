# GitHub Actions CI/CD for APK Building

**Updated:** November 29, 2025  
**Scope:** Automated APK building on GitHub, no Play Store needed

---

## 🎯 New Plan: GitHub Auto-Build + Private APK

Instead of Play Store upload → **GitHub Releases for download**

```
Your Code Repo (GitHub)
        ↓
GitHub Actions Trigger (on push/release tag)
        ↓
Build Android APK (Gradle)
        ↓
Create GitHub Release
        ↓
APK downloadable (private, only users with access)
```

---

## 📋 Modified Roadmap

**Original PHASE 6 (Play Store):**
```
❌ REMOVED:
- Play Store account setup
- Store listing creation
- App review waiting (2-3 days)
- Play Store submission
```

**New PHASE 6 (GitHub Actions):**
```
✅ ADDED:
- GitHub Actions workflow setup (.yml)
- Auto-build on every push
- Create Release artifacts
- Download APK from GitHub Release
- Version management
```

---

## 🚀 New Simplified Timeline

| Phase | Timeline | Task |
|-------|----------|------|
| **Phase 0** | Day 1-2 | Setup environment + GitHub repo |
| **Phase 1** | Day 3-7 | React Native project |
| **Phase 2** | Day 8-17 | UI migration |
| **Phase 3** | Day 18-27 | Audio module |
| **Phase 4** | Day 28-34 | Integration |
| **Phase 5** | Day 35-41 | Testing & APK build |
| **Phase 6** | Day 42-44 | GitHub Actions setup |
| | | ✨ **READY TO DOWNLOAD!** |

**TOTAL: 6 weeks (same as before but direct APK, no store)**

---

## 🛠️ Phase 6: GitHub Actions Setup (2-3 days)

### Step 1: Create GitHub Repository

```bash
# On GitHub.com:
1. Create new private repo: "vocal-remover-app"
2. Clone to local
3. Add Android code

cd vocal-remover-app
git add .
git commit -m "Initial Android project setup"
git push origin main
```

### Step 2: Generate Signing Key (for APK)

```bash
# Generate keystore for signing APK (one time)
keytool -genkey -v -keystore release.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias vocal-remover \
  -dname "CN=Your Name, O=Your Company, C=Country"

# This creates: release.jks file (~3KB)
# IMPORTANT: Keep this file safe! It signs your APK permanently.

# Encode for GitHub Secrets (base64)
# On Windows PowerShell:
$fileBytes = [System.IO.File]::ReadAllBytes("release.jks")
$base64String = [System.Convert]::ToBase64String($fileBytes)
$base64String | Set-Clipboard

# On Mac/Linux:
base64 release.jks | pbcopy  # or xclip
```

### Step 3: Add Secrets to GitHub

```
GitHub Repo Settings → Secrets and variables → Actions

Create these secrets:
├── RELEASE_KEYSTORE (base64 encoded keystore file)
├── RELEASE_KEY_ALIAS (e.g., "vocal-remover")
├── RELEASE_KEY_PASSWORD (your password)
└── RELEASE_STORE_PASSWORD (keystore password)

Examples:
  RELEASE_KEY_ALIAS = vocal-remover
  RELEASE_KEY_PASSWORD = YourPassword123
  RELEASE_STORE_PASSWORD = YourPassword123
```

**How to add:**
```
GitHub → Settings (repo) → Secrets and variables → Actions → New repository secret

Name: RELEASE_KEYSTORE
Secret: [paste base64 content]

Then repeat for other secrets
```

### Step 4: Create GitHub Actions Workflow

Create file: `.github/workflows/android-build.yml`

```yaml
name: Android APK Build

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:  # Manual trigger

jobs:
  build:
    name: Build APK
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup JDK 11
        uses: actions/setup-java@v3
        with:
          java-version: '11'
          distribution: 'temurin'
          cache: gradle
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Setup Android SDK
        uses: android-actions/setup-android@v2
        with:
          api-levels: '34'
          build-tools-version: '34.0.0'
      
      - name: Decode signing key
        env:
          RELEASE_KEYSTORE: ${{ secrets.RELEASE_KEYSTORE }}
          RELEASE_KEY_ALIAS: ${{ secrets.RELEASE_KEY_ALIAS }}
          RELEASE_KEY_PASSWORD: ${{ secrets.RELEASE_KEY_PASSWORD }}
          RELEASE_STORE_PASSWORD: ${{ secrets.RELEASE_STORE_PASSWORD }}
        run: |
          echo "$RELEASE_KEYSTORE" | base64 -d > release.jks
          echo "KEYSTORE_PATH=release.jks" >> $GITHUB_ENV
          echo "KEY_ALIAS=$RELEASE_KEY_ALIAS" >> $GITHUB_ENV
          echo "KEY_PASSWORD=$RELEASE_KEY_PASSWORD" >> $GITHUB_ENV
          echo "STORE_PASSWORD=$RELEASE_STORE_PASSWORD" >> $GITHUB_ENV
      
      - name: Build Android App
        run: |
          cd android
          chmod +x gradlew
          ./gradlew bundleRelease \
            -Pandroid.injected.signing.store.file=../release.jks \
            -Pandroid.injected.signing.store.password=${{ secrets.RELEASE_STORE_PASSWORD }} \
            -Pandroid.injected.signing.key.alias=${{ secrets.RELEASE_KEY_ALIAS }} \
            -Pandroid.injected.signing.key.password=${{ secrets.RELEASE_KEY_PASSWORD }}
      
      - name: Build APK (alternative if Bundle fails)
        if: failure()
        run: |
          cd android
          ./gradlew assembleRelease \
            -Pandroid.injected.signing.store.file=../release.jks \
            -Pandroid.injected.signing.store.password=${{ secrets.RELEASE_STORE_PASSWORD }} \
            -Pandroid.injected.signing.key.alias=${{ secrets.RELEASE_KEY_ALIAS }} \
            -Pandroid.injected.signing.key.password=${{ secrets.RELEASE_KEY_PASSWORD }}
      
      - name: Rename APK
        run: |
          if [ -f android/app/build/outputs/bundle/release/*.aab ]; then
            mv android/app/build/outputs/bundle/release/*.aab VocalRemover-v${{ github.run_number }}.aab
          elif [ -f android/app/build/outputs/apk/release/*.apk ]; then
            mv android/app/build/outputs/apk/release/*.apk VocalRemover-v${{ github.run_number }}.apk
          fi
      
      - name: Create Release
        if: startsWith(github.ref, 'refs/tags/')
        uses: softprops/action-gh-release@v1
        with:
          files: |
            VocalRemover-*.apk
            VocalRemover-*.aab
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Upload APK as Artifact
        uses: actions/upload-artifact@v3
        with:
          name: VocalRemover-APK
          path: |
            android/app/build/outputs/apk/release/*.apk
            android/app/build/outputs/bundle/release/*.aab
          retention-days: 30
      
      - name: Publish results comment
        if: always()
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            let message = '✅ **Android Build Report**\n\n';
            
            // Check if APK exists
            try {
              const apkFiles = fs.readdirSync('android/app/build/outputs/apk/release');
              message += `**APK Build:** ✅ Success\n`;
              message += `**Files:** ${apkFiles.join(', ')}\n\n`;
            } catch (e) {
              message += `**APK Build:** ❌ Failed\n\n`;
            }
            
            message += `**Download:** Check "Artifacts" tab above\n`;
            message += `**Size:** See build logs for details\n`;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: message
            });
```

### Step 5: How to Use (For You)

**Every time you push:**
```bash
git add .
git commit -m "Update vocal remover"
git push origin main

# GitHub Actions automatically:
# 1. Builds APK
# 2. Creates artifact (download in Actions tab)
# 3. Ready in 5-10 minutes
```

**To create Release:**
```bash
# Create tag
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions:
# 1. Builds APK
# 2. Creates Release page
# 3. APK available as Release download
# 4. Share release link with users
```

**To download APK:**
```
GitHub Repo → Actions (tab)
  ↓
Find your build
  ↓
Artifacts section
  ↓
Download "VocalRemover-APK"
  ↓
Extract .apk file
  ↓
Install on Android phone
```

---

## 📥 How Users Download APK

### Option 1: From Actions (Every Build)
```
Your GitHub Repo
  ↓
Actions tab
  ↓
Latest workflow run
  ↓
Artifacts section
  ↓
VocalRemover-APK (download)
  ↓
Extract and install
```

### Option 2: From Releases (Tagged Versions)
```
Your GitHub Repo
  ↓
Releases section
  ↓
Select version (v1.0.0, v1.1.0, etc.)
  ↓
Download .apk file
  ↓
Install on phone
```

### Option 3: Direct Links
```
GitHub generates download links like:
https://github.com/yourusername/vocal-remover-app/releases/download/v1.0.0/VocalRemover-v1.0.0.apk

Share this link directly!
(private, only people with GitHub access can download if private repo)
```

---

## 🔐 Privacy & Security

**Since it's private repo:**
```
✅ APK only for invited users
✅ GitHub access control
✅ No one else can download
✅ Signing key stored securely in GitHub Secrets
✅ Keys never exposed in logs
```

**To share APK:**
```
Option 1: Invite users to GitHub repo (private access)
Option 2: Share direct download link (GitHub generates)
Option 3: Create release with expiration (30 days default)
```

---

## 🛠️ Gradle Configuration for GitHub Actions

Add to: `android/app/build.gradle`

```gradle
android {
    compileSdkVersion 34
    targetSdkVersion 34
    minSdkVersion 24

    defaultConfig {
        applicationId "com.vocalremover"
        versionCode 1
        versionName "1.0.0"
        
        // Auto-increment build number
        versionCode = System.getenv("GITHUB_RUN_NUMBER")?.toInteger() ?: 1
    }

    signingConfigs {
        release {
            storeFile file(System.getenv("KEYSTORE_PATH") ?: "release.jks")
            storePassword System.getenv("STORE_PASSWORD")
            keyAlias System.getenv("KEY_ALIAS")
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile(
                'proguard-android-optimize.txt'
            ), 'proguard-rules.pro'
        }
    }
}
```

---

## 📊 GitHub Actions Cost

**Free Tier:**
```
✅ Ubuntu runners: 20 jobs/month free
✅ 3,000 minutes/month free
✅ Perfect for hobby projects

2,000 minutes for Android builds = ~8-10 builds/month free
```

**If you hit limit:**
```
$0.25 per extra minute
= ~$2-5/month for frequent builds
(minimal cost)
```

---

## 🔄 Version Management

**How to version releases:**

```bash
# v1.0.0 - Initial release
git tag v1.0.0
git push origin v1.0.0

# v1.0.1 - Bug fix
git tag v1.0.1
git push origin v1.0.1

# v1.1.0 - New features
git tag v1.1.0
git push origin v1.1.0

# Semantic Versioning:
# MAJOR.MINOR.PATCH
# v1 = major release
# .0 = minor update
# .0 = patch/bug fix
```

---

## 📝 Installation Instructions for Users

Create: `INSTALL_APK.md` in repo

```markdown
# How to Install Vocal Remover APK

## Requirements
- Android 7.0 or higher
- ~100MB free storage
- Microphone access permission
- Bluetooth (optional, for wireless speaker)

## Installation Steps

### Method 1: From GitHub Releases (Recommended)

1. Go to: https://github.com/yourusername/vocal-remover-app/releases
2. Download latest `VocalRemover-v*.apk`
3. Open downloaded APK on Android phone
4. Tap "Install"
5. Grant permissions (Mic, Storage)
6. Done!

### Method 2: From GitHub Actions

1. Go to: https://github.com/yourusername/vocal-remover-app/actions
2. Find latest "Android APK Build" workflow
3. Scroll to "Artifacts"
4. Download "VocalRemover-APK"
5. Extract .apk file
6. Install on phone

### Method 3: Manual Sideload

1. Enable "Unknown sources" on Android:
   - Settings → Security → Unknown sources (toggle ON)
2. Download APK using Method 1 or 2
3. Open APK (auto-install)
4. Or use: `adb install VocalRemover-v1.0.0.apk`

## First Time Setup

1. **Allow Permissions:**
   - Microphone access (required)
   - Storage access (for loading audio files)
   - Bluetooth (if using wireless speaker)

2. **Add API Key (Optional):**
   - Tap ⚙️ Settings
   - Paste your Google Gemini API key
   - Save

3. **Test Features:**
   - Upload local audio file
   - Or use Live mode (microphone)
   - Try vocal removal
   - Export result as WAV

## Troubleshooting

### APK won't install
- Check Android version (7.0+)
- Free storage ~100MB
- Enable "Unknown sources"

### App crashes on startup
- Check permissions granted
- Clear app cache: Settings → Apps → Vocal Remover → Storage → Clear Cache
- Reinstall APK

### Microphone not working
- Check permission: Settings → Apps → Vocal Remover → Permissions → Microphone
- Try in Live mode again

## Support

- GitHub Issues: Report bugs
- GitHub Discussions: Ask questions
- Include Android version & device model

## Privacy

- All processing happens locally on your device
- No audio uploads to cloud
- API key stored only on your phone
```

---

## ✅ New Phase 6 Checklist

**When you're ready for GitHub CI/CD:**

- [ ] Create GitHub private repository
- [ ] Push Android code to GitHub
- [ ] Generate signing key (release.jks)
- [ ] Add GitHub Secrets (RELEASE_KEYSTORE, passwords)
- [ ] Create `.github/workflows/android-build.yml`
- [ ] Push workflow file to GitHub
- [ ] Trigger manual build (workflow_dispatch)
- [ ] Verify APK builds successfully
- [ ] Test APK on Android device
- [ ] Create Release (tag v1.0.0)
- [ ] Verify APK available in Release
- [ ] Share link with users
- [ ] Document installation instructions

---

## 🎯 End Result

```
push code → GitHub Actions builds APK → Download ready → Install on phone

No Play Store approval
No store listing needed
Complete control
Private distribution
Instant updates
```

---

**Updated Timeline:**

```
Days 1-2:   Phase 0 (Setup)
Days 3-7:   Phase 1 (React Native)
Days 8-17:  Phase 2 (UI)
Days 18-27: Phase 3 (Audio)
Days 28-34: Phase 4 (Integration)
Days 35-41: Phase 5 (Testing + Build)
Days 42-44: Phase 6 (GitHub Actions)
            ✨ APK Ready for download!
```

**TOTAL: 6 weeks to private APK on GitHub**

---

**Last Updated:** November 29, 2025  
**Status:** Ready for Implementation  
**Next:** Begin Phase 0 when ready
