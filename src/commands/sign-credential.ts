import * as vscode from "vscode";
import { getVeramo } from "../veramo";
import { posix } from 'path';
import yaml from 'yaml';
import { generateCIDForString } from "../utils";


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
      let selectedRange: vscode.Range;
      if(args?.str) {
        selectedText = args.str;
      } else {

        let selections: readonly vscode.Selection[] = editor.selections;
        if (selections.length > 1) {
          vscode.window.showErrorMessage('[Veramo] Sorry, multiple text is not supported!');
          return;
        }
        let selection: vscode.Selection = selections[0];
        selectedRange = new vscode.Range(selection.start, selection.end);
        selectedText = editor.document.getText(
          new vscode.Range(selection.start, selection.end)
        );
        if (selectedText.length < 1) {
          selectedText = editor.document.getText();
          selectedRange = new vscode.Range(
            new vscode.Position(0,0),
            new vscode.Position(editor.document.lineCount,0)
          );
        }
      }

      try {
        let unsignedCredential = {} as any;
        let replaceSelectedText = true;
        let format: 'json' | 'yaml' | undefined = undefined;

        const cid = await generateCIDForString(selectedText);

        try {
          try {
            unsignedCredential = JSON.parse(selectedText);
            format = 'json';
          }catch(e){
            try {
              unsignedCredential = yaml.parse(selectedText);
              if (!unsignedCredential.credentialSubject) {
                throw Error('Not YAML');
              }
              format = 'yaml';
            } catch (e) {
              throw (e);
            }
          }
          delete(unsignedCredential['proof']);
          delete(unsignedCredential['issuer']);
        } catch (e) {
          const path = vscode.workspace.asRelativePath(editor.document.uri);
          unsignedCredential = {
            credentialSubject: { 
              id: cid, 
              path
            },
            type: [ "VerifiableCredential", "SignedFile"]
          };
          
          replaceSelectedText = false;
        }

        const identifiers = await getVeramo().didManagerFind();

        const selectedDid = await vscode.window.showQuickPick<vscode.QuickPickItem>(  
          identifiers.map(i => ({
            label: i.did,
            detail: i.alias
          })),
          {
            title: 'Select issuer DID',
            matchOnDetail: true
          }
        );
        if (!selectedDid) {
          return;
        }

        unsignedCredential.issuer = { id: selectedDid.label };

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

        if (replaceSelectedText) {
          const replacementText = format === 'json' 
            ? JSON.stringify(credential, null, 2) + '\n'
            : yaml.stringify(credential);

          editor.edit((builder) => {
            builder.replace(
              selectedRange,
              replacementText 
            );
          });
        } else {
          if (!vscode.workspace.workspaceFolders) {
            return;
          }
          const contextFolder = vscode.workspace.getConfiguration("veramo").get("contextFolder", "context");
          const folderUri = vscode.workspace.workspaceFolders[0].uri;
          const fileUri = folderUri.with({ path: posix.join(folderUri.path, contextFolder, `${cid}.json`) });
          vscode.workspace.fs.writeFile(fileUri, Buffer.from(JSON.stringify(credential), 'utf8'));
          vscode.window.showInformationMessage('File was signed successfully');
        }
        setTimeout(()=>{          
          vscode.commands.executeCommand('veramo.updateStatusBarItem');
        }, 1000);
        
      } catch (e: any) {
        vscode.window.showErrorMessage(e.message);
      }
    }

    return true;
  });

};
