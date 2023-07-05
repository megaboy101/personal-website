import * as React from 'react'
import styles from '../page.module.scss'
import { LinkIcon } from './icons/LinkIcon'
import { useSpring, animated } from '@react-spring/web'
import { Github } from './icons/Github'
import { Award } from './icons/Award'
import { Devpost } from './icons/Devpost'
import { Figma } from './icons/Figma'

type Props = {
  awardTitle?: string
  awardLocation?: string
  awardDate?: string
  title: string
  githubLink?: string
  devpostLink?: string
  figmaLink?: string
  hidden: boolean
  focused: boolean
  children: React.ReactNode
  onHover: (title: string) => void
  onHoverLeave: () => void
}

export const CardSmall = ({
  awardTitle,
  awardDate,
  awardLocation,
  title,
  children,
  githubLink,
  devpostLink,
  figmaLink,
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
        <div className={styles.experience}>
          { awardTitle &&
            <p className={styles.award}>
              <Award/>
              {awardTitle}
            </p>
          }
          { awardDate &&
            <>
            <p className={styles.awardInfo}>
              {awardLocation}
              <br/>
              {awardDate}
            </p>
            </>
          }
          <h3>{title}</h3>
          <p>
            {children}
          </p>
          <div className={styles.links}>
            { githubLink &&
              <a href={githubLink} target="_blank" rel="noopener">
                <Github />
                Github
                <LinkIcon theme="light" />
              </a>
            }
            { devpostLink &&
            <a href={devpostLink} target="_blank" rel="noopener">
              <Devpost />
              Devpost
              <LinkIcon theme="light" />
            </a>
            }
            { figmaLink &&
            <a href={figmaLink} target="_blank" rel="noopener">
              <Figma />
              Figma
              <LinkIcon theme="light" />
            </a>
            }
          </div>
        </div>
      </animated.div>
    </animated.div>
  )
}