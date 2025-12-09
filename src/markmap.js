// src/markmap.js
// Markmapライブラリを直接インポートし、グローバル (window.markmap) に依存しない
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';
import { Toolbar } from 'markmap-toolbar';
import { createToolbar, createToolbarButton, applyContainerStyles, preventEventPropagation } from './utils.js';



// Transformerのインスタンスを1つ作成し、再利用
const transformer = new Transformer();

/**
 * Markdownの本文（パラグラフ）を見出しやリストアイテムに結合して "Heading: Body" の形式にする
 */
function processMarkdown(markdown) {
  const lines = markdown.split('\n');
  let newLines = [];
  let inCodeBlock = false;
  let lastHeaderIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // コードブロックの判定
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      newLines.push(line);
      lastHeaderIndex = -1;
      continue;
    }

    if (inCodeBlock) {
      newLines.push(line);
      continue;
    }

    // 空行は無視
    if (trimmed === '') {
      newLines.push(line);
      continue;
    }

    // ヘッダーの場合
    if (trimmed.startsWith('#')) {
      newLines.push(line);
      lastHeaderIndex = newLines.length - 1;
      continue;
    }

    // リストアイテムの場合も結合対象（親）とする
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('>') || /^\d+\. /.test(trimmed)) {
      newLines.push(line);
      lastHeaderIndex = newLines.length - 1;
      continue;
    }

    // それ以外（本文パラグラフ）
    if (lastHeaderIndex !== -1) {
      // 直前の見出し/リストに結合する
      const currentHeader = newLines[lastHeaderIndex];
      // <br/>で改行し、spanでスタイル適用
      newLines[lastHeaderIndex] = `${currentHeader}<br/><span class="markmap-body-text">${trimmed}</span>`;
    } else {
      // 親がない状態での本文
      newLines.push(`- <span class="markmap-body-text">${trimmed}</span>`);
    }
  }

  return newLines.join('\n');
}


/**
 * Markmapをレンダリングする関数
 */
function renderMarkmaps() {
  const markmapElements = document.querySelectorAll('pre code.language-markmap');

  markmapElements.forEach((el) => {
    const preElement = el.parentElement;
    if (preElement.dataset.markmapRendered) {
      return;
    }
    preElement.dataset.markmapRendered = 'true';

    const rawMarkdown = el.textContent;
    const markdown = processMarkdown(rawMarkdown);

    const { root } = transformer.transform(markdown);

    const container = document.createElement('div');
    container.classList.add('markmap');

    // Use unified styles
    applyContainerStyles(container);

    // Specific overrides if needed (e.g. position for toolbar)
    container.style.position = 'relative';
    container.style.height = 'auto';
    container.style.minHeight = '150px';
    // Border/BoxSizing handled by applyContainerStyles

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width = '100%';
    svg.style.display = 'block';



    // Old Markmap Toolbar removed (lines 154-162 in original)
    // We use our shared Toolbar instead later.

    container.append(svg);
    preElement.replaceWith(container);

    const mm = Markmap.create(svg, {
      spacingVertical: 15,
      paddingX: 20,
      maxWidth: 300,
    }, root);

    // Toolbar.create(mm, toolbar); // Disable default markmap toolbar to use ours?
    // Wait, the user wants the REFRESH button. The default toolbar has zoom/pan/etc.
    // The user screenshot showed a custom refresh button. I will recreate THAT.
    // If user wants internal toolbar too... for now I focused on the refresh button.

    // Use shared toolbar for Refresh Button
    const toolbar = createToolbar(container);

    const refreshButton = createToolbarButton('⟲', async () => {
        refreshButton.classList.add('markmap-spin');
        await updateLayout();
        refreshButton.classList.remove('markmap-spin');
    }, 'Refresh Layout');

    toolbar.appendChild(refreshButton);

    const updateLayout = async () => {
        await mm.fit();
        const { y2 } = mm.state.rect;

        let calculatedHeight = y2 * 1.5 + 300;
        const MAX_HEIGHT = 900;

        if (calculatedHeight > MAX_HEIGHT) {
            calculatedHeight = MAX_HEIGHT;
        }

        if (calculatedHeight > 0) {
            svg.style.height = `${calculatedHeight}px`;
            container.style.height = `${calculatedHeight}px`;
        }
        await mm.fit();
    };

    // Use Shared Event Blocking
    preventEventPropagation(container);

    (async () => {
        await mm.fit();
        await updateLayout();
    })();
  });
}



// 初期レンダリング
renderMarkmaps();

// DOMの変更を監視して再レンダリング
const observer = new MutationObserver(renderMarkmaps);
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
