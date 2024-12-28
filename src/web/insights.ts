import { Hono } from "@hono"
import { perform } from "@/runtime.ts"
import { savePageview } from "@/app.ts"


const page = new Hono()

page.post("/p", async (c) => {
  await perform(savePageview(c.req))

  return c.json({})
})

export default page
