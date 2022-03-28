import { DIDResolutionResult } from "@veramo/core";
const pretty = require('json-pretty-html').default;

export function getWebviewContentForDIDResolution(resulutionResult: DIDResolutionResult) {

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';">
  <title>Veramo</title>
  <style>
  .json-pretty {
      font-family: Menlo, Monaco, "Courier New", monospace;
      font-weight: normal;
  }

  .json-string {
      color: #6caedd;
  }

  .json-key {
      color: #ec5f67;
  }

  .json-boolean {
      color: #99c794;
  }

  .json-number {
      color: #99c794;
  }

  </style>
</head>
<body>


  <h2>DID Document</h2>
  ${pretty(resulutionResult.didDocument)}

  <h2>Metadata</h2>
  ${pretty(resulutionResult.didDocumentMetadata)}
  
  <h2>Resolution metadata</h2>
  ${pretty(resulutionResult.didResolutionMetadata)}


</body>
</html>`;
}
