# Figma Plugin API Research - Documentation Index

**Research Completed**: October 2, 2025
**Plugin**: Icon Set Generator

This directory contains comprehensive research and documentation for building the Icon Set Generator Figma plugin using the official Figma Plugin API.

---

## Documentation Files

### 1. FIGMA_PLUGIN_API_REFERENCE.md
**Complete API Reference**

Comprehensive documentation covering all Figma Plugin API methods needed for the Icon Set Generator:

- Component Set Creation with Variants
- Clone and Scale Vector Nodes
- Stroke Width Management
- Plugin Structure and Manifest
- UI Communication
- Complete Implementation Examples

**Use this for**: Detailed API explanations, code examples, and understanding how each API works.

### 2. QUICK_REFERENCE.md
**Quick Lookup Guide**

Fast reference for common API patterns:

- Component set creation snippets
- Clone & scale one-liners
- Stroke width helpers
- Message passing templates
- Common patterns and type checking

**Use this for**: Quick copy-paste code snippets during development.

### 3. IMPLEMENTATION_GUIDE.md
**Step-by-Step Implementation**

Complete walkthrough for building the Icon Set Generator:

- Project setup instructions
- File-by-file implementation
- Core logic (code.ts)
- UI implementation (ui.html)
- Build and test procedures
- Troubleshooting guide

**Use this for**: Following the exact steps to build the plugin from scratch.

---

## Quick Start

If you want to start building immediately:

1. Read: `IMPLEMENTATION_GUIDE.md` - Step 1 (Project Setup)
2. Reference: `QUICK_REFERENCE.md` - For code snippets
3. Deep dive: `FIGMA_PLUGIN_API_REFERENCE.md` - When you need details

---

## Key API Methods Summary

### Component Sets
```typescript
const component = figma.createComponent()
component.name = "Size=16"

const componentSet = figma.combineAsVariants(
  [component1, component2],
  figma.currentPage
)
```

### Clone & Scale
```typescript
const cloned = node.clone()
cloned.rescale(2.0)  // Scale to 200%
```

### Stroke Width
```typescript
node.strokeWeight = 2.5

// Recursive application
function applyStrokeRecursively(node, strokeWidth) {
  if ('strokeWeight' in node) {
    node.strokeWeight = strokeWidth
  }
  if ('children' in node) {
    node.children.forEach(child => {
      applyStrokeRecursively(child, strokeWidth)
    })
  }
}
```

### UI Communication
```javascript
// UI to Plugin
parent.postMessage({
  pluginMessage: { type: 'generate', data: {...} }
}, '*')

// Plugin to UI
figma.ui.postMessage({ type: 'status', message: 'Done!' })
```

---

## Minimal Plugin Structure

```
icon-set-generator/
├── manifest.json          # Plugin configuration
├── code.ts               # Main logic (compiles to code.js)
├── ui.html               # User interface
├── tsconfig.json         # TypeScript config
└── package.json          # Dependencies
```

**Files used by Figma**:
- `manifest.json`
- `code.js` (compiled from code.ts)
- `ui.html`

---

## manifest.json Template

```json
{
  "name": "Icon Set Generator",
  "id": "PLACEHOLDER_ID",
  "api": "1.0.0",
  "editorType": ["figma"],
  "main": "code.js",
  "ui": "ui.html",
  "documentAccess": "dynamic-page",
  "networkAccess": {
    "allowedDomains": ["none"]
  }
}
```

---

## Build Process

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run build

# Or watch mode
npm run watch
```

---

## Testing in Figma

1. Open Figma Desktop App
2. Menu → Plugins → Development → Import plugin from manifest
3. Select your `manifest.json`
4. Create a test vector icon
5. Select it and run the plugin
6. Verify component set creation

---

## Research Sources

All documentation is based on official Figma Plugin API documentation:

- **Main Docs**: https://developers.figma.com/docs/plugins/
- **API Reference**: https://developers.figma.com/docs/plugins/api/
- **Component Sets**: https://developers.figma.com/docs/plugins/api/ComponentSetNode/
- **Variants**: https://developers.figma.com/docs/plugins/api/properties/figma-combineasvariants/
- **Vector Nodes**: https://developers.figma.com/docs/plugins/api/VectorNode/
- **Manifest**: https://developers.figma.com/docs/plugins/manifest/
- **UI Creation**: https://developers.figma.com/docs/plugins/creating-ui/

Documentation current as of **October 2025**.

---

## Next Steps

1. Follow `IMPLEMENTATION_GUIDE.md` to set up the project
2. Implement the core functionality from the examples
3. Test with various icon types
4. Iterate on the UI design
5. Publish to Figma Community (optional)

---

## Questions Answered

This research answers your specific questions:

1. **Component Set Creation** ✓
   - How to create component sets with variant properties
   - Setting "Size" property with numeric values (16, 20, 24, 32, 40, 48)
   - Exact API methods: `figma.createComponent()`, `figma.combineAsVariants()`

2. **Clone and Scale Vectors** ✓
   - How to clone nodes with `node.clone()`
   - How to scale proportionally with `node.rescale(factor)`
   - Maintaining aspect ratio automatically

3. **Stroke Width** ✓
   - Setting stroke width with `node.strokeWeight`
   - Applying recursively to all vector children
   - Complete recursive function provided

4. **Plugin Structure** ✓
   - Minimal file structure documented
   - manifest.json configuration explained
   - Separation of code.ts (main thread) and ui.html (UI thread)

5. **UI Communication** ✓
   - Message passing with `parent.postMessage()` and `figma.ui.postMessage()`
   - Complete bidirectional communication examples
   - Data types and patterns explained

All information stored in this documentation for future reference.

---

## File Paths

All documentation files are located at:

```
/Users/travisgregory/Projects/Icon Set Generator/docs/figma-api/
├── README.md                          (this file)
├── FIGMA_PLUGIN_API_REFERENCE.md      (complete reference)
├── QUICK_REFERENCE.md                 (quick lookup)
└── IMPLEMENTATION_GUIDE.md            (step-by-step guide)
```
