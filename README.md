# Markdown Preview Plus

**Markdown Preview Plus** extends VS Code's built-in Markdown preview to render interactive diagrams including **Markmap** (Mindmaps), **Mermaid** graphs, and **Graphviz** (DOT) diagrams.

- [Markdown Preview Plus](#markdown-preview-plus)
  - [✨ Features](#-features)
  - [💡 Usage](#-usage)
    - [Markmap (Mindmap)](#markmap-mindmap)
    - [Mermaid](#mermaid)
    - [Graphviz (DOT)](#graphviz-dot)
  - [🎨 Customization](#-customization)
    - [Mermaid Color Theme Change](#mermaid-color-theme-change)
  - [License](#license)

## ✨ Features

- **Diagram Support**:
  - **Markmap**: Render Markdown lists as interactive, zoomable mindmaps.
  - **Mermaid**: Render Flowcharts, Sequence diagrams, Gantt charts, etc., with extensive customization.
  - **Graphviz (DOT)**: Render complex graph visualizations using the DOT language (powered by WebAssembly).

- **Interactive Zoom & Pan**:
  - **Zoom**: Mouse wheel to zoom in/out.
  - **Pan**: Click and drag to pan around large diagrams.
  - **Toolbar**: Dedicated "Reset Zoom" button for easy navigation.

- **Custom Styling**:
  - Fully customizable appearance via CSS variables.
  - Includes a "Cyberpunk / Dark Neon" styling example (see below).

## 💡 Usage

Use standard Markdown code blocks with the appropriate language identifiers: `markmap`, `mermaid`, or `graphviz` (alias `dot`).

### Markmap (Mindmap)

![markmap](./demo/markmap.png)

```markdown
    ```markmap
    # Root Topic
    ## Feature A
    ### Detail 1
    ## Feature B
    ```

```

### Mermaid

![Mermaid](./demo/mermaid.png)

```markdown
    ```mermaid
    flowchart LR
        A[Start] --> B{Is it working?}
        B -- Yes --> C[Great!]
        B -- No --> D[Debug]
    ```

```

### Graphviz (DOT)

![graphviz](./demo/graphviz.png)

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

### Mermaid Color Theme Change

- settings.json Configuration

```json
"markdown-preview-plus.mermaidTheme": "pinklily"  //default, neutral, dark, forest, base
```

- Default Mermaid Theme: `Pink Lily`

  [PinkLily Color Theme](https://marketplace.visualstudio.com/items?itemName=yuna495.pinklily)

  It is a theme with similar colors to the `PinkLily` color theme I created.

## License

MIT
