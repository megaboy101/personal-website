import Nav from './nav.tsx'
import Footer from './footer.tsx'

export default ({ children }) => (
  <body
    class="flex"
    ui-minheight="device"
    ui-align="center"
    // This is a one-off hack because we must have
    // the body as a layout and visual element
    style="
      background-color:var(--neutral-1);
    "
  >
    <div
      class="flex"
      ui-width="full"
      ui-maxwidth="padded-screen"
      ui-px="4"
      ui-grow
    >
      <div class="flex" ui-py="6">
        <Nav />
      </div>

      <div class="flex" ui-align="center" ui-grow>
        <div class="flex" ui-maxwidth="readable" ui-width="full">
          {children}
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  </body>
)
