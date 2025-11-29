# GitHub Secrets Setup Guide

## Required Secrets for Automated APK Builds

To enable GitHub Actions to build APK automatically, you need to configure these secrets in your GitHub repository settings.

### Steps to Add Secrets:

1. Go to: `https://github.com/babayagaWK/Karaoke/settings/secrets/actions`

2. Click **"New repository secret"** and add each secret below:

---

## Secrets to Configure

### Option A: Using EAS (Recommended for Expo)

#### 1. **EXPO_TOKEN**
- Get from: https://expo.dev/settings/access-tokens
- Click "Create token" (type: "Build server")
- Copy the full token value
- **Key**: `EXPO_TOKEN`
- **Value**: `<your-expo-token>`

#### 2. **EXPO_USERNAME** (Optional, if using username/password login)
- Your Expo account username
- **Key**: `EXPO_USERNAME`
- **Value**: `<your-expo-username>`

#### 3. **EXPO_PASSWORD** (Optional, if using username/password login)
- Your Expo account password
- **Key**: `EXPO_PASSWORD`
- **Value**: `<your-expo-password>`

---

### Option B: Using Local Android Build (Advanced)

If you want to build locally without EAS, you'll need:

#### 1. **ANDROID_KEYSTORE_BASE64**
```bash
# Create keystore (run this once):
keytool -genkey -v -keystore vocal-remover.jks -keyalg RSA -keysize 2048 -validity 10000 -alias karaoke

# Encode to base64:
certutil -encode vocal-remover.jks keystore.b64
# (Or use: base64 -i vocal-remover.jks)
```
- **Key**: `ANDROID_KEYSTORE_BASE64`
- **Value**: `<base64-encoded-keystore>`

#### 2. **ANDROID_KEYSTORE_PASSWORD**
- Password you set when creating the keystore
- **Key**: `ANDROID_KEYSTORE_PASSWORD`
- **Value**: `<your-keystore-password>`

#### 3. **ANDROID_KEY_ALIAS**
- Alias used when creating keystore (usually "karaoke")
- **Key**: `ANDROID_KEY_ALIAS`
- **Value**: `karaoke`

#### 4. **ANDROID_KEY_PASSWORD**
- Key password (same as keystore password usually)
- **Key**: `ANDROID_KEY_PASSWORD`
- **Value**: `<your-key-password>`

---

## Quickest Setup (Recommended)

**For fastest APK builds with EAS:**

1. Create Expo account: https://expo.dev/signup
2. Create access token: https://expo.dev/settings/access-tokens
3. Add `EXPO_TOKEN` secret to GitHub
4. That's it! Push to `master` branch and GitHub Actions will build APK

---

## Testing the Build

1. Push code to GitHub:
   ```bash
   git push origin master
   ```

2. Go to: `https://github.com/babayagaWK/Karaoke/actions`

3. Watch the workflow execute:
   - ✅ Green = Build succeeded, APK ready
   - ❌ Red = Build failed, check logs

4. If a tag is pushed (e.g., `v1.0.0`), APK is automatically released:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
   Then download from: `https://github.com/babayagaWK/Karaoke/releases`

---

## APK Download After Build

### Via GitHub Releases (for tagged releases):
1. Go to: `https://github.com/babayagaWK/Karaoke/releases`
2. Download APK from the release

### Via GitHub Actions (for any build):
1. Go to: `https://github.com/babayagaWK/Karaoke/actions`
2. Click the successful workflow run
3. Click "Artifacts" section to download APK

---

## Manual Build Commands (if needed)

```bash
# Install EAS CLI locally
npm install -g eas-cli

# Build on local machine (requires Expo account)
eas build --platform android

# Or use Expo's web-based build
expo build:android
```

---

## Troubleshooting

**Build fails with "Invalid token"**
- Verify `EXPO_TOKEN` is correctly set in GitHub Secrets
- Re-create the token at https://expo.dev/settings/access-tokens

**Build fails with "Timeout"**
- EAS builds can take 5-10 minutes
- Check GitHub Actions log for detailed errors

**APK not found after build**
- Build might have failed silently
- Check the GitHub Actions log for error messages
- Verify secrets are correctly configured

---

## Next Steps After First Successful Build

1. ✅ Verify APK builds successfully
2. ✅ Test APK on Android device:
   ```bash
   adb install -r app-release.apk
   ```
3. ✅ Configure version numbering in `package.json`
4. ✅ Setup release notes automation

---

**Status**: Ready for GitHub Actions APK building
**Setup Time**: ~5 minutes (add secrets)
**Build Time**: ~10 minutes per APK
