// Types
interface GenerateMessage {
  type: 'generate';
  sizes: number[];
  strokes: number[];
  customName?: string;
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

  // Scale based on the larger dimension to fill square bounds
  const maxDimension = Math.max(sourceNode.width, sourceNode.height);
  const scaleFactor = targetSize / maxDimension;

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

// Create single component set (DRY utility function)
function createSingleComponentSet(
  sourceNode: SceneNode,
  sizes: number[],
  strokes: number[],
  customName?: string
): ComponentSetNode {
  const components: ComponentNode[] = [];
  const iconName = customName || sourceNode.name;

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

    // Center icon in component BEFORE resizing
    resizedIcon.x = (size - resizedIcon.width) / 2;
    resizedIcon.y = (size - resizedIcon.height) / 2;

    // Resize component WITHOUT scaling children
    component.resizeWithoutConstraints(size, size);

    // Remove fills (transparent background)
    component.fills = [];

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

  return componentSet;
}

// Bulk generation logic
function generateBulkComponentSets(
  sourceNodes: SceneNode[],
  sizes: number[],
  strokes: number[],
  customName?: string
): void {
  const componentSets: ComponentSetNode[] = [];
  const errors: { name: string; error: string }[] = [];

  const SPACING = 32; // 4pt grid spacing
  const alignedX = sourceNodes[0].x; // Use first node's X for alignment
  let currentY = sourceNodes[0].y;

  // Process each node
  for (const node of sourceNodes) {
    try {
      // Determine component name
      let componentName: string | undefined;
      if (customName && sourceNodes.length > 1) {
        // Multiple icons with custom name: append index
        componentName = `${customName}-${sourceNodes.indexOf(node) + 1}`;
      } else if (customName && sourceNodes.length === 1) {
        // Single icon with custom name
        componentName = customName;
      }
      // If no custom name, componentName remains undefined and original name is used

      const componentSet = createSingleComponentSet(node, sizes, strokes, componentName);

      // Position component set (vertical stack, aligned X)
      componentSet.x = alignedX;
      componentSet.y = currentY;

      // Update Y for next component set
      currentY += componentSet.height + SPACING;

      componentSets.push(componentSet);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push({ name: node.name, error: errorMessage });
      console.error(`Failed to process "${node.name}":`, error);
    }
  }

  // Select all generated component sets
  if (componentSets.length > 0) {
    figma.currentPage.selection = componentSets;
    figma.viewport.scrollAndZoomIntoView(componentSets);
  }

  // Show result notification
  if (errors.length === 0) {
    const count = componentSets.length;
    const plural = count === 1 ? 'set' : 'sets';
    figma.notify(`✅ Generated ${count} component ${plural}`);
  } else {
    figma.notify(
      `Generated ${componentSets.length} sets, ${errors.length} failed`,
      { error: true }
    );
  }

  // Close plugin
  figma.closePlugin();
}

// Check selection and update UI (DRY utility function)
function updateSelectionStatus(): void {
  const selection = figma.currentPage.selection;

  // Filter valid icon nodes
  const validNodes = selection.filter(node => isValidIconNode(node));

  if (validNodes.length > 0) {
    const iconNames = validNodes.map(node => node.name);

    figma.ui.postMessage({
      type: 'selection-status',
      hasValidSelection: true,
      count: validNodes.length,
      iconNames: iconNames
    });
  } else {
    figma.ui.postMessage({
      type: 'selection-status',
      hasValidSelection: false,
      count: 0,
      iconNames: []
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

    // Filter valid icon nodes
    const validNodes = selection.filter(node => isValidIconNode(node));

    // Validate selection
    if (validNodes.length === 0) {
      figma.notify('❌ Please select at least one valid icon');
      return;
    }

    // Generate component sets (single or bulk)
    generateBulkComponentSets(validNodes, msg.sizes, msg.strokes, msg.customName);
  }
};
