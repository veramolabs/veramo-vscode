import * as vscode from "vscode";
import { getVeramo } from "../veramo";
import { getWebviewContentForCredentialVerificationResult } from "../webviews/credentialVerification";
import yaml from 'yaml';

export const verifyCredentialCommand = async (args: any) => {
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
            selectedText = editor.document.getText();
          }
        }

        try {
          let credential;
          try {
            credential = JSON.parse(selectedText);
          }catch(e) {
            try {
              credential = yaml.parse(selectedText);
            } catch (e) {
              throw (e);
            }
          }
          const result = await getVeramo().verifyCredential({ credential });

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