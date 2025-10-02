# Project Name: Icon Set Generator

**File Purpose**: This file provides guidance to Claude Code (claude.ai/code) when working in this project.
**Last Updated**: October 2, 2025
**Version**: 1.1

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

1. User selects a vector icon in Figma
2. User opens the "Resize Icon" plugin (can be opened before or after selecting icon)
3. Plugin validates selection in real-time and displays:
   - Icon name in title (if valid selection)
   - Warning message in title (if no/invalid selection)
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
   - **Remove a size**: Click the red × button (top-right of each card)
   - **Add a new size**: Click the "+ Add Size" button (adds next increment: +8px size, +0.5px stroke)
   - **Edit size values**: Whole numbers only
   - **Edit stroke values**: Decimals allowed
   - Minimum 1 size required (cannot remove last size)
5. User clicks "Generate Component" button
6. Plugin generates the component with variants

---

## Output Requirements

**Generated Component Set**:
- Variant property name: "Size"
- Variant values: numbers only (16, 20, 24, 32, etc.)
- Component name: matches the original icon layer name
- Auto layout: HORIZONTAL with 16px spacing and padding
- Transparent background (no fills)

**Variants**:
- Icons placed directly in components (no frame wrapper)
- Icons are scaled proportionally (never stretched)
- Icons are vector duplicates of the original
- Each icon centered within its component bounds
- Custom stroke width applied per variant

**Screenshot Reference**: docs/screenshots/Screenshot 2025-10-02 at 11.33.21 AM.png

---

## Tech Stack

- **Language**: TypeScript (compiled to JavaScript)
- **Platform**: Figma Plugin API v1.0.0
- **Build Tool**: TypeScript Compiler (tsc)
- **UI**: Vanilla HTML/CSS/JavaScript
- **Dependencies**: @figma/plugin-typings

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
