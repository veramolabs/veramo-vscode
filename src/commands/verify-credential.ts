import * as vscode from "vscode";
import { agent } from "../setup";
import { getWebviewContentForCredentialVerificationResult } from "../webviews/credentialVerification";

export const verifyCredentialCommand = async () => {
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
        let selectedText: string = editor.document.getText(
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
            { enableScripts: true }
          );
          panel.webview.html = getWebviewContentForCredentialVerificationResult(result);
        } catch (e: any) {
          vscode.window.showErrorMessage(e.message);
        }
      }

      return true;
    });


  };