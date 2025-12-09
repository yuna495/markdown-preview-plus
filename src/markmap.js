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
    container.classList.add('markmap');
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
        cursor: pointer;
      }
      .markmap-node circle {
        fill: var(--markmap-circle-fill, #11ff84);
        stroke: var(--markmap-circle-stroke, #11ff84);
        stroke-width: 1px;
      }
      .markmap-node text {
        fill: var(--markmap-text-color, #fd9bcc);
        font-family: var(--markmap-font-family, "Fira Code", monospace);
      }
      .markmap-node foreignObject {
        color: var(--markmap-text-color, #fd9bcc);
        font-family: var(--markmap-font-family, "Fira Code", monospace);
      }
      .markmap-node a {
        color: var(--markmap-link-color, #46d2e8);
      }
      .markmap-link {
        stroke: var(--markmap-line-color, #ff0080);
      }
      .markmap-body-text {
        font-weight: normal;
        font-size: 0.9em;
        color: var(--markmap-body-text-color, #fd9bcc);
        display: inline-block;
      }
      /* Highlight/Bold Color Variable mapping */
      .markmap-node foreignObject strong,
      .markmap-node foreignObject em,
      .markmap-node foreignObject b,
      .markmap-node foreignObject i {
        color: var(--markmap-highlight-color, #FF14E0) !important;
      }
    `;
    svg.append(style);

    const toolbar = document.createElement('div');
    toolbar.style.position = 'absolute';
    toolbar.style.right = '20px';
    toolbar.style.top = 'auto';
    toolbar.style.bottom = '20px';
    toolbar.style.padding = '0';
    toolbar.style.display = 'flex';
    toolbar.style.gap = '8px';
    toolbar.style.flexDirection = 'column';

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

    // 更新ボタン (右下に配置)
    const refreshButton = document.createElement('button');
    refreshButton.textContent = '⟲';
    refreshButton.type = 'button';
    refreshButton.title = 'Refresh Layout';
    refreshButton.style.zIndex = '999';
    refreshButton.style.cursor = 'pointer';
    refreshButton.style.width = '30px';
    refreshButton.style.height = '30px';
    refreshButton.style.borderRadius = '50%';
    refreshButton.style.border = '1px solid #1f8';
    refreshButton.style.background = '#222';
    refreshButton.style.color = '#1f8';
    refreshButton.style.fontSize = '16px';
    refreshButton.style.display = 'flex';
    refreshButton.style.alignItems = 'center';
    refreshButton.style.justifyContent = 'center';
    refreshButton.style.position = 'fixed'; // コンテナに対する相対位置
    refreshButton.style.bottom = '10px';      // 下端から10px
    refreshButton.style.right = '10px';       // 右端から10px

    refreshButton.onclick = (e) => {
        e.stopPropagation();
        updateLayout();
    };

    container.appendChild(refreshButton);

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
