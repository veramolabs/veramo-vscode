import * as vscode from "vscode";
import { DIDResolutionResult } from "@veramo/core";
import yaml from 'yaml';

export function getWebviewContentForDIDResolution(resolutionResult: DIDResolutionResult, webview: vscode.Webview, extensionUri: vscode.Uri) {
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

    <pre>${yaml.stringify(resolutionResult)}</pre>

  </body>
  </html>`;
}
