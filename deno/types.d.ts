import "preact";

// declare interface Thing extends JSX.HTMLAttributes<HTMLElement> {
//   thing?: string;
// }

declare global {
  namespace preact {
    namespace JSX {
      interface IntrinsicElements {
        'x-bar': any;
        'x-bar-manager': any;
        'x-nav-item': any;
      }
    }
  }
}
