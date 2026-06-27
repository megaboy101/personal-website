class CopyButton extends HTMLElement {
  static {
    customElements.define("copy-button", this);
  }

  connectedCallback() {
    this.addEventListener("click", this);
    this.targetSelector = this.getAttribute("target");
  }

  handleEvent(event) {
    switch (event.type) {
      case "click":
        return this.handleClick(event);
    }
  }

  handleClick(event) {
    const target = this.parentElement.querySelector(
      this.targetSelector,
    );
    if (target == null) return;
    navigator.clipboard.writeText(target.innerText);
  }
}
