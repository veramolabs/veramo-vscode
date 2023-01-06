import * as vscode from 'vscode';
import { agent } from '../setup';

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
			this.codeLenses.push(new vscode.CodeLens(range, {
				title: 'Verifiable Credential',
				command: 'veramo.verify-credential',
				arguments: [{str: matches[1]}]
			}));
		}

		while ((matches = this.regexJwtVc.exec(text)) !== null) {
			const line = document.lineAt(document.positionAt(matches.index).line);

			const start = new vscode.Position(line.lineNumber, 0);
			const end = new vscode.Position(line.lineNumber, 1);
			const range = new vscode.Range(start, end);
			try{
				const message = await agent.handleMessage({raw: matches[1]});
				let title = `${message.type} ${message.from} ${message.createdAt}`;

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

