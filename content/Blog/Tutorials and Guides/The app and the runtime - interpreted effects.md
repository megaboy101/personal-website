---
Owner: Jacob Bleser
Created time: 2021-01-24T10:58
Development: Seed
Lifespan: Evergreen
Type: Opinion
---
[[Demonstration of managed effects in Elixir]]
- Some thoughts and logic on how to do good software architecture and design
- The major thing we're trying to do here is separate the DATA from the RUNTIME.
- The DATA layer is a large army of functions, that take data in, and put data out.  
    They are the "brains" of the application, and make all the decisions of WHEN x DO y  
    
- This layer is supported by the RUNTIME layer. This is the shell of the application  
    that acts as the "body", simply taking instructions from the DATA layer and executing  
    them in the real world.  
    
- This is designed to be spiritually similar to these ideas:
    1. The Elm Architecture
    2. Functional Core, Imperative Shell
    3. Hexagonal Architecture/Ports and Adapters
- This approach has 2 key advantages:
    1. Logically complex code is simple to debug and test in isolation
    2. Code that interacts with the real world can be debugged and tested without any  
        app logic being involved. This allows it to be largely abstracted away from app  
        developers needing to worry about the internals.  
        
- The question I'm at rn is, how to structure this internal core.
- I know I want to have modules primary built around a data structure.
- But which functions should just operate on data, vs which functions  
    should return more opaque data like Changesets or Multi's?  
    - Ideally, as little code as possible should work with changesets or multi's,  
        because they are very opaque data structures that are trickier to inspect  
        and debug than more application-level data structures. It's easier to debug  
        a function that changes the :name field of a profile by just returning a new  
        profile struct than one that returns a changeset  
        
    - However, Changeset's and Multi's are very much required to communicate to  
        the RUNTIME what commands/changes we would like to run  
        
- As a potential related idea to this, I want to explore the idea of like pure data structures and row-polymorphic modules. Something like the code below. This does make every module much more complicated with type definitions. But it also can make modules simpler, which could be good for easier testing
```elixir
defmodule Profile do
	defstruct [
		:id,
		:first_name,
		:last_name
	]
end
defmodule Matching do
	# By defining a custom type, Matching is dissociated from any specific
	# type of profile. 
	@type profile :: %{first_name: String.t, last_name: String.t}
	@spec create(profile) :: :ok
	def create(profile) do
		MatchServer.create(profile.first_name, profile.last_name)
	end
end
my_profile = %Profile{id: "asdf", first_name: "Jacob", last_name: "Bleser"}
Matching.create(my_profile)
```