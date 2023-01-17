import type MarkdownIt from 'markdown-it';
import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';
import { encode } from 'html-entities';

export function markdownPlugin(md: MarkdownIt){

  var defaultRender = md.renderer.rules.fence;

  function fence(tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: Renderer): string {

    const token = tokens[idx];
    if (token.info === 'jwt+vc' || token.info === 'json+vc') {
      const source = encode(JSON.stringify(token.content));
      return `<div class="veramo" data-lang="${token.info}" data-source="${source}"><div class="spinner"></div></div>`;
    }
    if (defaultRender) {
      return defaultRender(tokens, idx, options, env, self);
    }
    return 'This should not happen?';
  }

  md.renderer.rules.fence = fence;
  return true;
}


