# Markdown Preview Plus

**Markdown Preview Plus** extends VS Code's built-in Markdown preview to render interactive diagrams including **Markmap** (Mindmaps), **Mermaid** graphs, and **Graphviz** (DOT) diagrams.

- [Markdown Preview Plus](#markdown-preview-plus)
  - [✨ Features](#-features)
  - [💡 Usage](#-usage)
    - [Markmap (Mindmap)](#markmap-mindmap)
    - [Mermaid](#mermaid)
    - [Graphviz (DOT)](#graphviz-dot)
  - [🎨 Customization](#-customization)
    - [Default Theme: Pink Lily](#default-theme-pink-lily)
  - [License](#license)

## ✨ Features

- **Rich Diagram Support**:
  - **Markmap**: Render Markdown lists as interactive, zoomable mindmaps.
  - **Mermaid**: Render Flowcharts, Sequence diagrams, Gantt charts, etc., with extensive customization.
  - **Graphviz (DOT)**: Render complex graph visualizations using the DOT language (powered by WebAssembly).

- **Interactive Zoom & Pan**:
  - **Smart Scroll**: Scroll naturally past diagrams. Hold **Ctrl** + **Scroll** to zoom into the diagram.
  - **Pan**: Click and drag to pan around large diagrams.
  - **Toolbar**: Dedicated "Reset Zoom" button for easy navigation.

- **Custom Styling**:
  - Fully customizable appearance via CSS variables.
  - Includes a "Cyberpunk / Dark Neon" styling example (see below).

## 💡 Usage

Use standard Markdown code blocks with the appropriate language identifiers: `markmap`, `mermaid`, or `graphviz` (alias `dot`).

### Markmap (Mindmap)

```markdown
    ```markmap
    # Root Topic
    ## Feature A
    ### Detail 1
    ## Feature B
    ```

```

### Mermaid

```markdown
    ```mermaid
    flowchart LR
        A[Start] --> B{Is it working?}
        B -- Yes --> C[Great!]
        B -- No --> D[Debug]
    ```

```

### Graphviz (DOT)

```markdown
    ```graphviz
    digraph G {
      rankdir=LR;
      node [style=filled, color="#11ff84", fontcolor="#000"];
      Start -> Process -> End;
      Process -> Start [style=dashed, label="Loop"];
    }
    ```

```

## 🎨 Customization

You can customize the look and feel of your diagrams by creating a `style.css` file in your workspace root or by configuring `markdown.styles` in your VS Code settings.

- setting.json

```json
"markdown.styles": ["./style.css"]
```

### Default Theme: Pink Lily

Below is a comprehensive style sheet that creates a high-contrast Neon/Cyberpunk look for your preview and diagrams.

```css
:root {
  /* Colors - User Requirements */
  --mermaid-primary-color: #272b2b;       /* Dark Background for nodes */
  --mermaid-secondary-color: #171b19;     /* Alternative dark background */

  --mermaid-border-color: #11ff84;        /* Green Borders */
  --mermaid-text-color: #fd9bcc;          /* Pink Text */
  --mermaid-secondtext-color:#46d2e8;     /* Cyan Text */

  --mermaid-line-color: #ff0080;          /* Dark Pink Lines/Arrows */
  --mermaid-arrow-color: #ff0080;         /* Dark Pink Arrows */

  --mermaid-font-family: "Fira Code", "Shippori Mincho", monospace;

  /* Markmap Colors */
  --markmap-circle-fill: #11ff84;
  --markmap-circle-stroke: #11ff84;
  --markmap-body-text-color: #fd9bcc;
  --markmap-text-color: #fd9bcc;
  --markmap-link-color: #46d2e8;
  --markmap-line-color: #ff0080;
  --markmap-line-width: 4px;
  --markmap-font-family: "Fira Code", "Shippori Mincho", monospace;
}

/*
  ========================================
  Flowchart (graph)
  ========================================
*/

/* Nodes (Rectangles, Circles, Rhombus) */
.mermaid .node rect,
.mermaid .node circle,
.mermaid .node ellipse,
.mermaid .node polygon,
.mermaid .node path,
.mermaid g.node rect,
.mermaid g.node circle,
.mermaid g.node polygon {
  fill: var(--mermaid-primary-color) !important;
  stroke: var(--mermaid-border-color) !important;
  stroke-width: 2px !important;
}

/* Node Text (Label) */
.mermaid .node .label,
.mermaid .nodeLabel,
.mermaid .label {
  color: var(--mermaid-text-color) !important;
  fill: var(--mermaid-text-color) !important; /* SVG text uses fill */
  font-family: var(--mermaid-font-family);
}
/* Handle foreignObject text (Common in flowcharts) */
.mermaid .node .label foreignObject div,
.mermaid .nodeLabel foreignObject div,
.mermaid .label foreignObject div,
.mermaid span.nodeLabel {
  color: var(--mermaid-text-color) !important;
}


/* Edges (Lines connecting nodes) */
.mermaid .edgePath .path,
.mermaid .flowchart-link {
  stroke: var(--mermaid-line-color) !important;
  stroke-width: 2px !important;
  fill: none !important;
}

/* Arrowheads */
.mermaid .marker {
  fill: var(--mermaid-arrow-color) !important;
  stroke: var(--mermaid-arrow-color) !important;
}
/* V10 often puts markers in defs, coloring the path is key, but marker-end needs color too */
.mermaid marker path {
  fill: var(--mermaid-arrow-color) !important;
  stroke: var(--mermaid-arrow-color) !important;
}

/* Edge Labels (Text on lines) */
.mermaid .edgeLabel,
.mermaid .edgeLabel rect {
  background-color: #000000 !important; /* Dark background for readability */
  fill: #000000 !important;
}

/* Sequence Diagram Adjustments */
/* Actors */
.mermaid g.actor,
.mermaid rect.actor {
  fill: var(--mermaid-primary-color) !important;
  stroke: var(--mermaid-border-color) !important;
}
.mermaid text.actor > tspan,
.mermaid tspan {
  fill: var(--mermaid-text-color) !important;
}

/* Lines */
.mermaid line {
  stroke: var(--mermaid-line-color) !important;
}

/* Message Text */
.mermaid .messageText {
  fill: var(--mermaid-text-color) !important;
  stroke: none !important;
}

/* Notes */
.mermaid .note {
  fill: #222 !important;
  stroke: var(--mermaid-border-color) !important;
}
.mermaid .noteText {
  fill: #fff !important;
}

/* Loops / Alt blocks */
.mermaid .loopText,
.mermaid .loopText > tspan {
  fill: #fff !important;
}
.mermaid .loopLine {
  stroke: var(--mermaid-border-color) !important;
}

/*
  ========================================
  Class Diagram
  ========================================
*/

.mermaid g.classGroup rect {
  fill: var(--mermaid-primary-color) !important;
  stroke: var(--mermaid-border-color) !important;
  stroke-width: 2px;
}

.mermaid g.classGroup text {
  fill: var(--mermaid-text-color) !important;
}

.mermaid g.classGroup line {
  stroke: var(--mermaid-border-color) !important;
}

.mermaid .relation {
  stroke: var(--mermaid-line-color) !important;
  stroke-width: 2px;
  fill: none;
}

/*
  ========================================
  State Diagram
  ========================================
*/
.mermaid .stateGroup rect,
.mermaid .stateGroup circle {
  fill: var(--mermaid-primary-color) !important;
  stroke: var(--mermaid-border-color) !important;
}
.mermaid .stateGroup text {
  fill: var(--mermaid-text-color) !important;
}
/* State Diagram v2 Edges */
.mermaid .transition {
  stroke: var(--mermaid-line-color) !important;
}

/*
  ========================================
  ER Diagram
  ========================================
*/
/*
   We target all rects in entity boxes to ensure background is applied.
   We specify colors for alternating rows if needed, or default to general.
*/
.mermaid .entityBox {
  fill: var(--mermaid-primary-color) !important;
  stroke: var(--mermaid-border-color) !important;
}
.mermaid .entityBox rect,
.mermaid .er-entityBox rect {
  fill: var(--mermaid-primary-color) !important;
  stroke: var(--mermaid-border-color) !important;
}

/* ER Diagram Edges */
.mermaid .relationshipLine {
  stroke: var(--mermaid-line-color) !important;
}
.mermaid path.er.relationshipLine {
  stroke: var(--mermaid-line-color) !important;
}

/*//////////////////////////////////////////////*/
/* Markmap (Mindmap) */
/*//////////////////////////////////////////////*/

/* Node lines and circles */
.markmap-node {
  color: var(--markmap-text-color) !important;
  fill: var(--markmap-circle-fill) !important;
}

/* Lines (Edges) */
.markmap-link,
.markmap svg > g > path {
  stroke-opacity: 1 !important;
  fill: none !important;
}

/* Text elements (SVG text) */
.markmap-node text {
  fill: var(--markmap-text-color) !important;
}

/* ForeignObject (Rich text container) */
.markmap-node foreignObject {
  color: var(--markmap-circle-fill) !important;
  font-family: var(--markmap-font-family) !important;
  line-height: 1.2;
}

/* Body Text (Custom span) -> Override to Pink */
.markmap-node foreignObject .markmap-body-text {
  font-weight: normal;
  font-size: 0.9em;
  color: var(--markmap-body-text-color) !important;
  display: inline-block;
}

/* Bold/Strong/Em -> Dark Pink */
.markmap-node foreignObject strong,
.markmap-node foreignObject em,
.markmap-node foreignObject b,
.markmap-node foreignObject i {
  color: #FF14E0 !important;
}

/* Links inside nodes */
.markmap-node a {
  color: var(--markmap-link-color) !important;
}

/* Update Animation */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.markmap-spin {
  animation: spin 0.8s linear infinite;
}
```

## License

MIT
