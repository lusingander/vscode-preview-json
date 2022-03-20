import * as vscode from 'vscode';

function formatJSONString(s: string, indent: number): string | null {
  try {
    const json = JSON.parse(s);
    return JSON.stringify(json, null, indent);
  } catch {
    return null;
  }
}

function toMarkdownString(s: string): vscode.MarkdownString | null {
	const json = formatJSONString(s, 2);
  if (!json) {
    return null;
  }
  const content = `\`\`\`json\n${json}\n\`\`\``;
  const md = new vscode.MarkdownString(content);
  md.supportHtml = true;
  md.isTrusted = true;
  return md;
}

export function activate(context: vscode.ExtensionContext) {
  vscode.languages.registerHoverProvider('*', {
    provideHover(document, position, token) {
      const selection = vscode.window.activeTextEditor?.selection;
      if (!selection?.contains(position)) {
        return null;
      }
      const selectedText = document.getText(selection);
      const md = toMarkdownString(selectedText);
      if (!md) {
        return null;
      }
      return new vscode.Hover(md);
    }
  });
}

export function deactivate() {}
