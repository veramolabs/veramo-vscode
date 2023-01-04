import * as vscode from "vscode";
import type MarkdownIt from 'markdown-it';
import { agent } from "./setup";
import { getWebviewContentForMessage } from "./webviews/message";
import { getWebviewContentForDIDResolution } from "./webviews/diddocument";
import { markdownPlugin } from "./markdown";
import { getWebviewContentForCredentialVerificationResult } from "./webviews/credentialVerification";
import { didDocumentHoverProvider } from "./hover-providers";

let verifiedStatusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  
  context.subscriptions.push(vscode.commands.registerCommand('veramo.verifyCredential', async () => {
    vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: "Verifying credential...",
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
          selectedText = editor.document.getText();
        }
  
        try {
          const result = await agent.verifyCredential({ credential: JSON.parse(selectedText) });
  
          const panel = vscode.window.createWebviewPanel(
            'previewVerifiedCredential',
            'Verified credential',
            vscode.ViewColumn.Two,
            {enableScripts: true}
          );
          panel.webview.html = getWebviewContentForCredentialVerificationResult(result);
        } catch (e: any){
          vscode.window.showErrorMessage(e.message);
        }
      }

      return true;
		});


  }));

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
            {enableScripts: true}
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
            {enableScripts: true}
          );
          panel.webview.html = getWebviewContentForDIDResolution(result);
        } catch (e: any){
          vscode.window.showErrorMessage(e.message);
        }
      }
      return true;
    });
  }));

  vscode.languages.registerHoverProvider('markdown', didDocumentHoverProvider);
  vscode.languages.registerHoverProvider('javascript', didDocumentHoverProvider);
  vscode.languages.registerHoverProvider('typescript', didDocumentHoverProvider);


  verifiedStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
  verifiedStatusBarItem.command = 'veramo.verifyCredential';
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

async function updateVerifiedStatusBarItem() {
  verifiedStatusBarItem.hide();

  const text = vscode.window.activeTextEditor?.document.getText();
  if (text) {
    try{
      const result = await agent.verifyCredential({credential: JSON.parse(text)});
      if (result.verified) {
        verifiedStatusBarItem.text = `$(check) Verified`;
        verifiedStatusBarItem.show();
      }
      
    } catch (e) {
      
    }
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
