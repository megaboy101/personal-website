import { HonoRequest } from "hono"

export const head = {
  title: 'Writing // Jacob Bleser'
}


export default ({}: { ctx: HonoRequest }) => {
  return (
    <main id="writing">
    </main>
  )
}
