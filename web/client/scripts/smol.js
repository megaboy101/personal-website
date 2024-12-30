import { signal as _signal, computed as _computed, effect as _effect } from 'https://esm.sh/*@preact/signals-core'

export const signal = _signal;
export const computed = _computed;
export const effect = _effect;

export function defineElement(elementName, func) {
  customElements.define(elementName, class extends HTMLElement {
    connectedCallback() {
      this.callbacks = []
      func.call(this, this.attributes)
    }

    disconnectedCallback() {
      for (const [elem, eventName, cbFunc] of this.callbacks) {
        elem.removeEventListener(eventName, cbFunc)
      }
    }

    selectAll(query) {
      return this.querySelectorAll(query)
    }

    select(query) {
      return this.querySelector(query)
    }

    onEvent(elementsOrEventName, eventNameOrCbFunc, cbFunc) {
      // If the last arg is not given, we are
      // attaching a handler to ourself, and all
      // the function args are shifted
      if (cbFunc == null) {
        const eventName = elementsOrEventName;
        const cbFunc = eventNameOrCbFunc;
        this.addEventListener(eventName, cbFunc)
        this.callbacks.push([this, eventName, cbFunc])
      } else {
        const elements = elementsOrEventName;
        const eventName = eventNameOrCbFunc;

        for (const element of elements) {
          element.addEventListener(eventName, cbFunc)
          this.callbacks.push([element, eventName, cbFunc])
        }
      }
    }
  })
}