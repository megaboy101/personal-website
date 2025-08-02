class SelectLink extends HTMLElement {
  static {
    customElements.define("select-link", SelectLink);
  }

  connectedCallback() {
    const select = this.querySelector("select");

    select.addEventListener("change", this);
  }

  disconnectedCallback() {
    select.removeEventListener(this);
  }

  handleEvent(event) {
    const selectedValue = event.target.value;
    window.location = selectedValue;
  }
}
