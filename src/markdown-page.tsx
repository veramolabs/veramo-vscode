import * as React from "react";
import * as ReactDOMServer from 'react-dom/server';
import { decode } from 'html-entities';
import { CredentialVerificationView } from "./webviews/CredentialVerificationView";
import { veramo } from "./veramo/local-instance";

function init() {
  // @ts-ignore
  for (const container of document.getElementsByClassName('veramo')) {

    const lang = container.dataset.lang;
    const decoded = decode(container.dataset.source);
    const parsed = JSON.parse(decoded);
    let credential = null;

    if (lang === 'json+vc') {
      credential = JSON.parse(parsed);
    } else if (lang === 'jwt+vc') {
      credential = {
        proof: {
          type: "JwtProof2020",
          jwt: parsed.replace(/\s/g, '')
        }
      };
    }

    veramo.verifyCredential({ credential })
    .then(verifyResult => {
        container.outerHTML = ReactDOMServer.renderToStaticMarkup(
          <CredentialVerificationView verifyResult={verifyResult} />
        );
    })
    .catch((e: any) => {
      //@ts-ignore
      const out = document.createElement('div');
      out.innerHTML = `Unable to verify. Please allow all content and script execution`;
      out.style.color = 'red';
      container.appendChild(out);

      container.append();
    });

  }

}

//@ts-ignore
window.addEventListener('vscode.markdown.updateContent', init);

init();