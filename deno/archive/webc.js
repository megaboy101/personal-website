import { WebC } from 'npm:@11ty/webc'

const page = new WebC()

const myPage = await Deno.readTextFile('./input.html')

page.setBundlerMode(true)
page.setContent(myPage)
page.defineComponents("components/**.webc")

const { html, css, js, components } = await page.compile()

const finalHtml = html
    .replace(
        "$STYLE",
        `<style>
        ${css.join("\n")}
        </style>`
    )
    .replace(
        "$SCRIPT",
        `<script type="module">
        ${js.join("\n")}
        </script>`
    )

await Deno.writeTextFile('./index.html', finalHtml)