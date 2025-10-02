# Figma Plugin API Quick Reference

Quick lookup guide for common API patterns in Icon Set Generator.

---

## Component Set Creation

```typescript
// Create individual components
const component = figma.createComponent()
component.name = "Size=16"  // Variant property format
component.resize(16, 16)

// Combine into component set
const componentSet = figma.combineAsVariants(
  [component1, component2, component3],
  figma.currentPage
)
componentSet.name = "Icon Set"
```

---

## Clone & Scale

```typescript
// Clone a node
const cloned = originalNode.clone()

// Scale proportionally from top-left
cloned.rescale(2.0)  // 200% of original

// Or resize to exact dimensions
cloned.resize(48, 48)

// Calculate scale factor
const scaleFactor = targetSize / originalNode.width
cloned.rescale(scaleFactor)
```

---

## Stroke Width

```typescript
// Set stroke width
node.strokeWeight = 2.5

// Apply recursively to all children
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

---

## Plugin UI

### manifest.json
```json
{
  "name": "Icon Set Generator",
  "id": "1234567890123456789",
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

### Show UI
```typescript
figma.showUI(__html__, {
  width: 400,
  height: 600,
  themeColors: true
})
```

---

## Message Passing

### UI → Plugin
```javascript
// In ui.html
parent.postMessage({
  pluginMessage: {
    type: 'generate',
    data: { sizes: [16, 24, 48] }
  }
}, '*')
```

```typescript
// In code.ts
figma.ui.onmessage = (msg) => {
  if (msg.type === 'generate') {
    const sizes = msg.data.sizes
    // Process...
  }
}
```

### Plugin → UI
```typescript
// In code.ts
figma.ui.postMessage({
  type: 'status',
  message: 'Processing...'
})
```

```javascript
// In ui.html
onmessage = (event) => {
  const msg = event.data.pluginMessage
  console.log(msg.message)
}
```

---

## Common Patterns

### Get Selection
```typescript
const selection = figma.currentPage.selection
const firstNode = selection[0]

if (selection.length === 0) {
  figma.notify('Please select something')
  return
}
```

### Close Plugin
```typescript
figma.closePlugin()
figma.closePlugin('Success message!')
```

### Position Nodes
```typescript
node.x = 100
node.y = 200

// Center child in parent
child.x = (parent.width - child.width) / 2
child.y = (parent.height - child.height) / 2
```

### Focus Viewport
```typescript
// Select nodes
figma.currentPage.selection = [componentSet]

// Zoom to fit
figma.viewport.scrollAndZoomIntoView([componentSet])
```

---

## Type Checking

```typescript
// Check node type
if (node.type === 'VECTOR') { }
if (node.type === 'COMPONENT') { }
if (node.type === 'COMPONENT_SET') { }

// Check for properties
if ('strokeWeight' in node) { }
if ('children' in node) { }
if ('resize' in node) { }
```

---

## Error Handling

```typescript
try {
  // Plugin logic
  await generateIconSet()
  figma.closePlugin('Success!')
} catch (error) {
  figma.ui.postMessage({
    type: 'error',
    message: error.message
  })
}
```

---

## Notifications

```typescript
// Simple notification
figma.notify('Component created!')

// Notification with timeout
figma.notify('Processing...', { timeout: 2000 })

// Error notification
figma.notify('Error: Invalid selection', { error: true })
```

---

## File Paths Reference

### Development Structure
```
icon-set-generator/
├── manifest.json
├── code.ts          (compile to →)  code.js
├── ui.html
├── tsconfig.json
└── package.json
```

### Production Files (used by Figma)
```
manifest.json
code.js              (compiled from code.ts)
ui.html
```

---

## Build Commands

```bash
# Compile TypeScript
tsc

# Watch mode
tsc --watch

# With bundler (if using webpack/esbuild)
npm run build
```

---

## Useful Links

- **Official API Docs**: https://developers.figma.com/docs/plugins/
- **ComponentSetNode**: https://developers.figma.com/docs/plugins/api/ComponentSetNode/
- **combineAsVariants**: https://developers.figma.com/docs/plugins/api/properties/figma-combineasvariants/
- **VectorNode**: https://developers.figma.com/docs/plugins/api/VectorNode/
- **Plugin Manifest**: https://developers.figma.com/docs/plugins/manifest/
- **Creating UI**: https://developers.figma.com/docs/plugins/creating-ui/
