import { DIDResolutionResult } from "@veramo/core";

const PCT_ENCODED = '(?:%[0-9a-fA-F]{2})';
const ID_CHAR = `(?:[a-zA-Z0-9._-]|${PCT_ENCODED})`;
const METHOD = '([a-z0-9]+)';
const METHOD_ID = `((?:${ID_CHAR}*:)*(${ID_CHAR}+))`;
const PARAM_CHAR = '[a-zA-Z0-9_.:%-]';
const PARAM = `;${PARAM_CHAR}+=${PARAM_CHAR}*`;
const PARAMS = `((${PARAM})*)`;
const PATH = `(/[^#?]*)?`;
const QUERY = `([?][^#]*)?`;
const FRAGMENT = `(#.*)?`;
export const DID_MATCHER = new RegExp(`did:${METHOD}:${METHOD_ID}${PARAMS}${PATH}${QUERY}${FRAGMENT}`);
export const DID_MATCHER_GLOBAL = new RegExp(DID_MATCHER, 'g');


export function didDocumentResolutionToMarkdown(resolutionResult: DIDResolutionResult): string {
  let content = '';

  const { didDocument, didDocumentMetadata, didResolutionMetadata } = resolutionResult;

  if (didResolutionMetadata.error) {
    return didResolutionMetadata.error;
  }

  content += didDocument?.id + '\n';

  if (didDocument?.verificationMethod) {
    content += '### Verification methods\n\n';

    const verificationMethod = didDocument.verificationMethod.map(verificationMethod => {
      let str = `- \`${verificationMethod.type}\`\n`;
      
      str += `  - used as: `;
      if (didDocument.authentication?.includes(verificationMethod.id)) {
        str += 'authentication ';
      }

      if (didDocument.keyAgreement?.includes(verificationMethod.id)) {
        str += 'keyAgreement ';
      }

      if (didDocument.assertionMethod?.includes(verificationMethod.id)) {
        str += 'assertionMethod ';
      }

      str += `\n`;
      
      if (verificationMethod.publicKeyHex) {
        str += `  - publicKeyHex: ${verificationMethod.publicKeyHex}\n`;
      }
      
      if (verificationMethod.blockchainAccountId) {
        str += `  - blockchainAccountId: ${verificationMethod.blockchainAccountId}\n`;
      }

      if (verificationMethod.controller) {
        str += `  - controller: ${verificationMethod.controller}\n`;
      }

      if (verificationMethod.publicKeyBase58) {
        str += `  - publicKeyBase58: ${verificationMethod.publicKeyBase58}\n`;
      }

      if (verificationMethod.publicKeyBase64) {
        str += `  - publicKeyBase64: ${verificationMethod.publicKeyBase64}\n`;
      }

      if (verificationMethod.publicKeyMultibase) {
        str += `  - publicKeyMultibase: ${verificationMethod.publicKeyMultibase}\n`;
      }

      if (verificationMethod.publicKeyJwk) {
        str += `  - publicKeyMultibase: ${JSON.stringify(verificationMethod.publicKeyJwk)}\n`;
      }

      return str;
    }
    );
    
    content += verificationMethod.join('\n');
  }

  if (resolutionResult.didDocument?.service) {
    content += '### Services\n\n';
    content += `${resolutionResult.didDocument.service.map(service => `- ${service.type}\n  - ${service.serviceEndpoint}\n`).join('\n')}`;
  }

  content += `\n\n### DID Document\n\`\`\`json\n${JSON.stringify(didDocument, null, 2)}\n\`\`\``;
  content += `\n\n### DID Document Metadata\n\`\`\`json\n${JSON.stringify(didDocumentMetadata, null, 2)}\n\`\`\``;

  return content;
}