import * as vscode from "vscode";
import {
  config,
  IRemoteInstance
} from './config';

export class VeramoExplorer implements vscode.TreeDataProvider < VeramoInstance > {

  getChildren(element: VeramoInstance): VeramoInstance[] {
    if (!element) {
      const children: VeramoInstance[] = config.map(
        i => new VeramoInstance(i.name, vscode.TreeItemCollapsibleState.Collapsed, undefined, i)
      );
      return children;
    }

    if(element.instance?.remote) {
      return [
        new VeramoInstance(element.instance?.url || '', vscode.TreeItemCollapsibleState.None),
        new VeramoInstance(element.instance?.openApiUrl || '', vscode.TreeItemCollapsibleState.None),
        new VeramoInstance(element.instance?.apiKey || '', vscode.TreeItemCollapsibleState.None),
      ];
    }
    return [];
  }

  getTreeItem(element: VeramoInstance): vscode.TreeItem {
    return element;
  }

}

export class VeramoInstance extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command,
		public readonly instance?: IRemoteInstance,
	) {
		super(label, collapsibleState);

		this.tooltip = `${this.label}-${this.instance?.remote}`;
		this.description = this.instance?.openApiUrl || '';
	}

	contextValue = 'veramoInstance';
}

