import { IMessage } from "@veramo/core";
const pretty = require('json-pretty-html').default;

export function getWebviewContentForMessage(message: IMessage) {
  let m = JSON.stringify(message, null, 2); // Message

  const c = message.credentials ? `<h2>W3C Credentials</h2>
  ${pretty(message.credentials)}
  ` : '';

  const p = message.presentations ? `<h2>W3C Presentations</h2>
  ${pretty(message.presentations)}`: '';

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

  <h1>Type ${message.type}</h1>

  <h2>Metadata</h2>
  ${pretty(message.metaData)}

  <h2>Data</h2>
  ${pretty(message.data)}

  <hr style="height:1px;border-width:0;color:gray;background-color:gray">
  
  ${c}

  ${p} 

</body>
</html>`;
}
