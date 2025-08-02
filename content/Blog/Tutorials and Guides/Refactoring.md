---
Owner: Jacob Bleser
Created time: 2023-05-24T11:44
Development: Seed
Lifespan: Evergreen
Type: Guide
---
## Refactoring Effects
An app is just a reducer of the world state and a command
Services should just be viewed as opaque data structures.
Ex, typeform is just a big dict of workspaces, forms, and responses
Wrap all services up as one opaque “world state” data structure. Pass this in to all top-level functions.
Think of it like the conn/token pattern in elixir
Use in-memory data structures to test, effectful one in production
Alt, use in-memory handler in testing, live handler in prod
### Major problems:
Need to build in-memory versions of every service. Easy enough for small services, but very time consuming and error prone for complex ones, such as a database. Errors could be alleviated by interface testing, but still its a lot of ceremony
In Python I think of classes as doing 1 of 2 things:
1. Classes as custom values
    1. Classes can be used to define custom data structures, such as a datetime class. The classes are fundamentally just raw state, and are passed to stateless functions in their associated model for handle data transformation. Think adding a number of hours to a datetime.
    2. I like to think of these as akin to structs in elixir
2. Classes as stateful services
    1. Classes can be used to represent live, stateful services that interact with the outside work. A class representing a connection pool to a database for example. The class doesnt represent a data structure, it instead has methods for interacting with the service.
    2. These are more akin to genservers in elixir
  
I struggle to reconcile this mental model with dependency injection. For example, say you want to build an http client for some 3rd party API. Each request is effectful, so you’d probably want to inject the underlying http client so that u can use a mock when testing. However, each request is fundamentally a one-off and independent of each other, implying that a stateful class is unnecessary. Aside from the dependency, the client isn’t maintaining any state like a connection or anything. Moreover, while this dependency needs to be decided at runtime, it’s basically static and unchaning for the lifetime of the program.
Perhaps the solution is to invert the dependency relationship? So instead of our client needing an http client, our client returns some sort of data structure that an http client can then use?
This is a great idea, but runs into the problem that you cant use the result of an effect further in the function.
An aside, generator functions enable this out-and-in context switching, but has its own problems, namely an inability to be typed and using concurrency controls for code organization
Perhaps the solution is to loosen my idea that a class is either a value or a living service? Instead, a class is either a value, or an effect handler?
## Good testing vs Good Refactoring / Testing Layers
Full API-level tests are unavoidable. You simply must write them to be confident your application fulfills all the features you need it to have.
Any test below this level is to some degree redundant. The advantage of it is that it enables specificity. If the match calculator is broken for example, you will probably catch it at the app level but it will be really difficult to identify where the source of the issue is. But if you also have also have a bundle of tests for the match calculator, you will more immediately notice the bug. So it requires nuance.
Functional core imperative shell also helps the process of identifying where issues occur when they do. If all your effects happen at the beginning and end of execution, its very easy to go in and attempt to recreate the issue in a pure context. Pure modules are significantly easier to debug because they are context independent, and can be run even in a small script provided they have the right input
  
## Effectful code in Python
In Python, effectful pipelines are built via standard operations and exceptions  
standard operations define the happy path, and exceptions define the various failure paths.  
---
So I suppose my problem is, if I have an effectful function with a large surface area of results,  
(particularly failures), how do I adequately test them?  
I acknowledge that at the top level I will have to do some integration tests, where I mock  
out the effectful dependencies, but the number of tests I need to perform is the number  
of results that are possible.  
Case in point the example below:  
I run 2 queries, each of which can succeed or fail in 2 different ways  
I perform a data transformation, which creates 1 result  
This results in (1 success case) + (4 failure cases) = 5 integration tests
The question is whether (1) the number of tests can be reduced or (2) the logic  
involved in each test can be simplified  
(1) I don't think the number of tests can be reduced. Each test describes an  
observable output of the system, so we need to create a test to make sure that  
output always occurs when it should. What I do find interesting is that the 4  
failure types are condensed into 1 failure type in the root function. So in  
theory you'd think it's only 2 integration tests, but we still need to assert  
that the failure output occurs  
_for the right reasons_. Or perhaps a better way  
of saying it is, I need to assert that my function indeed only has those 2 outputs.  
If there was a bug in the workspace request code for example, it could cause the  
underlying exception to bubble up, breaking the 2-output contract. But I could  
also handle error-condensing in a standardized way, removing my need to test it  
in every situation. Since my client code is wrapped in the Slack "platform", I  
could just let exceptions happen at the root level and let the platform convert them  
to the correct type. That being said, I don't think this situation works for me in  
this  
_particular_ case. I'm not just condensing a bundle of exceptions into 1, I'm  
intentionally catching and translating the exception into one I want. Each exception  
has a different message attached, which I think is a different and significant observed  
result of the function. So I suppose what I'm grappling with is: If the function only  
outputs 2 types, why do I need to test 4 different ways of getting the failure type and  
only 1 way of getting the success type? Well I suppose what I'm testing for is that the  
conversion happens as intended. I suppose in a purer environment I couldn't just have a  
catch-all-and-convert step in the wrapper program. I would need each possibly returned  
data structure to implement some "convert" protocol, so the automator would know how to  
go from the given type to the desired one. That logic could probably be tested in a pure  
way, but does that still leave the issue that the function needs to be tested in 5  
different ways? Well yes and no I think. It is true that the function returns 5 different  
significant values, BUT it can be  
_masked_ as 2 different significant values, say Form and  
BotErrorable. The trick is that in reality the error type is an exception, so normal  
protocol rules may not apply  
(2) The complexity of each test depends on how much state needs to be setup in order to run it.  
In the past I've been a big proponent of "consumer-only" interaction tests. For example, if  
I'm testing that an API can get a user, I don't go into the database and manually add the  
user row. Instead, I call another API request to set the user, and then call the get API  
call. This treats the system under test as a black box "service", meaning it maintains  
its own internal state that is inaccessible to me except through it's provided methods. I  
think this is a good way of testing effectful code, but the tradeoff is that it can lead  
to a TON of setup code. Checkmate is a good example of this. The way that we reduce setup  
is by trying to figure out the minimal amount of work necessary to trigger the result we  
are interested in verifying, without concern for how it got that result. For example, in  
Checkmate there is a lot that goes on under the hood between when a profile is freshly  
created and when they finish onboarding. We could assert that a profile has the same first  
name as the one we gave it immediately after the profile is created, or after they finish  
onboarding, or both. Doing both would be more thorough, but that's a slippery slope, because  
it's impossible to know from the outside looking in which actions would warrant checking  
the same state again. I think the goal should be to test with the minimal amount of steps  
necessary to assert that a function can perform all the behaviors we care about. Hmm, that's  
an interesting thought. When thinking in terms of behaviors, I think I take the perspective  
that I don't know how a system works, I only know how to interact with it. I'm asserting  
that, whatever data structure is in there, that it at least fulfils the protocol I need it  
for. It is inherently stateful in that sense. You know what this makes me think about is  
testing redundancy. The main reason I want to refactor code into purer, simpler logic is  
that it allows me to test a variety of inputs in a much more isolated environment, as opposed  
to needing to test all possible business rules through the root public API. In theory,  
assuming you mock minimal dependencies well you can just test everything through the  
root, but it's a nightmare as your app gets more complex. So where do you draw the line?  
Honestly it may just not be reasonable to know. Integration tests are sorta by definition  
redundant if you really think about it, since they test multiple pieces working together.  
A good case study to think about in this regard is how to test the connection manager for  
Cupid, if the external API is just the Checkmate API. My gut instinct is to test all the  
connection logic as close to the core data structures as possible, since that logic is  
really complicated. But if I had a fully unit-tested connection module, would that mean  
I shouldn't need to test any connection-affecting flows at the API level? I honestly feel  
like I still should, but that's agonizing to do due to the aforementioned setup complexity.  
The ONLY step I could see to reducing complexity would be to "spill the guts" of the apps  
internal state, so that every API-level test was just a direct input-output translation.  
But even then I still feel like I would like to test every connection rule twice right?  
```Plain
Another thing to think about is code that I explicitly don't test because I trust that it
works. For example, I don't test things internal to Postgrex in Checkmate. I only test flows
that would have a user-noticeable affect. An interesting thing this makes me think about
though is like, if there's 100s of different ways for you to connect with someone, what's
the difference if the result is the same? Maybe I don't need to encode full user-flows as
tests, I just need to create a single test for each _type_ of result I want? I suppose
the catch is that there are some flows that are inherently stateful that I can't avoid. For
example, in Checkmate I can have no match by setting a gender preference to one that matches
none of my friends genders, or by just opting out of matching. Both of those options lead
to the same underlying result, but I need to ensure both paths lead to that result. It's
not enough to just say that I can get unmatched, I need to ensure that both operations
result in the same state
```
Something I keep coming back to is how Elm both does and doesn't conform to the Functional Core  
Imperative Shell model. It doesn't in the sense that an HTTP request must be encoded and given  
to the runtime before it's results can be async handled. But it does in the sense that you  
can compose effects and logic into a single task that executes in a single step. I suppose at  
the end of the day it is just a data structure though, where the former has a smaller result  
surface area than the latter