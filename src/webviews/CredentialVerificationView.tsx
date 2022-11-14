import * as React from "react";
import { IVerifyResult, VerifiableCredential } from "@veramo/core";
import { CredentialView } from "./CredentialView";
import { formatRelative } from 'date-fns';

export const CredentialVerificationView = ({ verifyResult } : { verifyResult: IVerifyResult }) => {
  const credential = verifyResult.verifiableCredential as VerifiableCredential;

  return <div>
    {verifyResult.error && <p>Error: {verifyResult.error.message}</p>}
    {!verifyResult.error 
      && verifyResult.verified 
      && <CredentialView credential={credential} />}
    
    {verifyResult.verified && <div className="veramo__verification_result_footer" >
      <svg
        className="veramo__verified_icon"
        xmlns="http://www.w3.org/2000/svg" 
        width="12" 
        height="12" 
        viewBox="0 0 1200 1200">
        <path d="M600,1200a604.428,604.428,0,0,1-120.921-12.19,596.709,596.709,0,0,1-214.545-90.281A601.752,601.752,0,0,1,47.151,833.547,596.971,596.971,0,0,1,12.19,720.921a605.85,605.85,0,0,1,0-241.842A596.709,596.709,0,0,1,102.47,264.534,601.751,601.751,0,0,1,366.453,47.151,596.971,596.971,0,0,1,479.079,12.19a605.85,605.85,0,0,1,241.842,0A596.709,596.709,0,0,1,935.466,102.47a601.751,601.751,0,0,1,217.383,263.982,596.976,596.976,0,0,1,34.961,112.626,605.849,605.849,0,0,1,0,241.842,596.709,596.709,0,0,1-90.281,214.545,601.751,601.751,0,0,1-263.982,217.383,596.976,596.976,0,0,1-112.626,34.961A604.428,604.428,0,0,1,600,1200ZM233.818,499.972l340.917,545.086L967.272,283.377,574.734,684.509Z" fill="#73c394"/>
      </svg>
      {verifyResult.issuer}
      <span className="veramo__verification_result_footer_spacer">・</span>
      {formatRelative(
        new Date(credential.issuanceDate), 
        new Date()
      )}
      </div>}
  </div>;
};


