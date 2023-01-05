import * as vscode from "vscode";
import { agent } from "../setup";

const verifiedStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
verifiedStatusBarItem.command = 'veramo.verify-credential';
export { verifiedStatusBarItem };

export async function updateVerifiedStatusBarItem() {
  verifiedStatusBarItem.hide();

  const text = vscode.window.activeTextEditor?.document.getText();
  if (text) {
    try{
      const result = await agent.verifyCredential({credential: JSON.parse(text)});
      if (result.verified) {
        verifiedStatusBarItem.text = `$(check) Verified`;
        verifiedStatusBarItem.show();
      }
      
    } catch (e) {
      
    }
  }
}