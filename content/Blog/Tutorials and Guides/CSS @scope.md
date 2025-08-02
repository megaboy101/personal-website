---
Owner: Jacob Bleser
Created time: 2024-02-19T22:42
Development: Budding
Lifespan: Evergreen
Type: Guide
---
# Introduction
CSS @scope is a new at-rule for natively handling “scope” in CSS
True to its name, it allows you to scope, or limit the reach of your selectors to specific html regions. The idea is that this lets you express ownership of styles that span multiple elements.
This has been a long requested CSS feature, and tool like CSS Modules exist specifically for this feature alone. With @scope, you can now do this in native CSS with no tooling
# How it compares to Shadow DOM
Shadow DOM and CSS shadow parts fill a similar niche as @scope, and there is a degree of overlap. But there are some distinctions to keep in mind.
Shadow DOM, and by consequence shadow parts, require runtime javascript or declarative shadow DOM to function. This may not be desirable in all environments for a number of reasons. Most notably, shadow DOM has some accessibility concerns, and you may not want a JS requirement for something that only involves styling
Scope may also be desirable in environments where you don’t have control of shadow DOM elements, such as in some design systems that are pre-styled.
Ultimately, shadow DOM/parts are ideal for UI elements that span multiple elements but are designed to function in a consistent, generalized, lockstep fashion. The best example is a modal. There may be an root element, an element to wrap the trigger button, and elements for the backdrop and modal container. Each element can be independently styled via parts, and be orchestrated consistently behind the schemes via custom elements.
# When to use @scope
The killer feature of @scope is that it allows us to natively express application-specific _contextual_ style decisions, similar to what you’d expect in CSS modules or SFCs.
A good example is the navigation bar for a website. Typically, a navigation will have a logo all the way to the left, and a series of links on the far right. More than likely, these links will use a text size, weight, color, and font inline with the sites design system. These styles are standardized, and common to many other elements on the site. There is nothing context specific here.
But, you may want a specific style for when the link matches the current page, or when a link is hovered. These styles are contextual, we don’t want all links to hover like this, just links _in the scope of the navbar._
Granted, you could also solve this via a utility class, something like `hover:color-bright`.
But, what gives scope a little bit more power is that you can control the styles of _multiple_ elements within a single scope. Perhaps, when you hover over one link, all the other links will dim themselves to make it easier to see your selection?
# Recommendations for usage
1. When you want to create a scope, you should define it like this:
```css
@scope ([data-scope="navbar"]) to ([data-scope]) {
	...styles...
}
```
```html
<nav data-scope="navbar">
	...elements...
</nav>
```
- Define the root of your scope with `data-scope="my-scope".` This is a simple convention that makes it clear in your html that this is the start of some scoped styles.
- Define the inner boundary of your scope to be _any_ `data-scope` attribute found. This prevents outer scopes from affecting inner scopes, and ensures you only have at most one scope affecting an element at a time, which is a generally good idea