class Element extends HTMLElement {
  listeners = []

  connectedCallback() {
    const items = this.querySelectorAll("*")

    for (const item of items) {
      for (const attr of item.attributes) {
        if (attr.name.startsWith("x-on:")) {
          const [_, event] = attr.name.split(":")
          item.addEventListener(event, () => this[attr.value]())
          this.listeners.push([item, event])
        }
      }
    }

    this.ready()
  }

  disconnectedCallback() {
    for (const [element, eventName] of this.listeners) {
      element.removeEventListener(eventName)
    }
  }
}

class NavItem extends Element {
  static {
    customElements.define("x-nav-item", this)
  }

  #triggerBtn = null
  #barDiv = null

  ready() {
    this.#triggerBtn = this.querySelector("button")
    this.#barDiv = this.querySelector("div")
  }

  activated() {
    this.#triggerBtn.style.opacity = 1
    this.#barDiv.style.width = '48px'
  }

  deactivated() {
    this.#triggerBtn.style.opacity = 0.5
    this.#barDiv.style.width = '24px'
  }
}
