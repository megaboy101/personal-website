# Custom elements

- Don't use `is`, it looks cool but it's not supported in
  safari and is sorta an anti-pattern

- Custom elements are inline divs, so they do affect layout
  even if you don't want them to. This means it really doesn't
  make sense to have "controller" elements that just add behavior
  to the element directly within it. This means I can't to element
  "scripts" like I was thinking with Godot

- Classes should not be used for finding elements to add behavior to,
  you really should be using custom elements.

- It feels like custom elements really aren't ideal for like state
  management. They can manage internal state pretty well, but
  trying to get them to interact with other elements, even through
  events, is kinda garbage. Like they aren't ethereal controllers
  you can just attach to elements, they're real things on the page.
  PSYCH this is actually possible with `display: contents`

- I think a good model to fall back on is "what would HTML do". If
  there isn't some HTML precedent for what I'm trying to do, more
  than likely I'm tackling the problem wrong.
  A good example of this is with state management. There are basically like 2 or 3 HTML elements I can think of that manage
  client side state, <form> and <select>, and both of them have a
  custom DSL of sub-elements that they manage. Like <form> has label
  and all that, and <select> has option. Additionally, pretty much
  all that state is managed internally, although you can plug in
  JS to fetch it out.

- I should do more research on state management in vanilla JS,
  especially outside web components. Alpine is a good and minimal
  place to start, but I wanna do a more platform friendly approach
  if I can get away with it.
  One thing that is really nice about Alpine is that it's really
  easy to do localized state management. I don't need to have
  some external JS file that needs to find the local elements it
  wants, and then do the local. It's much more portable.

- One approach to state management for localized state is "manager"
  elements. These are elements that have no visual component
  (basically just rendering their children), but do logical data
  management. I am exceptionally mixed on this approach. On one hand,
  this sorta matches the approach by Godot, or "container" elements
  in react. On the other hand, I feel like this isn't really what
  custom elements are designed for, and this approach is kinda a 
  hack. Like I think if I made a ton of manager elements like this 
  I'd build an exceptionally deep DOM interface. Moreover, its not
  very declarative at all, and my soul is telling me that being
  more declarative is the way. One of the nice parts of Alpine is 
  that every action is very nicely declarative. Maybe I can create 
  something similar

- So it looks like it's very possible to make "smart" components
  that are just managers of their children's state. Instead of
  calling them managers I've been using the convention to just
  call them whatever their associated component is called which seems
  to work pretty well. The fact that the elements are real DOM nodes
  isn't perfect, but it definitely isn't a dealbreaker or anything.
  So in the end I would consider vanilla JS manager components 
  doable in the Godot style.

- So with this base 
