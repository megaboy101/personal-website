---
Owner: Jacob Bleser
Created time: 2023-12-06T09:09
Development: Budding
Lifespan: Seasonal
Type: Project
---
Hey, I’m Jacob!!!!!!!! 😄
Today I’d like to talk about Elixir at Discord, but as a larger theme I sorta wanna talk about using Elixir at work, and sorta take you on a journey of how I started using it at work, how it’s been, and whether I would recommend it to others. And to illustrate that, I’m gonna be sharing a couple case studies and war stories/campfire stories
  
So first, some quick introductions. My name is Jacob, I currently work at Discord on the nitro perks team. We are involved in everything related to the premium fun side of Discord, so things like sounds, emoji’s, stickers, and more recently our shop. If you wanna reach out to me at some point either about the talk or just in general, you can reach out to me on Twitter or Discord.
  
SO, our story starts from humble beginnings, in mid-2022, at a small social dating company called the Marriage Pact, and with an app called Checkmate.
  
To bring you up to speed, things had been going well, we had successfully raised a 5M seed round in February, everyone had moved up to NYC to work together, and we could even now make full-time salaries.
  
The only problem, was our tech stack was on fire
  
At the time, we had spent the previous year trying to basically build a near-field location-based dating service called Soulmate Radar, and it had turned into a complete technical flop.
  
The location services weren’t reliable, the matchmaking was slow, and the servers were in a constant state of burning down us-east-1.
  
And after like a year of building this thing, that was pretty demoralizing as a small team who had poured their heart and souls into it, to see it fall into obscurity almost immediately.
  
So in mid-2022 we wanted to build a new app from scratch, and try and right all the product and engineering wrongs we made along the way.
  
We knew going in that our current technical architecture was not going to cut it. At the time, we were primarily a Python shop, using FastAPI to power our application services. We liked Python for the same reason that I think everyone likes python, its easy to learn, most engineers already have a working knowledge of how to use it, and theres an entire ecosystem of ready made tools and patterns that small, early stage startups can leverage to bootstrap themselves very quickly. And I still believe that today, and think that python is a great option for new companies and new people in software as well.
  
That being said, after a year of using it in production we as a team had become acutely aware that python was not really a good fit for our unique product demands.
Give a profile of marriage pacts technical requirements
Specifically:
- **Inability to easily leverage several cores.** We were a viral social app, and where load can skyrocket at any time on a moments notice. Our system needs to be able to gracefully scale up and down with minimal intervention or complexity.
- **Lack of good realtime primitives.** Our product is built around shared realtime events and connections. Things like realtime notifications, emails, and presence. This amounts to a lot of stateful (web)socket engineering, and all the complexity that comes with it.
- **Heavy reliance on external services for tasks like work queues (celery), and caching (redis)**. We were a very tiny team (just 1 full-time backend dev at the start), and wanted to limit as much as possible our time spent on infrastructure management, especially as our company grew. We didn’t wanna use a system that would be very simple to manage at 1k users, but require a rewrite at 100k
So, we knew we needed to make a change, the question is, to what?
I think usually, this is where most teams would reach for Go. This is so much of a pattern at this point that I think it’s kinda a meme of its own [insert why is my team moving from nodejs to golang]. And for good reason, Go is lean, fast, has great concurrency primitive’s, and is exceedingly simple to deploy on modern cloud services
  
So why didn’t we do that?
  
Well, it wasn’t because Elixir was cool. I think a lot of people choose elixir for personal projects and prototypes because elixir is novel and functional, but companies don’t succeed on the cool factor of their stack. Fundamentally we were a business and needed to make a decision that would be in the best interest of our product and our team.
  
Ultimately, the reason our team chose to bet on elixir was: Reliability, and tooling, particularly around realtime systems.
  
Elixir, and its older brother Erlang, were fundamentally built around a methodology and toolkit that emphasizes ruthless reliability, regardless of scale. And as a team who had basically normalized watching the AWS dashboard at 3AM, that was huge.
Talk about tooling
  
So, with a newfound sense of vigor, we set out to build a new app called Checkmate.
  
The Checkmate app, in a nutshell, was a way to see how scientifically compatible you were with your friends, lovers, and secret crushes.
  
Unlike Soulmate Radar it did not have a location services component to it (thank god), but it did use realtime matchmaking and compatibility tracking, a live-updating feed to see who’s compatible with who in real-time, real-time notifications, and deep social network analysis and recommendations.
  
This app was built over the course of 6 months, with its first beta release going out after the first 2.
It was built by 3 engineers, 2 backend engineers and 1 iOS engineer.
The entire backend service was powered by Elixir and Phoenix, with all our data stored in Postgres, with a bit in dynamo and Neo4j for some of our social recommendations
  
Overall the development and maintenance experience was pretty much night and day compared to our previous app.
Some of the highlights were:
- We removed an entire mountain of complexity no longer needing to maintain celery, redis, or gunicorn. Elixir’s built-in Task, Genserver, and ETS systems were enough for our use cases
- We spent much less time in the aws console. With elixir and postgres, we just needed to occasionally upgrade our instance size and that was it. We never even needed to use multiple servers.
- Our systems were much easier to test, debug, snd modify over time. Immutable stateless data is amazing, and phoenix has incredible tools for structuring and testing logic, especially realtime socket logic!
  
So, what were the results:  
  
With these systems in place, we were able to release Checkmate as a much stabler app, and when it broke the top 15 apps on the app store, we were ready. All we needed to do was keep increasing that instance size. [talk more about user count, and growth]
  
---
  
Ok, so now I would like to switch gears a little bit and finally talk about Discord, that realtime messaging app, also known as “that thing my kids use” or that thing you need to download to try Midjourney.
  
Much of the info I’m gonna share here is also available to read on our blog, so if you’re interested to learn more about some of the intricacies of how Discord operates, including and beyond just the Elixir stuff, I would highly recommend it.
  
So Discord in a nutshell is a realtime voice and text messaging system, reminiscent of older tools like AOL IAM or Windows MSN, or TeamSpeak. Or for a more modern comparison, it’s kinda like Slack, or Microsoft teams, but more fun [insert Daniel, the cooler Daniel meme]
  
There’s a really god article by Maggie Appleton, the illustrator for Egghead, about the emerging concept of [The Cozy Web](https://maggieappleton.com/cozy-web), that I would highly recommend you check out. That article gives a much better explanation than I could about the ethos around Discord, and what it’s trying to be.
  
SO Discord was started in 2015, as a spinoff project of a mobile game the founders had been working on [insert game name here]
  
Originally the app was just a tiny chat and voice messaging system, with the backend being built on Python and Elixir.
Elixir has been a foundational part of the Discord stack since its inception, and is one of the main technologies that allows it to work the way it does. Both then and now, Elixir powers the bulk of Discord’s realtime systems, including its messaging, presence, voice, and video streaming features.
  
One interested thing to point out about this is that Elixir itself didn’t hit 1.0 until Sept 2014, and Phoenix, Elixir’s main web framework, didn’t have it’s first 1.0 release until Aug 2015, so Elixir at Discord actually predates Phoenix, which is just wild to me. Like it’s one thing to build your startup on a niche technology, it’s another thing entirely to build your startup on a niche technology that doesn’t even have a stable web framework yet.
But in all seriousness, Discord chose to take a gamble with Elixir for their product for many of the reasons we chose Elixir at The Marriage Pact, it’s reliable, flexible, and handles growing technical demands exceptionally well.
  
So since coming from those humble beginnings, Discord has grown, _massively_
  
Here are some fast facts about the scale at which Discord is operating:
- 150 million monthly active users
- 25 million new registrations each month
- Users spend >5 billion combined minutes in Discord each day
- >8 million different servers
  
The biggest server (Midjourney):
- >10 million active members
- >1 million concurrent online
  
On the technical side, Discord now has one of the largest and oldest Elixir deployments in the world!
- We can currently schedule >250 million concurrent Elixir processes at peak, with 10s of thousands of processes starting and stopping every second
- All of these processes are run on a distributed elixir cluster, comprised of >1000 individual cloud compute VMs running on Google Cloud across several geographic regions
- Connections between nodes in the network are managed by our own in-house partial mesh network topology manager built on etcd. This allows us to optimize how processes come in and out of the network, who handles them, and how.
  
How has the journey been along the way?
Now, I haven’t been with the company long enough to see its major Elixir developments and struggles, so I spoke with Jake Heinz, who is one of our lead engineers and has been with the company since 2015
  
The Elixir website also has an article where Jose, the creator of Elixir, spoke with Jake on how it’s been.
But that article is from late 2020, and Discord has had some major growth since then, especially in the wake of COVID and everyone suddenly moving online. But if you’re curious, I would highly recommend [the article](https://elixir-lang.org/blog/2020/10/08/real-time-communication-at-scale-with-elixir-at-discord/)
  
So when I spoke with him:
1. He mentioned that, despite growing very quickly to massive scale, Discord hasn’t really needed to rewrite or re-invent its core infrastructure much at all. The stack that powered Discord at 100k users is more or less the stack that powered Discord at 100 million.
    - This is pretty rare for the tech industry. I think at some point most companies go through the phase of doing a long-term rewrite of their core systems, usually because the tools that allowed them to iterate and ship quickly start to have natural upper limits. A good example of this is how Twitter shifted their core backend from Rails to Scala when their existing stack started hitting upper scaling limits. Which is not to say Rails doesn’t scale, Shopify has proven that many times over. I do think it illustrates a trend though.
    - This is also a pretty solid competitive advantage. Migrating core infrastructure to a new stack takes time and talent, that could otherwise be spent iterating on product features and quality. For a recent example of this, the frontend team at Github is currently in the process of migrating much of their UI from primarily Rails and web-component-based system to React, and it has not been without fanfare. [insert angry tweets here]
- Second thing he mentioned is that Elixir has a very good setup for improving performance-critical sections of the stack. For those that don’t know, Elixir supports what are called Native Implemented Functions, or NIFs, which allow you to plug in native C/C++/Rust code into Elixir, usually as a method for improving performance. Discord has quite a few native modules written in Rust that it uses to speed up performance critical parts of its Elixir stack. What’s nice about this is it allows us to retain all of the existing reliability and scalability features that Elixir provides. We don’t need to build additional “sidecar” services unless it’s something very large (such as for our RTC systems)
- Overall, as someone who has built much of Discord’s Elixir stack and been around long enough to live through the consequences of those decisions, pretty much nobody on the team regrets their choice to use Elixir, and are in fact really happy with how it’s managed to scale over time.
    - To quote the article I mentioned earlier:  
          
        _”What we do in Discord would not be possible without Elixir. It wouldn’t be possible in Node or Python. We would not be able to build this with five engineers if it was a C++ codebase. Learning Elixir fundamentally changed the way I think and reason about software. It gave me new insights and new ways of tackling problems.”_
  
---
  
To summarize:
- Is Elixir a tool worth betting a company on?
    - I would say yes. To me Elixir combines the iterative speed and reliability of a typical application tool suite like Ruby on Rails, Django, or Node.js; combined with the performance, reliability, and peace of mind that you’d find in something like Go or Rust.
    - DHH, the creator of Rails recently talked about what he called Renaissance Developers, who can manage their entire product stack in a single toolkit, and I think Elixir, especially with Phoenix, fit’s that model exceptionally well.
- Does Elixir scale?
    - Yes, Discord has proven that Elixir can scale exceptionally smoothly, and it’s developer experience doesn’t significantly degrade as the numbers of active users or feature’s grow
- Trade-offs and pain points?
    - Not all drivers exist (yet!)
        - At Marriage Pact, we needed to write our own Neo4j driver, which took time and effort. But mostly because Neo4j doesn’t document their protocol very well.
    - Deployment can be tricky
        - Elixir and phoenix now have good support for Docker, which alleviates most deployment issues. Most providers don’t explicitly have documentation for how to deploy, resulting in difficult to diagnose issues. This is changing a bit with tools like [Fly.io](http://Fly.io) and [render.com](http://render.com) explicitly supporting Elixir, but if you’re a large company in AWS or Google Cloud, it will require some trial and error.
- Non-trade-offs?
    - Hiring/training is hard
        - Nobody that we hired at Marriage Pact, and very few Discord engineers for the first several years had any Elixir experience before joining. Elixir isn’t python, but it’s simple enough that most engineers can pick it up quite easily with the right guidance.
            - In particular, Elixir has a great emphasis on publishing and encouraging good documentation, which has been a lifesaver at times
    - What if I need hyped-specific tool that Elixir doesn’t support