import render from "preact-render-to-string";
import { createHead, useServerSeoMeta, renderSSRHead } from 'unhead';
// import { renderSSRHead } from 'unhead-ssr';
import { Document } from '@/index.tsx'

const head = createHead()

useServerSeoMeta({
  title: 'About',
  description: 'My about page',
  ogDescription: 'Still about my about page',
  ogTitle: 'About',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
})

const result = await renderSSRHead(head)

// const html = render(<Document />, {}, { pretty: true });

// await Deno.writeTextFile("./index.html", html)

console.log(result)
console.log("Done!");