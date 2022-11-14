import * as React from "react";
import { VerifiableCredential } from "@veramo/core";
import { Kudos } from './Templates/Kudos';

export const CredentialView = ({ credential } : { credential: VerifiableCredential }) => {
  if (credential.type?.includes('Kudos')) {
    return <Kudos credential={credential} />;
  }

  return <div className="credential">
    <div>Type: {(credential.type as string[]).join(';')}</div>
    <div>Created at: {credential.issuanceDate}</div>
    <div className="credential__issuer">Issuer: {(credential.issuer as any).id}</div>
    <pre>{JSON.stringify(credential.credentialSubject, null, 2)}</pre>
  </div>;
};
