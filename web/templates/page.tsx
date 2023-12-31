import { FC } from 'hono/jsx'
import Nav from './nav.tsx'
import Footer from './footer.tsx'

export default ({ children }) => (
  <body layout="frame">
    <div layout="page">
      <div layout="py-6">
        <Nav />
      </div>

      <div layout="content-frame">
        {children}
      </div>

      <div>
        <Footer />
      </div>
    </div>
  </body>
)