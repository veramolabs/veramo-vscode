import { IMessage } from "@veramo/core";
import { credentialToHTML } from "./credential";
import { presentationToHTML } from "./presentation";
const pretty = require('json-pretty-html').default;

export function getWebviewContentForMessage(message: IMessage) {
  let m = JSON.stringify(message, null, 2); // Message

  const c = message.credentials ? `<h2>W3C Credentials</h2>
  ${message.credentials.map(vc => credentialToHTML(vc, vc.proof.jwt))}
  ${pretty(message.credentials)}
  ` : '';

  const p = message.presentations ? `<h2>W3C Presentations</h2>
  ${message.presentations.map(vp => presentationToHTML(vp, vp.proof.jwt))}
  ${pretty(message.presentations)}`: '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src https:; style-src 'unsafe-inline'; connect-src https:">
  <title>Veramo</title>
  <style>

  /*---------------------------------------------------------------------------------------------
  *  Copyright (c) Microsoft Corporation. All rights reserved.
  *  Licensed under the MIT License. See License.txt in the project root for license information.
  *--------------------------------------------------------------------------------------------*/
 
 html, body {
   font-family: var(--markdown-font-family, -apple-system, BlinkMacSystemFont, "Segoe WPC", "Segoe UI", system-ui, "Ubuntu", "Droid Sans", sans-serif);
   font-size: var(--markdown-font-size, 14px);
   padding: 0 26px;
   line-height: var(--markdown-line-height, 22px);
   word-wrap: break-word;
 }
 
 body {
   padding-top: 1em;
 }
 
 /* Reset margin top for elements */
 h1, h2, h3, h4, h5, h6,
 p, ol, ul, pre {
   margin-top: 0;
 }
 
 h2, h3, h4, h5, h6 {
   font-weight: normal;
   margin-bottom: 0.2em;
 }
 
 #code-csp-warning {
   position: fixed;
   top: 0;
   right: 0;
   color: white;
   margin: 16px;
   text-align: center;
   font-size: 12px;
   font-family: sans-serif;
   background-color:#444444;
   cursor: pointer;
   padding: 6px;
   box-shadow: 1px 1px 1px rgba(0,0,0,.25);
 }
 
 #code-csp-warning:hover {
   text-decoration: none;
   background-color:#007acc;
   box-shadow: 2px 2px 2px rgba(0,0,0,.25);
 }
 
 body.scrollBeyondLastLine {
   margin-bottom: calc(100vh - 22px);
 }
 
 body.showEditorSelection .code-line {
   position: relative;
 }
 
 body.showEditorSelection :not(tr).code-active-line:before,
 body.showEditorSelection :not(tr).code-line:hover:before {
   content: "";
   display: block;
   position: absolute;
   top: 0;
   left: -12px;
   height: 100%;
 }
 
 body.showEditorSelection li.code-active-line:before,
 body.showEditorSelection li.code-line:hover:before {
   left: -30px;
 }
 
 .vscode-light.showEditorSelection .code-active-line:before {
   border-left: 3px solid rgba(0, 0, 0, 0.15);
 }
 
 .vscode-light.showEditorSelection .code-line:hover:before {
   border-left: 3px solid rgba(0, 0, 0, 0.40);
 }
 
 .vscode-light.showEditorSelection .code-line .code-line:hover:before {
   border-left: none;
 }
 
 .vscode-dark.showEditorSelection .code-active-line:before {
   border-left: 3px solid rgba(255, 255, 255, 0.4);
 }
 
 .vscode-dark.showEditorSelection .code-line:hover:before {
   border-left: 3px solid rgba(255, 255, 255, 0.60);
 }
 
 .vscode-dark.showEditorSelection .code-line .code-line:hover:before {
   border-left: none;
 }
 
 .vscode-high-contrast.showEditorSelection .code-active-line:before {
   border-left: 3px solid rgba(255, 160, 0, 0.7);
 }
 
 .vscode-high-contrast.showEditorSelection .code-line:hover:before {
   border-left: 3px solid rgba(255, 160, 0, 1);
 }
 
 .vscode-high-contrast.showEditorSelection .code-line .code-line:hover:before {
   border-left: none;
 }
 
 ul ul,
 ul ol,
 ol ul,
 ol ol {
   margin-bottom: 0;
 }
 
 img {
   max-width: 100%;
   max-height: 100%;
 }
 
 a {
   text-decoration: none;
 }
 
 a:hover {
   text-decoration: underline;
 }
 
 a:focus,
 input:focus,
 select:focus,
 textarea:focus {
   outline: 1px solid -webkit-focus-ring-color;
   outline-offset: -1px;
 }
 
 p {
   margin-bottom: 0.7em;
 }
 
 ul,
 ol {
   margin-bottom: 0.7em;
 }
 
 hr {
   border: 0;
   height: 2px;
   border-bottom: 2px solid;
 }
 
 h1 {
   padding-bottom: 0.3em;
   line-height: 1.2;
   border-bottom-width: 1px;
   border-bottom-style: solid;
   font-weight: normal;
 }
 
 table {
   border-collapse: collapse;
   margin-bottom: 0.7em;
 }
 
 th {
   text-align: left;
   border-bottom: 1px solid;
 }
 
 th,
 td {
   padding: 5px 10px;
 }
 
 table > tbody > tr + tr > td {
   border-top: 1px solid;
 }
 
 blockquote {
   margin: 0 7px 0 5px;
   padding: 0 16px 0 10px;
   border-left-width: 5px;
   border-left-style: solid;
 }
 
 code {
   font-family: var(--vscode-editor-font-family, "SF Mono", Monaco, Menlo, Consolas, "Ubuntu Mono", "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace);
   font-size: 1em;
   line-height: 1.357em;
 }
 
 body.wordWrap pre {
   white-space: pre-wrap;
 }
 
 pre:not(.hljs),
 pre.hljs code > div {
   padding: 16px;
   border-radius: 3px;
   overflow: auto;
 }
 
 pre code {
   color: var(--vscode-editor-foreground);
   tab-size: 4;
 }
 
 /** Theming */
 
 .vscode-light pre {
   background-color: rgba(220, 220, 220, 0.4);
 }
 
 .vscode-dark pre {
   background-color: rgba(10, 10, 10, 0.4);
 }
 
 .vscode-high-contrast pre {
   background-color: var(--vscode-textCodeBlock-background);
 }
 
 .vscode-high-contrast h1 {
   border-color: rgb(0, 0, 0);
 }
 
 .vscode-light th {
   border-color: rgba(0, 0, 0, 0.69);
 }
 
 .vscode-dark th {
   border-color: rgba(255, 255, 255, 0.69);
 }
 
 .vscode-light h1,
 .vscode-light hr,
 .vscode-light td {
   border-color: rgba(0, 0, 0, 0.18);
 }
 
 .vscode-dark h1,
 .vscode-dark hr,
 .vscode-dark td {
   border-color: rgba(255, 255, 255, 0.18);
 }
 


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


  .veramo {
    position: relative;
    border: 1px solid rgba(128, 128, 128, 0.5);
    border-radius: 15px;
    padding: 15px;
  }
  
  .verification {
    /* display: inline-block; */
    position: absolute;
    top: 15px;
    right: 15px;
  }
  
  .veramo-footer {
    opacity: 0.6;
    font-size: small;
  }
  
  .veramo-summary {
    opacity: 0.7;
  }


.credential {
  border: 1px solid var(--background-modifier-border);
  padding: 10px;
}

.credential__issuer {
  color: var(--text-muted);
}

.veramo__verification_result_footer {
  /* border-top: 1px solid var(--background-modifier-border); */
  /* margin-top: 10px; */
  padding: 5px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: var(--text-muted);
  font-size: small;
  cursor: pointer;
}

.veramo__verification_result_footer_spacer {
}

.credential__kudos {
  border-radius: 5px;
  border-left: 4px solid #73C394;
  padding: 15px;
  background-color: rgba(0,0,0,0.1);
}

.credential__kudos_content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.credential__kudos_author {
  font-weight: 500;
  font-size: small;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
}

.credential__kudos_author_avatar {
  height: 24px;
  width: 24px;
  border-radius: 12px;
  margin-right: 10px;
}

.credential__kudos_title {
  font-weight: 700;
  font-size: medium;
  margin-bottom: 10px;
}

.credential__kudos_kudos {
  font-weight: normal;
  font-size: medium;
  margin-bottom: 10px;
}

.credential__kudos_footer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: normal;
  font-size: small;
  color: var(--text-muted);

}

.credential__kudos_guild_avatar {
  height: 16px;
  width: 16px;
  border-radius: 8px;
  margin-right: 5px;
}

.credential__kudos_footer_spacer {
  margin-right: 2px;
  margin-left: 2px;
}

.credential__kudos_avatar {
  height: 100px;
  width: 100px;
  min-height: 100px;
  min-width: 100px;
  border-radius: 5px;
  margin-left: 15px;
}

.veramo__pointer {
  cursor: pointer;
}

.credential__kudos_emoji {
  margin-right: 5px;
}

.veramo__verified_icon {
  margin-right: 5px;
}

.veramo__pre {
  font-size: small;
  white-space: pre-wrap;       /* Since CSS 2.1 */
  white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
  white-space: -pre-wrap;      /* Opera 4-6 */
  white-space: -o-pre-wrap;    /* Opera 7 */
  word-wrap: break-word;       /* Internet Explorer 5.5+ */
}

  </style>
</head>
<body>
  ${c}

  ${p} 
  <hr style="height:1px;border-width:0;color:gray;background-color:gray">

  <h1>Type ${message.type}</h1>

  <h2>Metadata</h2>
  ${pretty(message.metaData)}

  <h2>Data</h2>
  ${pretty(message.data)}

  

</body>
</html>`;
}
