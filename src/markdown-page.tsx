import * as React from "react";
import * as ReactDOMServer from 'react-dom/server';
import { decode } from 'html-entities';
import { CredentialVerificationView } from "./webviews/components/CredentialVerificationView";
import { veramo } from "./veramo/local-instance";
import { normalizeCredential } from 'did-jwt-vc';
import { VerifiableCredential } from "@veramo/core";

function init() {
  // @ts-ignore
  for (const container of document.getElementsByClassName('veramo')) {

    const lang = container.dataset.lang;
    const decoded = decode(container.dataset.source);
    const parsed = JSON.parse(decoded);
    let credential: VerifiableCredential | undefined = undefined;

    try {
      if (lang === 'json+vc') {
        credential = JSON.parse(parsed);
      } else if (lang === 'jwt+vc') {
        credential = normalizeCredential(parsed.replace(/\s/g, ''));
      }
  
      if (credential) {
        veramo.verifyCredential({ credential })
        .then(verifyResult => {
          container.outerHTML = ReactDOMServer.renderToStaticMarkup(
            <CredentialVerificationView verifyResult={verifyResult} credential={credential} />
          );
        })
        .catch((e: any) => {
          //@ts-ignore
          const out = document.createElement('div');
          out.innerHTML = `Unable to verify. ${e.message}`;
          out.style.color = 'red';
          container.appendChild(out);
          
          container.append();
        });
      }
        
    } catch (e: any) {
      //@ts-ignore
      const out = document.createElement('div');
      out.innerHTML = `Error: ${e.message}`;
      out.style.color = 'red';
      container.appendChild(out);

      container.append();
    }

  }

}

//@ts-ignore
window.addEventListener('vscode.markdown.updateContent', init);

init();