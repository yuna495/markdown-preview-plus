import mermaid from 'mermaid';
import { select } from 'd3-selection';
import { createToolbar, createToolbarButton, applyContainerStyles, setupD3Zoom, preventEventPropagation } from './utils.js';

mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: 'dark',
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

        container.style.position = 'relative';
        container.style.height = '600px';

        pre.replaceWith(container);

        try {
            if (await mermaid.parse(raw)) {
                const { svg } = await mermaid.render(id, raw);
                container.innerHTML = svg;

                // Post-Processing
                const allElements = container.querySelectorAll('*');
                allElements.forEach(el => {
                    const style = window.getComputedStyle(el);
                    const fill = el.getAttribute('fill');
                    const bgColor = style.backgroundColor;

                    if (fill === '#ffffff' || fill === 'white' || fill === 'rgb(255, 255, 255)' || style.fill === 'rgb(255, 255, 255)' || style.fill === '#ffffff') {
                        el.style.fill = '#000000';
                        el.setAttribute('fill', '#000000');
                    }
                    if (bgColor === 'rgb(255, 255, 255)' || bgColor === '#ffffff' || bgColor === 'white') {
                        el.style.backgroundColor = '#000000';
                    }
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
