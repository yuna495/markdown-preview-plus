/**
 * Common utilities for Markdown Preview Plus diagram rendering
 */

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
