class ClassGroup extends HTMLElement {
  // static {
  //   customElements.define("class-group", this)
  // }

  connectedCallback() {
    this.trigger = this.getAttribute("trigger");
    this.targetSelector = this.getAttribute("target")
    this.activeClasses = this.getAttribute("active").split(" ");
    this.elements = this.querySelectorAll(this.targetSelector)
    this.defaultElement = this.querySelector("[cg-default]")
    
    const uuid = crypto.randomUUID().slice(0, 6);
    this.setAttribute("data-transition-id", uuid)

    // Build and attach stylesheet
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
      [data-transition-id="${uuid}"] ${this.targetSelector} {
        transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      }
    `)

    document.adoptedStyleSheets.push(sheet);

    for (const element of this.elements) {
      element.addEventListener("mouseenter", this)
      element.addEventListener("mouseleave", this)
    }
  }

  disconnectedCallback() {
    for (const element of this.elements) {
      element.removeEventListener("mouseenter", this)
      element.addEventListener("mouseleave", this)
    }
  }

  handleEvent(event) {
    this[`on${event.type}`](event)
  }

  onmouseenter(event) {
    event.target.classList.add(this.activeClasses)

    for (const element of this.elements) {
      if (element !== event.target) {
        element.classList.remove(this.activeClasses)
      }
    }
  }

  onmouseleave(event) {
    event.target.classList.remove(this.activeClasses)

    // Reset to default if there is one
    if (this.defaultElement) {
      this.defaultElement.classList.add(this.activeClasses)
    }
  }
}