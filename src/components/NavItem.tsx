import * as React from 'react'
import { useSpring, animated } from "react-spring"

interface Props {
  number: '01' | '02' | '03'
  label: string
  selected: boolean
  select: (number: string) => void
  deselect: () => void
  onClick: (number: '01' | '02' | '03') => void
}

export const NavItem: React.FC<Props> = ({ number, label, selected, select, deselect, onClick }) => {
  const props = useSpring({
    opacity: selected ? 1 : 0.5,
    from: { opacity: 0.5 },
    config: { tension: 250 }
  })

  const barProps = useSpring({
    width: selected ? '48px' : '24px',
    from: { width: '24px' },
    config: { tension: 250 }
  })

  return (
    <li>
      <animated.button
        style={props}
        onMouseMove={() => select(number)}
        onMouseLeave={() => deselect()}
        onClick={() => onClick(number)}
      >
        {number} <animated.div style={barProps} className="bar" /> {label}
      </animated.button>
    </li>
  )
}
