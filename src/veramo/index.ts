import * as vscode from "vscode";
import { veramo as localInstance } from './local-instance';
import { veramo as remoteInstance } from './remote-instance';

import { IDIDManager, IMessageHandler, IResolver, TAgent } from "@veramo/core";
import { ICredentialIssuer, ICredentialVerifier } from "@veramo/credential-w3c";

export type InstalledPlugins = IResolver & IMessageHandler & ICredentialIssuer & ICredentialVerifier & IDIDManager;

export const getVeramo = (): TAgent<InstalledPlugins> => {
  const enabled = vscode.workspace.getConfiguration("veramo").get("useRemoteInstance", false);
  if (enabled) {
    return remoteInstance;
  } else {
    return localInstance;
  }
};
