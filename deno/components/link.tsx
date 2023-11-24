import { FunctionComponent as FC } from "preact"

export const Link: FC<{href: string}> = ({href, children}) => (
  <a href={href} target="_blank" rel="noopener">
    {children}
  </a>
)