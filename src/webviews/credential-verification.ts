import * as vscode from "vscode";
import { IVerifyResult, VerifiableCredential } from "@veramo/core";
import { credentialToHTML } from "./components/renderer";
import yaml from 'yaml';

import './style.css';

export function getWebviewContentForCredentialVerificationResult(result: IVerifyResult, credential: VerifiableCredential, webview: vscode.Webview, extensionUri: vscode.Uri) {
  const c = credentialToHTML(credential);
  const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'main.css'));

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
  <br/>
  <h2>Verification result</h2>
  <pre>${yaml.stringify(result)}</pre>
</body>
</html>`;
}
