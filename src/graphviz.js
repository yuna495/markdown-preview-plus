import { Graphviz } from "@hpcc-js/wasm";
import { select } from 'd3-selection';
import { createToolbar, createToolbarButton, applyContainerStyles, setupD3Zoom, preventEventPropagation } from './utils.js';

const renderGraphviz = async () => {
  const blocks = document.querySelectorAll('pre code.language-graphviz, pre code.language-dot');

  for (const block of blocks) {
    const pre = block.parentElement;
    if (pre.dataset.graphvizRendered) continue;
    pre.dataset.graphvizRendered = 'true';

    let raw = block.textContent.trim();

    const container = document.createElement('div');
    container.classList.add('graphviz-container');
    container.classList.add('graphviz');

    applyContainerStyles(container);

    applyContainerStyles(container);


    applyContainerStyles(container);

    // No aggressive CSS injection effectively allows custom colors to work.
    // We will do "Smart Defaulting" in JS below.


    container.style.position = 'relative';
    container.style.height = '600px';

    pre.replaceWith(container);

    try {
      const graphviz = await Graphviz.load();
      const svgContent = graphviz.layout(raw, "svg", "dot");
      container.innerHTML = svgContent;

      // Smart Theme Application
      // Only apply theme colors if the element has default colors (black/white/none)
      const theme = {
        nodeFill: '#272b2b',
        nodeStroke: '#11ff84',
        text: '#fd9bcc',
        edge: '#ff0080',
        edgeText: '#46d2e8',
        font: '"Fira Code", "Shippori Mincho", monospace'
      };

      const isDefault = (color) => {
        if (!color) return true;
        const c = color.toLowerCase();
        return ['none', 'black', 'white', '#000000', '#ffffff', '#000', '#fff', 'transparent', 'rgb(0, 0, 0)', 'rgb(255, 255, 255)'].includes(c);
      };

      const svgRoot = container.querySelector('svg');
      if (svgRoot) {
        // 1. Background
        const graphBg = svgRoot.querySelector('.graph > polygon');
        if (graphBg) graphBg.setAttribute('fill', 'transparent');

        // 2. Nodes
        const nodes = svgRoot.querySelectorAll('.node');
        nodes.forEach(node => {
          // Shapes (Node Background/Border)
          const shapes = node.querySelectorAll('polygon, ellipse');
          shapes.forEach(shape => {
            const fill = shape.getAttribute('fill');
            const stroke = shape.getAttribute('stroke');

            if (isDefault(fill)) {
              shape.setAttribute('fill', theme.nodeFill);
            }
            if (isDefault(stroke)) {
              shape.setAttribute('stroke', theme.nodeStroke);
              shape.setAttribute('stroke-width', '2');
            }
          });

          // Paths (Dividers in Record nodes)
          const paths = node.querySelectorAll('path, line, polyline');
          paths.forEach(path => {
             const stroke = path.getAttribute('stroke');
             const fill = path.getAttribute('fill'); // Dividers often have 'fill="none"'

             // If it looks like a divider (default stroke, no active fill)
             if (isDefault(stroke) && (isDefault(fill) || fill === 'none')) {
               // Dividers use Cyan
               path.setAttribute('stroke', theme.edgeText);
               path.setAttribute('stroke-width', '1');
               path.style.stroke = theme.edgeText; // Force style override
             }
          });

          // Text
          const texts = node.querySelectorAll('text');
          texts.forEach(text => {
            const fill = text.getAttribute('fill');
            if (isDefault(fill)) {
              text.setAttribute('fill', theme.text);
              text.style.fontFamily = theme.font;
            }
          });
        });

        // 3. Edges
        const edges = svgRoot.querySelectorAll('.edge');
        edges.forEach(edge => {
          // Lines (Paths)
          const paths = edge.querySelectorAll('path');
          paths.forEach(path => {
            const stroke = path.getAttribute('stroke');
            if (isDefault(stroke)) {
              path.setAttribute('stroke', theme.edge);
              path.setAttribute('stroke-width', '2');
            }
          });

          // Arrows (Polygons)
          const polys = edge.querySelectorAll('polygon');
          polys.forEach(poly => {
            const fill = poly.getAttribute('fill');
            const stroke = poly.getAttribute('stroke');
            if (isDefault(fill)) poly.setAttribute('fill', theme.edge);
            if (isDefault(stroke)) poly.setAttribute('stroke', theme.edge);
          });

          // Text
          const texts = edge.querySelectorAll('text');
          texts.forEach(text => {
             const fill = text.getAttribute('fill');
             if (isDefault(fill)) {
               text.setAttribute('fill', theme.edgeText);
               text.style.fontFamily = theme.font;
             }
          });
        });
      }

      const svgEl = container.querySelector('svg');
      if (svgEl) {
        svgEl.removeAttribute('width');
        svgEl.removeAttribute('height');
        svgEl.removeAttribute('style');
        svgEl.removeAttribute('viewBox'); // We will let D3 manage transform, but maybe we need bbox?

        svgEl.style.width = '100%';
        svgEl.style.height = '100%';
        svgEl.style.display = 'block';

        // Wrap contents in a zoom layer group
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.classList.add('zoom-layer');
        while (svgEl.firstChild) {
          g.appendChild(svgEl.firstChild);
        }
        svgEl.appendChild(g);

        const d3Svg = select(svgEl);
        const d3G = select(g);

        // Get BBox for initial zoom calculation
        const bBox = g.getBBox();
        const { zoomBehavior, initialTransform } = setupD3Zoom(d3Svg, d3G, container, bBox);

        // Toolbar
        const toolbar = createToolbar(container);
        const btnReset = createToolbarButton('⟲', () => {
          d3Svg.transition().call(zoomBehavior.transform, initialTransform);
        }, 'Reset Zoom');
        toolbar.appendChild(btnReset);

        preventEventPropagation(container);
      }

    } catch (err) {
      console.error('Graphviz render error:', err);
      container.innerHTML = `<pre style="color:red;padding:10px;">Graphviz Error: ${err.message}</pre>`;
    }
  }
};

renderGraphviz();
const observer = new MutationObserver(renderGraphviz);
observer.observe(document.body, { childList: true, subtree: true });
