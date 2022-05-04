import { VerifiableCredential } from "@veramo/core";
import { formatDistanceToNow } from 'date-fns';

export function credentialToHTML(vc: VerifiableCredential, jwt?: string) {
  //FIXME there is something weird with VerifiableCredential type in the @next branch
  let issuer = (vc.issuer as any).id as string;
  issuer = `${issuer.slice(0, 16)}...${issuer.slice(-4)}`;
  const type = (vc.type as string[]).join(', ');
  
  if (vc.credentialSubject.id) {
    vc.credentialSubject.id = `${vc.credentialSubject.id.slice(
      0,
      16
    )}...${vc.credentialSubject.id.slice(-4)}`;
  }
  
  return `<div class="veramo" ${jwt ? `data-jwt="${jwt}"` : ''}>
            <div class="verification">${vc.proof.type ? checkmark : spinner}</div>
            <div class="description">${vc.credentialSubject.description || ''}</div>

            <details>
              <summary class="veramo-summary">${type}</summary>
              <div class="veramo-details">
              <table>
                ${objectToTableRows(vc.credentialSubject)}
              </table>
              </div>
            </details>
            
            <div class="veramo-footer">
              ${formatDistanceToNow(new Date(vc.issuanceDate), {
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