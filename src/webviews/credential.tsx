import * as React from "react";
import * as ReactDOMServer from 'react-dom/server';
import { VerifiableCredential } from "@veramo/core";

import { VerifiableCredential as VerifiableCredentialView } from '@veramo-community/react-components';

export function credentialToHTML(vc: VerifiableCredential, jwt?: string) {
  // return '<h1>hello</h1>';
  return ReactDOMServer.renderToStaticMarkup(
    <VerifiableCredentialView credential={vc} />
  );
}

