import mermaid from 'mermaid';
import { select } from 'd3-selection';
import { zoom, zoomIdentity } from 'd3-zoom';

mermaid.initialize({ startOnLoad: false, securityLevel: 'loose', theme: 'dark' });

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
        container.classList.add('mermaid'); // Add standard class for user CSS targeting
        container.style.position = 'relative';
        container.style.width = '100%';
        container.style.height = '600px'; // Fixed height for a proper viewport
        container.style.border = '1px solid #ddd';
        container.style.boxSizing = 'border-box';
        container.style.background = 'transparent'; // Allow theme/CSS correctly
        container.style.overflow = 'hidden';

        pre.replaceWith(container);

        try {
            // Check if valid
            if (await mermaid.parse(raw)) {
                const { svg } = await mermaid.render(id, raw);
                container.innerHTML = svg;

                // --- Post-Processing Fixes (Brute Force) ---
                // Iterate ALL elements to find white backgrounds and kill them
                const allElements = container.querySelectorAll('*');
                allElements.forEach(el => {
                    const style = window.getComputedStyle(el);
                    const fill = el.getAttribute('fill');
                    const bgColor = style.backgroundColor;

                    // Check for white fill
                    if (fill === '#ffffff' || fill === 'white' || fill === 'rgb(255, 255, 255)' || style.fill === 'rgb(255, 255, 255)' || style.fill === '#ffffff') {
                         el.style.fill = '#000000';
                         el.setAttribute('fill', '#000000');
                    }

                    // Check for white background-color (often in foreignObject > div)
                    if (bgColor === 'rgb(255, 255, 255)' || bgColor === '#ffffff' || bgColor === 'white') {
                        el.style.backgroundColor = '#000000';
                    }

                    // Specific fix for edgeLabel rects (in case they are not pure white but 'default' theme color)
                    if (el.tagName.toLowerCase() === 'rect' && el.closest('.edgeLabel')) {
                         el.style.fill = '#000000';
                         el.style.color = '#ff0080'; // Ensure text color is correct if this is a container
                    }
                });

                const svgEl = container.querySelector('svg');
                if (svgEl) {
                    // Reset SVG attributes to allow d3-zoom full control
                    svgEl.removeAttribute('width');
                    svgEl.removeAttribute('height');
                    svgEl.removeAttribute('style');
                    svgEl.removeAttribute('viewBox'); // Critical for predictable d3-zoom

                    svgEl.style.width = '100%';
                    svgEl.style.height = '100%';
                    svgEl.style.display = 'block';
                    svgEl.style.pointerEvents = 'all';

                    // Create zoom layer
                    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    g.classList.add('zoom-layer');

                    // Move existing content into G
                    while (svgEl.firstChild) {
                        g.appendChild(svgEl.firstChild);
                    }
                    svgEl.appendChild(g);

                    const d3Svg = select(svgEl);
                    const d3G = select(g);

                    // Calculate initial bounds to fit
                    const bBox = g.getBBox();
                    const containerWidth = container.clientWidth || 800; // Fallback
                    const containerHeight = container.clientHeight || 600;

                    // Add padding
                    const padding = 20;
                    const widthRatio = (containerWidth - padding * 2) / bBox.width;
                    const heightRatio = (containerHeight - padding * 2) / bBox.height;
                    const minRatio = Math.min(widthRatio, heightRatio);

                    // Limit initial zoom
                    const initialScale = Math.min(minRatio, 1);

                    // Center logic:
                    // We want: visibleCenterX = scaledCenterX + translate
                    // translate = visibleCenterX - scaledCenterX
                    const midX = bBox.x + bBox.width / 2;
                    const midY = bBox.y + bBox.height / 2;

                    const initialTranslateX = (containerWidth / 2) - (midX * initialScale);
                    const initialTranslateY = (containerHeight / 2) - (midY * initialScale);

                    const initialTransform = zoomIdentity
                        .translate(initialTranslateX, initialTranslateY)
                        .scale(initialScale);


                    const zoomBehavior = zoom()
                        .scaleExtent([0.1, 10])
                        .on('zoom', (event) => {
                            d3G.attr('transform', event.transform);
                        });

                    d3Svg.call(zoomBehavior);
                    // Apply initial transform
                    d3Svg.call(zoomBehavior.transform, initialTransform);
                    d3Svg.on('dblclick.zoom', null);


                    // Toolbar
                    const toolbar = document.createElement('div');
                    toolbar.style.position = 'absolute';
                    toolbar.style.right = '10px';
                    toolbar.style.bottom = '10px';
                    toolbar.style.display = 'flex';
                    toolbar.style.flexDirection = 'column';
                    toolbar.style.gap = '5px';
                    toolbar.style.zIndex = '1000';

                    const createBtn = (text, onClick) => {
                        const btn = document.createElement('button');
                        btn.textContent = text;
                        btn.style.width = '30px';
                        btn.style.height = '30px';
                        btn.style.borderRadius = '50%';
                        btn.style.border = '1px solid #1f8';
                        btn.style.background = '#222';
                        btn.style.cursor = 'pointer';
                        btn.style.display = 'flex';
                        btn.style.alignItems = 'center';
                        btn.style.justifyContent = 'center';
                        btn.style.color = '#1f8';
                        btn.onclick = (e) => {
                            e.stopPropagation();
                            onClick();
                        };
                        return btn;
                    };

                    const btnReset = createBtn('⟲', () => {
                         d3Svg.transition().call(zoomBehavior.transform, initialTransform);
                    });

                    toolbar.appendChild(btnReset);
                    container.appendChild(toolbar);

                    // Stop propagation
                    const events = ['wheel', 'mousedown', 'mouseup', 'mousemove', 'click', 'dblclick'];
                    events.forEach(evt => {
                         container.addEventListener(evt, (e) => e.stopPropagation());
                    });
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
