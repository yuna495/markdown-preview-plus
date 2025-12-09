import { select } from 'd3-selection';
import { zoom, zoomIdentity } from 'd3-zoom';

/**
 * Common utilities for Markdown Preview Plus diagram rendering
 */

/**
 * Configure D3 Zoom behavior for a given SVG and Group
 * @param {object} d3Svg - The D3 selection of the SVG element
 * @param {object} d3G - The D3 selection of the content Group element
 * @param {HTMLElement} container - The container element (for size calculation)
 * @param {object} initialBBox - The bounding box of the content {x, y, width, height}
 * @returns {object} { zoomBehavior, initialTransform }
 */
export function setupD3Zoom(d3Svg, d3G, container, initialBBox) {
    const containerWidth = container.clientWidth || 800;
    const containerHeight = container.clientHeight || 600;

    // Add padding
    const padding = 20;
    const widthRatio = (containerWidth - padding * 2) / initialBBox.width;
    const heightRatio = (containerHeight - padding * 2) / initialBBox.height;
    const minRatio = Math.min(widthRatio, heightRatio);

    // Limit initial zoom
    const initialScale = Math.min(minRatio, 1);

    // Center logic
    const midX = initialBBox.x + initialBBox.width / 2;
    const midY = initialBBox.y + initialBBox.height / 2;

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
    d3Svg.call(zoomBehavior.transform, initialTransform);
    d3Svg.on('dblclick.zoom', null);

    return { zoomBehavior, initialTransform };
}

/**
 * Stops propagation of common interaction events on the element
 * @param {HTMLElement} element - The target element
 */
export function preventEventPropagation(element) {
    const events = ['wheel', 'mousedown', 'mouseup', 'mousemove', 'click', 'dblclick', 'pointerdown', 'pointerup', 'pointermove', 'contextmenu'];
    events.forEach(evt => {
        element.addEventListener(evt, (e) => e.stopPropagation());
    });
}


/**
 * Applies unified styles to the diagram container
 * @param {HTMLElement} container - The container element
 */
export function applyContainerStyles(container) {
    container.style.width = '90%';          // Slightly narrower as requested
    container.style.margin = '10px auto';   // Center and add vertical space
    container.style.display = 'block';      // Ensure block layout

    // Unified Border Styles
    container.style.border = '1px solid #666';
    container.style.borderRadius = '4px';
    container.style.boxSizing = 'border-box';
}

/**
 * Creates a standard toolbar container positioned absolutely within the diagram container
 * @param {HTMLElement} container - The parent container (must have position: relative)
 * @returns {HTMLElement} The styled toolbar element
 */
export function createToolbar(container) {
    const toolbar = document.createElement('div');
    toolbar.style.position = 'absolute';
    toolbar.style.right = '10px';
    toolbar.style.bottom = '10px';
    toolbar.style.display = 'flex';
    toolbar.style.flexDirection = 'column';
    toolbar.style.gap = '5px';
    toolbar.style.zIndex = '1000';

    // Ensure container has relative positioning so absolute works correctly
    if (getComputedStyle(container).position === 'static') {
        container.style.position = 'relative';
    }

    container.appendChild(toolbar);
    return toolbar;
}

/**
 * Creates a standard styled circular button for the toolbar
 * @param {string} text - The button label/icon text
 * @param {Function} onClick - Click handler (automatically stops propagation)
 * @param {string} [title] - Optional tooltip text
 * @returns {HTMLElement} The styled button element
 */
export function createToolbarButton(text, onClick, title = '') {
    const btn = document.createElement('button');
    btn.textContent = text;
    if (title) btn.title = title;

    // Style
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

    // Event
    btn.onclick = (e) => {
        e.stopPropagation();
        onClick(e);
    };

    return btn;
}
