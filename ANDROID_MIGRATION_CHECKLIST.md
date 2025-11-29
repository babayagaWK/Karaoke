# 📱 Android APK Migration - Pre-Execution Checklist

**Date:** November 29, 2025  
**Status:** Pre-Migration Phase

---

## ✅ Phase 0: Pre-Migration Requirements

### A. Development Environment Setup

- [ ] **Java Development Kit (JDK)**
  ```bash
  java -version
  # Requires: JDK 11 or higher
  # Download: https://adoptopenjdk.net/ (or Oracle JDK)
  ```

- [ ] **Android Studio**
  ```bash
  # Download: https://developer.android.com/studio
  # Includes: SDK, Emulator, Gradle, Android Tools
  # Install size: ~10GB
  ```

- [ ] **Node.js & npm**
  ```bash
  node --version  # v18+
  npm --version   # 9+
  ```

- [ ] **Git**
  ```bash
  git --version
  ```

### B. Android SDK Components

**In Android Studio → SDK Manager:**
- [ ] Android SDK Platform 34
- [ ] Android SDK Platform-Tools
- [ ] Android Emulator
- [ ] NDK (for JNI if needed)
- [ ] Gradle (automatic)

### C. Current Project Backup

```bash
# Create backup branch
git checkout -b backup/web-app-before-android
git push origin backup/web-app-before-android

# or ZIP backup
mkdir ~/backups
cp -r /path/to/app ~/backups/app_$(date +%Y%m%d)
```

- [ ] Backup current `package.json`
- [ ] Backup `src/` directory
- [ ] Backup `.env.local` (API keys)
- [ ] Document all current dependencies

### D. Dependencies Inventory (Current Web App)

**Current React Web Dependencies:**
```json
{
  "react": "^19.0.0-rc.1",
  "react-dom": "^19.0.0-rc.1",
  "typescript": "^5.8.0",
  "vite": "^6.1.0",
  "tailwindcss": "^4.0.1",
  "axios": "^1.7.5"
}
```

**New React Native Dependencies to Add:**
```json
{
  "react": "^19.0.0",
  "react-native": "^0.75.0",
  "react-native-permissions": "^4.0.0",
  "@react-native-async-storage/async-storage": "^1.23.0",
  "expo": "~51.0.0",
  "expo-av": "^14.0.0",
  "react-native-slider": "^0.11.0",
  "typescript": "^5.8.0"
}
```

**Packages to Keep:**
- `axios` (HTTP requests)
- `typescript` (type checking)

**Packages to Remove:**
- `vite` (replaced by React Native bundler)
- `react-dom` (no DOM in RN)
- `tailwindcss` (replaced by StyleSheet)
- `@vitejs/*` (Vite specific)

---

## 🎯 Decision Matrix: PATH A vs PATH B

**Choose PATH A (React Native) if:**
- [ ] You want to reuse ~70% React code
- [ ] You plan iOS version later
- [ ] Timeline is critical (3-4 weeks)
- [ ] Team has React/JS expertise
- [ ] Accept ~10% performance penalty

**Choose PATH B (Kotlin Native) if:**
- [ ] Performance is top priority
- [ ] You're comfortable learning Kotlin
- [ ] APK size is critical (<30MB)
- [ ] Android-only for now (no iOS)
- [ ] Can spare 4-6 weeks

**Recommendation: PATH A ✅ (faster, keeps code base leverage)**

---

## 📋 Pre-Migration Setup (Before Starting Phase 1)

### Task 1: Verify Java & Android Setup

```bash
# Test Java
java -version
javac -version

# Test Android SDK
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --list_installed

# Test Gradle
gradle --version
```

**Expected Output:**
```
java version "11.0.21" 2023-10-17 LTS
Android SDK Build-Tools version 34.0.0
gradle 8.2 or higher
```

- [ ] All tools detected correctly
- [ ] Paths set up in environment variables

### Task 2: Create New React Native Project

```bash
# Option A: Using Expo (Easier)
npx create-expo-app VocalRemoverApp --template
cd VocalRemoverApp

# Option B: Using React Native CLI (More control)
npx @react-native-community/cli init VocalRemoverApp --template typescript

# Verify installation
npm test
npm start
```

- [ ] New RN project created
- [ ] Dependencies installed
- [ ] Dev server runs without errors

### Task 3: Setup Project Structure

```
VocalRemoverApp/
├── android/
│   ├── app/
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   ├── java/
│   │   │   │   │   └── com/vocalremover/  ← Kotlin files
│   │   │   │   ├── res/
│   │   │   │   └── AndroidManifest.xml
│   │   │   └── test/
│   │   └── build.gradle
│   └── gradle/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── components/
│   │   ├── PlaybackControl.tsx
│   │   ├── FrequencyVisualizer.tsx
│   │   ├── EQSliders.tsx
│   │   ├── PresetButtons.tsx
│   │   └── ActionButtons.tsx
│   ├── modals/
│   │   ├── SettingsModal.tsx
│   │   └── ComparisonModal.tsx
│   ├── services/
│   │   ├── nativeAudioBridge.ts
│   │   ├── geminiService.ts
│   │   └── audioExporter.ts
│   ├── utils/
│   │   └── audioEngine.native.ts
│   ├── styles/
│   │   ├── theme.ts
│   │   └── colors.ts
│   ├── App.tsx
│   └── index.tsx
├── app.json
├── app.config.js
├── tsconfig.json
├── babel.config.js
├── eas.json
└── package.json
```

- [ ] Folder structure created
- [ ] TypeScript config updated

### Task 4: Configure TypeScript for React Native

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "jsx": "react-native",
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts", "**/*.spec.ts"]
}
```

- [ ] tsconfig.json created
- [ ] TypeScript validation passes

### Task 5: Prepare Android Permissions

**Create:** `android/app/src/main/AndroidManifest.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.vocalremover">

    <!-- ===== AUDIO PERMISSIONS ===== -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    
    <!-- ===== FILE PERMISSIONS ===== -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    
    <!-- ===== SYSTEM AUDIO (Optional, requires API 31+) ===== -->
    <!-- <uses-permission android:name="android.permission.PROJECT_MEDIA" /> -->
    
    <!-- ===== INTERNET (For API calls) ===== -->
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:name=".MainApplication"
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:allowBackup="true"
        android:theme="@style/AppTheme">
        
        <activity
            android:name=".MainActivity"
            android:label="@string/app_name"
            android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"
            android:launchMode="singleTask"
            android:windowSoftInputMode="adjustResize"
            android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
```

- [ ] AndroidManifest.xml created
- [ ] All permissions listed
- [ ] Application name matches package

### Task 6: Test React Native Setup

```bash
# Start Metro bundler
npm start

# In another terminal, build and run
npm run android

# Or using Expo
npx expo start --android
```

**Expected Result:**
- [ ] Dev server starts
- [ ] Emulator/device connects
- [ ] App displays "Welcome to React Native"
- [ ] No TypeScript errors

---

## 🔍 Code Migration Preparation

### Step 1: Analyze Current Components

**Create migration spreadsheet** with columns:
| Component | LOC | Complexity | RN Equivalent | Notes |
|-----------|-----|-----------|---------------|-------|
| Controls.tsx | 300 | High | PlaybackControl.tsx | Sliders → Slider comp |
| Visualizer.tsx | 250 | High | FrequencyVisualizer.tsx | Canvas → SkiaCanvas |
| SettingsModal.tsx | 246 | Medium | SettingsModal.tsx | Modal → React Native Modal |
| Presets.tsx | 150 | Low | PresetButtons.tsx | Direct migration |
| EQControls.tsx | 200 | Medium | EQSliders.tsx | Multiple sliders |

- [ ] All components analyzed
- [ ] Migration complexity estimated
- [ ] Conversion strategy documented

### Step 2: Prepare Test Cases

**Create test suite for each component:**

```typescript
// src/__tests__/PlaybackControl.test.ts
describe('PlaybackControl', () => {
  test('should render play button', () => {
    // Test play/pause functionality
  });
  
  test('should handle slider changes', () => {
    // Test progress bar updates
  });
  
  test('should display correct duration', () => {
    // Test time formatting
  });
});
```

- [ ] Test cases prepared
- [ ] Testing framework installed (Jest + React Native Testing Library)

---

## 🗂️ File Conversion Reference

### Web Component → React Native Conversion

**Before (React Web):**
```tsx
// src/components/Controls.tsx (Web)
import React from 'react';

export const Controls = ({ isPlaying, onPlayPause }) => (
  <div className="bg-slate-800 p-6 rounded-lg">
    <button 
      onClick={onPlayPause}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      {isPlaying ? 'Pause' : 'Play'}
    </button>
  </div>
);
```

**After (React Native):**
```tsx
// src/components/PlaybackControl.tsx (Native)
import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

export const PlaybackControl = ({ isPlaying, onPlayPause }) => (
  <View style={styles.container}>
    <Pressable 
      style={[styles.button, isPlaying && styles.buttonActive]}
      onPress={onPlayPause}
    >
      <Text style={styles.buttonText}>
        {isPlaying ? 'Pause' : 'Play'}
      </Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    padding: 24,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonActive: {
    backgroundColor: '#dc2626',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
```

---

## ⚠️ Common Pitfalls & Solutions

| Pitfall | Cause | Solution |
|---------|-------|----------|
| **Module not found** | Incorrect import paths | Use relative paths: `../` not absolute |
| **Metro bundler error** | Cache corruption | Run: `npx react-native start --reset-cache` |
| **Audio permission denied** | No runtime permission request | Use `react-native-permissions` |
| **Slow build** | First build is slow | Can take 5-10 mins on first run |
| **TypeScript errors** | RN types missing | Install: `@types/react-native` |
| **CSS/Tailwind doesn't work** | No DOM in RN | Use StyleSheet.create() instead |

---

## 📊 Success Criteria (Phase 0)

All checkboxes completed = Ready for Phase 1

**Environment:**
- [ ] JDK 11+ installed
- [ ] Android Studio configured
- [ ] Android SDK tools updated
- [ ] Node.js 18+ and npm working

**Project:**
- [ ] React Native project created
- [ ] TypeScript configured
- [ ] Android permissions set
- [ ] Dev server runs
- [ ] Emulator test successful

**Code Preparation:**
- [ ] Current app backed up
- [ ] Dependencies analyzed
- [ ] Components documented
- [ ] Test cases prepared
- [ ] Migration strategy confirmed

**Git:**
- [ ] Backup branch created
- [ ] .gitignore includes RN build artifacts
- [ ] Ready for commits

---

## 🚀 Start Phase 1?

When all checkboxes are complete, proceed to:

**PHASE 1: Project Setup & Configuration**

```bash
# Phase 1 commands preview
npm install react-native @react-native-async-storage/async-storage
npx react-native init
npm run android  # First build
```

---

**Last Updated:** November 29, 2025  
**Status:** Pre-Execution Checklist  
**Next:** Complete all checkboxes → Begin Phase 1
