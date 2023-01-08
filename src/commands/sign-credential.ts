import * as vscode from "vscode";
import { getVeramo } from "../veramo";
import { getWebviewContentForMessage } from "../webviews/message";

export const signCredentialCommand = async (args: any) => {
  vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: "Signing credential...",
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
          selectedText = editor.document.getText()
        }
      }

      try {
        const unsignedCredential = JSON.parse(selectedText);
        delete(unsignedCredential['proof']);

        const identifiers = await getVeramo().didManagerFind();

        const selectedDid = await vscode.window.showQuickPick(  
          identifiers.map(i => i.did),
          {
            title: 'Select issuer DID'
          }
        );

        unsignedCredential.issuer.id = selectedDid;

        const proofFormat: any = await vscode.window.showQuickPick(  
          ['EthereumEip712Signature2021', 'jwt', 'lds'],
          {
            title: 'Select issuer DID'
          }
        );

        if (!proofFormat) {
          return;
        }
        const credential = await getVeramo().createVerifiableCredential({
          credential: unsignedCredential,
          proofFormat
        });

        editor.edit((builder) => {
          builder.replace(
            new vscode.Range(
              new vscode.Position(0,0),
              new vscode.Position(editor.document.lineCount,0),
            ),
            JSON.stringify(credential, null, 2)
          );
        });

      } catch (e: any) {
        vscode.window.showErrorMessage(e.message);
      }
    }

    return true;
  });

};
