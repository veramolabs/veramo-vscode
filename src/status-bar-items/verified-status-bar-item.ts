import * as vscode from "vscode";
import { getVeramo } from "../veramo";

const verifiedStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
export { verifiedStatusBarItem };

export async function updateVerifiedStatusBarItem() {
  verifiedStatusBarItem.hide();
  
  const text = vscode.window.activeTextEditor?.document.getText();
  if (text) {
    const veramo = getVeramo();
    try{
      const result = await veramo.verifyCredential({credential: JSON.parse(text)});
      if (result.verified) {
        verifiedStatusBarItem.text = `$(check) Signed by ${result.issuer} (${veramo.context.name})`;
        verifiedStatusBarItem.command = 'veramo.verify-credential';
        verifiedStatusBarItem.show();
      } else {
        verifiedStatusBarItem.text = `$(cross) Not signed (${veramo.context.name})`;
        verifiedStatusBarItem.command = 'veramo.sign-credential';
        verifiedStatusBarItem.show();
      }
      
    } catch (e) {
        verifiedStatusBarItem.text = `$(cross) Not signed (${veramo.context.name})`;
        verifiedStatusBarItem.command = 'veramo.sign-credential';
        verifiedStatusBarItem.show();
    }

  }
}

