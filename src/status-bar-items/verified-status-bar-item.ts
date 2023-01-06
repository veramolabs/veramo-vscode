import * as vscode from "vscode";
import { getVeramo } from "../veramo";

const verifiedStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
verifiedStatusBarItem.command = 'veramo.verify-credential';
export { verifiedStatusBarItem };

export async function updateVerifiedStatusBarItem() {
  verifiedStatusBarItem.hide();

  const text = vscode.window.activeTextEditor?.document.getText();
  if (text) {
    try{
      const veramo = getVeramo();
      const result = await veramo.verifyCredential({credential: JSON.parse(text)});
      if (result.verified) {
        verifiedStatusBarItem.text = `$(check) Signed by ${result.issuer} (${veramo.context.name})`;
        verifiedStatusBarItem.show();
      }
      
    } catch (e) {
      
    }
  }
}