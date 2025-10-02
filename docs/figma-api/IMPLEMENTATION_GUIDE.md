# Icon Set Generator - Implementation Guide

Step-by-step implementation guide for building the Icon Set Generator Figma plugin.

**Last Updated**: October 2, 2025

---

## Project Requirements

Build a Figma plugin that transforms a single vector icon into a component set with multiple size variants, each with customizable stroke widths.

**End Result**: A ComponentSet with variants for different sizes (16px, 20px, 24px, 32px, 40px, 48px) where each variant has an appropriate stroke width.

---

## Implementation Steps

### Step 1: Project Setup

1. **Create project structure**:
```
icon-set-generator/
├── manifest.json
├── code.ts
├── ui.html
├── tsconfig.json
└── package.json
```

2. **Initialize package.json**:
```json
{
  "name": "icon-set-generator",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc",
    "watch": "tsc --watch"
  },
  "devDependencies": {
    "@figma/plugin-typings": "^1.90.0",
    "typescript": "^5.0.0"
  }
}
```

3. **Configure tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES6",
    "lib": ["ES2015"],
    "strict": true,
    "typeRoots": ["./node_modules/@types", "./node_modules/@figma"]
  }
}
```

4. **Install dependencies**:
```bash
npm install
```

---

### Step 2: Create manifest.json

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

Note: The `id` field will be assigned by Figma when you first publish.

---

### Step 3: Build the Core Logic (code.ts)

#### 3.1 Main Entry Point

```typescript
// code.ts

// Show UI when plugin starts
figma.showUI(__html__, {
  width: 400,
  height: 600,
  themeColors: true
})

// Listen for messages from UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate') {
    try {
      await generateIconSet(msg.config)
      figma.closePlugin('Icon set created successfully!')
    } catch (error) {
      figma.ui.postMessage({
        type: 'error',
        message: error.message
      })
    }
  }

  if (msg.type === 'cancel') {
    figma.closePlugin()
  }
}
```

#### 3.2 Icon Set Generation Function

```typescript
interface IconConfig {
  sizes: number[]
  strokes: number[]
}

async function generateIconSet(config: IconConfig) {
  // 1. Validate selection
  const selection = figma.currentPage.selection

  if (selection.length === 0) {
    throw new Error('Please select a vector icon')
  }

  const sourceNode = selection[0]

  // 2. Validate node type
  if (!isValidIconNode(sourceNode)) {
    throw new Error('Selected node must be a vector, group, or frame')
  }

  // 3. Create components for each size
  const components: ComponentNode[] = []

  for (let i = 0; i < config.sizes.length; i++) {
    const size = config.sizes[i]
    const stroke = config.strokes[i]

    // Send progress update to UI
    figma.ui.postMessage({
      type: 'progress',
      message: `Creating ${size}px variant...`,
      current: i + 1,
      total: config.sizes.length
    })

    // Create variant component
    const component = createIconVariant(sourceNode, size, stroke)
    components.push(component)
  }

  // 4. Combine into component set
  const componentSet = figma.combineAsVariants(
    components,
    figma.currentPage,
    0
  )

  // 5. Name and position component set
  componentSet.name = sourceNode.name || 'Icon Set'
  componentSet.x = sourceNode.x + sourceNode.width + 100
  componentSet.y = sourceNode.y

  // 6. Select and zoom to new component set
  figma.currentPage.selection = [componentSet]
  figma.viewport.scrollAndZoomIntoView([componentSet])
}
```

#### 3.3 Create Individual Variant

```typescript
function createIconVariant(
  sourceNode: SceneNode,
  size: number,
  strokeWidth: number
): ComponentNode {
  // 1. Clone the source icon
  const cloned = sourceNode.clone()

  // 2. Calculate scale factor (assumes square icons)
  const scaleFactor = size / Math.max(sourceNode.width, sourceNode.height)
  cloned.rescale(scaleFactor)

  // 3. Apply stroke width to all vector children
  applyStrokeRecursively(cloned, strokeWidth)

  // 4. Create component frame
  const component = figma.createComponent()
  component.name = `Size=${size}`
  component.resize(size, size)

  // 5. Add cloned icon to component
  component.appendChild(cloned)

  // 6. Center the icon in the component
  cloned.x = (size - cloned.width) / 2
  cloned.y = (size - cloned.height) / 2

  return component
}
```

#### 3.4 Apply Stroke Recursively

```typescript
function applyStrokeRecursively(node: SceneNode, strokeWidth: number) {
  // Apply stroke if node supports it
  if ('strokeWeight' in node && node.type !== 'GROUP') {
    // Only set if node has strokes
    if (node.strokes && node.strokes.length > 0) {
      node.strokeWeight = strokeWidth
    }
  }

  // Recursively apply to children
  if ('children' in node) {
    for (const child of node.children) {
      applyStrokeRecursively(child, strokeWidth)
    }
  }
}
```

#### 3.5 Validation Helper

```typescript
function isValidIconNode(node: SceneNode): boolean {
  const validTypes = [
    'VECTOR',
    'BOOLEAN_OPERATION',
    'STAR',
    'LINE',
    'ELLIPSE',
    'POLYGON',
    'RECTANGLE',
    'GROUP',
    'FRAME'
  ]

  return validTypes.includes(node.type)
}
```

---

### Step 4: Build the UI (ui.html)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 16px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 12px;
      color: #333;
    }

    h2 {
      margin: 0 0 16px 0;
      font-size: 14px;
      font-weight: 600;
    }

    .size-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }

    .size-item {
      border: 1px solid #e5e5e5;
      border-radius: 6px;
      padding: 12px;
      position: relative;
      text-align: center;
      background: white;
      transition: all 0.2s;
    }

    .size-item:hover {
      border-color: #0066ff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .remove-btn {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #ff4444;
      color: white;
      border: none;
      cursor: pointer;
      font-size: 12px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .remove-btn:hover {
      background: #cc0000;
    }

    .size-preview {
      width: 60px;
      height: 60px;
      margin: 0 auto 8px;
      background: #f5f5f5;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .size-label {
      font-weight: 600;
      margin-bottom: 6px;
      font-size: 13px;
    }

    .stroke-label {
      font-size: 10px;
      color: #666;
      margin-bottom: 4px;
    }

    .stroke-input {
      width: 70px;
      padding: 6px;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      text-align: center;
      font-size: 12px;
    }

    .stroke-input:focus {
      outline: none;
      border-color: #0066ff;
    }

    .add-btn {
      width: 100%;
      padding: 12px;
      border: 2px dashed #e5e5e5;
      border-radius: 6px;
      background: transparent;
      cursor: pointer;
      font-size: 12px;
      margin-bottom: 16px;
      transition: all 0.2s;
    }

    .add-btn:hover {
      border-color: #0066ff;
      color: #0066ff;
      background: #f0f7ff;
    }

    .generate-btn {
      width: 100%;
      padding: 12px;
      background: #0066ff;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .generate-btn:hover {
      background: #0052cc;
    }

    .generate-btn:active {
      transform: scale(0.98);
    }

    .generate-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .status {
      margin-top: 12px;
      padding: 10px;
      border-radius: 6px;
      font-size: 11px;
      text-align: center;
      display: none;
    }

    .status.error {
      background: #ffebee;
      color: #c62828;
      border: 1px solid #ffcdd2;
    }

    .status.success {
      background: #e8f5e9;
      color: #2e7d32;
      border: 1px solid #c8e6c9;
    }

    .status.info {
      background: #e3f2fd;
      color: #1565c0;
      border: 1px solid #bbdefb;
    }
  </style>
</head>
<body>
  <h2>Icon Set Generator</h2>

  <div id="sizeGrid" class="size-grid"></div>

  <button class="add-btn" id="addSize">+ Add Size</button>

  <button class="generate-btn" id="generate">Generate Component Set</button>

  <div id="status" class="status"></div>

  <script>
    // Default configuration
    const DEFAULT_SIZES = [
      { size: 16, stroke: 1.5 },
      { size: 20, stroke: 2 },
      { size: 24, stroke: 2 },
      { size: 32, stroke: 2.5 },
      { size: 40, stroke: 3 },
      { size: 48, stroke: 3.5 }
    ]

    let iconSizes = [...DEFAULT_SIZES]

    // Render the size grid
    function render() {
      const grid = document.getElementById('sizeGrid')
      grid.innerHTML = ''

      iconSizes.forEach((item, index) => {
        const div = document.createElement('div')
        div.className = 'size-item'

        // Calculate preview size (scale to fit preview area)
        const previewSize = Math.min(item.size, 48)
        const previewStroke = (item.stroke * previewSize) / item.size

        div.innerHTML = `
          ${iconSizes.length > 1 ? `<button class="remove-btn" data-index="${index}">×</button>` : ''}
          <div class="size-preview">
            <div style="
              width: ${previewSize}px;
              height: ${previewSize}px;
              border: ${previewStroke}px solid #666;
              border-radius: 3px;
            "></div>
          </div>
          <div class="size-label">${item.size}px</div>
          <div class="stroke-label">Stroke Width</div>
          <input
            type="number"
            class="stroke-input"
            value="${item.stroke}"
            step="0.5"
            min="0.5"
            max="10"
            data-index="${index}"
          />
        `
        grid.appendChild(div)
      })

      // Attach event listeners
      attachEventListeners()
    }

    function attachEventListeners() {
      // Remove button
      document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.onclick = (e) => {
          const index = parseInt(e.target.dataset.index)
          iconSizes.splice(index, 1)
          render()
        }
      })

      // Stroke input
      document.querySelectorAll('.stroke-input').forEach(input => {
        input.onchange = (e) => {
          const index = parseInt(e.target.dataset.index)
          const value = parseFloat(e.target.value)

          if (value >= 0.5 && value <= 10) {
            iconSizes[index].stroke = value
            render()
          }
        }
      })
    }

    // Add new size
    document.getElementById('addSize').onclick = () => {
      const lastSize = iconSizes[iconSizes.length - 1].size
      const lastStroke = iconSizes[iconSizes.length - 1].stroke

      const newSize = lastSize + 8
      const newStroke = Math.min(lastStroke + 0.5, 10)

      iconSizes.push({
        size: newSize,
        stroke: newStroke
      })

      render()
    }

    // Generate component set
    document.getElementById('generate').onclick = () => {
      const btn = document.getElementById('generate')
      btn.disabled = true
      showStatus('Generating component set...', 'info')

      parent.postMessage({
        pluginMessage: {
          type: 'generate',
          config: {
            sizes: iconSizes.map(item => item.size),
            strokes: iconSizes.map(item => item.stroke)
          }
        }
      }, '*')

      // Re-enable after delay
      setTimeout(() => {
        btn.disabled = false
      }, 2000)
    }

    // Show status message
    function showStatus(message, type = 'info') {
      const status = document.getElementById('status')
      status.textContent = message
      status.className = 'status ' + type
      status.style.display = 'block'

      if (type !== 'info') {
        setTimeout(() => {
          status.style.display = 'none'
        }, 3000)
      }
    }

    // Handle messages from plugin
    onmessage = (event) => {
      const msg = event.data.pluginMessage

      if (msg.type === 'error') {
        showStatus(msg.message, 'error')
        document.getElementById('generate').disabled = false
      }

      if (msg.type === 'progress') {
        showStatus(msg.message, 'info')
      }

      if (msg.type === 'success') {
        showStatus(msg.message, 'success')
      }
    }

    // Initial render
    render()
  </script>
</body>
</html>
```

---

### Step 5: Build and Test

1. **Compile TypeScript**:
```bash
npm run build
```

This creates `code.js` from `code.ts`.

2. **Import Plugin in Figma**:
   - Open Figma Desktop App
   - Go to Menu → Plugins → Development → Import plugin from manifest
   - Select your `manifest.json` file

3. **Test the Plugin**:
   - Create a simple vector icon in Figma
   - Select the icon
   - Run the plugin (Menu → Plugins → Development → Icon Set Generator)
   - Adjust sizes and strokes in the UI
   - Click "Generate Component Set"
   - Verify the component set is created with correct variants

---

## Key Implementation Details

### Variant Naming Convention

The variant property is defined by the component name:
```typescript
component.name = "Size=16"  // Creates variant with Size property = 16
```

After combining with `combineAsVariants()`, Figma automatically recognizes this pattern and creates a variant property called "Size" with values: 16, 20, 24, etc.

### Scaling Strategy

For square icons:
```typescript
const scaleFactor = targetSize / sourceWidth
node.rescale(scaleFactor)
```

For non-square icons (maintain aspect ratio):
```typescript
const scaleFactor = targetSize / Math.max(sourceWidth, sourceHeight)
node.rescale(scaleFactor)
```

### Stroke Width Proportions

Common stroke width ratios:
- 16px icon → 1.5px stroke (9.4% of size)
- 24px icon → 2px stroke (8.3% of size)
- 48px icon → 3.5px stroke (7.3% of size)

You can also calculate proportional strokes:
```typescript
const strokeWidth = size * 0.08  // 8% of icon size
```

### Centering Icons in Components

After scaling, center the icon:
```typescript
icon.x = (componentSize - icon.width) / 2
icon.y = (componentSize - icon.height) / 2
```

---

## Troubleshooting

### Issue: Stroke not applied to all paths
**Solution**: Some nodes might be groups. The recursive function handles this by checking for `'strokeWeight' in node` and skipping groups.

### Issue: Icons appear stretched
**Solution**: Use `rescale()` instead of `resize()`. The `rescale()` method maintains aspect ratio.

### Issue: Component set deletes itself
**Solution**: Component sets must always have children. Ensure you create at least one variant before combining.

### Issue: Variant property not showing
**Solution**: Check component naming. Must use exact format: `PropertyName=Value` (e.g., `Size=16`).

---

## Next Steps

1. Add more configuration options (e.g., corner radius, padding)
2. Support for multiple variant properties (Size, Style, State)
3. Export presets for common icon systems
4. Add icon preview in UI
5. Support batch processing multiple icons

---

## Resources

- Full API Reference: `/docs/figma-api/FIGMA_PLUGIN_API_REFERENCE.md`
- Quick Reference: `/docs/figma-api/QUICK_REFERENCE.md`
- Official Figma Plugin Docs: https://developers.figma.com/docs/plugins/
