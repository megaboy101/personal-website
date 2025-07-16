---
Owner: Jacob Bleser
Created time: 2023-12-17T17:45
Development: Seed
Lifespan: Seasonal
Type: Guide
---
# Content
This site is first and foremost built around content.

I have no formal structure or schedule to my writing. The only general rule of thumb I follow is to lean on the side of writing more, even the insignificant. The getting things done framework talks about getting things out of your head and onto paper, and I’ve found that to be very helpful for keeping my thoughts clear; both as an software engineer who has to keep a lot in brain ram, and as someone with ADHD.
The vast majority of my creative writing is done on my phone while I’m on the move; on the bus/train, while walking, or while waiting in line. I tend to do my best thinking while I’m in motion.

I do all my writing in a mix of Google Keep and Obsidian. I primarily use Google Keep out of long-term habit. It was the first note-taking app I got used to all the way back in high school on an old samsung galaxy phone. I discovered Notion in 2017, but for a while the mobile app was fairly complicated and slow on my android phone, which created a lot of friction for me as a largely impulse-driven writer. I still used Notion for deep desktop writing though. In 2023, after a couple failed a attempts, I moved all my Notion documents over to Obsidian, which is now my go-to writing application.

All of the content you see on this site comes directly from my Obsidian docs synced nightly from my Google Drive. I consider it my reliable long-term knowledge archive. My Obsidian setup is internally kinda complicated, but externally radically minimal. I just use pages, links, and a little front matter for blog posts. No DataFrames or anything of the sort. You can definitely over-engineer Obsidian if you’re not careful (I have many times), so keeping the structure flat and constrained helps me focus more on the content than the tool itself.
# Design
Much like my writing, I tend to overthink and second guess my visual design skills if I spend too much time in it. Doubly so for self-made works such my website. Thus, I strive for a radically minimal design. My goal is to have a site experience that feels natural to read and browse, while also constraining what I can self-critique.
  
I use a simple, conventional site structure. Most people already have a muscle-memory intuition of how to navigate pages on the web. For example, navigation links are usually at the top right of the page. Keeping navigation conventional removes mental friction while jumping around, as I tend to do a lot with blogs especially.

I prefer default fonts and colors. My color palette and type scale come from Radix, which I highly recommend for almost any kind of UI work, not just a blog. I use a neutral palette out of personal preference. What’s nice about Radix colors is that they include both a light and dark variant, ensuring my pages look good in light or dark mode. I also use system fonts rather than a custom font. This is mainly to improve page responsiveness and prevent content-layout shift. For other projects I also love Inter.

I'm pretty ruthless on performance where it affects UX. Nothing grinds my gears more than a great blog article that takes +3 seconds to load on my phone, or stops working on the subway, or loads the content but the buttons don’t work yet. The engineering section goes into more details on how I accomplish this, but it informs the visual and interaction design as well. Visual complexity is kept to a minimum, which reduces the amount of essential CSS and JS assets that need to be loaded. Site layout is consistent across pages, which reduces the amount of bytes sent over the network when fetching new pages. All navigation is expressed though links, which means navigation works immediately. All this leads to a reading experience that feels snappy and lightweight.
# Engineering
This site is currently run on Deno, and (mostly) vanilla JS; and is hosted on Fly.

I’ve had this site for +6 years, and it’s gone through 3 major revisions. The first version was built as a static Gatsby site. ~3 years later I then rebuilt it in Next 13. Then last year I decided to rebuild it again from scratch with the goal of cutting out all the non-essential dependencies, and radically reducing the number of moving parts involved in maintaining the site.

The current stack is built around longevity and simplicity. I want this website to last +20 years, and that puts constraints on the degree of operational complexity I’m willing to accept.
## Deno
I like Deno, it’s just a nicer, simpler version of Node for kind of work I do. It lets me use static types, linting, formatting, and testing without a separate Vite setup. There's also a dedicated KV store, cron scheduler, and SQLite integration, which means I don’t need to maintain an external store like Redis or Postgres for simple projects like this one.
## Hono
Hono is my HTTP request handler of choice. It’s simple, conventional, and relatively quick. I especially like its dedicated JSX support, which I for writing all my HTML layouts
## Web Components
Where necessary I use vanilla web components for client-side enhancements. Because I don’t use a build pipeline, the custom elements I need for each page are included via a `<script type=”module”>` tag.
## Turbo (Hotwire)
I use Turbo as a small client-side, drop-in performance improvement. Turbo let’s page changes use the same browser process, which helps the browsing experience feel more snappy. Since I use the same CSS and JS globally, using Turbo also helps prevent page changes from refetching assets without even needing to worry about caching. The result is that each page load after the first one only loads new HTML, which is usually <50Kb total.

At present I don’t use any sort of link prefetching, mainly just because the site already felt fast enough for my liking, but this may be something I explore in the future.
## Fly
Fly is a simple, Docker-based hosting service. I have a love-hate relationship with it, but I can host a tiny server for free without much headache.

I originally wanted to host this site on an edge network like Deno Deploy or Cloudflare Pages, but the former had some serious latency issues, and the later would require me to bundle my server-side code, which I didn’t want to worry about.

With Fly my server works nearly 1:1 the same when run locally or hosted, which keeps complexity low and helps me resolve production issues more easily. Since Fly is docker-based I can also migrate to a new provider if needed in the future without needing to re-engineer how my site functions.