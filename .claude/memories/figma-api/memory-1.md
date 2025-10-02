# Figma API Memory 1

**Created**: 2025-10-02T12:45:00Z
**Category**: Solutions
**Source**: Icon Set Generator Plugin Implementation

## Summary
Successfully implemented component set generation with auto layout, transparent backgrounds, and proper icon scaling. Key learnings about component structure and layout modes.

## Key Information

### Component Set with Auto Layout
```typescript
// After combining into component set, enable horizontal auto layout
const componentSet = figma.combineAsVariants(components, figma.currentPage);

// Configure auto layout
componentSet.layoutMode = 'HORIZONTAL';
componentSet.primaryAxisSizingMode = 'AUTO';
componentSet.counterAxisSizingMode = 'AUTO';
componentSet.itemSpacing = 16;
componentSet.paddingLeft = 16;
componentSet.paddingRight = 16;
componentSet.paddingTop = 16;
componentSet.paddingBottom = 16;

// Remove fills for transparency
componentSet.fills = [];
```

### Transparent Components (No Fills)
```typescript
// Components need fills = [] for transparent background
const component = figma.createComponent();
component.fills = [];  // Critical for transparent background

// Don't wrap in frames - place icons directly
component.appendChild(resizedIcon);
```

### Icon Scaling Pattern
```typescript
function createResizedIcon(sourceNode: SceneNode, targetSize: number): SceneNode {
  const cloned = sourceNode.clone();
  const scaleFactor = targetSize / sourceNode.width;

  if ('rescale' in cloned) {
    cloned.rescale(scaleFactor);  // Maintains aspect ratio
  }

  return cloned;
}
```

## Relevant To
- Icon Set Generator component creation
- Any plugin needing transparent component sets with auto layout
- Proportional icon scaling without frames
