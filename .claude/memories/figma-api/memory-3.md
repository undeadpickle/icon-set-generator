# Figma API Memory 3

**Created**: 2025-10-02T12:00:00Z
**Category**: APIs
**Source**: https://www.figma.com/plugin-docs/

## Summary
Core Figma Plugin APIs for component creation, UI communication, and plugin structure. Essential methods and patterns for building functional plugins.

## Key Information

### Plugin Structure (manifest.json)
```json
{
  "name": "Plugin Name",
  "id": "unique-id",
  "api": "1.0.0",
  "editorType": ["figma"],
  "main": "code.js",     // Compiled JavaScript
  "ui": "ui.html"         // Plugin UI
}
```

### UI Communication (Message Passing)

**UI to Plugin**:
```javascript
// In ui.html
parent.postMessage({
  pluginMessage: {
    type: 'generate',
    sizes: [16, 20, 24],
    strokes: [1.6, 2, 2.5]
  }
}, '*');
```

**Plugin to UI**:
```typescript
// In code.ts
figma.ui.onmessage = (msg) => {
  if (msg.type === 'generate') {
    const { sizes, strokes } = msg;
    // Process...
  }
};
```

### Core Component APIs

**Clone Node**:
```typescript
const cloned = sourceNode.clone();
```

**Scale Proportionally**:
```typescript
const scaleFactor = targetSize / node.width;
cloned.rescale(scaleFactor);
```

**Create Component**:
```typescript
const component = figma.createComponent();
component.appendChild(iconNode);
component.name = `Size=${value}`;
```

**Combine as Variants**:
```typescript
const componentSet = figma.combineAsVariants(
  [comp1, comp2, comp3],
  figma.currentPage
);
```

### Show UI
```typescript
figma.showUI(__html__, { width: 400, height: 300 });
```

### Plugin Lifecycle
```typescript
// Close plugin
figma.closePlugin();

// Show notification
figma.notify('✅ Success!');
```

## Relevant To
- All Figma plugin development
- Plugin UI architecture
- Component manipulation basics
