import { VerifiableCredential } from "@veramo/core";
import * as multiformats from 'multiformats';
import * as dag from '@ipld/dag-pb';
import * as crypto from 'crypto';


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

export function getIssuerDID(credential: VerifiableCredential): string {
  if (typeof credential.issuer === 'string') {
    return credential.issuer;
  } else {
    return credential.issuer.id;
  }
}

const sha256 = multiformats.hasher.from({
  name: 'sha2-256',
  code: 0x12,
  encode: (input) => multiformats.bytes.coerce(crypto.createHash('sha256').update(input).digest())
});

export async function generateCIDForString(str: string): Promise<string> {
  const prepared = dag.prepare(str);
  const encoded = dag.encode(prepared);
  const hash = await sha256.digest(encoded);
  const cid = multiformats.CID.create(0, dag.code, hash);
  const result =  cid.toString();
  return result;
}
