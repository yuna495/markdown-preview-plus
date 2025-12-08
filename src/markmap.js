// src/markmap.js
// Markmapライブラリを直接インポートし、グローバル (window.markmap) に依存しない
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';
import { Toolbar } from 'markmap-toolbar';

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
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.height = 'auto';
    container.style.minHeight = '150px';
    container.style.border = '1px solid #666';
    container.style.boxSizing = 'border-box';
    container.style.borderRadius = '4px';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width = '100%';
    svg.style.display = 'block';

    const style = document.createElement('style');
    style.textContent = `
      .markmap-node {
        color: #11ff84 !important;
        fill: #11ff84 !important;
      }
      .markmap-node text {
        fill: #11ff84 !important;
      }
      .markmap-node foreignObject {
        color: #11ff84 !important;
      }
      .markmap-body-text {
        font-weight: normal;
        font-size: 0.9em;
        color: #fd9bcc !important;
        fill: #fd9bcc !important;
        display: inline-block;
      }
      .markmap-node a {
        color: #8cb4ff !important;
      }
    `;
    svg.append(style);

    const toolbar = document.createElement('div');
    toolbar.style.position = 'absolute';
    toolbar.style.right = '20px';
    toolbar.style.top = '20px';
    toolbar.style.padding = '0';
    toolbar.style.display = 'flex';
    toolbar.style.gap = '8px';

    container.append(svg, toolbar);
    preElement.replaceWith(container);

    const mm = Markmap.create(svg, {
      spacingVertical: 15,
      paddingX: 20,
      maxWidth: 300,
    }, root);

    Toolbar.create(mm, toolbar);

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

    // 更新ボタン (右上に配置)
    const refreshButton = document.createElement('button');
    refreshButton.textContent = '↻';
    refreshButton.type = 'button';
    refreshButton.title = 'Refresh Layout';
    refreshButton.style.zIndex = '999';
    refreshButton.style.cursor = 'pointer';
    refreshButton.style.width = '30px';
    refreshButton.style.height = '30px';
    refreshButton.style.borderRadius = '50%'; // 丸くする
    refreshButton.style.border = '1px solid #ccc';
    refreshButton.style.background = '#222';
    refreshButton.style.color = '#fff';
    refreshButton.style.fontSize = '16px';
    refreshButton.style.display = 'flex';
    refreshButton.style.alignItems = 'center';
    refreshButton.style.justifyContent = 'center';
    refreshButton.style.marginBottom = '5px'; // 標準ツールバーとの間隔

    refreshButton.onclick = (e) => {
        e.stopPropagation();
        updateLayout();
    };

    // ツールバーを縦並びにする
    toolbar.style.flexDirection = 'column';
    // 標準ツールバーの前に更新ボタンを追加して、一番上に表示されるようにする
    if (toolbar.firstChild) {
        toolbar.insertBefore(refreshButton, toolbar.firstChild);
    } else {
        toolbar.appendChild(refreshButton);
    }

    const blockEvents = [
        'click', 'dblclick',
        'mousedown', 'mouseup', 'mousemove',
        'wheel',
        'pointerdown', 'pointerup', 'pointermove',
        'contextmenu'
    ];
    blockEvents.forEach(evt => {
        container.addEventListener(evt, (e) => {
            e.stopPropagation();
        });
    });

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
