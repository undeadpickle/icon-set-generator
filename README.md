# Icon Set Generator - Figma Plugin

A Figma plugin that generates component sets with multiple size variants from a single vector icon.

## Features

- **Bulk generation** - Select multiple icons to create multiple component sets at once
- **Real-time selection monitoring** - Button updates as you select/deselect icons
- Creates component set with customizable size variants
- Applies proportional scaling to icons
- Sets custom stroke widths for each size
- **Add/remove sizes dynamically** with + and × buttons
- Default sizes: 16, 20, 24, 32, 40, 48px
- Default strokes: 1.6, 2, 2.5, 3, 3.5, 4px
- Horizontal auto layout with transparent backgrounds

## How to Test in Figma

### 1. Import the Plugin

1. Open Figma desktop app
2. Go to **Plugins** → **Development** → **Import plugin from manifest...**
3. Select the `manifest.json` file in this directory
4. Plugin will appear in **Plugins** → **Development** → **Resize Icon**

### 2. Prepare a Test Icon

1. Create or select a vector icon in your Figma file
2. Icon must be:change
   - A vector, group, or frame
   - Not a raster image, section, or existing component
   - Have editable stroke

### 3. Run the Plugin

1. Run **Plugins** → **Development** → **Resize Icon** (can run before or after selecting)
2. Select one or more valid icons (if not already selected)
3. UI displays and updates in real-time:
   - **Single icon**: Shows icon name in title
   - **Multiple icons**: Shows count ("3 icons selected") and list of all icon names
   - **No selection**: Warning message with disabled button
   - 6 default size/stroke input pairs
   - Generate button (enabled only if valid icon(s) selected)
4. Customize as needed:
   - Remove sizes: Click red × button on any card
   - Add sizes: Click "+ Add Size" button (adds +8px size, +0.5px stroke)
   - Edit values: Modify size and stroke inputs directly
5. Click **Generate Component** button
   - **Single icon**: Creates 1 component set
   - **Multiple icons**: Creates one component set per icon, vertically stacked with 32px spacing

### 4. Expected Result

**Single Icon Selected:**
- One component set named after your original icon
- Auto layout enabled (horizontal)
- 6 variants with property "Size" (16, 20, 24, 32, 40, 48)
- Variants displayed horizontally with 16px spacing
- Transparent background (no fills)
- Icons proportionally scaled and centered

**Multiple Icons Selected:**
- One component set per selected icon
- Each named after its source icon
- All component sets vertically stacked with 32px spacing
- Same size/stroke settings applied to all
- Notification shows count: "✅ Generated 3 component sets"

## Development

### Build

```bash
npm install
npm run build
```

### Watch Mode

```bash
npm run watch
```

## Files

**Core Plugin**:

- `manifest.json` - Plugin configuration
- `code.ts` - Main plugin logic (TypeScript)
- `code.js` - Compiled JavaScript (generated)
- `ui.html` - Plugin user interface
- `tsconfig.json` - TypeScript configuration
- `package.json` - Node dependencies

**Documentation**:

- `docs/figma-api/` - Comprehensive Figma Plugin API reference
- `.claude/memories/figma-api/` - Agent memory system (3 rotating knowledge files)
- `.claude/agents/figma-api-expert.md` - Figma API research sub-agent

## Architecture

### Main Thread (`code.ts`)

- **Real-time selection monitoring** (`figma.on('selectionchange')`)
- Selection validation (vector/group/frame only)
- Icon cloning and resizing (`createResizedIcon`)
- Stroke width application (`applyStrokeWidth` - recursive)
- Component creation with transparent background
- Component set generation with auto layout
- Bi-directional messaging (UI ↔ Plugin)

### UI Thread (`ui.html`)

- Dynamic size/stroke input grid (3-column layout)
- Add/remove size functionality with state management
- Real-time input validation
- Message passing to main thread
- Minimum 1 size constraint

## DRY Principles Applied

- **Reusable functions**: `createResizedIcon()` and `applyStrokeWidth()` used for all sizes
- **Type-safe messaging**: Shared interface for UI-to-plugin communication
- **Template rendering**: Single card template for all size inputs
- **Configuration**: Default values in constants
