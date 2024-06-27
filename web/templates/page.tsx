import Nav from './nav.tsx'
import Footer from './footer.tsx'
import { Child } from "@hono/jsx";

export default ({ children }: {children: Child}) => (
  <body>
    <Nav />

    {children}

    <Footer />
  </body>
)
