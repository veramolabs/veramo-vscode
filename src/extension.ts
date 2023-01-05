import * as vscode from "vscode";
import type MarkdownIt from 'markdown-it';
import { markdownPlugin } from "./markdown";
import { didDocumentHoverProvider } from "./hover-providers/did-document-hover";
import { verifyCredentialCommand } from "./commands/verify-credential";
import { verifyCommand } from "./commands/verify";
import { resolveDidCommand } from "./commands/resolve-did";
import { updateVerifiedStatusBarItem, verifiedStatusBarItem } from "./status-bar-items/verified-status-bar-item";

export function activate(context: vscode.ExtensionContext) {
  
  context.subscriptions.push(vscode.commands.registerCommand('veramo.verify-credential', verifyCredentialCommand));
  context.subscriptions.push(vscode.commands.registerCommand('veramo.verify', verifyCommand));
  context.subscriptions.push(vscode.commands.registerCommand('veramo.resolve-did', resolveDidCommand));

  vscode.languages.registerHoverProvider('markdown', didDocumentHoverProvider);
  vscode.languages.registerHoverProvider('javascript', didDocumentHoverProvider);
  vscode.languages.registerHoverProvider('typescript', didDocumentHoverProvider);

	context.subscriptions.push(verifiedStatusBarItem);
  context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateVerifiedStatusBarItem));
	vscode.workspace.onDidSaveTextDocument(updateVerifiedStatusBarItem, null, context.subscriptions);

  updateVerifiedStatusBarItem();

  return {
    extendMarkdownIt(md: MarkdownIt) {
        return md.use(markdownPlugin);
    }
  };
  
}

// this method is called when your extension is deactivated
export function deactivate() {}
