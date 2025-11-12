# Whiteboard Application Design Guidelines

## Design Approach

**Selected Approach:** Design System (Utility-Focused Application)
**Primary References:** Linear (clean productivity aesthetics) + Figma/Miro (collaborative tool patterns)
**Justification:** This is a productivity tool where efficiency, clarity, and usability are paramount. The interface should fade into the background, letting the canvas be the hero.

## Core Design Elements

### Typography
- **Primary Font:** Inter or DM Sans via Google Fonts CDN
- **Headings:** Font weight 600, sizes: text-2xl (board titles), text-lg (section headers), text-sm (labels)
- **Body Text:** Font weight 400-500, text-sm for UI labels, text-xs for tooltips
- **Monospace:** For board IDs/timestamps, use font-mono

### Layout System
**Spacing Primitives:** Tailwind units of 2, 3, 4, 6, 8, and 12
- Toolbar padding: p-3
- Sidebar spacing: p-4, gap-3 between items
- Button spacing: px-4 py-2
- Section margins: mb-6, mb-8
- Canvas container: p-0 (full bleed)

**Grid Structure:**
- Sidebar: Fixed width 280px (w-70)
- Main canvas: flex-1 (takes remaining space)
- Toolbar: Floating with backdrop-blur, positioned absolute

### Component Library

**A. Application Shell**
- **Layout:** Split-view with collapsible sidebar + full canvas area
- **Sidebar:** Left-aligned, contains whiteboard list, "New Board" button, board thumbnails
- **Canvas Container:** Takes full remaining space, centered drawing area with subtle grid background (optional toggle)
- **Top Toolbar:** Floating bar with drawing tools, positioned near top-center over canvas

**B. Navigation & Controls**

*Sidebar Components:*
- New Board button: Full-width, prominent placement at top
- Board list items: Card-style with board name, last modified timestamp, thumbnail preview (100px × 75px)
- Active board indicator: Subtle accent border on selected board
- Board actions: Rename, duplicate, delete icons on hover

*Top Toolbar:*
- Tool selector buttons: Pen, Eraser, Rectangle, Circle, Line (icon-only with tooltips)
- Color picker: Circular swatch showing current color
- Brush size slider: Compact, inline control
- Undo/Redo buttons: Standard icons (using Heroicons)
- Clear canvas: Destructive action, placed separately with confirmation

**C. Drawing Canvas**
- Canvas element: Full area with subtle border or shadow to define edges
- Grid overlay: Optional light dot grid for alignment (toggle in settings)
- Cursor indication: Custom cursor showing brush preview when drawing
- Selection feedback: Visual indicators for selected shapes

**D. Form Elements**
- Board name input: Inline editable text in sidebar items
- Color picker: Custom component with preset palette + hex input
- Brush size: Range slider with numeric value display
- Modal dialogs: For confirmations (delete board, clear canvas)

**E. Interactive States**
- Tool buttons: Active state with subtle background fill
- Board items: Hover state with elevated shadow
- Canvas: Drawing preview while mouse down
- Buttons: All standard hover/active states handled by component

### Icons
**Library:** Heroicons (via CDN)
**Usage:**
- Drawing tools: Pencil, eraser, shapes (rectangle, circle, line)
- Actions: Trash, duplicate, plus, undo, redo
- UI: Chevrons for collapsible sections, settings gear
- Consistent 20px (w-5 h-5) for toolbar, 16px (w-4 h-4) for sidebar

### Interactive Elements

**Toolbar Behavior:**
- Floating position with backdrop-blur-md background
- Grouped tools with subtle dividers (border-r)
- Active tool highlighted with accent treatment
- Compact, single-row layout for all drawing controls

**Canvas Interactions:**
- Click and drag to draw
- Tool-specific cursors (crosshair for shapes, circle for pen)
- Real-time preview of shapes before release
- Smooth stroke rendering

**Sidebar Management:**
- Scrollable board list when content exceeds viewport
- Board thumbnails generated from canvas snapshots
- Quick actions appear on card hover
- Collapsible to maximize canvas space (toggle button)

### Data Display
- Whiteboard thumbnails: 100px × 75px preview images in sidebar
- Board metadata: Name (editable), creation/modified date
- Tool status: Current color, brush size visually represented
- Empty states: "No boards yet" with prominent "Create First Board" CTA

### Overlays & Modals
- Delete confirmation: Simple modal with board name, Cancel/Delete actions
- Clear canvas confirmation: Inline confirmation near clear button
- Settings panel: Slide-out drawer for preferences (grid toggle, etc.)

### Responsive Behavior
- Desktop: Full sidebar + canvas layout
- Tablet: Collapsible sidebar, toolbar remains floating
- Mobile: Bottom toolbar, sidebar as drawer overlay, canvas fills screen

## Images
This is a web application without marketing needs, so no hero images are required. The focus is entirely on the functional canvas interface.

## Professional Quality Standards
- Canvas rendering: Smooth, performant drawing with no lag
- Tool switching: Instant response, clear visual feedback
- State persistence: Seamless save/load of board states
- Clean aesthetic: Minimal chrome, maximum canvas space
- Accessibility: Keyboard shortcuts for all tools, ARIA labels for screen readers