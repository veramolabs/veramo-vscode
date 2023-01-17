import * as vscode from "vscode";
import { getVeramo } from "../veramo";
// import { CID, hasher } from 'multiformats';
import pkg from 'blakejs'
const { blake2bHex } = pkg
import matter from 'gray-matter';


export const signMarkdownMatterCommand = async (args: any) => {
  vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: "Signing markdown file...",
    cancellable: true
  }, async (progress, token) => {
    token.onCancellationRequested(() => {
      console.log("User canceled the long running operation");
    });

    const editor = vscode.window.activeTextEditor;
    if (editor) {
      let selectedText: string;
      let selectedRange: vscode.Range;
      selectedText = editor.document.getText();
      selectedRange = new vscode.Range(
        new vscode.Position(0,0),
        new vscode.Position(editor.document.lineCount,0)
      );


      try {
        let unsignedCredential;
        let replaceSelectedText = true;
        
        const parsed = matter(selectedText);

        // const bytes = Buffer.from(selectedText, 'base64');
        // const hash = await hasher.from() ().digest(bytes);
        // const cid = CID.create(1, 0x12, hash);

        const cid = blake2bHex(parsed.content);
        unsignedCredential = parsed.data as any;        
        delete(unsignedCredential['proof']);
        delete(unsignedCredential['issuer']);

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
        unsignedCredential.credentialSubject = {
          ...unsignedCredential.credentialSubject,
          cid: cid
        };
          

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

        const replacementText = matter.stringify(parsed.content, credential);

        editor.edit((builder) => {
          builder.replace(
            selectedRange,
            replacementText 
          );
        });
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
