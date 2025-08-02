---
Owner: Jacob Bleser
Created time: 2021-08-09T14:55
Development: Seed
Lifespan: Evergreen
Type: Opinion
---
Some people say integration tests and unit tests, ive found that that isnt really a good name because it doesnt well convey what im using them for. I prefer specs and tests. Specs are less about verifying correctness of code, and moreso about documenting and keeping track of product features. This enables you to change code internals while knowing if it breaks or conflicts with the previous features you wrote. Tests are about automated debugging, and are the first line of defense. If something in my app is broken, and i have a rough idea of what systems it might be affecting, i can run the test suite on that section of code to start weeding out potential root causes of the issue.  
In a perfect world specs could be used as a source of documentation, or a way to generate documentation, but that may be a pipe dream.  
Debuggable code is very easy to isolate. Code is easy to isolate when it runs no effects whatsoever, or if it does it only does one, and the effect is the focus of the code
Debuggable code is very transparent. You can know what data is in the system when it fails, so its easy to reproduce later
Debuggable code has easy to understand intent. You can easily build an intuition about how a piece of code should work, so you can quickly discern why the code is deviating from how its intended to function. Related, theres a lot of internet discourse about how to document code, and how it should convey why the code is there, not what it does. (1) if you feel the need to convey what a piece of code does, its a good sign you need to refactor the code, usually but not always by just puting the weird logic in an isolated function with a good name. (2) i think what should be commented is intent; what are you trying to do here. Note, this is different from docstrings or the like, which help consumers understand what a piece of code does. Comments discuss internals
Debuggable code is consolidated. You can see an entire stack of functionality from a single file or folder, and dont have to jump around and understand how a whole bunch of unrelated systems work in order to understand how the faulty system works
Isolate  
Expose  
Consolidate  
Document