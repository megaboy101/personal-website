---
Owner: Jacob Bleser
Created time: 2021-01-26T21:02
Development: Seed
Lifespan: Seasonal
Type: Guide
---
- Classes are bit of an overloaded term in Python, and should be used with care
- Classes as Data
    - The vast majority of the time, you should use classes in Python to create custom, stateless, immutable data types
    - You should use `@dataclass(frozen=true)`, this helps denote that the class is purely for use as a transparent data structure.
    - The only methods on these types of classes should be for implementing protocols. They should read from `self` but never write to it. Moreover, they should never execute side effects
    - These classes can inherit from one or multiple protocol classes, but only those
- Classes as Protocols
    - Classes are required to define protocols in Python. These classes should only inherit from Protocol
    - These classes should never contain or mutate state
    - You can implement methods on protocol classes as a way to provide default implementations (”derive” so to speak)
- Classes as Servers
    - These are the rarest classes you should create or use, and should be reserved for framework or library authors
    - Server classes contain state, and are meant to be singly inherited. They expose a set of callback methods that the inherited class should implement. The inherited class should not define any custom state, or manipulate the state of the server class
    - Inherited classes should contain as little logic as possible, and should defer all their logic to stateless functions. This makes it easier to test the inherited classes logic without needing to deal with a stateful server