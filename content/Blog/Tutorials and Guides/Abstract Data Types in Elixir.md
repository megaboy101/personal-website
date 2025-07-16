---
Owner: Jacob Bleser
Created time: 2023-12-17T17:13
Development: Seed
Lifespan: Evergreen
Type: Guide
---
Something that took me a long time to understand in elixir was when protocols were appropriate to use. Basically, they are a way of defining abstract data types, without being bound to a specific data structure. So they define a type through its behavior, not it's structure
There are 2 examples that really made this sync in for me.
The first is how you can make a queue protocol, and then implement it 2 different ways depending on the underlying struct
The second is how ranges are defined in terms of structs, yet still implement the enum protocol.
The third is how you can invent your own numbers by defining and implementing a “number” protocol. A number is anything that supports the “addition” and “subtraction” protocols for example. That's a bit contrived, but it helps illustrate the point that you can define something in terms of what it does, just as much as you can define something in terms of what it is
Types are defined in terms of their behavior, rather than in terms of sets of values.
Golang has it right with this. You add both structs and interfaces with the `type` keyword.