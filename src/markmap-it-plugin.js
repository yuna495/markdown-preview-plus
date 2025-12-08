// src/markmap-it-plugin.js

// markdown-it のカスタムレンダラー
function markmapItPlugin(md) {
    // Markmapのコードブロックのレンダリングルールをオーバーライド
    const defaultFenceRender = md.renderer.rules.fence;

    md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        const info = token.info.trim();

        // language-markmap のコードブロックを見つける
        if (info === 'markmap') {
            // ここで特殊なHTMLを生成
            // Markmapのレンダリングスクリプト（dist/markmap.js）がこの形式を読み取る想定

            // NOTE: Markmapライブラリは通常、'language-markmap'のクラスを持つ
            // <code>タグ内のMarkdownを読み込む。
            return `<pre><code class="language-markmap">${md.utils.escapeHtml(token.content)}</code></pre>`;
        }

        // それ以外のコードブロックはデフォルトのレンダラーに任せる
        return defaultFenceRender(tokens, idx, options, env, self);
    };
}

module.exports = markmapItPlugin;
