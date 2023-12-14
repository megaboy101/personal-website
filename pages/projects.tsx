import { Hono } from 'hono'

const page = new Hono()

page.get("", c => {
  return c.render(
    <h1 style="color:white;">Projects</h1>
  )
})

export default page
