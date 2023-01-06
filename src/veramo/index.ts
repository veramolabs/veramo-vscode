import * as vscode from "vscode";
import { veramo as localInstance } from './local-instance';
import { veramo as remoteInstance } from './remote-instance';

import { IMessageHandler, IResolver, TAgent } from "@veramo/core";
import { ICredentialIssuer, ICredentialVerifier } from "@veramo/credential-w3c";

export type InstalledPlugins = IResolver & IMessageHandler & ICredentialIssuer & ICredentialVerifier;

export const getVeramo = (): TAgent<InstalledPlugins> => {
  const enabled = vscode.workspace.getConfiguration("veramo").get("enableRemoteInstance", false);
  if (enabled) {
    return remoteInstance;
  } else {
    return localInstance;
  }
};
