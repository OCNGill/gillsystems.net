# GillSystems — CTA Emoji Sound Plan

## Overview

This document outlines the plan for adding short audio cues to the CTA (Call-To-Action) emoji interactions on the GillSystems.net homepage:
- **"Oh YEAH"** plays on arms emoji (💪) hover
- **"Sweet"** plays on thumbs-up emoji (👍) hover

---

## Design Goals

✅ Very short clips (0.5–2 seconds each)  
✅ Small file size (target < 40 KB per clip after encoding)  
✅ Low latency playback on desktop hover  
✅ Mobile tap support  
✅ Cross-browser compatibility (Chrome, Firefox, Safari, Edge)  
✅ Respects browser autoplay policies and user accessibility preferences  

---

## Implementation Plans

### Plan A: Recommended (Web Audio API + Enable Toggle)

**Approach:**
- Provide a small "Enable sounds" toggle in the CTA area
- On user click, create and unlock an AudioContext
- Pre-load and decode both audio clips as AudioBuffers
- On emoji `mouseenter` (desktop) or `touchstart` (mobile), play the appropriate sound via BufferSourceNode
- Optional: fade out or stop playback on `mouseleave`

**Pros:**
- Low latency (Web Audio API)
- Full control (volume, stop, fade)
- Reliable after user gesture (respects autoplay policy)
- Clean UX affordance

**Cons:**
- Requires one explicit user gesture (one-time)

---

### Plan B: Minimal Friction (HTMLAudioElement)

**Approach:**
- Use standard `<audio>` element with `autoplay`
- Call `play()` on hover
- Catch errors if browser blocks autoplay
- Show optional hint to enable

**Pros:**
- Simplest implementation
- No pre-loading needed

**Cons:**
- Higher latency
- Unreliable without explicit user gesture
- Less control over playback

---

### Plan C: Embedded Data URIs (Single-File Deploy)

**Approach:**
- Encode very small clips as base64 data URIs in JavaScript

**Pros:**
- Single-file deployment
- No separate asset requests

**Cons:**
- Only viable for tiny clips (<10 KB)
- Increases JS payload
- Harder to update

---

## Audio Encoding & File Format

### Recommended Workflow

1. **Record in Audacity** at 48 kHz, mono
2. **Export as WAV** (lossless working format)
3. **Encode to two formats:**
   - **OGG/Opus** (modern browsers, smallest size)
   - **MP3** (fallback for Safari, older browsers)

### ffmpeg Encoding Commands

Run these from the project root after recording:

```powershell
# OGG/Opus encoding (modern, ~10-15 KB per clip)
ffmpeg -i oh-yeah.wav -c:a libopus -b:a 40k -vbr on -ar 24000 -ac 1 oh-yeah.ogg
ffmpeg -i sweet.wav   -c:a libopus -b:a 40k -vbr on -ar 24000 -ac 1 sweet.ogg

# MP3 encoding (fallback, ~20-30 KB per clip)
ffmpeg -i oh-yeah.wav -codec:a libmp3lame -b:a 64k -ar 24000 -ac 1 oh-yeah.mp3
ffmpeg -i sweet.wav   -codec:a libmp3lame -b:a 64k -ar 24000 -ac 1 sweet.mp3
```

### Quality Targets

- **Sample rate:** 22–24 kHz (smaller files; sufficient for voice)
- **Bitrate:** Opus 32–48 kbps VBR; MP3 64 kbps
- **Channels:** Mono (single channel)
- **Result:** ~10–30 KB per clip total

---

## Recording Instructions (Audacity)

### Setup

1. Open Audacity
2. Set **Project Rate** (bottom-left) to **48000 Hz**
3. Set recording to **Mono** (1 channel)
4. Select a good quality microphone (USB condenser, headset, or phone in quiet room)
5. Use a pop filter if available

### Recording

1. Create new audio track
2. Click **Record** button
3. Say clearly: **"Oh YEAH"** (energetic, ~0.8–1.2 seconds)
4. Stop, save this as a new project
5. Create new track, record: **"Sweet"** (upbeat, ~0.6–1.0 seconds)
6. Save as separate project files

### Cleanup (Basic Processing)

1. **Noise Reduction:**
   - Select 0.5 seconds of background noise
   - `Effect → Noise Reduction → Get Noise Profile`
   - Select all (`Ctrl+A`)
   - `Effect → Noise Reduction` (apply with gentle settings)

2. **Normalize:**
   - Select all (`Ctrl+A`)
   - `Effect → Normalize...` set to **–3 dB** (prevents clipping)

3. **Trim & Fade:**
   - Remove leading/trailing silence (leave ~0.1 s)
   - Select last 0.1 seconds of audio
   - `Effect → Fade Out` to prevent clicks at end

4. **Optional: Light Compression**
   - Select all
   - `Effect → Compressor` (light ratio: 2:1, gentle settings)

### Export as WAV

1. `File → Export → Export as WAV`
2. Format: **WAV (Microsoft), signed 16-bit PCM**
3. Filename: `oh-yeah.wav` or `sweet.wav`
4. Save to project root
5. Click **Export**

---

## Web Audio API Integration (cta-component.js)

### High-Level Pseudocode

```javascript
let audioCtx = null;
const buffers = {};
let soundsEnabled = localStorage.getItem('soundsEnabled') === 'true';

// Initialize on first user gesture
async function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
  // Load and decode both clips
  buffers.ohYeah = await loadAndDecode('assets/sounds/oh-yeah.ogg', 'assets/sounds/oh-yeah.mp3');
  buffers.sweet = await loadAndDecode('assets/sounds/sweet.ogg', 'assets/sounds/sweet.mp3');
}

async function loadAndDecode(primaryUrl, fallbackUrl) {
  try {
    const resp = await fetch(primaryUrl);
    const ab = await resp.arrayBuffer();
    return await audioCtx.decodeAudioData(ab);
  } catch {
    // Fallback to second format
    const resp = await fetch(fallbackUrl);
    const ab = await resp.arrayBuffer();
    return await audioCtx.decodeAudioData(ab);
  }
}

function playSound(buffer, volume = 0.8) {
  if (!audioCtx || !soundsEnabled) return;
  
  const src = audioCtx.createBufferSource();
  const gain = audioCtx.createGain();
  
  src.buffer = buffer;
  gain.gain.value = volume;
  
  src.connect(gain).connect(audioCtx.destination);
  src.start(0);
  
  return src;
}

// Add toggle for sounds
document.querySelector('.enable-sounds-btn').addEventListener('click', async () => {
  soundsEnabled = !soundsEnabled;
  localStorage.setItem('soundsEnabled', soundsEnabled);
  
  if (soundsEnabled && !audioCtx) {
    await initAudio();
  }
});

// Hook up to emoji elements
document.querySelector('.arms-emoji').addEventListener('mouseenter', () => {
  if (soundsEnabled && audioCtx) {
    playSound(buffers.ohYeah, 0.9);
  }
});

document.querySelector('.thumbsup-emoji').addEventListener('mouseenter', () => {
  if (soundsEnabled && audioCtx) {
    playSound(buffers.sweet, 0.9);
  }
});
```

---

## Asset File Locations

Place encoded audio files in `assets/sounds/`:

```
assets/
├── sounds/
│   ├── oh-yeah.ogg
│   ├── oh-yeah.mp3
│   ├── sweet.ogg
│   └── sweet.mp3
└── ...existing assets
```

---

## Accessibility & UX Considerations

- **Respect `prefers-reduced-motion`:** Default sounds to OFF if user prefers reduced motion
- **Mobile:** No hover on mobile; map to `touchstart` or require explicit enable
- **Autoplay Policy:** Always require user gesture to unlock AudioContext
- **Volume:** Keep sounds at 70–90% to avoid startling users
- **Mute Toggle:** Provide a visible way to toggle sounds on/off, persist in localStorage

---

## Testing Checklist

- [ ] Desktop Chrome: enable sounds, hover emoji → plays
- [ ] Desktop Firefox: verify OGG plays
- [ ] Desktop Safari: verify MP3 fallback works
- [ ] iOS Safari: test tap behavior, user gesture requirement
- [ ] Android Chrome: test tap and hover (if supported)
- [ ] Check file sizes: each clip < 40 KB
- [ ] Listen for audio quality: no artifacts, clear voice

---

## Next Steps

1. **Record** `oh-yeah.wav` and `sweet.wav` using Audacity steps above
2. **Encode** using ffmpeg commands to produce OGG and MP3 versions
3. **Place files** in `assets/sounds/` directory
4. **Implement** Web Audio integration in `cta-component.js` (Plan A recommended)
5. **Test** across browsers and devices
6. **Deploy** to production

---

**Document version:** 1.0.0  
**Created:** 2025-12-11  
**Status:** Ready for implementation
