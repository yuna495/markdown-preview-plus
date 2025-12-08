// The module 'vscode' contains the VS Code extensibility API
const vscode = require('vscode');

// 作成予定のMarkmapプラグインをインポートします
const markmapPlugin = require('./markmap-it-plugin');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Markdown Preview Plus is now active!');


}

// この関数をエクスポートすることで、VS CodeのMarkdown拡張機能が
// 独自のマークダウン-itインスタンスを拡張するために呼び出します。
/**
 * @param {import('markdown-it')} md
 * @returns {import('markdown-it')}
 */
function extendMarkdownIt(md) {
    // Markmapプラグインを適用
    // ここに将来Mermaidプラグインも追加できます
    return md.use(markmapPlugin);
}


function deactivate() {}

module.exports = {
	activate,
    extendMarkdownIt,
	deactivate
}
