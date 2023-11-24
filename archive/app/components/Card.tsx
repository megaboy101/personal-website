import * as React from 'react'
import { LinkIcon } from './icons/LinkIcon'
import { useSpring, animated } from '@react-spring/web'

type Props = {
  label: string
  title: string
  websiteURL: string
  hidden: boolean
  focused: boolean
  children: React.ReactNode
  onHover: (title: string) => void
  onHoverLeave: () => void
}

export const Card = ({
  label,
  title,
  children,
  websiteURL,
  hidden,
  focused,
  onHover,
  onHoverLeave
}: Props) => {
  const props = useSpring({
    transform: focused ? 'scale(1.08)' : 'scale(1)',
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
        onMouseMove={() => onHover(title)}
        onMouseLeave={() => onHoverLeave()}
      >
        <div className="template-card">
          <p className="text-label">{label}</p>
          <h3 className="text-header">{title}</h3>
          <p>
            {children}
          </p>
          <div>
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