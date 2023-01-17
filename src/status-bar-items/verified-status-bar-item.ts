import { IVerifyResult } from "@veramo/core";
import * as vscode from "vscode";
import { getVeramo } from "../veramo";
import { posix } from 'path';
import pkg from 'blakejs'
const { blake2bHex } = pkg
import yaml from 'yaml';

const verifiedStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
export { verifiedStatusBarItem };

export async function updateVerifiedStatusBarItem() {
  verifiedStatusBarItem.hide();
  verifiedStatusBarItem.command = undefined;
  
  const text = vscode.window.activeTextEditor?.document.getText();
  if (text && vscode.window.activeTextEditor) {
    const veramo = getVeramo();
    try{

      let result: IVerifyResult | undefined = undefined;
      let finished = false;
      try {
        let credential;
        try {
          credential = JSON.parse(text);
        }catch(e) {
          try {
            credential = yaml.parse(text);
          } catch (e) {
            throw (e);
          }
        }

        result = await veramo.verifyCredential({credential});
      } catch (e) {
        if (vscode.workspace.workspaceFolders) {
          const cid = blake2bHex(text);
          const contextFolder = vscode.workspace.getConfiguration("veramo").get("contextFolder", "context");
          const folderUri = vscode.workspace.workspaceFolders[0].uri;
          const fileUri = folderUri.with({ path: posix.join(folderUri.path, contextFolder, `${cid}.json`) });

          const readData = await vscode.workspace.fs.readFile(fileUri);
          const fileContents = Buffer.from(readData).toString('utf8');
          const path = vscode.workspace.asRelativePath(vscode.window.activeTextEditor.document.uri);

          result = await veramo.verifyCredential({credential: JSON.parse(fileContents)});
          if (
            result?.verified 
            && (result.verifiableCredential?.type as string[]).includes('SignedFile')
            && result.verifiableCredential?.credentialSubject.id === cid
            && result.verifiableCredential?.credentialSubject.path === path
          ) {
            verifiedStatusBarItem.text = `$(check) Signed by ${result.issuer} (${veramo.context.name})`;
            verifiedStatusBarItem.command = {
              title: 'Verify credential',
              command: 'veramo.verify-credential',
              arguments: [{str: fileContents}]
            };
            verifiedStatusBarItem.show();
            finished = true;
          }
    
        }

      }

      if (!finished) {
        if (result?.verified) {
          verifiedStatusBarItem.text = `$(check) Signed by ${result.issuer} (${veramo.context.name})`;
          verifiedStatusBarItem.command = 'veramo.verify-credential';
          verifiedStatusBarItem.show();
        } else {
          verifiedStatusBarItem.text = `$(cross) Not signed (${veramo.context.name})`;
          verifiedStatusBarItem.command = 'veramo.sign-credential';
          verifiedStatusBarItem.show();
        }
      }
      
    } catch (e) {
        verifiedStatusBarItem.text = `$(cross) Not signed (${veramo.context.name})`;
        verifiedStatusBarItem.command = 'veramo.sign-credential';
        verifiedStatusBarItem.show();
    }

  }
}

