import { useState } from 'react'
import { useSpring, animated } from '@react-spring/web'
import styles from '../page.module.scss'

type Props = {
  number: '01' | '02' | '03'
  label: string
  onClick: (number: '01' | '02' | '03') => void
}

export const NavItem: React.FC<Props> = ({ number, label, onClick }) => {
  const [hovered, setHovered] = useState(false)

  const props = useSpring({
    opacity: hovered ? 1 : 0.5,
    from: { opacity: 0.5 },
    config: { tension: 250 }
  })

  const barProps = useSpring({
    width: hovered ? '48px' : '24px',
    from: { width: '24px' },
    config: { tension: 250 }
  })

  return (
    <li className={styles.headerItem}>
      <animated.button
        style={props}
        onMouseMove={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onClick(number)}
      >
        {number} <animated.div style={barProps} className={styles.bar} /> {label}
      </animated.button>
    </li>
  )
}
