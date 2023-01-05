import * as vscode from "vscode";
import { DID_MATCHER_GLOBAL } from "../utils";

let timeout: NodeJS.Timer | undefined = undefined;

const didUrlDecorationType = vscode.window.createTextEditorDecorationType({
  textDecoration: 'underline',
  overviewRulerColor: 'green',
  overviewRulerLane: vscode.OverviewRulerLane.Right,
  light: {
    // this color will be used in light color themes
    borderColor: 'darkgreen'
  },
  dark: {
    // this color will be used in dark color themes
    borderColor: 'lightgreen'
  }
});


function updateDecorations() {
  let activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }

  const text = activeEditor.document.getText();
  const didUrls: vscode.DecorationOptions[] = [];
  let match;
  while ((match = DID_MATCHER_GLOBAL.exec(text))) {
    const startPos = activeEditor.document.positionAt(match.index);
    const endPos = activeEditor.document.positionAt(match.index + match[0].length);
    const decoration = { range: new vscode.Range(startPos, endPos)};
    didUrls.push(decoration);
  }
  activeEditor.setDecorations(didUrlDecorationType, didUrls);

}

export function triggerUpdateDecorations(throttle = false) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = undefined;
  }
  if (throttle) {
    timeout = setTimeout(updateDecorations, 500);
  } else {
    updateDecorations();
  }
}
