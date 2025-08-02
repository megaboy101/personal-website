---
Owner: Jacob Bleser
Created time: 2023-12-17T17:13
Development: Seed
Lifespan: Evergreen
Type: Guide
---
Original Thoughts (not sure when I wrote this):
- Behaviors for effects, protocols for data
- Behaviors map the same functions and data to different implementions. If the functions are the same, and the data coming in and out is the same, the only difference is the effects being run on the data. This can be seen in how, most of the time, behaviors are written for testing purposes
- Protocols map the same API to different types of data. For example, an enumable that can work on numbers, string, objects, etc. It’s a type of polymorphism, similar to generics but more than that. It allows custom types to extend a common API. For example, if you had a `create` function imported like `from core import create` you could implement the create logic for every type you wanted. Then you wouldn't have to have a million create methods
How I feel now (Aug, 2023):
- It’s not as clear cut as behaviors for effects and protocols for data.
- There are practical differences between the two, and I can illustrate it with the `Enum` protocol
    - If Enum were a behavior, the way you would implement it would be to create a new module, with a struct for the data type you want.
    - When you now call Enum, you have to pass your data structure, and the module that handles it. This is more work than it’s worth and kinda defeats the point of the behavior
- Protocols are all about data abstraction. You define an abstract data structure as a protocol, and then provide it a physical data structure that can be fulfil the requirements of that abstraction. Classic OO example would be like giving an array for a stack protocol. This can let you do cool things like have a data structure implement many protocols, allowing it to be reused in many places while keeping each individual place its used much simpler
- Behaviors are about inheritance, or components in the React sense. You provide an engine, and give the consumer a contract one how to program that engine. The consumers program is pure and simple, and can be easily tested in isolation. But since it implements the behavior, it can be utilized in a stateful engine.
    - This is an approach of separating the pure, sequential, non-concurrent business logic from the highly effectful but reusable runtime
        - Could this connect to Elms runtime/application system?