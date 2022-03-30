import { agent } from './setup';
import { credentialToHTML } from './webviews/credential';

function init() {
  // @ts-ignore
  for (const container of document.getElementsByClassName('veramo')) {

    const jwt = container.dataset.jwt;
    if (jwt) {
      agent.handleMessage({ raw: jwt })
      .then(message => {
        if (message.type === 'w3c.vc' && message.credentials) {
          container.innerHTML = credentialToHTML(message.credentials[0]);
        }
      })
      .catch((e: any) => {
        //@ts-ignore
        const out = document.createElement('div');
        out.innerHTML = `Unable to verify. Please allow all content and script execution`;
        out.style.color = 'red';
        container.appendChild(out);

        container.append();
      });
    }

}

}

//@ts-ignore
window.addEventListener('vscode.markdown.updateContent', init);

init();