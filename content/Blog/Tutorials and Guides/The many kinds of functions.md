---
Owner: Jacob Bleser
Created time: 2024-01-07T12:49
Development: Seed
Lifespan: Evergreen
Type: Opinion
---
Something I’ve been thinking about a lot lately while I’ve been working with the Ramda library has been the different kinds of functions there are.
In functional programming, there are names for different kinds of functions that share a common use case. I think knowing about them can be a useful thing to know, even if you don’t program in Haskell or the like.
  
# Predicates
The simplest to understand. A predicate is a function that returns a boolean.
When you call array.filter(), you give a predicate function to know which array values to accept.
# Transformer
A function that, given a specific value, turns it into another value.
Like filter, when you call array.map(), you give a transformer.