import "cross-fetch/polyfill";
import * as vscode from "vscode";
import { agent } from "./setup";
import { getWebviewContentForMessage } from "./webviews/message";
import { getWebviewContentForDIDResolution } from "./webviews/diddocument";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  context.subscriptions.push(vscode.commands.registerCommand('veramo.verify', async () => {
    vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: "Verifying data...",
			cancellable: true
		}, async (progress, token) => {
			token.onCancellationRequested(() => {
				console.log("User canceled the long running operation");
			});

      const editor = vscode.window.activeTextEditor;
      if (editor) {
        let selections: readonly vscode.Selection[] = editor.selections;
        if (selections.length > 1) {
          vscode.window.showErrorMessage('[Veramo] Sorry, multiple text is not supported!');
          return;
        }
        let selection: vscode.Selection = selections[0];
        let selectedText:string = editor.document.getText(
            new vscode.Range(selection.start, selection.end
          ));
        if (selectedText.length < 1) {
          vscode.window.showErrorMessage('Please select text!');
          return;
        }
  
        try {
          const message = await agent.handleMessage({ raw: selectedText });
  
          const panel = vscode.window.createWebviewPanel(
            'previewVerifiedData',
            'Verified data',
            vscode.ViewColumn.Two,
            {}
          );
          panel.webview.html = getWebviewContentForMessage(message);
        } catch (e: any){
          vscode.window.showErrorMessage(e.message);
        }
      }

      return true;
		});


  }));


  context.subscriptions.push(vscode.commands.registerCommand('veramo.resolve', async () => {
    vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: "Resolving DID...",
			cancellable: true
		}, async (progress, token) => {
			token.onCancellationRequested(() => {
				console.log("User canceled the long running operation");
			});
        
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        let selections: readonly vscode.Selection[] = editor.selections;
        if (selections.length > 1) {
          vscode.window.showErrorMessage('[Veramo] Sorry, multiple text is not supported!');
          return;
        }
        let selection: vscode.Selection = selections[0];
        let selectedText:string = editor.document.getText(
            new vscode.Range(selection.start, selection.end
          ));
        if (selectedText.length < 1) {
          vscode.window.showErrorMessage('Please select text!');
          return;
        }

        try {
          const result = await agent.resolveDid({ didUrl: selectedText });

          const panel = vscode.window.createWebviewPanel(
            'previewDidDocument',
            'DID',
            vscode.ViewColumn.Two,
            {}
          );
          panel.webview.html = getWebviewContentForDIDResolution(result);
        } catch (e: any){
          vscode.window.showErrorMessage(e.message);
        }
      }
      return true;
    });
  }));
}

// this method is called when your extension is deactivated
export function deactivate() {}

