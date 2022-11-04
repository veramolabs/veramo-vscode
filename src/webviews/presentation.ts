import { VerifiableCredential, VerifiablePresentation } from "@veramo/core";
import { formatDistanceToNow } from 'date-fns';
import { credentialToHTML } from "./credential";

export function presentationToHTML(vp: VerifiablePresentation, jwt?: string) {
  //FIXME there is something weird with VerifiablePresentation type in the @next branch
  let issuer = (vp.holder as any) as string;
  // issuer = `${issuer.slice(0, 16)}...${issuer.slice(-4)}`;
  const type = (vp.type as string[]).join(', ');
  
  return `<div class="veramo" ${jwt ? `data-jwt="${jwt}"` : ''}>
            <div class="verification">${vp.proof.type ? checkmark : spinner}</div>
            <div class="veramo-details">
              <table>
                <tr><td colspan="2"> ${type}</td></tr>
                <tr><td colspan="2"> ${vp.verifiableCredential?.map(vc => credentialToHTML(vc as any as VerifiableCredential))}</td></tr>
              </table>
            </div>
            
            <div class="veramo-footer">
              ${vp.issuanceDate && formatDistanceToNow(new Date(vp.issuanceDate), {
                addSuffix: true,
              })} 
              by <b>${issuer}</b>
            </div>
          </div>`;
}

function objectToTableRows(obj: any): string {
  let result = "";
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const element = obj[key];
      result += `<tr><td>${key}</td><td>${
        typeof element === "string"
          ? element
          : "<table>" + objectToTableRows(element) + "</table>"
      }</td></tr>`;
    }
  }
  return result;
}

const checkmark = `<svg xmlns="http://www.w3.org/2000/svg" title="Verified" width="16" height="16" viewBox="0 0 1200 1200">
<path d="M600,1200a604.428,604.428,0,0,1-120.921-12.19,596.709,596.709,0,0,1-214.545-90.281A601.752,601.752,0,0,1,47.151,833.547,596.971,596.971,0,0,1,12.19,720.921a605.85,605.85,0,0,1,0-241.842A596.709,596.709,0,0,1,102.47,264.534,601.751,601.751,0,0,1,366.453,47.151,596.971,596.971,0,0,1,479.079,12.19a605.85,605.85,0,0,1,241.842,0A596.709,596.709,0,0,1,935.466,102.47a601.751,601.751,0,0,1,217.383,263.982,596.976,596.976,0,0,1,34.961,112.626,605.849,605.849,0,0,1,0,241.842,596.709,596.709,0,0,1-90.281,214.545,601.751,601.751,0,0,1-263.982,217.383,596.976,596.976,0,0,1-112.626,34.961A604.428,604.428,0,0,1,600,1200ZM233.818,499.972l340.917,545.086L967.272,283.377,574.734,684.509Z" fill="#73c394"/>
</svg>`;

const spinner = '<div class="spinner"></div>';