import { Hono } from "@hono"

const page = new Hono()

page.get("", (c) => {
  return c.render(
    <h1>projects</h1>,
  )
})

export default page
