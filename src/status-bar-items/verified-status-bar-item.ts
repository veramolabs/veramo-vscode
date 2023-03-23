import { IVerifyResult } from "@veramo/core";
import * as vscode from "vscode";
import { getVeramo } from "../veramo";
import { generateCIDForString, getIssuerDID } from '../utils';
import { posix } from 'path';
import yaml from 'yaml';
import matter from 'gray-matter';

const verifiedStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
export { verifiedStatusBarItem };

export async function updateVerifiedStatusBarItem() {
  verifiedStatusBarItem.hide();
  verifiedStatusBarItem.command = undefined;
  const editor = vscode.window.activeTextEditor;
  const text = editor?.document.getText();
  const language = editor?.document.languageId;

  if (text && editor) {
    let cid = await generateCIDForString(text);
    const veramo = getVeramo();
    let credential;
    let result: IVerifyResult | undefined = undefined;
    try {
      switch(language) {
        case 'json':
          credential = JSON.parse(text);
          result = await veramo.verifyCredential({credential, fetchRemoteContexts: true});
          if (result?.verified) {
            verifiedStatusBarItem.text = `$(check) Signed by ${getIssuerDID(credential)}`;
            verifiedStatusBarItem.command = 'veramo.verify-credential';
            verifiedStatusBarItem.show();
          } 
          break;
        case 'yaml':
          credential = yaml.parse(text);
          result = await veramo.verifyCredential({credential, fetchRemoteContexts: true});
          if (result?.verified) {
            verifiedStatusBarItem.text = `$(check) Signed by ${getIssuerDID(credential)}`;
            verifiedStatusBarItem.command = 'veramo.verify-credential';
            verifiedStatusBarItem.show();
          } 
          break;
        case 'markdown':
          const parsed = matter(text);
          if (parsed.data && parsed.content) {
            credential = parsed.data as any;
            cid = await generateCIDForString(parsed.content);
              result = await veramo.verifyCredential({credential, fetchRemoteContexts: true});
            if (result?.verified && result?.verifiableCredential?.credentialSubject?.cid === cid) {
              verifiedStatusBarItem.text = `$(check) Signed by ${getIssuerDID(credential)}`;
              verifiedStatusBarItem.command = {
                title: 'Verify credential',
                command: 'veramo.verify-credential',
                arguments: [{str: JSON.stringify(parsed.data)}]
              };
              verifiedStatusBarItem.show();
            } else if (result?.verifiableCredential?.credentialSubject?.cid && result?.verifiableCredential?.credentialSubject?.cid !== cid) {
              verifiedStatusBarItem.text = `$(error) Content does not match signature`;
              verifiedStatusBarItem.command = {
                title: 'Verify credential',
                command: 'veramo.verify-credential',
                arguments: [{str: JSON.stringify(parsed.data)}]
              };
              verifiedStatusBarItem.show();
            } 
          }
          break;
        default:
          if (vscode.workspace.workspaceFolders) {
            const cid = await generateCIDForString(text);
            const contextFolder = vscode.workspace.getConfiguration("veramo").get("contextFolder", "context");
            const folderUri = vscode.workspace.workspaceFolders[0].uri;
            const fileUri = folderUri.with({ path: posix.join(folderUri.path, contextFolder, `${cid}.json`) });
  
            const readData = await vscode.workspace.fs.readFile(fileUri);
            const fileContents = Buffer.from(readData).toString('utf8');
            const path = vscode.workspace.asRelativePath(editor.document.uri);
            const credential = JSON.parse(fileContents);
            result = await veramo.verifyCredential({credential, fetchRemoteContexts: true});
            if (
              result?.verified 
              && (result.verifiableCredential?.type as string[]).includes('SignedFile')
              && result.verifiableCredential?.credentialSubject.id === cid
              && result.verifiableCredential?.credentialSubject.path === path
            ) {
              verifiedStatusBarItem.text = `$(check) Signed by ${getIssuerDID(credential)}`;
              verifiedStatusBarItem.command = {
                title: 'Verify credential',
                command: 'veramo.verify-credential',
                arguments: [{str: fileContents}]
              };
              verifiedStatusBarItem.show();
            } 
          }
  
      }
  
    } catch (e) {
     
    }
  }
}

