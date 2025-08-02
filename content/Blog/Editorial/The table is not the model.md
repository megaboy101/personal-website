---
Owner: Jacob Bleser
Created time: 2023-12-17T17:12
Development: Seed
Lifespan: Evergreen
Type: Opinion
---
Something that really took me a lot of effort to wrap my head around was the reality that how you model and understand data, and how that data is best persisted, are two distinct concepts and should be handled separately. Often time’s we view the database tables as our source of truth, and write our API’s around the schema’s it provides. The catch is that, as your application get’s more complex, you realize that you need to wrangle that schema more and more to fit more complex transformations. This can often lead to over-fetching data, because you only need small pieces of data from a bunch of different tables.
Alternatively, database tables, or serializations schema’s to be more broad, should be an afterthought when designing your application. Design with a model first, and then figure out how to best persist it, not the other way around.
A good practice I’ve taken to is designing my models to work in-memory first where I have the full freedom of my programming language, and then once the functions are figured out, I get to work on persistence. More often than not I find that the model can’t be perfectly modelled to any particular storage system, so you have to make tradeoffs. But I think this is a good thing, because it forces you to think more about storage solutions in the context of your specific data needs, and less about how to compromise your internal model for the sake of your storage solution.
This is the solution to the problem I had when I began working at MP and had to argue about the best storage solution for our company.