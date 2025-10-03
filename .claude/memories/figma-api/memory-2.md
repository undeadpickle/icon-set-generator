# Figma API Memory 2

**Created**: 2025-10-02T14:30:00Z
**Category**: Patterns
**Source**: Icon Set Generator Bulk Generation Implementation

## Summary

Implemented bulk component set generation with vertical stacking, error handling, and UI feedback for multiple icon selections. Learned patterns for processing multiple nodes, positioning, and user feedback.

## Key Information

### Bulk Generation Pattern

```typescript
// Filter valid nodes before processing
const validNodes = selection.filter((node) => isValidIconNode(node));

// Process each node with error handling (continue on error)
function generateBulkComponentSets(
  sourceNodes: SceneNode[],
  sizes: number[],
  strokes: number[]
): void {
  const componentSets: ComponentSetNode[] = [];
  const errors: { name: string; error: string }[] = [];

  const SPACING = 64; // 8pt grid spacing
  let currentY = sourceNodes[0].y;

  for (const node of sourceNodes) {
    try {
      const componentSet = createSingleComponentSet(node, sizes, strokes);

      // Position component set (vertical stack)
      componentSet.x = node.x;
      componentSet.y = currentY;

      // Update Y for next component set
      currentY += componentSet.height + SPACING;

      componentSets.push(componentSet);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      errors.push({ name: node.name, error: errorMessage });
    }
  }

  // Select all generated component sets
  if (componentSets.length > 0) {
    figma.currentPage.selection = componentSets;
    figma.viewport.scrollAndZoomIntoView(componentSets);
  }
}
```

### Selection Status for Multiple Nodes

```typescript
// Filter and send count + names array to UI
function updateSelectionStatus(): void {
  const selection = figma.currentPage.selection;
  const validNodes = selection.filter((node) => isValidIconNode(node));

  if (validNodes.length > 0) {
    const iconNames = validNodes.map((node) => node.name);

    figma.ui.postMessage({
      type: "selection-status",
      hasValidSelection: true,
      count: validNodes.length,
      iconNames: iconNames,
    });
  }
}
```

### UI Display for Multiple Selections

```javascript
// Show count and list when multiple icons selected
if (msg.count > 1) {
  selectionCountDiv.textContent = `${msg.count} icons selected`;
  selectionCountDiv.style.display = "block";

  // Show list of all icon names
  iconListDiv.innerHTML = msg.iconNames
    .map((name) => `<div class="icon-list-item">• ${name}</div>`)
    .join("");
  iconListDiv.style.display = "block";
}
```

### Vertical Stacking with 8pt Grid

- Use 64px spacing (8 × 8px) for comfortable separation
- Maintain original X coordinate for alignment
- Increment Y by height + spacing for each component set
- Select all generated sets and zoom viewport to fit

### Error Handling Best Practices

- Use try/catch per node (continue on error pattern)
- Track both successful and failed operations
- Log errors to console for debugging
- Show summary notification with counts
- Never stop batch processing due to single error

## Relevant To

- Bulk icon component generation
- Multi-node processing patterns
- Vertical stacking and positioning
- Error resilient batch operations
- User feedback for bulk actions
