import * as React from 'react'
import { LinkIcon } from "./icons/LinkIcon"
import { useSpring, animated } from "react-spring"

interface Props {
  label: string
  title: string
  websiteURL: string
  hidden: boolean
  selected: boolean
  select: (title: string) => void
  deselect: () => void
}

export const Card: React.FC<Props> = ({
  label,
  title,
  children,
  websiteURL,
  hidden,
  selected,
  select,
  deselect
}) => {
  const props = useSpring({
    transform: selected ? 'scale(1.08)' : 'scale(1)',
    from: { transform: 'scale(1)' },
    config: { tension: 250 }
  })

  const opacityProps = useSpring({
    opacity: hidden ? 0.5 : 1,
    from: { opacity: 1 },
    config: { tension: 250 }
  })

  return (
    <animated.div style={opacityProps}>
      <animated.div
        style={props}
        onMouseMove={() => select(title)}
        onMouseLeave={() => deselect()}
      >
        <div className="experience">
          <p className="company">{label}</p>
          <h3>{title}</h3>
          <p>
            {children}
          </p>
          <div className="links">
            <a href={websiteURL} target="_blank" rel="noopener">
              Website
              <LinkIcon theme="dark" />
            </a>
          </div>
        </div>
      </animated.div>
    </animated.div>
  )
}