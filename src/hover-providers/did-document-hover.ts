import { HoverProvider, Hover } from "vscode";
import { agent } from "../setup";
import { didDocumentResolutionToMarkdown, DID_MATCHER } from "../utils";

export const didDocumentHoverProvider: HoverProvider = {
  async provideHover(document, position, token) {
    const range = document.getWordRangeAtPosition(position, DID_MATCHER);
    if (!range) {return null;}

    const didUrl = document.getText(range);
    let contents = '';

    try {
      const resolutionResult = await agent.resolveDid({ didUrl });
      contents = didDocumentResolutionToMarkdown(resolutionResult);
    } catch (e: any) {
      contents = 'Error: ' + e.message;
    }
    
    return new Hover(contents, range);
  }
};
