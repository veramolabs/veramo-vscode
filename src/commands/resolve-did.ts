import * as vscode from "vscode";
import { getVeramo } from "../veramo";
import { getWebviewContentForDIDResolution } from "../webviews/diddocument";

export const resolveDidCommand = async () => {
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
      let selectedText: string = editor.document.getText(
        new vscode.Range(selection.start, selection.end
        ));
      if (selectedText.length < 1) {
        vscode.window.showErrorMessage('Please select text!');
        return;
      }

      try {
        const result = await getVeramo().resolveDid({ didUrl: selectedText });

        const panel = vscode.window.createWebviewPanel(
          'previewDidDocument',
          'DID',
          vscode.ViewColumn.Two,
          { enableScripts: true }
        );
        panel.webview.html = getWebviewContentForDIDResolution(result);
      } catch (e: any) {
        vscode.window.showErrorMessage(e.message);
      }
    }
    return true;
  });
};