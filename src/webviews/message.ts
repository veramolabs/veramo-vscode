import * as vscode from "vscode";
import { IMessage } from "@veramo/core";
import { credentialToHTML, presentationToHTML } from "./components/renderer";
import yaml from 'yaml';

export function getWebviewContentForMessage(message: IMessage, webview: vscode.Webview, extensionUri: vscode.Uri) {
  const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'main.css'));

  const c = message.credentials ? `<h2>W3C Credentials</h2>
  ${message.credentials.map(vc => credentialToHTML(vc))}
  ` : '';

  const p = message.presentations ? `<h2>W3C Presentations</h2>
  ${message.presentations.map(vp => presentationToHTML(vp))}
  `: '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src https:; style-src ${webview.cspSource}; connect-src https:">
  <title>Veramo</title>
  <link href="${styleMainUri}" rel="stylesheet">
</head>
<body>
  ${c}

  ${p} 

  <h2>Message</h2>

  <pre>${yaml.stringify(message)}</pre>

</body>
</html>`;
}
