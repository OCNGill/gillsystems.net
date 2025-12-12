---
description: How to create a new solution page with terminal effects, colored text, and audio CTA
---

# Solution Page Creation Workflow

## Lessons Learned: System Architecture Page

### Issues Encountered

#### 1. Color Tags Not Rendering
**Problem:** Used inline `style="color: #00ffff"` spans which bypassed the JavaScript animation system entirely.

**Root Cause:** The `solutions-pages.js` uses a TreeWalker to detect specific HTML tags (`<white>`, `<blue>`, `<yellow>`) and marks them for special rendering. Inline styles are ignored.

**Solution:** Use the custom HTML tags defined in `styles.css`:
- `<white>` - renders as white text (var(--text-primary))
- `<blue>` - renders as cyan text (var(--accent-secondary)) 
- `<yellow>` - renders as yellow text (var(--accent-warning))

#### 2. JavaScript Config Required for Color Tags
**Problem:** Even with correct HTML tags, colors showed as hash characters during animation.

**Root Cause:** The `solutions-pages.js` only had `whiteTagSelector` in decodeOptions. Blue and yellow weren't configured.

**Solution:** Added to the systemarchitecture config in solutions-pages.js:
```javascript
decodeOptions: {
    whiteTagSelector: 'white',
    cyanTagSelector: 'blue',      // NEW
    yellowTagSelector: 'yellow',   // NEW
    waveLength: 18,
    waveSpeed: 70
    // NOTE: Removed redWaveSelector - not used on this page
}
```

Also added detection and rendering logic in `buildCharMetadata()` and `rebuildTextWithHash()` functions to handle `isCyan` and `isYellow` flags.

#### 3. Multi-Line HTML Breaks Animation
**Problem:** Auto-formatting the paragraph across multiple lines broke the terminal animation.

**Root Cause:** Line breaks inside span tags created whitespace issues in the text walker.

**Solution:** Keep the entire `<p class="solution-text">` content on a SINGLE LINE in the HTML file. Do not let editors auto-format it.

#### 4. Audio Not Working on file:// URLs
**Problem:** Audio worked on live site but not when testing locally via file:// URLs.

**Root Cause:** Browser security restrictions block AudioContext on file:// protocol.

**Solution:** Always test via local server:
```bash
npx -y serve .
# Then use http://localhost:3000/solutions/page-name.html
```

#### 5. Using Wrong Element IDs
**Problem:** Created new sa-* prefixed IDs but JS config expected dt-* IDs (or vice versa).

**Root Cause:** Mismatch between HTML element IDs and JS config loaderId, contentId, etc.

**Solution:** For solution pages that share the same structure, keep using `dt-*` IDs:
- `dt-loader`, `dt-content`, `dt-scanlines`, `dt-terminal-typed-text`, `dt-terminal-cursor`, `dt-text`, `dt-cta-container`

The JS differentiates pages by `data-solution` attribute, not by element IDs.

---

## Generic Prompt for Creating New Solution Pages

### Usage
Copy and paste the prompt below, then fill in the two inputs:

---

**PROMPT:**

```
CREATE NEW SOLUTION PAGE: [PAGE_NAME]

1. Copy solutions/digital-transformation.html to solutions/[filename].html

2. Update these elements:
   - <title>: [PAGE_TITLE] | Gillsystems - Real Solutions for Real Businesses
   - <meta name="description">: [META_DESCRIPTION]
   - <h1 class="solution-title">: [H1_TITLE]
   - <p class="solution-subtitle">: [SUBTITLE]
   - data-solution attribute: [SOLUTION_KEY] (lowercase, no spaces/hyphens)
   - loader text: LOADING [EXE_NAME].EXE...

3. Replace the paragraph content (line 50) with:
   [CONTENT - see formatting rules below]

4. Add config to solutions-pages.js (after the last config object, before the closing bracket):
   ,
   {
       key: '[SOLUTION_KEY]',
       loaderId: 'dt-loader',
       contentId: 'dt-content',
       scanlinesId: 'dt-scanlines',
       typedTextId: 'dt-terminal-typed-text',
       cursorId: 'dt-terminal-cursor',
       textId: 'dt-text',
       loaderMessages: [
           'C:\\> LOADING [EXE_NAME].EXE...',
           'BOOT COMPLETE.'
       ],
       decodeOptions: {
           whiteTagSelector: 'white',
           cyanTagSelector: 'blue',
           yellowTagSelector: 'yellow',
           waveLength: 18,
           waveSpeed: 70
       }
   }

5. Keep dt-* element IDs unchanged
6. Keep all scripts, CTA, footer identical
7. Test via: http://localhost:3000/solutions/[filename].html

CONTENT FORMATTING RULES:
- Entire <p> must be on ONE LINE (no line breaks)
- Use <white>text</white> for white highlighted text
- Use <blue>text</blue> for cyan (#00ffff) text
- Use <yellow>text</yellow> for yellow (#ffff00) text
- Use <span class="red-wave">text</span> for red wave effect (optional)
- NO red wave unless specifically requested
- Content wraps naturally on mobile - avoid extremely long words
```

---

### INPUT TEMPLATE

**Panel Info:**
```
PAGE_NAME: Technical Support
FILENAME: technical-support.html
PAGE_TITLE: Technical Support
META_DESCRIPTION: [Your description here]
H1_TITLE: Technical Support
SUBTITLE: [Your subtitle here]
SOLUTION_KEY: technicalsupport
EXE_NAME: TECHNICAL_SUPPORT
```

**Content:**
```
[Your paragraph content here with <white>, <blue>, <yellow> tags for colored text]
```

---

### Checklist Before Commit
- [ ] Page loads without JS errors
- [ ] Terminal boot animation plays
- [ ] Hash decode animation works
- [ ] Colored text renders correctly (white/blue/yellow)
- [ ] CTA component appears after animation
- [ ] Audio plays on hover (test via localhost, not file://)
- [ ] Content readable on mobile (no horizontal scroll)
- [ ] No red wave effect (unless specifically requested)
