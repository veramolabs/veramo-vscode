import * as vscode from "vscode";
import { getVeramo } from "../veramo";
import { getWebviewContentForMessage } from "../webviews/message";

export const verifyCommand = async (args: any) => {
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
      let selectedText: string;
      if(args?.str) {
        selectedText = args.str;
        
      } else {

        let selections: readonly vscode.Selection[] = editor.selections;
        if (selections.length > 1) {
          vscode.window.showErrorMessage('[Veramo] Sorry, multiple text is not supported!');
          return;
        }
        let selection: vscode.Selection = selections[0];
        selectedText = editor.document.getText(
          new vscode.Range(selection.start, selection.end
          ));
        if (selectedText.length < 1) {
          vscode.window.showErrorMessage('Please select text!');
          return;
        }
      }

      try {
        const message = await getVeramo().handleMessage({ raw: selectedText });

        const panel = vscode.window.createWebviewPanel(
          'previewVerifiedData',
          'Verified data',
          vscode.ViewColumn.Two,
          { enableScripts: true }
        );
        panel.webview.html = getWebviewContentForMessage(message);
      } catch (e: any) {
        vscode.window.showErrorMessage(e.message);
      }
    }

    return true;
  });


};