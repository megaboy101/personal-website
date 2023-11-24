import { renderToString } from 'https://esm.sh/preact-render-to-string?deps=preact';

import App from './index2.jsx'


const output = renderToString(App)

await Deno.writeTextFile("./index.html", output)

console.log("Done!");
