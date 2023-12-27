import { Hono } from 'hono'

const page = new Hono()

page.get("", c => {
  return c.render(
    <div layout="pt-8">
      <h1 layout="pb-5">
        👋 Hi, I'm Jacob
      </h1>

      <p variant="large">
        I’m an indie web and game developer currently living the dream
        in ✨ New York City ✨. In college I co-founded a small web dev
        shop called Studio Reach to help bootstrap local tech startups,
        and more recently led the engineering efforts at a VC-backed
        social-dating startup called The Marriage Pact, along with the
        Checkmate app.
        <br/><br/>
        Outside of work I’m also active in the open source community,
        primarily in Elixir and the Bevy game engine for Rust.
      </p>
    </div>
  )
})

export default page
