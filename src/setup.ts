import { createAgent, IMessageHandler, IResolver, TAgent } from "@veramo/core";

import { DIDResolverPlugin } from "@veramo/did-resolver";
import { Resolver } from "did-resolver";
import { getResolver as ethrDidResolver } from "ethr-did-resolver";
import { getResolver as webDidResolver } from "web-did-resolver";
import { MessageHandler } from "@veramo/message-handler";
import { JwtMessageHandler } from "@veramo/did-jwt";
import { W3cMessageHandler } from "@veramo/credential-w3c";

const INFURA_PROJECT_ID = "3586660d179141e3801c3895de1c2eba";

type InstalledPlugins = IResolver & IMessageHandler;

export const agent: TAgent<InstalledPlugins> = createAgent<InstalledPlugins>({
  plugins: [
    new DIDResolverPlugin({
      resolver: new Resolver({
        ...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }),
        ...webDidResolver(),
      }),
    }),
    new MessageHandler({
      messageHandlers: [new JwtMessageHandler(), new W3cMessageHandler()],
    }),
  ],
});
