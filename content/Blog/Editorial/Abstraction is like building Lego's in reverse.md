---
Owner: Jacob Bleser
Created time: 2021-08-09T14:55
Development: Seed
Lifespan: Evergreen
Type: Opinion
---
The dream of every programmer is to have their system built like legos. Where all they do is mix and match the legos together to build different things. In reality though we play the role of both the Lego builder and the Lego designer. We not only build legos into different things, we also decide what the pieces are. And it's deciding what the pieces are that really sucks.
But something I realized is that, most often when building software systems, we build with big legos first, and slowly make our pieces smaller and smaller over time. Like if we wrote a JSON parsing library, the library would be the one piece. But if we then also needed to support XML parsing, the best idea would be to make a pluggable parser with a JSON and XML module. So we now have more pieces. But what's interesting is that the parser and the json module are now split, despite having the same functionality.
Why do we build things that way? Why not start by building with a pluggable parser piece and a JSON plugin piece? I think the answer is that it's usually bad practice to pre-emptively build things in pieces, for 2 reasons:
1. Building a system in smaller pieces takes more engineering time. You may be doing more work than you actually need to.
2. It's hard to know where to cut the pieces. In software you can in theory make infinitely small pieces for any system. But ideally you want as few pieces as possible to fulfil the requirements.