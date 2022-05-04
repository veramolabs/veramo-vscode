import type MarkdownIt from 'markdown-it';
import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';
import { normalizeCredential, normalizePresentation } from 'did-jwt-vc';
import decode from 'jwt-decode';
import { credentialToHTML } from './webviews/credential';
import { presentationToHTML } from './webviews/presentation';


export function markdownPlugin(md: MarkdownIt){

  var defaultRender = md.renderer.rules.fence;

  function fence(tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: Renderer): string {

    const token = tokens[idx];
    if (token.info === 'vc+jwt') {
      try {
        const decoded: any = decode(token.content);

        if (decoded.vc?.type?.includes('VerifiableCredential')) {
          const vc = normalizeCredential(decoded as any);
          return credentialToHTML(vc, token.content.trim());
        }else if (decoded.vp?.type?.includes('VerifiablePresentation')) {
          const vp = normalizePresentation(decoded as any);
          return presentationToHTML(vp, token.content.trim());
        }

      } catch (e) {
        // noop
      }

    }
    if (defaultRender) {
      return defaultRender(tokens, idx, options, env, self);
    }
    return 'This should not happen?';
  }

  md.renderer.rules.fence = fence;
  return true;
}


