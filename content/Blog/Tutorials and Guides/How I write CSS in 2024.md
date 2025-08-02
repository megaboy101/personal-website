---
Owner: Jacob Bleser
Created time: 2024-01-10T16:00
Development: Budding
Lifespan: Seasonal
Type: Opinion
---
In 2024, I've developed an approach to CSS styling that I really enjoy, but also haven't seen done anywhere else.
It is built on the following principles
1. It's just CSS. No build tooling like SASS, or PostCSS required
2. It's modern CSS. It leverages modern CSS features like nesting, variables, and selectors such as `:has()` and `:where()`
3. It makes component-oriented design easy
4. It's built on general styling principles
The methodology is built in layers that I will explain below
# Preflight
This is your CSS reset, it ensures your styling expectations are consistent across browsers and devices.
If you have opinions on this, feel free to bring your own.
My preflight is a modified version of Tailwinds. It works for me.
# Tokens
Pretty self exclamatory.
You should create design tokens for every standardized aspect of your design system.
For me this is:
1. Color scale
    - One token for every shade of every color
2. Typography scale
    - One token for each font stack
    - One token for each individual font size and weight
3. Spacing scale
    - One token for each space. I use a 1-9 scale
# Elements
This is where the real meat starts.
CSS is really good at being able to assign complex styling rules to single selectable entities. But it has no real good approaches for styling compositions of entities.
CSS methodologies exist to create standardized ways to express composition, such as via class hierarchies in BEM, but they've always felt unnatural to me.
Instead, we are going to focus on styling single entities, and express composition differently.
For each individual element, we want to create a standard style.
In practice it looks like this:
```css
h1 {
  color: var(--color-text);
  font-family: var(--type-sans);
  font-size: var(--type-1);
  font-weight: bold;
}
p {
  color: var(--color-text);
  font-family: var(--type-sans);
  font-size: var(--type-5);
  font-weight: normal;
}
button {
  color: var(--color-text);
  font-family: var(--type-sans);
  font-size: var(--type-5);
  font-weight: normal;
  background: blue;
  border-radius: var(--radius);
}
```
We assign styles using _element_ selectors rather than _class_ selectors.
This is because we want to associate these styles with just this specific element, rather than say these are general styles that could be applied to multiple elements.
Its important that layout-related styles like flexbox, grid, padding, or margin, or typography-related styles like font, weight, or letter-spacing be excluded from these styles. Layout and typography are special cases that are handled a bit differently below.
# Variants
You may be wondering, if all we can use for styling are element selectors, how do we express _**variance**_, or different styles for the same element, such as different kinds of buttons or text or surfaces.
This is what variants are for. Variants are how you express a different styling of the same underlying element.
Say for example we want a `default` and `primary` button variant.
We can express this in CSS as follows:
```css
button {
  color: var(--color-text);
  font-family: var(--type-sans);
  font-size: var(--type-5);
  font-weight: normal;
  background: gray;
  border-radius: var(--radius);
  &[variant="primary"] {
    color: var(--color-text);
    font-family: var(--type-sans);
    font-size: var(--type-5);
    font-weight: normal;
    background: blue;
    border-radius: var(--radius);
  }
}
```
A few important things to note here:
1. We style are variants as a nested selector inside our button. This lets us nicely co-locate our variants, and express that they are variants on this specific core element.
2. We select our variant through an attribute selector on the `variant` attribute, rather than as a class. There are a couple reasons for this.
    1. An element should only have 1 variant at a time. You should not combine variants (for example, a primary variant and a large variant) like you would with classes.
    2. Keeping our styles associated with an attribute helps us grok it's purpose at a glance, rather than as simply one class among many.
3. We duplicate most of our styles across variants. This is because variants aren't so much "overrides" of the default style but rather completely different versions altogether. It's also difficult to read variants when they're just overrides. Lots of jumping up and down when reading styles
Most non-layout visual styles can just be expressed through elements and variants. There's one more layer here, and thats states
# States
States are how we express visual feedback in an element or variant.
Again using the example of a button, this would be how you style your hover state, or your pressed state, or your already-pressed state.
States are associated with an element, or a variant if it has any.
Here is how they are written:
```css
button {
  color: var(--color-text);
  font-family: var(--type-sans);
  font-size: var(--type-5);
  font-weight: normal;
  background: gray;
  border-radius: var(--radius);
  &[variant="primary"] {
    color: var(--color-text);
    font-family: var(--type-sans);
    font-size: var(--type-5);
    font-weight: normal;
    background: blue;
    border-radius: var(--radius);
    &:where(:hover, .hover) {
      background: lightblue;
    }
	&:where(.visited) {
      background: lightblue;
    }
  }
}
```
Unlike variants, states are written as overrides, and they are also selected by class and pseudo-class.
The reason we use both is because we often need to transition an element into a visual state programmatically with some custom JavaScript. Additionally, all visual states may not be representable by built-in pseudo-classes alone. For example, you may want to to create an `active` state for an `<a>` tag that colors the text differently when it's link is also the page we're currently on.
Using elements, variants, and states, we can represent all non-layout aspects of our visual design.
# Layout
Layout is expressed in a slightly different way to just about everything else in our system.
This is because layout isn't really owned by any particular kind of element, but rather is a universal system for how we express the relationship between elements. How an element interacts with its contents, and its siblings.
Because of this, we don't define layouts with any kind of target element in mind. We instead create simple, general purpose layout _presets_ we can compose together.
The simplest kind of layout is the `row`. It organizes a group of elements horizontally. You'd express this layout as follows:
```css
[layout="row"] {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  &[layout~="top"] {
    align-items: top;
  }
  &[layout~="bottom"] {
    align-items: bottom;
  }
  &[layout~="gap-auto"] {
    justify-content: space-between;
  }
}
```
Once again, we use attribute selectors rather than classes. This is mainly so we can colocate all layout-related styles together, and express that they are separate from the element-specific styles.
However, _unlike_ variants, we can have multiple names in the layout attribute, similar to classes.
The first selector above defines the "preset". The preset expresses the overall “setup” of the layout. Common examples may be `row`, `column`, `frame`, `masonry`, etc. Within that preset, we can override how it behaves by adding modifiers.
For example, adding the `top` modifier anchors all elements in the row to the top of the container.
You can add as many or as few modifiers to a preset as you'd like. You can also create as many presets as you'd like.
Moreover, you can be as particular as you'd like with layout presets. For example, you could have generic presets like `row`, `column`, or `center`; or more domain specific presets like `card`.
# Typography
Similar to layout, typography is a special system because it isn’t owned by any particular element. This is because on the web text elements like `<h1>` and `<p>` express relative semantic hierarchy in addition to just being containers for visual style.
For example, the landing page of a website may have an `<h1>` tag with the largest possible font size and weight to create emphasis. At the same time, a blog post on that website may use an `<h1>` tag to represent the title of the article, but may use a more relaxed font size and weight. Same underlying text hierarchy, but different visual styles for different contexts. It’s important to realize that this is completely normal and ok.
A common anti-pattern is to associate semantic hierarchy with visual style, and either create blog articles with `<h2>` title elements (which aren’t semantically correct and can harm accessibility); or create a “default” `<h1>` style but override it nearly everywhere (which carries a high maintenance and complexity burden); or just use the same `<h1>` style everywhere (which harms visual cohesion and polish).
Using a similar system as we do for layout, we express typography through presets and modifiers.
Here is an example:
```css
[text="heading"] {
	font-family: var(--text-sans);
	font-size: var(--text-size-2);
  font-weight: var(--text-weight-2);
	letter-spacing: var(--text-spacing-2);
	line-height: var(--text-line-height-2);
	&[text~="large"] {
		font-size: var(--text-size-1);
	  font-weight: var(--text-weight-1);
		letter-spacing: var(--text-spacing-1);
		line-height: var(--text-line-height-1);
	}
	&[text~="small"] {
		font-size: var(--text-size-3);
	  font-weight: var(--text-weight-3);
		letter-spacing: var(--text-spacing-3);
		line-height: var(--text-line-height-3);
	}
}
```
It’s important to note that we’re merely showing _how_ you could express a typography system through CSS. But this makes no opinions on what that system actually consists of. Feel free to use whatever typography system you want to match your design system.
If you’re in the market for a typography system, [Radix UI](https://www.radix-ui.com/themes/docs/theme/typography#type-scale) has a good system to get you started.
## Aside: A basic typography system
Typography is a deceptively complex and nuanced subject, but is also a critical component to get right in a design system. How you choose to size, weight, and space your headers and paragraphs can single-handedly define the vibe of your websites.
To that end, here is a basic typography system you can use in your work to get going, along with some explanations for _why_ it’s organized the way that it is.
It’s important to note that this system is deliberately opinionated. The structure you see below is not **_the way_**, just **_a way_**.
### Font family
You typically want one or two fonts; a neutral interface font and an optional brand/display font for added impact. If you’re going to be displaying code, you will also want a monospace font.
The interface font will be your true workhorse. Everything from buttons, labels, tabs, and body/header text will utilize this font. This font should not be flashly, but rather subtle; such that it is legible in a variety of contexts.
Your operating system more than likely already has a versatile enough interface font built-in. For example, SF Pro on Mac, or Roboto on Android. These font’s are designed to look good on virtually all screen sizes and types; support many font weights and styles; and support a large number of languages. In CSS, you can use the special `system-ui` font to let the operating system use it’s default interface font.
You can get pretty far with using just the built-in font, and I would encourage you to try them first before reaching for an external font.
That being said, there are some community made interface fonts you may want to look into:
- [**Inter**](https://rsms.me/inter/) - A very versatile, general-purpose interface font. This font is designed to look good at many sizes, and on many devices; making it useful as a consistent, cross-platform web font.
- [**Geist**](https://vercel.com/font) - A font from Vercel, designed specifically for web interfaces
### Type Scale, tracking, and leading
A _[type scale](https://fonts.google.com/knowledge/glossary/scale)_ is how you decide what sizes of text you can display on screen, and more importantly, what sizes you can _**not**_ display. Text scale has a natural rhythm to it, just like music. It’s important that you display text in a way that feels natural to read, and fits the structure of it’s surroundings. Otherwise, you can create a page that feels very off-kilter in difficult to express ways.
Tracking (AKA `letter-spacing`) complements a type scale by making text tighter or looser depending on size. Usually, you want tighter letters for bigger text, and looser letters for smaller text.
Leading (AKA `line-height`) determines the spacing between multiple lines of body text. You generally want more space between lines for smaller text. Additionally, you typically want more space between paragraphs than you do between individual lines.
Building a type scale from scratch is tricky and requires a sharp eye. Generally, it’s a good idea to follow the scaling guidelines a particular font recommends, if they exist; and then pick out a subset of sizes for your use case.
If your font of choice does not provide any scaling recommendations, or you’d like to make one yourself, here’s a general guide:
1. Pick a definite **base size** for your font, usually the size you want for your body text. `16px` is a good starting point. `15px` and `14px` are also acceptable (but remember to experiment before deviating).
2. Pick a scaling **ratio**, which tells us how to scale up or down our base size at various steps. I don’t recommended you pick a ratio at random, but instead base yours off one of the [well-known](https://designcode.io/typographic-scales) ones. For example, Radix UI and Google’s Material Design are both based off the [Major Second Scale](https://m3.material.io/styles/typography/type-scale-tokens#2a57c8f0-d45b-470a-984f-eb4f89f425fa), which I also recommend as a good starting point. [Typescale](https://typescale.com/) is a neat tool for visualizing different ratios and scales.
3. Pick a set of sizes along the scale. 6-9 sizes is a good range to start; 3-4 general text sizes for badges, labels, tabs, buttons, and copywriting; and 3-4 larger heading sizes for small, medium, large, and title headings. You may also want 1-2 very large display size for landing page banners for front-page news. It may be tempting to pick a lot, but more sizes leads to more ambiguity on when to use which size, and consistency is more important than variety.
This is as much art as it is science, any there isn’t really an objectively correct type scale.
Here is a general scale that I like, again based off the Major Second Scale. It features 4 base text sizes, a base 16px size with 2 smaller label sizes and 1 larger body copy size; 4 heading sizes, for 3 levels of heading hierarchy + 1 title size (I personally prefer a 3-header constraint when writing), a
- **Text** - Base interface text scale
    
    |   |   |   |   |   |
    |---|---|---|---|---|
    |**Type**|Mini  <br>  <br>==Very small text like badges, small labels, and copyright notices==|Small  <br>  <br>==Primary used for labels, small buttons, or body subtext==|Normal  <br>  <br>==Base text size, primarily for copywriting==|Large  <br>  <br>==Extra large text for large banner/landing copy==|
    |**Size**|`0.75rem`|`0.875rem`|`1rem (16px)`|`1.125rem`|
    |**Letter-Spacing**|`0.0025em`|`0em`|`0em`|`0.0025em`|
    |**Line-height**|`1rem`|`1.25rem`|`1.5rem`|`1.625rem`|
    
- **Heading** - Large text designed for naming groups
    
    |   |   |   |   |   |
    |---|---|---|---|---|
    |**Type**|Mini  <br>  <br>==Tertiary headers.==|Small  <br>  <br>==Secondary headers==|Normal  <br>  <br>==Base header size==|Large  <br>  <br>==Page titles or landing page headers, pairs well with large text==|
    |**Size**|`1.25rem`|`1.5rem`|`1.75rem`|`2.1875rem`|
    |**Letter-Spacing**|`-0.005em`|`-0.00625em`|`-0.0075em`|`-0.01em`|
    |**Line-height**|`1.75rem`|`1.865rem`|`2.25`|`2.5rem`|
    
- **Display** - Extra large text for landing pages and special impact
    
    |   |   |   |
    |---|---|---|
    |**Type**|Normal  <br>  <br>==Designed for page titles or landing page headers, pairs well with large text==|Large  <br>  <br>==Designed for banner text==|
    |**Size**|`2.1875rem`|`3.75rem`|
    |**Letter-Spacing**|`-0.01em`|`-0.025em`|
    |**Line-height**|`2.5rem`|`3.75rem`|
    
### Font Weight
Weight has 2 main uses:
1. It is used to give added emphasis for larger text, such as headings
2. It is used to give added emphasis to body text
To that end, you can usually get by with just the following font weights:
- **Normal / 400** - Your base weight
- **Medium / 500** - For more emphasized headings
- **Bold / 700** - For emphasizing inline text
  
# Summary
And that's it!
With just tokens, elements, variants, states, and layout; you have all the foundation you need to express whatever styles you want on the web.