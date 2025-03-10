customElements.define('cursor-tracker', class extends HTMLElement {
  #strength = 0;

  connectedCallback() {
    this.observeStrength()
    this.observeCursor()
  }

  observeStrength() {
    // Load strength on connect, for when moving
    // between pages since Turbo won't reload the page
    this.loadStrength()

    // Load strength on initial page load, after
    // stylesheets have loaded
    window.onload = () => {
      this.loadStrength()
    }
  }

  loadStrength() {
    const styles = getComputedStyle(this)
    const strength = styles.getPropertyValue('--strength');

    if (strength == null || strength.length === 0) return;

    this.#strength = parseFloat(strength) ?? this.#strength;
  }

  observeCursor() {
    document.addEventListener('mousemove', (e) => this.setPosition(e))
  }

  setPosition(event) {
    const cursorX = event.clientX
    const cursorY = event.clientY

    const elementRect = this.getBoundingClientRect()

    const elementCenterX = elementRect.left + ((elementRect.right - elementRect.left) / 2)
    const elementCenterY = elementRect.top + ((elementRect.bottom - elementRect.top) / 2)

    const offsetX = ((cursorX - elementCenterX) / elementCenterX) * this.#strength
    const offsetY = ((cursorY - elementCenterY) / elementCenterY) * this.#strength

    this.style.setProperty("--rotateX", offsetX + "deg")
    this.style.setProperty("--rotateY", -1 * offsetY + "deg")
  }
})