import { VerifiableCredential } from '@veramo/core';
import * as vscode from 'vscode';
import { getVeramo } from '../veramo';
import { formatRelative } from 'date-fns';

/**
 * CodelensProvider
 */
export class CodeBlocksProvider implements vscode.CodeLensProvider {

	private codeLenses: vscode.CodeLens[] = [];
	private regexJsonVc: RegExp;
	private regexJwtVc: RegExp;
	private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
	public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

	constructor() {
		this.regexJsonVc = new RegExp(/^`{3}json\+vc\n([\s\S]*?)\n`{3}$/mg);
		this.regexJwtVc = new RegExp(/^`{3}jwt\+vc\n([\s\S]*?)\n`{3}$/mg);

		vscode.workspace.onDidChangeConfiguration((_) => {
			this._onDidChangeCodeLenses.fire();
		});
	}

	public async provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.CodeLens[]> {

		if (!vscode.workspace.getConfiguration("veramo").get("enableCodeLens", false)) {
			return [];
		}

		this.codeLenses = [];

		const text = document.getText();
		let matches;
		while ((matches = this.regexJsonVc.exec(text)) !== null) {
			const line = document.lineAt(document.positionAt(matches.index).line);

			const start = new vscode.Position(line.lineNumber, 0);
			const end = new vscode.Position(line.lineNumber, 1);
			const range = new vscode.Range(start, end);

			try {
				const credential = JSON.parse(matches[1]) as VerifiableCredential;
				const result = await getVeramo().verifyCredential({ credential, fetchRemoteContexts: true });
				let title = '';
				if (result.verified) {
					const issuer = (credential.issuer as any).id ? (credential.issuer as any).id : credential.issuer;
					const relativeDate = formatRelative(new Date(credential.issuanceDate), new Date());
					title = `Verifiable Credential signed by ${issuer} ∙ ${relativeDate}`;
				} else if (result.error) {
					title = `Error: ${result.error.message}`;
				}
				this.codeLenses.push(new vscode.CodeLens(range, {
					title,
					command: 'veramo.verify-credential',
					arguments: [{str: matches[1]}]
				}));

			} catch (e: any) {
				this.codeLenses.push(new vscode.CodeLens(range, {
					title: `Error: ${e.message}`,
					command: 'veramo.verify-credential',
					arguments: [{str: matches[1]}]
				}));
			}

		}

		while ((matches = this.regexJwtVc.exec(text)) !== null) {
			const line = document.lineAt(document.positionAt(matches.index).line);

			const start = new vscode.Position(line.lineNumber, 0);
			const end = new vscode.Position(line.lineNumber, 1);
			const range = new vscode.Range(start, end);
			try{
				const message = await getVeramo().handleMessage({raw: matches[1]});
				let type = '';
				switch(message.type) {
					case 'w3c.vc':
						type='Verifiable credential';
						break;
					case 'w3c.vp':
						type='Verifiable presentation';
						break;
				}
				const relativeDate = formatRelative(new Date(message.createdAt!), new Date());

				let title = `${type} signed by ${message.from} ∙ ${relativeDate}`;

				this.codeLenses.push(new vscode.CodeLens(range, {
					title,
					command: 'veramo.verify',
					arguments: [{str: matches[1]}]
				}));

			}catch(e){

			}
		}

		return this.codeLenses;

	}

}

