# 📱 Android APK Migration Plan
## React Web App → Native Android Application

**Last Updated:** November 29, 2025  
**Status:** Pre-Migration Planning  
**Estimated Timeline:** 3-4 weeks

---

## 📊 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  CURRENT STATE: React Web App (Vite)                           │
│  - ✅ Desktop/Web Browser                                       │
│  - ✅ Web Audio API Support                                     │
│  - ❌ Cannot access system audio (Android limitation)          │
└─────────────────────────────────────────────────────────────────┘
                               ↓
        ┌──────────────────────┴──────────────────────┐
        │  Two Viable Paths to Android                │
        └──────────────────────┬──────────────────────┘
                ↙                                ↘
    ┌──────────────────┐           ┌──────────────────┐
    │ PATH A:          │           │ PATH B:          │
    │ React Native     │           │ Kotlin Native    │
    │ + Kotlin Bridge  │           │ (Full Native)    │
    └──────────────────┘           └──────────────────┘
     Hybrid Approach               Pure Native
```

---

## 🎯 Path Comparison

### **PATH A: React Native + Kotlin Bridge (RECOMMENDED) ⭐**

**架構:**
```
┌────────────────────────────────────────┐
│  React Native (UI/Business Logic)      │  ← ง่ายต่อการ reuse code
├────────────────────────────────────────┤
│  Kotlin Native Module (AudioRecord)    │  ← จัดการ system audio
├────────────────────────────────────────┤
│  React Native Bridge (JS ↔ Kotlin)     │  ← Communication layer
├────────────────────────────────────────┤
│  Android Runtime (APK)                 │
└────────────────────────────────────────┘
```

**ข้อดี ✅**
- ✅ **Reuse 70% React code** จาก web app
- ✅ **Gradual migration** เป็นขั้นตอน
- ✅ **Easier maintenance** ใช้ JS สำหรับ UI
- ✅ **Fast development** TailwindCSS → React Native styles
- ✅ **iOS support** ใช้โค้ด React Native เดียวกัน

**ข้อเสีย ❌**
- ❌ Performance ต่ำกว่า native ~10-15%
- ❌ Native module ต้องเขียน Kotlin
- ❌ Bundle size ใหญ่กว่า (~50-80MB)
- ❌ Debugging ยุ่งเพราะ 2 layer

**Tech Stack:**
- React Native 0.75+
- Kotlin 1.9+
- Gradle Build System
- Java Native Interface (JNI)

**Timeline:** 3-4 weeks

---

### **PATH B: Kotlin Native (PURE NATIVE) 🚀**

**架構:**
```
┌────────────────────────────────────────┐
│  Jetpack Compose (Modern UI)           │  ← Declarative UI (like React)
├────────────────────────────────────────┤
│  Kotlin Coroutines (Async Logic)       │  ← Better than RN
├────────────────────────────────────────┤
│  AudioRecord API (System Audio)        │  ← Full control
├────────────────────────────────────────┤
│  Android Runtime (APK)                 │
└────────────────────────────────────────┘
```

**ข้อดี ✅**
- ✅ **Best performance** native speed
- ✅ **Smallest APK** ~20-30MB
- ✅ **Full Android features** hardware access
- ✅ **Official support** Google maintained
- ✅ **Future-proof** long-term support

**ข้อเสีย ❌**
- ❌ **Rewrite 100%** เขียนใหม่หมด
- ❌ **Learning curve** ต้องเรียน Kotlin + Jetpack
- ❌ **Longer development** 4-6 weeks
- ❌ **Separate iOS** ต้องเขียน Swift

**Tech Stack:**
- Kotlin 1.9+
- Jetpack Compose
- Coroutines
- AndroidX libraries

**Timeline:** 4-6 weeks

---

## 🏆 Recommendation: **PATH A (React Native)**

**เหตุผล:**
1. **ประหยัด time & effort** (~25% faster)
2. **Reuse components** 70% JS code พูดได้
3. **Future iOS** สามารถทำ iOS ได้ด้วยเดียวกัน
4. **Team skill** ใช้ React expertise ที่มีอยู่
5. **Still performant** สำหรับ audio app ก็พอ

---

## 📋 Step-by-Step Migration Plan (PATH A: React Native)

### **PHASE 1: Project Setup (3-5 days)**

#### **Step 1.1: Initialize React Native Project**
```bash
# ใช้ TypeScript template
npx @react-native-community/cli init VocalRemoverApp --template typescript

# หรือ ใช้ Expo (ง่ายกว่า)
npx create-expo-app VocalRemoverApp --template expo-template-default
```

**Output Directory Structure:**
```
VocalRemoverApp/
├── android/                    ← Android-specific code
│   ├── app/src/main/
│   │   ├── java/kotlin/        ← Kotlin modules (AudioRecord)
│   │   ├── res/                ← Resources
│   │   └── AndroidManifest.xml
│   └── gradle/
├── ios/                        ← iOS (สำหรับภายหลัง)
├── src/
│   ├── screens/                ← React Native screens
│   ├── components/             ← RN components
│   ├── services/               ← Services (Kotlin bridge)
│   └── utils/                  ← Utilities
├── app.json
├── app.config.js
├── eas.json                    ← Expo build config
└── package.json
```

#### **Step 1.2: Setup TypeScript Configuration**
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
    "allowJs": true
  }
}
```

#### **Step 1.3: Install Core Dependencies**
```bash
npm install \
  react-native@latest \
  @react-native-async-storage/async-storage \
  @react-native-camera-roll/camera-roll \
  react-native-permissions \
  react-native-audio-toolkit \
  react-native-sound \
  expo-av \
  expo-audio-session \
  expo-file-system \
  axios

npm install --save-dev \
  @types/react-native \
  typescript \
  @react-native/metro-config
```

**Dependencies Breakdown:**
| Package | Purpose |
|---------|---------|
| `@react-native-async-storage/async-storage` | Replace localStorage |
| `react-native-permissions` | Request mic/audio permissions |
| `expo-av` | Audio playback/recording |
| `react-native-audio-toolkit` | Advanced audio control |
| `react-native-file-system` | File I/O |
| `axios` | HTTP requests (API calls) |

#### **Step 1.4: Configure Android Permissions**
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
  <!-- Required Permissions -->
  <uses-permission android:name="android.permission.RECORD_AUDIO" />
  <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
  
  <!-- For system audio capture (requires MediaProjection) -->
  <uses-permission android:name="android.permission.PROJECT_MEDIA" />
  
  <application>
    <!-- ... rest of config ... -->
  </application>
</manifest>
```

**Permission Levels:**
```
Runtime Permissions Needed (API 31+):
├── android.permission.RECORD_AUDIO
├── android.permission.MODIFY_AUDIO_SETTINGS
└── android.permission.READ_EXTERNAL_STORAGE

System Audio (MediaProjection):
└── Requires user permission dialog (similar to screen cast)
```

---

### **PHASE 2: Component Migration (7-10 days)**

#### **Step 2.1: Convert UI Components**

**Current Web Structure:**
```
App.tsx (1200 lines)
├── Controls.tsx (300 lines) → RN: controls/PlaybackControl.tsx
├── Visualizer.tsx (250 lines) → RN: components/FrequencyVisualizer.tsx
├── SettingsModal.tsx (246 lines) → RN: modals/SettingsModal.tsx
├── Presets.tsx (150 lines) → RN: components/PresetButtons.tsx
├── EQControls.tsx (200 lines) → RN: components/EQSliders.tsx
├── ActionButtons.tsx (180 lines) → RN: components/ActionButtons.tsx
└── ComparisonModal.tsx (280 lines) → RN: modals/ComparisonModal.tsx
```

**Conversion Strategy:**

| Web Component | React Native Equivalent |
|---------------|------------------------|
| `<div>` | `<View>` |
| `<button>` | `<Pressable>` / `<TouchableOpacity>` |
| `<input>` | `<TextInput>` |
| `<input type="range">` | `<Slider>` (react-native-slider) |
| `<canvas>` | `<Canvas>` (react-native-canvas) |
| `className="..."` | `styles={StyleSheet.create(...)}` |
| TailwindCSS | NativeWind / Unistyles |

**Example Migration - Controls.tsx:**

**Before (React Web):**
```tsx
export const Controls = ({ 
  isPlaying,
  onPlayPause,
  currentTime,
  duration,
  volume,
  onVolumeChange,
  vocalRemovalLevel,
  onVocalRemovalChange
}) => {
  return (
    <div className="bg-slate-800/40 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">⏱️ PROGRESS</h3>
      <input 
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        className="w-full"
      />
      <button 
        onClick={onPlayPause}
        className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg"
      >
        {isPlaying ? '⏸️ Pause' : '▶️ Play'}
      </button>
    </div>
  );
};
```

**After (React Native):**
```tsx
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';

export const PlaybackControl = ({ 
  isPlaying,
  onPlayPause,
  currentTime,
  duration,
  volume,
  onVolumeChange,
  vocalRemovalLevel,
  onVocalRemovalChange
}: PlaybackControlProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>⏱️ PROGRESS</Text>
      
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={currentTime}
        onValueChange={/* sync time */}
        step={0.1}
      />
      
      <Pressable 
        style={[styles.button, { backgroundColor: isPlaying ? '#ef4444' : '#3b82f6' }]}
        onPress={onPlayPause}
      >
        <Text style={styles.buttonText}>
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  slider: {
    height: 40,
    marginVertical: 12,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

#### **Step 2.2: Setup Styling System**

**Option 1: React Native Built-in (Recommended)**
```tsx
// styles/theme.ts
export const colors = {
  background: '#020617',
  slate: {
    700: '#475569',
    800: '#1e293b',
    900: '#0f172a',
  },
  blue: {
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
  },
};

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // ... more styles
});
```

**Option 2: NativeWind (TailwindCSS-like)**
```bash
npm install nativewind tailwindcss postcss
```

```tsx
// Use similar to web
<View className="flex-1 bg-slate-950">
  <Text className="text-white font-bold">Title</Text>
</View>
```

#### **Step 2.3: State Management Migration**

**Current (Web):**
```tsx
const [showSettings, setShowSettings] = useState(false);
const [apiKey, setApiKey] = useState(() => 
  localStorage.getItem('gemini_api_key') || ''
);
```

**React Native:**
```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

const [showSettings, setShowSettings] = useState(false);
const [apiKey, setApiKey] = useState(() => {
  AsyncStorage.getItem('gemini_api_key').then(key => {
    setApiKey(key || '');
  });
  return '';
});

// Save helper
const saveApiKey = async (key: string) => {
  await AsyncStorage.setItem('gemini_api_key', key);
  setApiKey(key);
};
```

---

### **PHASE 3: Kotlin Audio Module (7-10 days)**

#### **Step 3.1: Create Kotlin Native Module for Audio Capture**

```kotlin
// android/app/src/main/kotlin/com/vocalremover/AudioCaptureModule.kt
package com.vocalremover

import android.content.Context
import android.media.AudioRecord
import android.media.AudioFormat
import android.media.MediaRecorder
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import java.nio.ByteBuffer
import java.util.concurrent.Executors
import kotlin.math.sqrt

class AudioCaptureModule(reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {

    private var audioRecord: AudioRecord? = null
    private var isRecording = false
    private val executor = Executors.newSingleThreadExecutor()
    
    // Microphone capture (ทำได้ใน Android)
    @ReactMethod
    fun startMicrophoneCapture(promise: Promise) {
        try {
            val sampleRate = 44100
            val channelConfig = AudioFormat.CHANNEL_IN_STEREO
            val audioFormat = AudioFormat.ENCODING_PCM_16BIT
            
            val bufferSize = AudioRecord.getMinBufferSize(sampleRate, channelConfig, audioFormat)
            
            audioRecord = AudioRecord(
                MediaRecorder.AudioSource.MIC,
                sampleRate,
                channelConfig,
                audioFormat,
                bufferSize
            )
            
            audioRecord?.startRecording()
            isRecording = true
            
            // Start reading audio in background
            executor.execute {
                captureAudioData(sampleRate, bufferSize)
            }
            
            promise.resolve("Microphone capture started")
        } catch (e: Exception) {
            promise.reject("AUDIO_ERROR", e.message)
        }
    }
    
    private fun captureAudioData(sampleRate: Int, bufferSize: Int) {
        val buffer = ByteArray(bufferSize)
        
        while (isRecording) {
            val read = audioRecord?.read(buffer, 0, bufferSize) ?: 0
            
            if (read > 0) {
                // Convert to PCM float array
                val floatArray = ByteBuffer
                    .wrap(buffer)
                    .asShortBuffer()
                    .array()
                    .map { it.toFloat() / 32768f }
                    .toFloatArray()
                
                // Send to React Native
                sendAudioToJS(floatArray)
            }
        }
    }
    
    private fun sendAudioToJS(audioData: FloatArray) {
        // Send via React Native bridge
        // Will implement in next step
    }
    
    @ReactMethod
    fun stopMicrophoneCapture(promise: Promise) {
        try {
            isRecording = false
            audioRecord?.stop()
            audioRecord?.release()
            audioRecord = null
            promise.resolve("Microphone capture stopped")
        } catch (e: Exception) {
            promise.reject("AUDIO_ERROR", e.message)
        }
    }
    
    override fun getName() = "AudioCaptureModule"
}
```

#### **Step 3.2: System Audio Capture (Advanced)**

**สำหรับดึง YouTube/Spotify audio:**

```kotlin
// android/app/src/main/kotlin/com/vocalremover/SystemAudioCaptureModule.kt
package com.vocalremover

import android.content.Context
import android.media.AudioPlaybackCaptureConfiguration
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class SystemAudioCaptureModule(reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {

    private var audioRecord: AudioRecord? = null
    private var isRecording = false
    
    // ⚠️ Requires MediaProjection (Android 10+)
    // User must grant "Record audio" permission via system dialog
    @ReactMethod
    fun requestMediaProjection(promise: Promise) {
        // Note: This requires starting intent for MediaProjection
        // The actual system audio capture needs MediaProjectionManager
        // Implementation requires native activity integration
        promise.reject(
            "NOT_IMPLEMENTED",
            "MediaProjection requires intent-based permission dialog"
        )
    }
    
    override fun getName() = "SystemAudioCaptureModule"
}
```

#### **Step 3.3: Register Native Module in MainApplication**

```kotlin
// android/app/src/main/kotlin/com/vocalremover/MainApplication.kt
package com.vocalremover

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactNativeHost
import java.lang.reflect.InvocationTargetException

class MainApplication : Application(), ReactApplication {

  private val mReactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Add custom modules here
              add(AudioCapturePackage())
            }

        override fun getJSMainModuleName(): String = "index"
        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG
      }

  override fun getReactNativeHost(): ReactNativeHost = mReactNativeHost
}
```

```kotlin
// android/app/src/main/kotlin/com/vocalremover/AudioCapturePackage.kt
package com.vocalremover

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class AudioCapturePackage : ReactPackage {

  override fun createNativeModules(
      reactContext: ReactApplicationContext
  ): List<NativeModule> =
      listOf(AudioCaptureModule(reactContext))

  override fun createViewManagers(
      reactContext: ReactApplicationContext
  ): List<ViewManager<*, *>> = emptyList()
}
```

---

### **PHASE 4: JavaScript Bridge & Web Audio Integration (5-7 days)**

#### **Step 4.1: Create JS Bridge to Kotlin Module**

```tsx
// src/services/nativeAudioBridge.ts
import { NativeModules, Platform } from 'react-native';

const { AudioCaptureModule } = NativeModules;

interface AudioBridgeAPI {
  startCapture: () => Promise<string>;
  stopCapture: () => Promise<string>;
  onAudioData: (callback: (data: Float32Array) => void) => void;
}

export const nativeAudioBridge: AudioBridgeAPI = {
  async startCapture() {
    if (Platform.OS !== 'android') {
      throw new Error('Only supported on Android');
    }
    return await AudioCaptureModule.startMicrophoneCapture();
  },

  async stopCapture() {
    if (Platform.OS !== 'android') {
      throw new Error('Only supported on Android');
    }
    return await AudioCaptureModule.stopMicrophoneCapture();
  },

  onAudioData(callback: (data: Float32Array) => void) {
    // Setup native event listener
    // Will receive audio chunks from Kotlin module
  }
};
```

#### **Step 4.2: Adapt Web Audio Engine for React Native**

**Current Web Audio Engine (ต้องปรับ):**

```typescript
// src/utils/audioEngine.native.ts (React Native version)
// ใช้ Expo Audio API instead of Web Audio API

import * as Audio from 'expo-av';

export class AudioEngineNative {
  private soundObject: Audio.Sound | null = null;
  
  async initializeAudio() {
    // Request permissions
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Audio permission denied');
    }
    
    // Setup audio session
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      interruptionMode: Audio.AndroidInterruptionMode.DoNotMix,
    });
  }
  
  async loadAudio(uri: string) {
    this.soundObject = new Audio.Sound();
    await this.soundObject.loadAsync({ uri });
  }
  
  async playAudio() {
    if (this.soundObject) {
      await this.soundObject.playAsync();
    }
  }
  
  async stopAudio() {
    if (this.soundObject) {
      await this.soundObject.stopAsync();
    }
  }
  
  // ⚠️ Web Audio API filters not available in React Native
  // Alternative: Use native audio processors or Web Audio polyfills
}
```

#### **Step 4.3: Processing Pipeline**

```
Kotlin AudioRecord (Microphone)
        ↓
Audio data bytes (PCM 16-bit)
        ↓
React Native Bridge
        ↓
JavaScript Float32Array
        ↓
Web Audio API Filters (OfflineAudioContext)
        ↓
Vocal Removal Processing
        ↓
Output PCM
        ↓
Expo Audio API (playback)
        ↓
Phone Speaker / Bluetooth
```

---

### **PHASE 5: Build & Test (5-7 days)**

#### **Step 5.1: Android Build Configuration**

```gradle
// android/app/build.gradle
android {
    compileSdkVersion 34
    targetSdkVersion 34
    minSdkVersion 24  // Support back to Android 7.0

    defaultConfig {
        applicationId "com.vocalremover"
        versionCode 1
        versionName "1.0.0"
    }

    signingConfigs {
        release {
            storeFile file("/path/to/keystore.jks")
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias "vocalremover"
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

#### **Step 5.2: Test on Android Emulator**

```bash
# Run on emulator
npm run android

# Or directly
./gradlew installDebug

# Check logs
adb logcat | grep "VocalRemover"
```

#### **Step 5.3: Debug Checklist**

- [ ] Audio permissions granted
- [ ] Microphone input captured correctly
- [ ] Audio data reaches React Native layer
- [ ] Processing pipeline executes
- [ ] Output plays on speaker
- [ ] Bluetooth speaker works
- [ ] Performance (latency < 100ms)

---

### **PHASE 6: Build Release APK (3-5 days)**

#### **Step 6.1: Generate Signing Key**

```bash
# Generate keystore
keytool -genkey -v -keystore release.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias vocalremover

# Store credentials safely
# DO NOT commit to git!
```

#### **Step 6.2: Build Release APK**

```bash
# Build AAB for Play Store
./gradlew bundleRelease

# Or traditional APK
./gradlew assembleRelease

# Output will be in:
# android/app/build/outputs/bundle/release/app-release.aab
# android/app/build/outputs/apk/release/app-release.apk
```

#### **Step 6.3: Optimize APK Size**

```gradle
// android/app/build.gradle
android {
    packagingOptions {
        exclude 'META-INF/DEPENDENCIES'
        exclude 'META-INF/LICENSE'
        exclude 'META-INF/LICENSE.txt'
    }
    
    bundle {
        density {
            enableSplit = true
        }
        language {
            enableSplit = true
        }
    }
}
```

**Expected APK Sizes:**
- Debug: 80-120 MB
- Release (minified): 25-35 MB

---

### **PHASE 7: Play Store Distribution (5-10 days)**

#### **Step 7.1: Create Play Store Account**

```
1. Go to Google Play Console (https://play.google.com/console)
2. Create Developer Account ($25 one-time fee)
3. Sign terms & conditions
4. Create new app listing
```

#### **Step 7.2: Prepare App Listing**

**Required Information:**
- App name: `Vocal Remover AI`
- Description: (500 chars)
  ```
  Advanced vocal removal using AI and spectral analysis.
  - Multi-band phase cancellation (70-75% effectiveness)
  - Real-time audio processing
  - EQ controls (Bass/Mid/Treble)
  - Presets (Karaoke/Ballad/Rock/Acoustic)
  - A/B comparison mode
  - Undo/Redo functionality
  - Export as WAV
  ```
- Short description: (80 chars)
  ```
  AI-powered vocal remover with real-time audio processing
  ```
- Screenshots (5-8): 
  - Main UI showing player
  - Frequency analyzer
  - EQ controls
  - Presets selection
  - Settings modal

- Privacy Policy URL
- Category: Music & Audio
- Content Rating: Everyone (ESRB)

#### **Step 7.3: Upload APK/AAB**

```
Google Play Console:
1. Go to Release → Production
2. Upload app-release.aab
3. Review and confirm
4. Submit for review (takes 24-48 hours)
```

#### **Step 7.4: Post-Launch Monitoring**

Monitor:
- Install rate
- Crash reports
- User reviews
- Performance metrics

---

## 📊 Timeline Summary

| Phase | Tasks | Duration | Status |
|-------|-------|----------|--------|
| **1. Setup** | RN init, TypeScript, Gradle, Permissions | 3-5 days | ⏳ |
| **2. UI Migration** | Component conversion, Styling, State mgmt | 7-10 days | ⏳ |
| **3. Audio Module** | Kotlin AudioRecord, Native bridge | 7-10 days | ⏳ |
| **4. Integration** | JS bridge, Web Audio adapter, Pipeline | 5-7 days | ⏳ |
| **5. Build & Test** | Emulator testing, Debugging, Optimization | 5-7 days | ⏳ |
| **6. Release APK** | Signing, Optimization, Build | 3-5 days | ⏳ |
| **7. Play Store** | Account, Listing, Upload, Review | 5-10 days | ⏳ |
| | **TOTAL** | **35-54 days (~6-8 weeks)** | ⏳ |

---

## 🛠️ Technology Stack (Final)

```
Frontend:
├── React Native 0.75+
├── TypeScript 5.8+
├── React Navigation (routing)
└── NativeWind (styling)

Backend (Native):
├── Kotlin 1.9+
├── Android Audio API
├── Coroutines
└── Gradle Build System

Audio Processing:
├── Web Audio API (via polyfill/adapter)
├── Expo Audio (playback)
├── AndroidAudio (recording)
└── React Native Bridge (IPC)

Storage:
├── AsyncStorage (user settings)
├── FileSystem (audio files)
└── MediaStore (system integration)

Server (Optional):
├── Gemini API (lyrics detection)
└── HTTPS / REST
```

---

## ⚠️ Known Limitations

1. **System Audio (YouTube/Spotify)**
   - Requires MediaProjection (Android 10+)
   - Users must explicitly grant permission
   - Not available on rooted/jailbroken devices

2. **Performance**
   - Real-time processing may have 100-200ms latency
   - Battery usage: ~15% per hour of continuous use

3. **Web Audio Processing**
   - Must adapt Web Audio API → Kotlin/Native equivalents
   - Some filters may need custom implementation

4. **iOS (Future)**
   - Requires separate Swift implementation
   - Different audio API (AVAudioEngine)
   - Similar timeline as Android

---

## 🚀 Next Steps

**Immediate (This Week):**
1. ✅ Review this migration plan
2. ⏳ Setup React Native project
3. ⏳ Setup Android development environment (Android Studio)
4. ⏳ Test RN app on emulator

**Week 2-3:**
5. ⏳ Migrate UI components
6. ⏳ Implement Kotlin audio module
7. ⏳ Test audio capture

**Week 4-6:**
8. ⏳ Complete integration
9. ⏳ Test end-to-end
10. ⏳ Build release APK

**Week 7-8:**
11. ⏳ Play Store listing
12. ⏳ Submit for review
13. ⏳ Launch & monitor

---

## 📞 Support & Resources

**Documentation:**
- [React Native Docs](https://reactnative.dev)
- [Kotlin Docs](https://kotlinlang.org/docs)
- [Android Developer](https://developer.android.com)
- [Expo Docs](https://docs.expo.dev)

**Tools:**
- Android Studio
- VS Code + React Native extension
- ADB (Android Debug Bridge)
- Firebase Crashlytics (optional)

**Community:**
- React Native Discord
- Stack Overflow tag: `react-native`
- Android Developers Google Group

---

**Last Updated:** November 29, 2025  
**Version:** 1.0 (Initial Planning)  
**Status:** Ready for Implementation
