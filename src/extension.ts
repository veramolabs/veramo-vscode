import "cross-fetch/polyfill";
import * as vscode from "vscode";
import { agent } from "./setup";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const didDocProvider = new (class
    implements vscode.TextDocumentContentProvider
  {
    async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
      try {
        const result = await agent.resolveDid({ didUrl: uri.path });
        return JSON.stringify(result, null, 2);
      } catch (e: any) {
        return "ERROR: " + e.message;
      }
    }
  })();

  vscode.workspace.registerTextDocumentContentProvider(
    "veramo-resolve-did",
    didDocProvider
  );

  const messageProvider = new (class
    implements vscode.TextDocumentContentProvider
  {
    async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
      try {
        const result = await agent.handleMessage({ raw: uri.path });
        return JSON.stringify(result, null, 2);
      } catch (e: any) {
        return "ERROR: " + e.message;
      }
    }
  })();

  vscode.workspace.registerTextDocumentContentProvider(
    "veramo-handle-message",
    messageProvider
  );

  console.log('Congratulations, your extension "veramo-vscode" is now active!');

  let disposable = vscode.commands.registerCommand(
    "veramo-vscode.handleMessage",
    async () => {
      let message = await vscode.window.showInputBox({
        placeHolder: "JWT",
      });
      if (message) {
        let uri = vscode.Uri.parse("veramo-handle-message:" + message);
        let doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider
        await vscode.window.showTextDocument(doc, { preview: false });
      }
    }
  );

  context.subscriptions.push(disposable);

  let disposable2 = vscode.commands.registerCommand(
    "veramo-vscode.resolveDid",
    async () => {
      let did = await vscode.window.showInputBox({
        placeHolder: "did:example:123",
      });
      if (did) {
        let uri = vscode.Uri.parse("veramo-resolve-did:" + did);
        let doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider
        await vscode.window.showTextDocument(doc, { preview: false });
      }
    }
  );

  context.subscriptions.push(disposable2);
}

// this method is called when your extension is deactivated
export function deactivate() {}
