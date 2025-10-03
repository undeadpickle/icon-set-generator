# Figma API Memory 4

**Created**: 2025-10-02T12:15:00Z
**Category**: Patterns
**Source**: Figma Plugin API Research

## Summary

Recursive stroke width application and component variant creation patterns. Methods for traversing node trees and applying properties to all vector children.

## Key Information

### Recursive Stroke Application

```typescript
// Apply stroke width to all vector nodes recursively
function applyStrokeWidth(node: SceneNode, strokeWidth: number): void {
  // Check if node has strokeWeight property
  if ("strokeWeight" in node) {
    node.strokeWeight = strokeWidth;
  }

  // Recursively apply to children
  if ("children" in node) {
    (node as ChildrenMixin).children.forEach((child) => {
      applyStrokeWidth(child, strokeWidth);
    });
  }
}
```

**When to Use**: When icons are groups or frames containing multiple vector children that all need the same stroke width.

### Component Variant Creation

```typescript
// Create individual components with variant naming pattern
const component = figma.createComponent();
component.name = `Size=${size}`; // Pattern: PropertyName=Value

// Figma extracts variant properties from names
const componentSet = figma.combineAsVariants(components, figma.currentPage);
// Result: Variant property "Size" with values 16, 20, 24, etc.
```

### Type Guards for Node Operations

```typescript
// Always check if methods exist before calling
if ("rescale" in cloned) {
  cloned.rescale(scaleFactor);
}

if ("strokeWeight" in node) {
  node.strokeWeight = value;
}
```

**Why**: Not all SceneNode types support all operations. Type guards prevent runtime errors.

## Relevant To

- Stroke manipulation across complex icon structures
- Variant property naming conventions
- Safe node property access
