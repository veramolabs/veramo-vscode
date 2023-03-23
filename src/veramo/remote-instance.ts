import "cross-fetch/polyfill";
import * as vscode from "vscode";
import { createAgent, TAgent } from "@veramo/core";
import { AgentRestClient } from '@veramo/remote-client';
import { InstalledPlugins } from './index.js';

export const veramo: TAgent<InstalledPlugins> = createAgent<InstalledPlugins>({
  context: {
    name: 'remote'
  },
  plugins: [
    new AgentRestClient({
      url: vscode.workspace.getConfiguration("veramo").get("veramo.remoteAgentUrl", "http://localhost:3332/agent"),
      headers: {
        'Authorization': 'Bearer ' + vscode.workspace.getConfiguration("veramo").get("veramo.remoteAgentApiKey", "test123")
      },
      enabledMethods: [
        'keyManagerGetKeyManagementSystems',
        'keyManagerCreate',
        'keyManagerGet',
        'keyManagerDelete',
        'keyManagerImport',
        'keyManagerEncryptJWE',
        'keyManagerDecryptJWE',
        'keyManagerSign',
        'keyManagerSharedSecret',
        'keyManagerSignJWT',
        'keyManagerSignEthTX',
        'didManagerGetProviders',
        'didManagerFind',
        'didManagerGet',
        'didManagerCreate',
        'didManagerGetOrCreate',
        'didManagerImport',
        'didManagerDelete',
        'didManagerAddKey',
        'didManagerRemoveKey',
        'didManagerAddService',
        'didManagerRemoveService',
        'resolveDid',
        'getDIDComponentById',
        'discoverDid',
        'dataStoreGetMessage',
        'dataStoreSaveMessage',
        'dataStoreGetVerifiableCredential',
        'dataStoreSaveVerifiableCredential',
        'dataStoreGetVerifiablePresentation',
        'dataStoreSaveVerifiablePresentation',
        'dataStoreORMGetIdentifiers',
        'dataStoreORMGetIdentifiersCount',
        'dataStoreORMGetMessages',
        'dataStoreORMGetMessagesCount',
        'dataStoreORMGetVerifiableCredentialsByClaims',
        'dataStoreORMGetVerifiableCredentialsByClaimsCount',
        'dataStoreORMGetVerifiableCredentials',
        'dataStoreORMGetVerifiableCredentialsCount',
        'dataStoreORMGetVerifiablePresentations',
        'dataStoreORMGetVerifiablePresentationsCount',
        'handleMessage',
        'packDIDCommMessage',
        'unpackDIDCommMessage',
        'sendDIDCommMessage',
        'sendMessageDIDCommAlpha1',
        'createVerifiableCredential',
        'createVerifiablePresentation',
        'verifyCredential',
        'verifyPresentation',
        'createSelectiveDisclosureRequest',
        'getVerifiableCredentialsForSdr',
        'validatePresentationAgainstSdr',
      ]
    }),
  ],
});
