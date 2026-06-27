import { Copy } from "@/includes/icons.tsx"

export const CodeFigure = (props) => {
  if ('data-rehype-pretty-code-figure' in props) {
    return (
      <figure {...props}>
        <copy-button class="copy" target="pre">
          <button type="button">
            <Copy />
          </button>
        </copy-button>
        {props.children}
      </figure>
    )
  }

  return <figure {...props} />
}
