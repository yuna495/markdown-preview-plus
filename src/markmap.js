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
    // 固定の高さは削除し、コンテンツに合わせて広がるようにする
    container.style.position = 'relative';
    // 左右幅の設定
    container.style.width = '85vw';
    container.style.maxWidth = '85vw';
    container.style.marginLeft = '50%';
    container.style.transform = 'translateX(-50%)';
    // 初期高さは最小限に
    container.style.height = 'auto';
    container.style.minHeight = '150px';
    // 枠線を追加
    container.style.border = '1px solid #666';
    container.style.boxSizing = 'border-box';
    container.style.borderRadius = '4px';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width = '100%';
    // 高さも初期はautoだが、JSで制御する

    // SVG内のテキスト色を明るくするスタイルを追加
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

    // Markmapを描画
    const mm = Markmap.create(svg, {
      spacingVertical: 35, // 縦幅を広げる
      paddingX: 20,
    }, root);

    Toolbar.create(mm, toolbar);

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.type = 'button';
    resetButton.style.zIndex = '999';
    resetButton.style.cursor = 'pointer';
    resetButton.onclick = () => {
      mm.fit();
    };
    toolbar.appendChild(resetButton);

    // デフォルトでfitさせる
    // データをセットして描画完了を待ち、高さを調整する
    (async () => {
        // setDataは不要（createで渡しているため）だが、念のためrender完了を待つ意味でfitを呼ぶ
        await mm.fit();

        // mm.state.rect から描画領域の高さを取得する
        const { y2 } = mm.state.rect;

        // 縦幅の計算
        let calculatedHeight = y2 * 1.5 + 300;

        // ★重要: 上限値を設定 (例: 800px)
        const MAX_HEIGHT = 800;

        // 上限を超えないように制限する
        if (calculatedHeight > MAX_HEIGHT) {
            calculatedHeight = MAX_HEIGHT;
        }

        if (calculatedHeight > 0) {
            svg.style.height = `${calculatedHeight}px`;
            container.style.height = `${calculatedHeight}px`; // コンテナも合わせる
        }

        // 高さ変更後に再調整
        await mm.fit();
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
