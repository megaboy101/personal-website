import * as React from 'react'
import { LinkIcon } from "./icons/LinkIcon"
import { useSpring, animated } from "react-spring"
import { Github } from "./icons/Github"
import { Award } from "./icons/Award"
import { Devpost } from "./icons/Devpost"

interface Props {
  awardTitle?: string
  awardLocation?: string
  awardDate?: string
  title: string
  githubLink?: string
  devpostLink?: string
  hidden: boolean
  selected: boolean
  select: (title: string) => void
  deselect: () => void
}

export const CardSmall: React.FC<Props> = ({
  awardTitle,
  awardDate,
  awardLocation,
  title,
  children,
  githubLink,
  devpostLink,
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
          { awardTitle &&
            <p className="award">
              <Award/>
              {awardTitle}
            </p>
          }
          { awardDate &&
            <>
            <p className="award-info">
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
          <div className="links">
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
          </div>
        </div>
      </animated.div>
    </animated.div>
  )
}