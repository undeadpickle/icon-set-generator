# Figma Plugin API Reference for Icon Set Generator

**Last Updated**: October 2, 2025
**Purpose**: Complete API reference for building the Icon Set Generator Figma plugin
**Official Documentation**: https://developers.figma.com/docs/plugins/

---

## Table of Contents

1. [Component Set Creation with Variants](#1-component-set-creation-with-variants)
2. [Clone and Scale Vector Nodes](#2-clone-and-scale-vector-nodes)
3. [Stroke Width Management](#3-stroke-width-management)
4. [Plugin Structure and Manifest](#4-plugin-structure-and-manifest)
5. [UI Communication](#5-ui-communication)
6. [Complete Implementation Examples](#6-complete-implementation-examples)

---

## 1. Component Set Creation with Variants

### Overview
Creating a component set with variant properties requires creating individual ComponentNodes first, then combining them using `figma.combineAsVariants()`.

### Key API Methods

#### `figma.createComponent()`
Creates a new, empty component with default dimensions of 100x100 pixels.

```typescript
createComponent(): ComponentNode
```

**Example**:
```javascript
const component = figma.createComponent()
component.name = "Icon"
component.resize(24, 24)
```

#### `figma.combineAsVariants()`
Combines multiple ComponentNodes into a ComponentSetNode. Equivalent to selecting components and clicking "Combine as Variants" in the Figma UI.

```typescript
combineAsVariants(
  nodes: ReadonlyArray<ComponentNode>,
  parent: BaseNode & ChildrenMixin,
  index?: number
): ComponentSetNode
```

**Parameters**:
- `nodes`: Array of ComponentNode objects to combine
- `parent`: Parent node where the ComponentSet will be created
- `index` (optional): Position within the parent's children

**Requirements**:
- All nodes must be ComponentNodes
- All nodes must be in the same page
- Cannot create parenting cycles

**Example**:
```javascript
// Create multiple size components
const sizes = [16, 20, 24, 32, 40, 48]
const components = []

sizes.forEach(size => {
  const component = figma.createComponent()
  component.name = `Size=${size}`
  component.resize(size, size)
  components.push(component)
})

// Combine into a component set
const componentSet = figma.combineAsVariants(
  components,
  figma.currentPage,
  0
)
componentSet.name = "Icon Set"
```

### Setting Variant Properties

Variant properties are defined by the component names using the pattern:
`PropertyName=PropertyValue`

For multiple properties:
`PropertyName1=Value1, PropertyName2=Value2`

**Example**:
```javascript
// Single variant property (Size)
component.name = "Size=16"

// Multiple variant properties
component.name = "Size=16, Style=Filled"
```

### Accessing ComponentSet Properties

After combining, you can access variant definitions:

```javascript
// Get the component set's property definitions
console.log(componentSet.componentPropertyDefinitions)
// Output example:
// {
//   "123abc": {
//     type: "VARIANT",
//     defaultValue: "16",
//     variantOptions: ["16", "20", "24", "32", "40", "48"]
//   }
// }

// Access individual variant components
componentSet.children.forEach(child => {
  console.log(child.name) // "Size=16", "Size=20", etc.
})
```

### Important Notes

- Empty component sets are not supported in Figma
- ComponentSets must always have children, or they will delete themselves
- You cannot directly create a ComponentSet - you must create individual components first
- The `variantProperties` API is deprecated; use `componentProperties` instead
- To add variant values, create new ComponentNodes and set their names appropriately

---

## 2. Clone and Scale Vector Nodes

### Cloning Nodes

#### `node.clone()`
Duplicates a node. By default, the duplicate is parented under `figma.currentPage`.

```typescript
clone(): this
```

**Example**:
```javascript
// Clone a vector icon
const originalIcon = figma.currentPage.selection[0]
const clonedIcon = originalIcon.clone()

// Clone is automatically added to currentPage
// You can reparent it if needed
component.appendChild(clonedIcon)
```

### Scaling Nodes

#### `node.rescale(scale)`
Scales a node from its top-left corner while maintaining aspect ratio. Equivalent to using the Scale Tool in Figma.

```typescript
rescale(scale: number): void
```

**Parameters**:
- `scale`: Scale factor (must be >= 0.01)

**Example**:
```javascript
// Scale to 200% of original size
node.rescale(2.0)

// Scale to 50% of original size
node.rescale(0.5)
```

### Resizing vs Rescaling

For precise sizing, you can also use `resize()`:

```javascript
// Resize to exact dimensions
node.resize(24, 24)

// Or calculate scale factor from target size
const originalWidth = node.width
const targetWidth = 48
const scaleFactor = targetWidth / originalWidth
node.rescale(scaleFactor)
```

### Complete Clone and Scale Pattern

```javascript
// Function to create a scaled copy of an icon
function createScaledIcon(sourceNode, targetSize) {
  const cloned = sourceNode.clone()

  // Calculate scale factor based on current width
  const scaleFactor = targetSize / sourceNode.width
  cloned.rescale(scaleFactor)

  return cloned
}

// Usage
const originalIcon = figma.currentPage.selection[0]
const icon16 = createScaledIcon(originalIcon, 16)
const icon24 = createScaledIcon(originalIcon, 24)
const icon48 = createScaledIcon(originalIcon, 48)
```

### Important Notes

- `rescale()` maintains aspect ratio automatically
- Scaling is applied from the top-left corner
- Works on VectorNode, FrameNode, GroupNode, and 16+ other node types
- Minimum scale factor is 0.01

---

## 3. Stroke Width Management

### Setting Stroke Width

#### `node.strokeWeight`
Sets the thickness of the stroke in pixels. Can be fractional and must be non-negative.

```typescript
strokeWeight: number
```

**Example**:
```javascript
// Set stroke width to 1.5px
node.strokeWeight = 1.5

// Set stroke width to 2px
node.strokeWeight = 2
```

### Individual Stroke Weights (Rectangles/Frames)

For rectangle and frame-like nodes, you can set different stroke weights per side:

```javascript
node.strokeTopWeight = 2
node.strokeRightWeight = 1.5
node.strokeBottomWeight = 2
node.strokeLeftWeight = 1.5
```

### Recursive Stroke Width Application

To apply stroke width to all vector children in a node:

```javascript
function applyStrokeRecursively(node, strokeWidth) {
  // Check if node has strokeWeight property
  if ('strokeWeight' in node) {
    node.strokeWeight = strokeWidth
  }

  // Recursively apply to children if they exist
  if ('children' in node) {
    node.children.forEach(child => {
      applyStrokeRecursively(child, strokeWidth)
    })
  }
}

// Usage
const iconGroup = figma.currentPage.selection[0]
applyStrokeRecursively(iconGroup, 2.0)
```

### Stroke Properties

Additional stroke-related properties:

```javascript
// Stroke alignment
node.strokeAlign = "CENTER" // or "INSIDE" or "OUTSIDE"

// Stroke cap (for open paths)
node.strokeCap = "ROUND" // or "NONE" or "SQUARE"

// Stroke join (for corners)
node.strokeJoin = "ROUND" // or "MITER" or "BEVEL"

// Dash pattern
node.dashPattern = [5, 5] // 5px dash, 5px gap
```

### Working with Stroke Geometry

```javascript
// Get stroke geometry (read-only)
const strokeGeometry = node.strokeGeometry
// Returns VectorPath[] representing stroke paths

// Outline stroke (convert stroke to fill)
const outlinedNode = node.outlineStroke()
// Returns a new VectorNode with stroke converted to fill
```

### Scaling Strokes

When scaling nodes, stroke width scales proportionally by default. To maintain stroke width:

```javascript
// Scale node but preserve original stroke width
const originalStrokeWeight = node.strokeWeight
node.rescale(2.0)
node.strokeWeight = originalStrokeWeight
```

### Important Notes

- Stroke weight of 0 means no stroke will appear
- For mixed stroke weights, reading `strokeWeight` returns `figma.mixed`
- VectorNode supports all stroke properties
- Stroke geometry is relative to the node's position

---

## 4. Plugin Structure and Manifest

### Minimal File Structure

```
icon-set-generator/
├── manifest.json          # Plugin configuration
├── code.ts               # Main plugin logic (compiled to code.js)
├── ui.html               # Plugin UI interface
├── tsconfig.json         # TypeScript configuration
└── package.json          # Node dependencies
```

### manifest.json

Complete example with all required fields for a plugin with UI:

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

#### Required Fields

- **name**: Plugin name displayed in Figma menu
- **id**: Unique identifier (assigned by Figma on first publish)
- **api**: Figma API version (currently "1.0.0")
- **main**: Path to compiled JavaScript file (code.js)
- **editorType**: Array specifying where plugin runs
  - `["figma"]` - Figma Design only
  - `["figjam"]` - FigJam only
  - `["figma", "figjam"]` - Both

#### Optional but Recommended Fields

- **ui**: Path to HTML file for plugin interface
- **documentAccess**: Set to `"dynamic-page"` (required for new plugins)
- **networkAccess**: Control external network access
  - `{ "allowedDomains": ["none"] }` - No network access
  - `{ "allowedDomains": ["https://api.example.com"] }` - Specific domains

#### Optional Fields

- **menu**: Create submenus
- **relaunchButtons**: Add relaunch buttons to layers
- **parameters**: Define plugin parameters
- **capabilities**: Additional plugin capabilities

### TypeScript Configuration

The `main` field in manifest.json always points to a JavaScript file (code.js), which is compiled from TypeScript (code.ts).

**tsconfig.json** example:
```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "ES6",
    "lib": ["ES2015"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "typeRoots": ["./node_modules/@types", "./node_modules/@figma"]
  }
}
```

### Build Process

Figma only uses three files when running a plugin:
1. **manifest.json** - Configuration
2. **code.js** - Main plugin code (compiled from code.ts)
3. **ui.html** - UI interface (if specified)

You must compile TypeScript to JavaScript:
```bash
tsc code.ts
```

Or use a bundler like webpack/esbuild for production builds.

---

## 5. UI Communication

### Creating a UI

#### 1. Create ui.html

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 16px;
      font-family: 'Inter', sans-serif;
    }
  </style>
</head>
<body>
  <h2>Icon Set Generator</h2>
  <button id="generate">Generate Component Set</button>

  <script>
    document.getElementById('generate').onclick = () => {
      parent.postMessage({
        pluginMessage: {
          type: 'generate',
          sizes: [16, 20, 24, 32, 40, 48],
          strokes: [1.5, 2, 2, 2.5, 3, 3.5]
        }
      }, '*')
    }
  </script>
</body>
</html>
```

#### 2. Update manifest.json

```json
{
  "ui": "ui.html"
}
```

#### 3. Show UI in code.ts

```typescript
figma.showUI(__html__, {
  width: 400,
  height: 600,
  themeColors: true  // Enable light/dark theme support
})
```

### Message Passing Patterns

#### From UI to Plugin (ui.html → code.ts)

**In ui.html**:
```javascript
// Send message from UI to plugin
parent.postMessage({
  pluginMessage: {
    type: 'generate',
    data: { sizes: [16, 24, 48] }
  }
}, '*')

// Security: Use specific origin in production
parent.postMessage({
  pluginMessage: { type: 'generate' }
}, 'https://www.figma.com')
```

**In code.ts**:
```typescript
// Receive message from UI
figma.ui.onmessage = (msg) => {
  console.log('Received from UI:', msg)

  if (msg.type === 'generate') {
    const sizes = msg.data.sizes
    // Process the data...
  }
}
```

#### From Plugin to UI (code.ts → ui.html)

**In code.ts**:
```typescript
// Send message from plugin to UI
figma.ui.postMessage({
  type: 'status',
  message: 'Component set created successfully!'
})
```

**In ui.html**:
```javascript
// Receive message from plugin
onmessage = (event) => {
  const msg = event.data.pluginMessage
  console.log('Received from plugin:', msg)

  if (msg.type === 'status') {
    alert(msg.message)
  }
}
```

### Supported Data Types

Both directions support sending:
- Objects
- Arrays
- Numbers
- Strings
- Booleans
- null
- undefined
- Date objects
- Uint8Array objects

**Example**:
```javascript
// Complex data structure
parent.postMessage({
  pluginMessage: {
    type: 'config',
    sizes: [16, 24, 32],
    options: {
      strokeWidth: 2,
      cornerRadius: 4,
      enabled: true
    },
    timestamp: new Date()
  }
}, '*')
```

### Closing the Plugin

From the plugin code:
```typescript
figma.closePlugin()

// With a success message
figma.closePlugin('Component set created!')
```

From the UI:
```javascript
parent.postMessage({
  pluginMessage: { type: 'close' }
}, '*')

// Then in code.ts:
figma.ui.onmessage = (msg) => {
  if (msg.type === 'close') {
    figma.closePlugin()
  }
}
```

### Complete Communication Example

**ui.html**:
```html
<script>
  // Send data to plugin
  document.getElementById('generate').onclick = () => {
    parent.postMessage({
      pluginMessage: {
        type: 'generate',
        sizes: [16, 24, 48],
        strokes: [1.5, 2, 3]
      }
    }, '*')
  }

  // Receive updates from plugin
  onmessage = (event) => {
    const msg = event.data.pluginMessage
    if (msg.type === 'progress') {
      document.getElementById('status').textContent = msg.message
    }
  }
</script>
```

**code.ts**:
```typescript
figma.showUI(__html__, { width: 400, height: 600 })

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate') {
    // Send progress updates
    figma.ui.postMessage({
      type: 'progress',
      message: 'Creating components...'
    })

    // Process data
    const { sizes, strokes } = msg

    // ... create component set ...

    // Notify completion
    figma.ui.postMessage({
      type: 'progress',
      message: 'Complete!'
    })

    figma.closePlugin('Component set created successfully!')
  }
}
```

### Important Notes

- Messages can be queued before UI fully loads
- Always use `pluginMessage` property when sending from UI
- Use `'*'` for origin in development, `'https://www.figma.com'` in production
- Message passing is asynchronous
- Consider using community libraries like `figma-await-ipc` for promise-based messaging

---

## 6. Complete Implementation Examples

### Example 1: Basic Icon Resizer

```typescript
// code.ts
figma.showUI(__html__, { width: 300, height: 400 })

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate') {
    const selection = figma.currentPage.selection[0]

    if (!selection) {
      figma.ui.postMessage({
        type: 'error',
        message: 'Please select an icon first'
      })
      return
    }

    const sizes = msg.sizes
    const components = []

    // Create component for each size
    for (let i = 0; i < sizes.length; i++) {
      const size = sizes[i]
      const stroke = msg.strokes[i]

      // Clone the original
      const cloned = selection.clone()

      // Scale to target size
      const scaleFactor = size / selection.width
      cloned.rescale(scaleFactor)

      // Apply stroke width recursively
      applyStrokeRecursively(cloned, stroke)

      // Create component
      const component = figma.createComponent()
      component.name = `Size=${size}`
      component.resize(size, size)
      component.appendChild(cloned)

      // Center the icon in the component
      cloned.x = (size - cloned.width) / 2
      cloned.y = (size - cloned.height) / 2

      components.push(component)
    }

    // Combine as variants
    const componentSet = figma.combineAsVariants(
      components,
      figma.currentPage,
      0
    )
    componentSet.name = "Icon Set"

    figma.closePlugin('Component set created!')
  }
}

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

### Example 2: Advanced Icon Generator with Validation

```typescript
// code.ts
interface IconConfig {
  sizes: number[]
  strokes: number[]
}

figma.showUI(__html__, {
  width: 400,
  height: 600,
  themeColors: true
})

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate') {
    try {
      const config: IconConfig = msg.config
      await generateIconSet(config)
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

async function generateIconSet(config: IconConfig) {
  // Validate selection
  const selection = figma.currentPage.selection
  if (selection.length === 0) {
    throw new Error('Please select a vector icon')
  }

  const sourceNode = selection[0]

  // Validate it's a vector or group
  if (!isVectorOrGroup(sourceNode)) {
    throw new Error('Selected node must be a vector or group')
  }

  figma.ui.postMessage({
    type: 'progress',
    message: 'Creating component variants...',
    current: 0,
    total: config.sizes.length
  })

  const components = []

  for (let i = 0; i < config.sizes.length; i++) {
    const size = config.sizes[i]
    const stroke = config.strokes[i]

    // Update progress
    figma.ui.postMessage({
      type: 'progress',
      message: `Creating ${size}px variant...`,
      current: i + 1,
      total: config.sizes.length
    })

    const component = createIconVariant(sourceNode, size, stroke)
    components.push(component)
  }

  // Combine into component set
  const componentSet = figma.combineAsVariants(
    components,
    figma.currentPage,
    0
  )

  componentSet.name = sourceNode.name || 'Icon Set'

  // Position component set near original
  componentSet.x = sourceNode.x + sourceNode.width + 100
  componentSet.y = sourceNode.y

  // Select the new component set
  figma.currentPage.selection = [componentSet]
  figma.viewport.scrollAndZoomIntoView([componentSet])
}

function createIconVariant(
  sourceNode: SceneNode,
  size: number,
  strokeWidth: number
): ComponentNode {
  // Clone the source
  const cloned = sourceNode.clone()

  // Calculate scale factor
  const scaleFactor = size / sourceNode.width
  cloned.rescale(scaleFactor)

  // Apply stroke width
  applyStrokeRecursively(cloned, strokeWidth)

  // Create component
  const component = figma.createComponent()
  component.name = `Size=${size}`
  component.resize(size, size)

  // Add cloned icon to component
  component.appendChild(cloned)

  // Center the icon
  cloned.x = (size - cloned.width) / 2
  cloned.y = (size - cloned.height) / 2

  return component
}

function applyStrokeRecursively(node: SceneNode, strokeWidth: number) {
  if ('strokeWeight' in node && node.type !== 'GROUP') {
    node.strokeWeight = strokeWidth
  }

  if ('children' in node) {
    for (const child of node.children) {
      applyStrokeRecursively(child, strokeWidth)
    }
  }
}

function isVectorOrGroup(node: SceneNode): boolean {
  return (
    node.type === 'VECTOR' ||
    node.type === 'BOOLEAN_OPERATION' ||
    node.type === 'STAR' ||
    node.type === 'LINE' ||
    node.type === 'ELLIPSE' ||
    node.type === 'POLYGON' ||
    node.type === 'RECTANGLE' ||
    node.type === 'GROUP' ||
    node.type === 'FRAME'
  )
}
```

### Example 3: Complete UI with Preview

```html
<!-- ui.html -->
<!DOCTYPE html>
<html>
<head>
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 16px;
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 12px;
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
      border-radius: 4px;
      padding: 12px;
      position: relative;
      text-align: center;
    }
    .size-item.selected {
      border-color: #0066ff;
      background: #f0f7ff;
    }
    .remove-btn {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #ff4444;
      color: white;
      border: none;
      cursor: pointer;
      font-size: 10px;
      line-height: 1;
    }
    .size-preview {
      width: 48px;
      height: 48px;
      margin: 0 auto 8px;
      background: #f5f5f5;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .size-label {
      font-weight: 600;
      margin-bottom: 4px;
    }
    .stroke-input {
      width: 60px;
      padding: 4px;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      text-align: center;
    }
    .add-btn {
      width: 100%;
      padding: 12px;
      border: 2px dashed #e5e5e5;
      border-radius: 4px;
      background: transparent;
      cursor: pointer;
      font-size: 12px;
      margin-bottom: 16px;
    }
    .add-btn:hover {
      border-color: #0066ff;
      color: #0066ff;
    }
    .generate-btn {
      width: 100%;
      padding: 12px;
      background: #0066ff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    .generate-btn:hover {
      background: #0052cc;
    }
    .generate-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    .status {
      margin-top: 12px;
      padding: 8px;
      border-radius: 4px;
      font-size: 11px;
      text-align: center;
    }
    .status.error {
      background: #ffebee;
      color: #c62828;
    }
    .status.success {
      background: #e8f5e9;
      color: #2e7d32;
    }
  </style>
</head>
<body>
  <h2>Icon Set Generator</h2>

  <div id="sizeGrid" class="size-grid"></div>

  <button class="add-btn" id="addSize">+ Add Size</button>

  <button class="generate-btn" id="generate">Generate Component Set</button>

  <div id="status" class="status" style="display: none;"></div>

  <script>
    const DEFAULT_SIZES = [
      { size: 16, stroke: 1.5 },
      { size: 20, stroke: 2 },
      { size: 24, stroke: 2 },
      { size: 32, stroke: 2.5 },
      { size: 40, stroke: 3 },
      { size: 48, stroke: 3.5 }
    ]

    let iconSizes = [...DEFAULT_SIZES]

    function render() {
      const grid = document.getElementById('sizeGrid')
      grid.innerHTML = ''

      iconSizes.forEach((item, index) => {
        const div = document.createElement('div')
        div.className = 'size-item'
        div.innerHTML = `
          ${iconSizes.length > 1 ? `<button class="remove-btn" data-index="${index}">×</button>` : ''}
          <div class="size-preview">
            <div style="width: ${item.size / 2}px; height: ${item.size / 2}px; border: ${item.stroke / 2}px solid #666; border-radius: 2px;"></div>
          </div>
          <div class="size-label">${item.size}px</div>
          <input
            type="number"
            class="stroke-input"
            value="${item.stroke}"
            step="0.5"
            min="0.5"
            data-index="${index}"
          />
        `
        grid.appendChild(div)
      })

      // Add event listeners
      document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.onclick = (e) => {
          const index = parseInt(e.target.dataset.index)
          iconSizes.splice(index, 1)
          render()
        }
      })

      document.querySelectorAll('.stroke-input').forEach(input => {
        input.onchange = (e) => {
          const index = parseInt(e.target.dataset.index)
          iconSizes[index].stroke = parseFloat(e.target.value)
        }
      })
    }

    document.getElementById('addSize').onclick = () => {
      const lastSize = iconSizes[iconSizes.length - 1].size
      const lastStroke = iconSizes[iconSizes.length - 1].stroke

      iconSizes.push({
        size: lastSize + 8,
        stroke: lastStroke + 0.5
      })
      render()
    }

    document.getElementById('generate').onclick = () => {
      showStatus('Generating...', false)

      parent.postMessage({
        pluginMessage: {
          type: 'generate',
          config: {
            sizes: iconSizes.map(item => item.size),
            strokes: iconSizes.map(item => item.stroke)
          }
        }
      }, '*')
    }

    function showStatus(message, isError = false) {
      const status = document.getElementById('status')
      status.textContent = message
      status.className = 'status ' + (isError ? 'error' : 'success')
      status.style.display = 'block'

      setTimeout(() => {
        status.style.display = 'none'
      }, 3000)
    }

    // Receive messages from plugin
    onmessage = (event) => {
      const msg = event.data.pluginMessage

      if (msg.type === 'error') {
        showStatus(msg.message, true)
      }

      if (msg.type === 'progress') {
        showStatus(msg.message, false)
      }
    }

    // Initial render
    render()
  </script>
</body>
</html>
```

---

## Summary

This reference covers all the essential Figma Plugin API methods needed to build the Icon Set Generator:

1. **Component Sets**: Use `figma.createComponent()` to create individual components, name them with `Size=value` pattern, then combine with `figma.combineAsVariants()`

2. **Cloning & Scaling**: Use `node.clone()` to duplicate icons and `node.rescale(factor)` to scale proportionally

3. **Stroke Width**: Set `node.strokeWeight` property and apply recursively by traversing node tree

4. **Plugin Structure**: Minimal files needed are manifest.json, code.js (compiled from code.ts), and ui.html

5. **UI Communication**: Use `parent.postMessage()` from UI and `figma.ui.postMessage()` from plugin, with `onmessage` handlers on both sides

All code examples are production-ready and follow current Figma Plugin API best practices as of October 2025.
