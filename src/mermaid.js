import mermaid from 'mermaid';
import { select } from 'd3-selection';
import { createToolbar, createToolbarButton, applyContainerStyles, setupD3Zoom, preventEventPropagation } from './utils.js';

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'loose',
  theme: 'base',
  themeVariables: {
    primaryColor: '#272b2b',
    primaryTextColor: '#fd9bcc',
    primaryBorderColor: '#11ff84',
    lineColor: '#ff0080',
    secondaryColor: '#171b19',
    tertiaryColor: '#171b19',
    attributeBackgroundColorOdd: '#222',
    attributeBackgroundColorEven: '#161b19',
    fontFamily: '"Fira Code", "Shippori Mincho", monospace',
    fontSize: '16px'
  },
  gantt: {
    todayMarker: false
  }
});

const renderMermaid = async () => {
  const blocks = document.querySelectorAll('pre code.language-mermaid');

  for (const block of blocks) {
    const pre = block.parentElement;
    if (pre.dataset.mermaidRendered) continue;
    pre.dataset.mermaidRendered = 'true';

    let raw = block.textContent.trim();
    const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const container = document.createElement('div');
    container.classList.add('mermaid-container');
    container.classList.add('mermaid');


    applyContainerStyles(container);

    const style = document.createElement('style');
    style.textContent = `
      :root {
        --mermaid-primary-color: #272b2b;
        --mermaid-secondary-color: #171b19;
        --mermaid-border-color: #11ff84;
        --mermaid-text-color: #fd9bcc;
        --mermaid-secondtext-color:#46d2e8;
        --mermaid-line-color: #ff0080;
        --mermaid-arrow-color: #ff0080;
        --mermaid-font-family: "Fira Code", "Shippori Mincho", monospace;
      }
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
      .mermaid .node .label, .mermaid .label, .mermaid span.nodeLabel {
        color: var(--mermaid-text-color) !important;
        fill: var(--mermaid-text-color) !important;
        font-family: var(--mermaid-font-family);
      }
      .mermaid .edgePath .path, .mermaid .flowchart-link {
        stroke: var(--mermaid-line-color) !important;
        stroke-width: 2px !important;
        fill: none !important;
      }
      .mermaid .marker, .mermaid marker path {
        fill: var(--mermaid-arrow-color) !important;
        stroke: var(--mermaid-arrow-color) !important;
      }
      .mermaid .edgeLabel, .mermaid .edgeLabel rect {
        background-color: #000000 !important;
        fill: #000000 !important;
      }
      .mermaid .actor {
        fill: var(--mermaid-primary-color) !important;
        stroke: var(--mermaid-border-color) !important;
      }
      .mermaid line { stroke: var(--mermaid-line-color) !important; }
      .mermaid .messageText { fill: var(--mermaid-text-color) !important; stroke: none !important; }
      .mermaid .note { fill: #222 !important; stroke: var(--mermaid-border-color) !important; }
      .mermaid .noteText { fill: #fff !important; }
      .mermaid .entityBox rect,
      .mermaid .er-entityBox rect,
      .mermaid [id^="entity-"] rect { fill: #222 !important; stroke: var(--mermaid-border-color) !important; }

      /* ER Diagram Alternating Rows */
      .mermaid .attributeBoxOdd,
      .mermaid .attributeBoxOdd rect,
      rect.attributeBoxOdd {
        fill: #222 !important;
        stroke: var(--mermaid-border-color) !important;
        stroke-width: 0 !important;
      }
      .mermaid .attributeBoxEven,
      .mermaid .attributeBoxEven rect,
      rect.attributeBoxEven,
      .mermaid [class*="attributeBoxEven"],
      .mermaid [class*="attributeBoxEven"] rect,
      .mermaid [class*="attributeBox-even"],
      .mermaid [class*="attributeBox-even"] rect {
        fill: #161b19 !important;
        stroke: var(--mermaid-border-color) !important;
        stroke-width: 0 !important;
      }
    `;
    // container.appendChild(style);

    container.style.position = 'relative';
    container.style.height = '600px';

    pre.replaceWith(container);

    try {
      if (await mermaid.parse(raw)) {
        const { svg } = await mermaid.render(id, raw);
        container.innerHTML = svg;

        // Post-Processing: Smart Dark Mode for ER Diagrams
        const getBrightness = (color) => {
          if (!color || color === 'none' || color === 'transparent') return 0;

          let r = 0, g = 0, b = 0;

          if (color.startsWith('#')) {
             const hex = color.slice(1);
             if (hex.length === 3) {
                r = parseInt(hex[0] + hex[0], 16);
                g = parseInt(hex[1] + hex[1], 16);
                b = parseInt(hex[2] + hex[2], 16);
             } else {
                r = parseInt(hex.substr(0, 2), 16);
                g = parseInt(hex.substr(2, 2), 16);
                b = parseInt(hex.substr(4, 2), 16);
             }
          } else if (color.startsWith('rgb')) {
            const arr = color.match(/(\d+)/g);
            if (!arr || arr.length < 3) return 0;
            r = parseInt(arr[0]);
            g = parseInt(arr[1]);
            b = parseInt(arr[2]);
          } else {
             if (color === 'white') return 255;
             return 0;
          }

          return isNaN(r) ? 0 : ((r * 299) + (g * 587) + (b * 114)) / 1000;
        };

        const allElements = container.querySelectorAll('*');
        allElements.forEach(el => {
          const computed = window.getComputedStyle(el);
          const fill = computed.fill;
          const brightness = getBrightness(fill);

          if (false && brightness > 200) {
             // Use setProperty to override any existing specificity
             // Even Rows (Light Grey) -> Darker (#161b19)
             // Odd Rows (White) -> Standard Dark (#222)
             const targetColor = brightness > 250 ? '#222' : '#161b19';

             el.style.setProperty('fill', targetColor, 'important');
             el.setAttribute('fill', targetColor);
          }

          // Edge Label Text Fix
          if (el.tagName.toLowerCase() === 'rect' && el.closest('.edgeLabel')) {
            el.style.fill = '#000000';
            el.style.color = '#ff0080';
          }
        });

        const todayMarkers = container.querySelectorAll('.today');
        todayMarkers.forEach(el => el.remove());

        const svgEl = container.querySelector('svg');
        if (svgEl) {
          svgEl.removeAttribute('width');
          svgEl.removeAttribute('height');
          svgEl.removeAttribute('style');
          svgEl.removeAttribute('viewBox');

          svgEl.style.width = '100%';
          svgEl.style.height = '100%';
          svgEl.style.display = 'block';
          svgEl.style.pointerEvents = 'all';

          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.classList.add('zoom-layer');
          while (svgEl.firstChild) {
            g.appendChild(svgEl.firstChild);
          }
          svgEl.appendChild(g);

          const d3Svg = select(svgEl);
          const d3G = select(g);

          // Use Shared Zoom Logic
          const bBox = g.getBBox();
          const { zoomBehavior, initialTransform } = setupD3Zoom(d3Svg, d3G, container, bBox);

          const toolbar = createToolbar(container);
          const btnReset = createToolbarButton('⟲', () => {
            d3Svg.transition().call(zoomBehavior.transform, initialTransform);
          }, 'Reset Zoom');
          toolbar.appendChild(btnReset);

          // Use Shared Event Blocking
          preventEventPropagation(container);
        }
      }
    } catch (err) {
      console.error(err);
      container.innerHTML = `<pre style="color:red;padding:10px;">${err.message}</pre>`;
    }
  }
};

renderMermaid();
const observer = new MutationObserver(renderMermaid);
observer.observe(document.body, { childList: true, subtree: true });
