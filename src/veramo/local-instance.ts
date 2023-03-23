import "cross-fetch/polyfill";
import { createAgent, TAgent } from "@veramo/core";
import { DIDResolverPlugin } from "@veramo/did-resolver";
import { Resolver } from "did-resolver";
import { getResolver as ethrDidResolver } from "ethr-did-resolver";
import { getResolver as webDidResolver } from "web-did-resolver";
import { getDidKeyResolver } from '@veramo/did-provider-key';
import { getDidPkhResolver } from '@veramo/did-provider-pkh';
import { getResolver as get3IDResolver } from '@ceramicnetwork/3id-did-resolver';

import { MessageHandler } from "@veramo/message-handler";
import { JwtMessageHandler } from "@veramo/did-jwt";
import { W3cMessageHandler, CredentialPlugin } from "@veramo/credential-w3c";
import { CredentialIssuerEIP712 } from "@veramo/credential-eip712";
import { CredentialIssuerLD, VeramoEd25519Signature2018, VeramoEcdsaSecp256k1RecoverySignature2020, LdDefaultContexts } from "@veramo/credential-ld";
import { contexts } from '@transmute/credentials-context';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { InstalledPlugins } from './index.js';

const ceramic = new CeramicClient('https://gateway.ceramic.network');
const INFURA_PROJECT_ID = "3586660d179141e3801c3895de1c2eba";

export const veramo: TAgent<InstalledPlugins> = createAgent<InstalledPlugins>({
  context: {
    name: 'local'
  },
  plugins: [
    new DIDResolverPlugin({
      resolver: new Resolver({
        ...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }),
        ...webDidResolver(),
        ...getDidKeyResolver(),
        ...getDidPkhResolver(),
        ...get3IDResolver(ceramic)
      }),
    }),
    new MessageHandler({
      messageHandlers: [new JwtMessageHandler(), new W3cMessageHandler()],
    }),
    new CredentialPlugin(),
    new CredentialIssuerEIP712(),
    new CredentialIssuerLD({
      suites: [new VeramoEd25519Signature2018(), new VeramoEcdsaSecp256k1RecoverySignature2020()],
      contextMaps: [contexts as any, LdDefaultContexts]
    })
  ],
});
