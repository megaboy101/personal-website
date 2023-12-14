import { signal, effect, defineElement } from '/elements/smol.js'

/**
 * Can this problem be broken into 2 sub-problems?
 * - Selection state: A controller that keep track
 *   of the currently selected element, and triggers
 *   an event when there is a change
 * - Class applier. A function that adds or removes
 *   a class from an element given some event condition
 * 
 * Really like the idea of focusing more on state than
 * imperative element manipulation if I can get away
 * with it. Signals makes this really nice too.
 * 
 * Would it be possible to do this with functions instead
 * of classes?
 */

function injectTransitionStyle(element, target) {
  const uuid = crypto.randomUUID().slice(0, 6);
  element.setAttribute("data-transition-id", uuid)

  // Build and attach stylesheet
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(`
    [data-transition-id="${uuid}"] ${target} {
      transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
  `)

  document.adoptedStyleSheets.push(sheet);
}

function ClassGroup({ target, active: activeClasses }) {
  const elements = this.selectAll(target.value)
  const defaultElement = this.select('[cg-default]')
  const active = signal(defaultElement)
  const activeClassList = activeClasses.value.split(" ")

  injectTransitionStyle(this, target.value)

  this.onEvent(elements, "mouseenter", (event) => {
    active.value = event.target
  })

  this.onEvent(elements, "mouseleave", (event) => {
    active.value = defaultElement
  })

  effect(() => {
    for (const element of elements) {
      if (element === active.value) {
        element.classList.add(activeClassList)
      } else {
        element.classList.remove(activeClassList)
      }
    }
  })
}

defineElement("class-group", ClassGroup)
