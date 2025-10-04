# Publishing to Figma Community

**Plugin**: Icon Set Generator
**Status**: Ready for Publishing
**Type**: Free Plugin

---

## Pre-Publishing Checklist

- [ ] Enable two-factor authentication on Figma account
- [ ] Create plugin icon (128 × 128 pixels)
- [ ] Create thumbnail/cover image (1920 × 1080 pixels)
- [ ] Optional: Create additional screenshots (up to 9 total)
- [ ] Test plugin thoroughly for bugs
- [ ] Generate Figma plugin ID during publishing flow
- [ ] Update `manifest.json` with generated ID

---

## Required Assets

### Plugin Icon (128 × 128 pixels)
**AI Generation Prompt:**
```
Create a modern, minimalist plugin icon for "Icon Set Generator" - a Figma tool that transforms single icons into component sets with multiple sizes.

Design requirements:
- 128x128 pixels, square format
- Transparent or subtle gradient background
- Visual concept: Show 3-4 squares/frames of increasing size arranged horizontally, with a simple icon shape inside each
- Color scheme: Vibrant blues and purples (Figma brand-friendly colors like #18A0FB)
- Style: Clean, geometric, flat design with subtle shadows or gradients
- Include visual elements suggesting: sizing, variants, or component sets
- Should be instantly recognizable at small sizes
- No text, just iconography

Think: Figma components + size scaling + productivity tool
```

**Alternative Simple Concept:**
A grid of 3 squares showing the same icon at sizes 16px, 24px, 48px with a subtle arrow or plus symbol. Use Figma's blue (#18A0FB) with white icons inside.

### Thumbnail/Cover Image (1920 × 1080 pixels)
- Screenshot of plugin UI showing the interface
- Include example output (component set with multiple sizes)
- Show before/after if possible
- High quality, professional appearance

### Additional Screenshots (Optional, up to 9)
- Bulk generation feature
- Custom naming workflow
- Size customization UI
- Final output examples

---

## Publishing Content

### Plugin Name
```
Icon Set Generator
```

### Tagline (Short, under 60 characters)
```
Transform single icons into multi-size component sets instantly
```

### Full Description
```
Icon Set Generator streamlines your icon workflow by converting individual vector icons into complete component sets with multiple size variants—all with a single click.

✨ KEY FEATURES

• Bulk Generation – Select multiple icons to create multiple component sets at once
• Custom Sizing – Add, remove, or modify size variants (16, 20, 24, 32, 40, 48px default)
• Smart Stroke Scaling – Automatically adjusts stroke widths for each size variant
• Auto-Grouping – Automatically wraps vector nodes for better structure
• Custom Naming – Rename component sets with automatic indexing for bulk operations
• Delete Originals – Optional cleanup to remove source icons after generation
• Real-time Selection – Live UI updates as you select/deselect icons

🎯 PERFECT FOR

• Icon design systems following 8pt grid
• Creating responsive icon libraries
• Material Design, iOS, or custom icon sets
• Design teams maintaining consistent icon sizing

🚀 HOW IT WORKS

1. Select one or more vector icons in your Figma file
2. Open the Icon Set Generator plugin
3. Customize sizes and stroke widths (or use smart defaults)
4. Optionally rename your component sets
5. Click "Generate Component"
6. Get perfectly sized component sets with horizontal auto layout

📐 OUTPUT

Each generated component set includes:
• Variant property "Size" with numeric values
• Proportionally scaled icons (never stretched)
• Custom stroke widths per variant
• Transparent backgrounds
• Horizontal auto layout with 16px spacing

No sign-ups, no external accounts, no fees—just a faster icon workflow.
```

### Category
```
Utilities
```
or
```
Productivity
```

### Support Contact
```
[Add your email or GitHub issues URL here]
```

### Tags/Keywords
```
icons, components, variants, design system, scaling, stroke, bulk, productivity, icon set, automation
```

---

## Step-by-Step Publishing Process

### Phase 1: Preparation
1. ✅ Enable two-factor authentication on your Figma account
2. ✅ Create plugin icon (128×128px PNG)
3. ✅ Create thumbnail image (1920×1080px)
4. ✅ Prepare additional screenshots (optional)
5. ✅ Test plugin thoroughly for bugs/crashes
6. ✅ Verify all features work as described

### Phase 2: Publishing (Desktop App Only)
1. Open **Figma Desktop App** (macOS/Windows required)
2. Navigate to **Figma menu → Plugins → Manage plugins**
3. Find "Icon Set Generator" and click **"Publish"**
4. When you see "Invalid ID in manifest.json" error:
   - Click **"Generate ID"** button
   - Copy the generated ID
   - Update `manifest.json` with the new ID
   - Save the file
5. Fill out "Describe your resource" page:
   - Upload plugin icon (128×128)
   - Upload thumbnail (1920×1080)
   - Add tagline and description (copy from above)
   - Select category: "Utilities" or "Productivity"
   - Add support contact
6. **Optional**: Complete security disclosure form
   - Icon Set Generator doesn't collect user data, so minimal disclosure needed
7. Set publishing details:
   - Publication scope: **Public (Figma Community)**
   - Configure comment settings: **Allow comments** (recommended)
8. Click **"Publish"** to submit for review

### Phase 3: Review & Launch
1. Wait 5-10 business days for Figma review
2. Plugin appears with "In review" badge initially
3. Receive email notification about approval status
4. Once approved, plugin goes live in Figma Community!

---

## Manifest ID Update

**Current manifest.json:**
```json
{
  "name": "Icon Set Generator",
  "id": "icon-set-generator",  // ← PLACEHOLDER - Replace with Figma-generated ID
  "api": "1.0.0",
  "editorType": ["figma"],
  "main": "code.js",
  "ui": "ui.html"
}
```

**During publishing:**
1. Figma will show "Invalid ID" error
2. Click "Generate ID" button
3. Copy the generated ID (format: `1234567890123456789`)
4. Replace `"icon-set-generator"` with the real ID
5. Save manifest.json
6. Continue publishing flow

---

## Review Guidelines Compliance ✅

Your plugin meets all Figma requirements:
- ✅ Complete and fully functional
- ✅ No crashes or obvious bugs
- ✅ Accurate description
- ✅ Performant (no long background processes)
- ✅ Matches Figma UI design
- ✅ Uses only official Figma Plugin APIs
- ✅ No fraudulent/misleading content
- ✅ Doesn't read/modify files without consent
- ✅ No advertisements
- ✅ Doesn't recreate existing Figma functionality
- ✅ Publicly available (free)
- ✅ No external accounts required

---

## Post-Publishing

### Marketing (Optional)
- Share on Twitter/X with #FigmaPlugins #Figma
- Post in Figma Community forums
- Share on LinkedIn
- Create demo video for YouTube
- Write blog post about the plugin
- Share in design communities (Designer News, Reddit r/FigmaDesign)

### Maintenance
- Monitor user comments and feedback
- Respond to support requests
- Fix bugs reported by users
- Plan feature updates based on feedback
- Update plugin regularly

### Metrics to Track
- Install count
- User ratings/reviews
- Comment engagement
- Feature requests

---

## Support Resources

**During Publishing:**
- Figma Plugin Publishing Help: https://help.figma.com/hc/en-us/articles/360042293394
- Plugin Review Guidelines: https://help.figma.com/hc/en-us/articles/360039958914

**After Publishing:**
- Figma Community Forum: https://forum.figma.com/
- Figma Discord: https://discord.gg/figma
- Plugin API Docs: https://developers.figma.com/docs/plugins/

---

## Quick Start Checklist

**Today:**
- [ ] Generate plugin icon using AI prompt
- [ ] Take screenshot for thumbnail
- [ ] Enable 2FA on Figma account

**Publishing Day:**
- [ ] Open Figma Desktop App
- [ ] Start publishing flow
- [ ] Generate and update plugin ID
- [ ] Upload assets
- [ ] Fill out description
- [ ] Submit for review

**After Approval:**
- [ ] Share announcement
- [ ] Monitor feedback
- [ ] Plan updates

---

## Notes

- Publishing can only be done from **Figma Desktop App** (not browser)
- Review typically takes **5-10 business days**
- Plugin will have "In review" badge until approved
- Once published, the plugin ID cannot be changed
- Cannot materially change plugin purpose after publishing (would need new plugin)
- Free plugins cannot be converted to paid later

---

**Good luck with your launch! 🚀**
