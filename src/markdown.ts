import type MarkdownIt from 'markdown-it';
import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';
import { encode } from 'html-entities';
import yaml from 'yaml';
import StateBlock from 'markdown-it/lib/rules_block/state_block';
import matter from 'gray-matter';

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

  function metaParse(state: StateBlock, start: number, end: number) {

    function get(state: StateBlock, line: number) {
      const pos = state.bMarks[line];
      const max = state.eMarks[line];
      return state.src.substr(pos, max - pos);
    }
    var startLine = state.line;
    if (start !== 0 || state.blkIndent !== 0) {
      return false;
    }
    if (state.tShift[start] < 0) {
      return false;
    }
    if (!get(state, start).match(/^---$/)) {
      return false;
    }
    const data = [];
    let line = start;
    while (line < end) {
      line++;
      const str = get(state, line);
      if (str.match(/^---$/)) {
        break;
      }
      if (state.tShift[line] < 0) {
        break;
      }
      data.push(str);
    }
    const parsed = matter(state.src);
    if (!parsed.data?.type?.includes('VerifiableCredential')) {
      return false;
    }

    // let parsed = {};
    // try {
    //   parsed = yaml.parse(data.join('\n'));
    // } catch (_) {}
    var token = state.push('meta', '', 0);
    token.content = JSON.stringify(parsed);
    token.map = [startLine, state.line];
    token.children = [];
    token.meta = state.src;
    state.line = line + 1;
    return true;
  }

  function metaRender(tokens:  Token[], idx: number) {


    return `<div class="veramo-meta" data-source="${encode(tokens[idx].content)}"><div class="spinner"></div></div>`;
  }
  md.block.ruler.before('code', 'meta', metaParse);
  md.renderer.rules.meta = metaRender;
  md.renderer.rules.fence = fence;
  return true;
}


