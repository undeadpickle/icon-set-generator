// Types
interface GenerateMessage {
  type: 'generate';
  sizes: number[];
  strokes: number[];
}

type PluginMessage = GenerateMessage;

// Validation
function isValidIconNode(node: SceneNode): boolean {
  const validTypes = ['VECTOR', 'GROUP', 'FRAME'];

  if (!validTypes.includes(node.type)) {
    return false;
  }

  if (node.type === 'FRAME' && (node as FrameNode).clipsContent === false) {
    return false;
  }

  return true;
}

// Clone and resize (DRY utility function)
function createResizedIcon(sourceNode: SceneNode, targetSize: number): SceneNode {
  const cloned = sourceNode.clone();
  const scaleFactor = targetSize / sourceNode.width;

  if ('rescale' in cloned) {
    cloned.rescale(scaleFactor);
  }

  return cloned;
}

// Apply stroke width recursively (DRY utility function)
function applyStrokeWidth(node: SceneNode, strokeWidth: number): void {
  if ('strokeWeight' in node) {
    node.strokeWeight = strokeWidth;
  }

  if ('children' in node) {
    (node as ChildrenMixin).children.forEach(child => {
      applyStrokeWidth(child, strokeWidth);
    });
  }
}

// Main generation logic
function generateComponentSet(
  sourceNode: SceneNode,
  sizes: number[],
  strokes: number[]
): void {
  const components: ComponentNode[] = [];
  const iconName = sourceNode.name;

  // Create component for each size
  sizes.forEach((size, index) => {
    const strokeWidth = strokes[index];

    // Create resized icon
    const resizedIcon = createResizedIcon(sourceNode, size);

    // Apply stroke
    applyStrokeWidth(resizedIcon, strokeWidth);

    // Create component with icon directly (no frame wrapper)
    const component = figma.createComponent();
    component.appendChild(resizedIcon);
    component.name = `Size=${size}`;
    component.resize(size, size);

    // Remove fills (transparent background)
    component.fills = [];

    // Center icon in component
    resizedIcon.x = (size - resizedIcon.width) / 2;
    resizedIcon.y = (size - resizedIcon.height) / 2;

    components.push(component);
  });

  // Combine into component set
  const componentSet = figma.combineAsVariants(components, figma.currentPage);
  componentSet.name = iconName;

  // Enable auto layout for horizontal display
  componentSet.layoutMode = 'HORIZONTAL';
  componentSet.primaryAxisSizingMode = 'AUTO';
  componentSet.counterAxisSizingMode = 'AUTO';
  componentSet.itemSpacing = 16;
  componentSet.paddingLeft = 16;
  componentSet.paddingRight = 16;
  componentSet.paddingTop = 16;
  componentSet.paddingBottom = 16;

  // Remove fills from component set
  componentSet.fills = [];

  // Position near original
  componentSet.x = sourceNode.x + sourceNode.width + 100;
  componentSet.y = sourceNode.y;

  // Select the new component set
  figma.currentPage.selection = [componentSet];
  figma.viewport.scrollAndZoomIntoView([componentSet]);

  figma.notify(`✅ Created component set: ${iconName}`);
}

// Check selection and update UI (DRY utility function)
function updateSelectionStatus(): void {
  const selection = figma.currentPage.selection;

  if (selection.length === 1 && isValidIconNode(selection[0])) {
    figma.ui.postMessage({
      type: 'selection-status',
      hasValidSelection: true,
      iconName: selection[0].name
    });
  } else {
    figma.ui.postMessage({
      type: 'selection-status',
      hasValidSelection: false,
      iconName: null
    });
  }
}

// Plugin initialization
figma.showUI(__html__, { width: 400, height: 300 });

// Send initial selection status to UI
updateSelectionStatus();

// Listen for selection changes
figma.on('selectionchange', () => {
  updateSelectionStatus();
});

// Handle UI messages
figma.ui.onmessage = (msg: PluginMessage) => {
  if (msg.type === 'generate') {
    const selection = figma.currentPage.selection;

    // Validate selection
    if (selection.length === 0) {
      figma.notify('❌ Please select an icon');
      return;
    }

    if (selection.length > 1) {
      figma.notify('❌ Please select only one icon');
      return;
    }

    const selectedNode = selection[0];

    if (!isValidIconNode(selectedNode)) {
      figma.notify('❌ Selected node must be a vector, group, or frame');
      return;
    }

    // Generate component set
    try {
      generateComponentSet(selectedNode, msg.sizes, msg.strokes);
      figma.closePlugin();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      figma.notify(`❌ Error: ${errorMessage}`);
    }
  }
};
