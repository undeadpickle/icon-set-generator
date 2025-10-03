# Project Name: Icon Set Generator

**File Purpose**: This file provides guidance to Claude Code (claude.ai/code) when working in this project.
**Last Updated**: October 2, 2025
**Version**: 1.3

---

## Project Overview

A modern, simple, and optimized Figma plugin that generates multiple size variants of vector icons with customizable stroke widths. The plugin follows current Figma plugin development best practices and maintains clean, DRY code architecture.

**Goal**: Allow a user of Figma to quickly turn a single vector icon into a variant component set with various sizes (based on 8pt grid/icon design systems) with customizable stroke widths.

**End Result**: A single Figma component with variant property "Size" containing multiple size variants (ex: 16, 20, 24, 32, 40, 48) with customized stroke widths for each size.

---

## Input Requirements

**Selected Icon Must Be**:
- Vector with editable stroke
- A vector layer, group, or frame
- Selected before running the plugin

**Cannot Be**:
- Raster image
- Section
- Component

---

## User Flow

1. User selects one or more vector icons in Figma
2. User opens the "Icon Set Generator" plugin (can be opened before or after selecting)
3. Plugin validates selection in real-time and displays:
   - **Component Name (optional)**: Text input for custom naming (disabled if no selection)
     - Single icon: Enter custom name (leaves blank uses original name)
     - Multiple icons: Enter base name, auto-appends -1, -2, etc.
   - **Delete checkbox**: "Delete original icons after generation"
   - **Multiple icons**: Shows count ("3 icons selected") and list of all icon names
   - **No/invalid selection**: Warning message "⚠️ No valid icon selected!" in input placeholder
   - Generate button (enabled/disabled based on current selection)
   - Updates automatically when user selects/deselects icons
   - Grid of size thumbnails with default values:
   - **16px** → stroke 1.6px
   - **20px** → stroke 2px
   - **24px** → stroke 2.5px
   - **32px** → stroke 3px
   - **40px** → stroke 3.5px
   - **48px** → stroke 4px
4. User can:
   - **Rename**: Type custom component name (optional)
   - **Delete originals**: Check box to remove original icons after generation
   - **Remove a size**: Click the red × button (top-right of each card)
   - **Add a new size**: Click the "+ Add Size" button (adds next increment: +8px size, +0.5px stroke)
   - **Edit size values**: Whole numbers only
   - **Edit stroke values**: Decimals allowed
   - Minimum 1 size required (cannot remove last size)
5. User clicks "Generate Component" button
6. Plugin generates component(s):
   - **Single icon**: Creates 1 component set (with custom name if provided)
   - **Multiple icons**: Creates one component set per icon, vertically stacked with 32px spacing (with indexed names if custom name provided)
   - **VECTOR nodes**: Automatically grouped before generation (preserves original name)
   - **Delete enabled**: Removes original icons after successful generation
   - All use the same size/stroke settings from the plugin UI

---

## Output Requirements

**Generated Component Set(s)**:
- Variant property name: "Size"
- Variant values: numbers only (16, 20, 24, 32, etc.)
- Component name: custom name if provided, otherwise original icon layer name
- Auto layout: HORIZONTAL with 16px spacing and padding
- Transparent background (no fills)

**Variants**:
- Icons placed directly in components (no frame wrapper)
- Icons are scaled proportionally based on max dimension (never stretched)
- Icons are vector duplicates of the original
- Each icon centered within its component bounds
- Custom stroke width applied per variant

**Auto-Grouping** (VECTOR nodes):
- VECTOR nodes automatically wrapped in a GROUP before generation
- Group preserves the original VECTOR's name
- GROUP and FRAME nodes are processed as-is (not re-grouped)
- Idempotent operation (subsequent runs use existing groups)

**Custom Naming**:
- Single icon: Custom name replaces original name
- Multiple icons: Custom base name + index appended (e.g., "Icon-1", "Icon-2", "Icon-3")
- If no custom name: Original icon names are used

**Delete Originals** (Optional):
- If checkbox enabled: Original icons removed after successful generation
- Deletion happens after all component sets are created
- Notification includes deletion status: "✅ Generated 3 component sets (originals deleted)"

**Bulk Generation** (Multiple Icons):
- One component set created per selected icon
- Component sets positioned vertically with 32px spacing (4pt grid)
- All component sets use identical size/stroke configuration
- All generated sets selected and visible in viewport
- Notification displays total count (e.g., "✅ Generated 3 component sets")

**Screenshot Reference**: docs/screenshots/Screenshot 2025-10-02 at 11.33.21 AM.png

---

## Tech Stack

- **Language**: TypeScript (compiled to JavaScript)
- **Platform**: Figma Plugin API v1.0.0
- **Build Tool**: TypeScript Compiler (tsc)
- **UI**: Vanilla HTML/CSS/JavaScript
- **UI Dimensions**: 400px × 560px (no scrollbar)
- **Dependencies**: @figma/plugin-typings

## Plugin Features Summary

- ✅ **Bulk generation** - Multiple component sets from multiple icons
- ✅ **Custom naming** - Optional rename with auto-indexing for bulk
- ✅ **Auto-grouping** - VECTOR nodes automatically grouped
- ✅ **Delete originals** - Optional cleanup after generation
- ✅ **Real-time selection** - Live updates as user selects/deselects
- ✅ **Dynamic sizes** - Add/remove size variants with + and × buttons
- ✅ **Proportional scaling** - Icons fill square bounds based on max dimension
- ✅ **Custom strokes** - Individual stroke width per size variant

---

## Sub-Agent: Figma API Expert

**When to Use**: Invoke the `figma-api-expert` sub-agent for any questions about Figma Plugin API, methods, node types, or best practices.

**How to Invoke**:
- Auto-delegation: Will activate automatically for Figma API questions
- Manual: Use the Task tool with `subagent_type: "figma-api-expert"`

**What It Does**:
- Researches official Figma Plugin API documentation
- Maintains memory of patterns, solutions, and architectural decisions
- Provides accurate API information with code examples and documentation references
- Read-only access to project (cannot modify code)

**Examples of Questions**:
- "How do I create component variants with the Figma API?"
- "What's the API for setting stroke widths on vector nodes?"
- "How do I scale icons proportionally in Figma plugins?"

---
