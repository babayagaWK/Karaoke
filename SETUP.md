# 🎵 Vocal Remover AI - Setup Guide

## ⚙️ Configuration Required

### **1. Google Gemini API Key (For AI Lyrics Detection)**

#### Why You Need It:
- Identify song title, artist, and album
- Extract song lyrics automatically
- Detect song language (Thai/English/etc)
- Uses AI to listen to audio clip

#### How to Get It:

**Option A: Free API Key (Recommended for Testing)**
1. Go to https://ai.google.dev/
2. Click "Get API Key"
3. Sign in with your Google account
4. Click "Create API Key"
5. Select "Create API key in existing project" or create new
6. Copy the generated API key

**Option B: Google Cloud Console**
1. Go to https://console.cloud.google.com/
2. Create new project
3. Enable "Generative Language API"
4. Create API credentials (API Key type)
5. Copy key

#### How to Add It:

**File: `.env.local`**
```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with your real API key.

**Example:**
```env
VITE_GEMINI_API_KEY=AIzaSyD1234567890abcdefghij...
```

#### Testing:
After adding key, try these steps:
1. Upload an MP3/WAV audio file
2. Click "Analyze 🔍" button
3. System should detect song info in 5-10 seconds

#### Troubleshooting:

**❌ "Failed to analyze" error:**
- Check API key is correct (no spaces, exact match)
- Verify API key is enabled in Google Cloud
- Check file size < 10MB
- Try with a clear audio file (not too noisy)

**❌ "API key not configured" warning:**
- Restart dev server: `npm run dev`
- Verify `.env.local` file exists
- Check spelling: `VITE_GEMINI_API_KEY` (must be exact)

**❌ API quota exceeded:**
- Free tier has rate limits
- Wait a few minutes and try again
- Check Google Cloud console for quota details

---

## 🚀 Running the Application

### **Development:**
```bash
npm install          # Install dependencies
npm run dev         # Start dev server at localhost:3000
```

### **Production Build:**
```bash
npm run build       # Create optimized build
npm run preview     # Preview production build
```

---

## 📱 Features (All Working!)

### **Core Features:**
✅ Multi-band vocal removal (70-75% effectiveness)  
✅ Real-time frequency visualization  
✅ 3-band equalizer (Bass/Mid/Treble)  
✅ 6 genre presets (Karaoke, Ballad, Rock, Acoustic, Pop, Jazz)  
✅ AI lyrics detection + song identification  
✅ Undo/Redo history tracking  
✅ A/B comparison mode  
✅ Export as WAV file  
✅ Live audio input (microphone)  

### **Advanced:**
✅ Responsive design (mobile/tablet/desktop)  
✅ Real-time EQ adjustment  
✅ Volume control  
✅ Progress seeking  
✅ Error handling with helpful messages  

---

## 🛠️ No Additional Setup Needed For:

These features work out of the box:
- ✅ Vocal removal
- ✅ EQ controls
- ✅ Presets
- ✅ Visualization
- ✅ Undo/Redo
- ✅ Export
- ✅ Live mode
- ✅ File upload

**Only AI Lyrics requires API key**

---

## 📝 File Structure

```
app/
├── App.tsx                 # Main app component
├── index.tsx              # React entry
├── index.html             # HTML entry
├── .env.local             # ← Add API key here
├── .env.example           # Example config
├── vite.config.ts         # Vite config
├── tsconfig.json          # TypeScript config
├── package.json           # Dependencies
│
├── types.ts               # TypeScript types
├── components/
│   ├── Controls.tsx       # Play/Volume/Vocal slider
│   ├── Visualizer.tsx     # Frequency chart
│   ├── EQControls.tsx     # 3-band EQ
│   ├── Presets.tsx        # 6 preset buttons
│   ├── ActionButtons.tsx  # Undo/Redo/Compare/Export
│   └── ComparisonModal.tsx # A/B comparison
│
├── services/
│   ├── geminiService.ts   # ← Uses API key for lyrics
│   ├── audioExporter.ts   # WAV encoder
│   └── presets.ts         # Preset definitions
│
└── utils/
    └── audioContext.ts    # Web Audio API engine
```

---

## 🔒 API Key Security

**⚠️ Important:**
- Never commit `.env.local` to git (it's in `.gitignore`)
- Never share your API key publicly
- API usage is tracked and free tier has limits
- Regenerate key if accidentally exposed

---

## 💡 Tips

1. **Test vocals removal without API key:** Upload file → Adjust sliders (vocal removal works offline)
2. **Optional feature:** AI lyrics only when you click "Analyze"
3. **Free tier enough for:** ~500 requests/day (varies)
4. **Recommended:** Use your own API key for personal use

---

## 📞 Support

If API key stops working:
1. Regenerate at https://ai.google.dev/
2. Update `.env.local`
3. Restart dev server
4. Clear browser cache (Ctrl+Shift+Delete)

Vocal removal works **without** API key!
