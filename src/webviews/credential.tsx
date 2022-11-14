import * as React from "react";
import * as ReactDOMServer from 'react-dom/server';
import { VerifiableCredential } from "@veramo/core";
import { formatDistanceToNow } from 'date-fns';
import { CredentialView } from './CredentialView';

export function credentialToHTML(vc: VerifiableCredential, jwt?: string) {
  // return '<h1>hello</h1>';
  return ReactDOMServer.renderToStaticMarkup(
    <CredentialView credential={vc} />
  );
}

