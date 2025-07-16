---
Owner: Jacob Bleser
Created time: 2023-11-30T12:14
Development: Budding
Lifespan: Seasonal
Type: Project
tags:
  - case study
---
[[Elixir Meetup Talk]]
  
Talks/speakers to learn from:
- Code Aesthetic
- No Boilerplate
- Anything from Dan Abramov or Kent C. Dodds
  
So just by show of hands:
- How many of you have used elixir before, either for experimenting or personal projects or whatever
- Now of those, how many have used or use elixir at work
  
Hi, today I’d like to take you on a journey of using Elixir in the big and small/in 10 slides.
  
Introductions
  
So, our story begins with this small startup.
  
So, now let’s fast forward to the big and talk about Discord
Intro about what Discord is
History of Discord and it’s usage of Elixir
  
Ok so now we can draw some conclusions.
- Would you use Elixir again?
    - Yes, for internet services it’s the best experience I’ve had building
        - Internet Services: Persistent server’s that either maintain internal state or frequently talk with persistent backing services like SQL, redis, microservices, macroservices, etc.
- Does Elixir scale?
    - Yes, Discord has proven that Elixir is fit for exceptionally large production workloads
- Is Elixir fit for startups/greenfield?
    - Yes, my team was able to be productive with it very quickly and never had to worry much about building around the tool. Put it in a container with CPUs to spare and it just works.
  
---
  
Introduction
- Today I’d like to take you on a journey of using Elixir in production.
    - Alt: Hey guys, my name is Jacob, and today I’d like to take you on a journey of using Elixir in production
- This is not going to be a “How to” Elixir guide (there are many other talks and articles for that on the internet). This instead going to be more about how I’ve used Elixir at work, and whether you should consider it for your work as well
  
About Me
- Hi, I’m Jacob!
- Currently a full-stack engineer at Discord working on Nitro Perks
    - Soundboard
    - Emoji’s
    - GIFs
    - Anything to express yourself with
- Here is where I’m active:
    - My personal website
        - Includes all the slides in this talk, along with links to sources
    - Twitter
    - Discord (duh)
  
Purpose of this talk:
- Take you on a journey of using Elixir in production in the small scale and the big scale
- Answer a few simple questions:
    - Is Elixir fit for production usage?
    - Does it scale?
    - What are the tradeoffs?
  
A tale of 2 companies
- The Marriage Pact
    - Seed-stage consumer social company
    - 2 full-time backend engineers
- Discord
    - Late-stage consumer social company
    - Hundreds of full-time engineers