---
Owner: Jacob Bleser
Created time: 2023-12-28T14:15
Development: Budding
Lifespan: Seasonal
Type: Guide
---
# Deno Deploy
## Pros
- Doesn’t require a build process to deploy. Just upload your code and it’s good to go
- Includes things for building real edge apps, like KV and CRON
## Cons
- There is no caching layer built-in. All requests, even for static assets, will trigger a separate function call. This has 2 really bad consequences:
    
    1. Loading a webpage means a function call for every static asset. If you have a lot of css and script files, this means a single page load can easily trigger 10-20 function calls, which can eat up your free tier extremely quickly
    2. Function call response times can sometimes be quite long. This, combined with every asset triggering it’s own function, means sometimes 90% of your site will load immediately but one single asset will take forever, like a font file or a random css file
    
    - This should be circumventable with a Cloudflare CDN layer in front, but I feel like that kinda defeats the point of even using serverless functions, plus it’s another thing to manage
- Performance can be noticeably poor. I’ve noticed this in the field with both my personal site, and with various Deno-related sites like the Fresh docs, the Deno docs, and the Deno Deploy dashboard. I think this may be related to cold starts or something, but can sometimes be multiple seconds on a solid internet connection to get a response
- Platform in general is pretty new, nothing is that stable atm
# Cloudflare Pages/Workers
## Pros
- Support for basically everything I want and need: CDN, KV store, edge functions in every availability zone imaginable, and more
- True, high performance edge caching. Has more availability zones than anyone else, meaning lowest latency
- Really reliable provider
- Really cheap, will realistically never break above their free tier
## Cons
- The worker runtime basically **requires** a server-side build step, whether it’s Deno, Node, or Bun based. It doesn’t support typescript or even packages, so they all must be compiled and bundled into plain javascript before the runtime can execute it
- KV storage is built for performance on high-read workloads. For low traffic sites it will still be really fast, but requests will need to go to a central location, somewhat defeating the point of putting a server on the edge
# Netlify
## Pros
- Already use it for my current setup
- Function runtime is built on Deno, which makes things easy
- Includes cloudflare CDN automatically, which removes need to manage separately
## Cons
- Edge functions don’t have access to any application APIs like Deno KV or cron. You can access them like any other 3rd party API, but that’s now a second thing to maintain
# Fly.io
## Pros
- Supports whatever you can fit in the box. This means you could run a sidecar app like postgres, redis, or sqlite. This also means Deno’s features like kv and cron can run locally just fine. This also allows for the most flexibility of your general stack, and means the most consistency between your local and prod deployment
- Has a free tier for small apps like a personal site
- Supports stateful apps, so you could just store stuff in memory instead of using external services if needed
## Cons
- It’s only “sorta” edge computing. You get up to 3 regions free, but then you need to pay per region to host your app. It makes multi-region deployments a lot easier, but you’re still paying for it, whereas you wouldn’t with something like cloudflare or deno deploy
    - I’ve seen comments that people don’t really feel sluggishness in practice. The remix docs site for example is exclusively on the free tier of fly, and uses no cdn layer in front, and honestly it felt fine (they do use prefetching tho)
    - It should also be said that Fly supports many US-based locations. So it’s possible I could just setup 3 US locations for free and be chill with it
- I’ve heard that reliability can be spotty at times.
    - I’ve personally not experienced this, and it seems to be mainly larger production apps, especially those with databases, that feel the real pain of this. But something to consider
- Theres still sorta a build step involved since you need to package your app via docker (which I kinda hate) although arguably more minor than a bundling step like with Cloudflare pages. The code itself is still pretty much the same, just the execution environment that is a bit different
# Summary
- I think in 2023 the only real options are either Cloudflare or Fly
- Cloudflare offers the best performance, price, and reliability; at the cost of a restricted set of tools that will require a build pipeline
- For workloads that need to be a bit more flexible, such as stateful stuff or wanna bundle bespoke services like postgres or redis, and can live with edge-ish latency and some downtime, Fly is the way
- A good way to think of cloudflare is less as a backend and more as like a service worker layer. Like not necessarily visual logic but still a client layer thats part of the client-side pipeline. Or maybe a client++ layer I suppose
  
So what are we gonna go with here? Realistically going back to my general engineering principles, and the goals of my personal site, I think Fly should be the way. I don’t need to mess with any build tool step, I can still do server-level logic if I want, and my setup is for the most part pretty generic, so I can swap to say Render or some other host if I want.
  
I cant help but want to like Cloudflare, and I think there are some killer use cases for it, but I think for my project its kinda like choosing Solid JS vs vanilla JS. Solid is great and the performance can’t be beat, but theres a complexity cost to getting things that optimal. Running a server on Fly just to run my little site may be a bit unoptimal, but its simple, and conventional, and consistent, and fast enough for me. Running on fly will probably last me a long while, and if I end up wanting to move providers later it should be relatively painless