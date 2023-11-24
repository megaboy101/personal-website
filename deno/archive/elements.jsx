import { animate } from 'https://esm.sh/motion'

/**
 * A better anchor tag
 */
export const Link = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener">{children}</a>
)


/**
 * An animatable container
 */
export const Transition = ({ children }) => {
    const setRef = (dom) => {
        if (dom !== null) {
            animate(
                dom, 
                { transform: "rotate(45deg)" },
                { duration: 10 }
            )
        }
    }

    return (
        <div ref={setRef}>{children}</div>
    )
}