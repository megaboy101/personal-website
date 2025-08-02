---
Owner: Jacob Bleser
Created time: 2021-08-09T14:55
Development: Seed
Lifespan: Seasonal
Type: Opinion
---
- If Rust has taught me anything about language design, it’s that trying to create the “best” syntax for everything, results in programs that don’t use the best syntax for anything. It just makes programs hard to read, and even harder to write well
- Rust’s solution to the most complex language programming language in wide use today (C++) is to create the second most complex programming language in wide use today.
- Macro’s aren’t the answer either. The problem with macro’s, regardless of how elegantly well a language chooses the implement them (and some definitely do), is that they’re typically only well understood by the person that wrote them, leaving the rest of us to dig into docs and articles in an attempt to intuit just what voodoo this code is actually doing. This is especially difficult for new programmers to a language. Not only must they learn the ins and outs of a languages existing syntax, they must also try to wrap their heads around all the ways its being extended
- Of course there are very good reasons for more syntax, namely specificity, and readability.
- Specificity lets you be more exact on what exactly you want a computer to do, which is often important in situations like systems programming where you often want a high degree of control over memory layout and CPU instructions. A good example of this is the dyn vs impl keywords in Rust. They both fulfil the same purpose conceptually, but have different practical performance implications.
- Readability is more broad. Sometimes syntax is added so that a particular data structure is easier to express. A good example of this is JSX, which makes it easier to read html than the equivalent representation as JavaScript objects and function calls. Syntax can also be added to make algorithms easier to read as well. For example, in Python you can write a for loop, or you can create a list comprehension.