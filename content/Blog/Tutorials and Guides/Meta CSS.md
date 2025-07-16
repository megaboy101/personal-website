---
Owner: Jacob Bleser
Created time: 2024-01-22T17:32
Development: dead
Lifespan: Seasonal
Type: Guide
---
I’ve been doing a lot of experimentation lately on **design engineering**, and specifically how to better leverage CSS.
This started when I was working on rebuilding my personal site, and I wanted to drastically cut back on the degree of build tools I was using, and try and see how far I could get with just modern vanilla CSS.
As it turns out, you can get pretty far these days. CSS custom properties and nesting in particular were the single golden features that allowed me to finally, completely move on from SASS.
At first things were great. I followed all the CSS methodologies and techniques I had learned over the years:
- A modern `reset.css` file to provide a solid cross-browser foundation for my styling.
- A `tokens.css` file with custom properties for all my relevant design constraints, such as standardized `spacing` and `type scaling`.
- A `layout.css` to keep my re-usable, fluid layout classes like `row`, `column`, and `screen`. These could be configured with my design tokens to apply standard spacing rules.
- A `typography.css` file to store my preset `fonts`, `type scale`, and `weights`.
- An `elements.css` file for storing all my html element-specific styles and variants.
- A `layers.css` file for organizing everything together into an easy-to-understand cascade hierarchy.
All of this was informed from my years of experience writing CSS, and some wisdom I’d collected recently such as Every Layout, CUBE CSS.
I was having a good time writing good old-fashioned CSS files for a change, and not having to worry about weird issues or complexities with tailwind, PostCSS, SASS, or CSS-in-JS was a nice relaxing change.
But then things started to get… painful.
# The problems with “traditional” CSS
Much of what I rediscovered about CSS while rebuilding my personal blog was what Adam Wathan, the creator of Tailwind CSS, also [realized as far back as 2017](https://adamwathan.me/css-utility-classes-and-separation-of-concerns/).
In a nutshell, when writing CSS in the traditional way (that is, using class names with a whole bunch of rules attached), you end up in a situation where your style declarations are heavily coupled and dependent on the **structure** of your HTML. If you move tags around, you have to restructure your styles as well, which makes them very brittle as well as just plain annoying to work with.
This also creates a bit of a readability issue in practice. For example, if you see `<div class=”card”>…</div>`, it’s not clear at a glance what styles this `div` actually has. If the image within the card is for some reason to the left of the text instead of above, you first need to find the `card` class in an external stylesheet, then find the `.card—img` class somewhere nearby, then fix the issue, then jump back into your html.
Additionally, by attaching an arbitrarily large chunk of styling rules to a single selector (usually a class), over time you slowly start to accumulate a lot of style declarations that are 80%-90% similar, just with a couple alterations to fit a specific use case. Over time this can result some really large, complicated stylesheets.
# Tooling-oriented CSS
**If you’re already familiar with the CSS state of the art (SASS, Modules, CSS-in-JS, Tailwind), feel free to skip this section.**
To address the problems I’ve outlined above, a number of CSS **tools** have developed over the years to sort of smooth out these problems. I’d like to give a bit of a summary of some of the more recent ones here, because I personally think that tooling alone is not the solution some claim it to be.
Today there are I think 2 popular approaches to writing what I call would structured CSS: **localized css** and **utility css**.
## Localized CSS
Localized CSS, exemplified by CSS modules, is an attempt to solve the exponential complexity problem. You colocate your style rules and declarations as close to it’s use-case as possible. usually with a colocated `*.module.css` file or even better as an embedded `<style scoped>` tag, such as the way Astro does it.
This removes a lot of the mental overhead of having to mentally map some html to it’s far off class definition, as well as removes the possibility of accidentally creating naming clashes with classes. Additionally, because everything is colocated, you can very easily update your CSS rules and HTML tags in tandem in smaller, more digestible chunks.
Best of all, you get to continue writing familiar, plain old CSS, with all the power of media queries, custom properties, pseudo-selectors, etc.
This approach does have some trade-offs though. Having the full power of CSS can sometimes be a double edged sword, particularly if you’re on a large team and/or don’t use custom properties to limit what visual styles are allowed. You can still run into the problem of writing a `row` class 20 different times and 20 different ways.
Additionally, jumping between `css` and `js` files can be annoying for some developers, myself included.
### CSS-in-JS
Today CSS-in-JS is many things, but I would argue it originally grew in popularity by following the same overarching spirit of localized CSS. CSS-in-JS at it’s core lets you put your style declarations in your JS files, usually alongside your JSX components.
This removes the annoyance of having to jump back and forth between `css` and `js` files, at the cost of slightly more verbose style declarations. I think this is why CSS-in-JS is arguably more popular in the JSX community.
## Utility CSS
Utility CSS, by contrast, is an attempt to decouple your HTML from it’s CSS by creating reusable style primitives; such as standard spacing increments, font sizes, or colors.
How many utilities you create and how granular you make them is a matter of preference. Some may choose to just hand-write classes for common layouts, such as a flexbox that’s always a row with no wrapping and evenly spaced children.
More often though, you’ll typically see tools designed for **generating** utility classes. This is because you typically want a _lot_ of classes. At a minimum you’ll usually want a class for every notable piece of your design system, like a class for every color in your palette (in both light and dark versions, of course).
The most extreme version of this are utility **frameworks** like Tailwind, which generate utility classes for just about every CSS property in existence and then some.
The advantage of this is that by consolidating common patterns into small, single-purpose classes; you can better encourage style reuse and consistency. This can further lead to overall smaller stylesheets as well as avoid the dreaded “append only stylesheet” problem.
Additionally, being able to write _all_ (or nearly all) of your styles via classes, as is the case with tailwind, is a really fluid DX in some contexts, particularly for JSX, or when doing any sort of UI prototyping.

> As an aside, something I find really interesting about this is that it’s effectively saying that part of the solution to complex CSS is simply being better at visual design. Conversely, it also implicitly pushes our web design to be more formulaic, because non-formulaic designs are harder to build and maintain; which is some interesting food for thought.
## Where tools fall short
I’ve used both CSS modules and tailwind quite a bit over the years for both personal and production work. Both of them are solid solutions to a tricky problem, and I’m not about to tell you not to try them or continue using them.
However, I didn’t feel comfortable using either of these solutions for my personal site.
CSS Modules is used extensively at my day job at Discord. It’s good for what it does, but I personally find the DX a bit lacking for a number of reasons:
1. It’s really easy to break established styling norms. Sure you _could_ use `—-bg-green` for that button, but you could also not. Code review will usually catch this kind of thing, but not always; and across dozens of teams and nearly a decade of growth, eventually you wind up with a loosely held style _guideline_ rather than _system_, which isn’t what I want. You could argue this isn’t really a problem for a single developer or small team; but I’ve been writing software long enough at this point to know that I don’t want to have to rely on **trusting** my past or future self.
2. JSX is my preferred templating language of choice, and jumping back and forth between CSS and JS just isn’t an ideal experience. I’m also just personally not a fan of having the `button.jsx` and `button.module.css` file duality for nearly every file.
I personally really like tailwind and use it a lot when UI doodling or prototyping, but I knew going in that I didn’t want have to deal with it’s rougher edges:
1. I’m not sure where I saw it first, but a good way to describe tailwind is that it makes the easy things easier and the hard things harder. Writing complex layouts like grids in particular can be really verbose and esoteric to understand. Same thing with complex animations or container queries; you can definitely do it, it just takes a bit of reading and syntax googling to do so.
2. Tailwind is a relatively thick tool these days. Getting it setup requires setting up a PostCSS toolchain, installing any plugins you may want, removing the utilities you don’t want and extending the one you do. To their credit I think the Tailwind team has done an incredible job at making their install and maintenance process relatively painless, but I’m not making a long-term multi-engineer SaaS app, I’m just making a personal site.
## Do we even need tooling?
Something to note about both of these approaches is that just about all of it requires some form of a build tool. CSS modules requires a bundler to combine all those one-off module files together. Tailwind needs a toolchain to generate all those utility classes, as well as remove the ones you aren’t needing, lest you wind up with a stylesheet with it’s own gravitational field.
I’m personally not inherently against build tools, but I find it odd that even in 2024 we still need one to organize even moderately scoped projects; and I had just hopped off the SCSS train.
I wanted to see if I could apply some first-principles thinking and create an approach for CSS that encapsulates the essence of the above approaches, but doesn’t require all the tooling.
# Principle-Oriented CSS
For just as long as there has been CSS tooling, there have been so-called CSS “methodologies”.
The earliest one I know of is Object-Oriented CSS, written as far back as 2009 ([this slide deck](https://www.slideshare.net/stubbornella/object-oriented-css) is the closest thing I could find to the original source). I would actually highly recommend looking through the deck. A lot of what it talks about is still strikingly relevant over a decade later.
  
  
  
In particular, I like that it is significantly more founded in first principles thinking about how to express visual design through code, than on-the-ground prescriptions about how to write CSS.
In the years following OOCSS there has been a progressive evolution of increasingly more prescriptive CSS methodologies, including but not limited to:
1. [Scalable and Modular Architecture for CSS](https://smacss.com/) (SMACSS)
2. [Block Element Modifier](https://getbem.com/introduction/) (BEMCSS)
3. [CUBE CSS](https://cube.fyi/)
  
I think all of this wisdom is good, and I think CUBE CSS in particular is pretty spot on in it’s thinking about how to organize CSS for easy use.
But I can’t help but feel as though all of this is attempting to solve a surface level problem, lots of CSS selectors, rather than tackle what I would consider a more foundational challenge, that is:
**How do I express my visual language in code?**
(^ I’m not sure if I’m wording the the thesis here perfectly, but it captures to me the essence of what “meta css” is about. It’s a methodology about building a meta language for your visual design. Tooling that can enable that meta language is helpful, but not required)
  
This is what led me to CUBE CSS, a _“methodology that’s orientated towards simplicity, pragmatism and consistency. It’s designed to work with the medium that you’re working in—often the browser—rather than_ against _it.”_ Cube CSS stresses leveraging modern CSS, and modern design thinking, to create a stylesheet authoring approach that is easy to read and iterate on over time.
I won’t go into the details of CUBE CSS here, the website gives a great breakdown. What I will do is briefly breakdown my experience with using it, where I think it shines, and where I felt it was lacking.
## The Good
Talk about the good
## The bad
Talk about the bad, namely the growing problem of some stuff being in utilities, some stuff being in external stylesheets.
# First Principles of Visual Design
Talk about the bigger picture, of what you’re really trying to even do here: express visual design in code
## What is CSS, really?
Talk about how CSS is first and foremost a tool to describe visual design. Additionally, it’s important to remember that CSS was invented in the context of styling documents. While it has over time evolved and improved to fit expressing more complex interfaces, the fundamentals of the language are unchanged.
If CSS isn’t serving to well-express our visual design goals, the problem is the language, not us.
  
# Finally, Meta CSS
(from my notes)
Meta CSS is a new approach to thinking about visual design on the web. You could call it a CSS methodology, but the CSS part isn’t really what’s important. The underlying implementation could really be anything.
What’s more important, is that meta css is about **building a specialized language for describing your visual style**.
  
It splits your styling into 2 layers.
Layer 1 is implemented in css, and describes your utilities. Things like your spacing, layout systems, typography systems.
Layer 2 is what you as an engineer actually use day-to-day. Its high-level layouts, type scales, and colors.
This is sorta a mid-point between fully tailwind style utility classes, and fully css based styling.
It arises from the realization that working with utility classes is an inherently better developer experience for rapid iteration and building interfaces. But accepts that not all visual design can be succinctly expressed via utilities. Things like states, variants, media queries, and complex layouts like grid.
Instead, you build up a collection of utilities into a “meta” styling language that is flexible to you, and uses css and utility classes to their strengths
  
You could also think of Meta CSS as a tool for building rules, whereas CSS is a tool for building styles
  
  
  
  
  
  
  
As an alternative approach to this article, I could talk about my journey:
- Traditional css, big complexity explosion
- CSS modules, use them at work, but they don’t fundamentally solve the problem of css, just limit the blast radius. You still can create fat classes and random px rules. Also don’t like the dx of jumping back and forth between css and js files
- Tailwind. Really like it, but it makes the easy things easier and the hard things harder, such as media queries and complex layouts
- CUBE CSS, like it for the no build tool requirement, but don’t like the BEM approach of grouping things, and dont like having to hop back and forth between js and css to understand a visual design
  
Alternative titles,
- In search of better css
- Why css still isn’t good enough (yet)
- How I write css in 2024
- The journey to css zen