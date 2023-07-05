'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSpring, useSpringValue } from '@react-spring/web'

import styles from './page.module.scss'
import profilePicture from './images/profile-picture.png'
import secLogo from './images/sec-logo.png'

import { Github } from './components/icons/Github'
import { LinkedIn } from './components/icons/LinkedIn'
import { Staple } from './components/icons/Staple'
import { Card } from './components/Card'
import { CardSmall } from './components/CardSmall'
import { NavItem } from './components/NavItem'
import { CardOpen } from './components/CardOpen'
import { Bulb } from './components/icons/Bulb'
import { LinkIcon } from './components/icons/LinkIcon'

export default function Home() {
  const setScroll = useScroller()
  const [focused, setFocus, clearFocus] = useFocus()

  return (
    <main className={styles.main}>
      <div className={styles.contentContainer}>
        <section className={styles.about}>
          <h1>Hello, I’m Jacob Bleser.</h1>
          <p>
            I’m a Software Engineer & Designer from Orlando, Florida.
            I’m the cofounder and CEO of Studio Reach, a web development
            boutique that helps founders bootstrap SaaS products. I can’t
            shut up about <a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> and <a href="https://builttoadapt.io/why-tdd-489fdcdda05e" target="_blank" rel="noopener">test-driven development</a>. I love creating
            engaging software and helping others do the same.
          </p>

          <ul className={styles.headers}>
            <NavItem
              number="01"
              label="EXPERIENCES"
              onClick={setScroll}
            />
            <NavItem
              number="02"
              label="HACKS & PROJECTS"
              onClick={setScroll}
            />
            <NavItem
              number="03"
              label="INVOLVEMENT"
              onClick={setScroll}
            />
          </ul>

          <div className={styles.links}>
            <Image src={profilePicture} alt="Profile Picture" />
            <ul>
              <li><a href="https://github.com/megaboy101" target="_blank" rel="noopener">
                <Github />
                <span>Github</span>
                <LinkIcon theme="light" />
              </a></li>
              <li><a href="https://www.linkedin.com/in/jacobbleser/" target="_blank" rel="noopener">
                <LinkedIn />
                <span>LinkedIn</span>
                <LinkIcon theme="light" />
              </a></li>
              <li><a href="https://docs.google.com/document/d/1WGUI6Ib-jkLDm7kzfFZwINk2x1Wi3TQjopYROJYNbAk/edit?usp=sharing" target="_blank" rel="noopener">
                <Staple />
                <span>Resume</span>
                <LinkIcon theme="light" />
              </a></li>
            </ul>
          </div>
        </section>

        <section className={styles.content}>
          <div id="experiences" className="primary">
            <h2 className={styles.headerMobile}>EXPERIENCES</h2>
            <Card
              label="STUDIO REACH"
              title="Are You House Ready"
              websiteURL="https://areyouhouseready.com/"
              hidden={!!(focused && focused !== 'Are You House Ready')}
              focused={focused === 'Are You House Ready'}
              onHover={setFocus}
              onHoverLeave={clearFocus}
            >
              A curated matchmaking service for home buyers and
              real estate professionals.
            </Card>

            <Card
              label="UF SOFTWARE ENGINEERING"
              title="Clubfinity"
              websiteURL="https://gitlab.com/ufsec/clubfinity"
              hidden={!!(focused && focused !== 'Clubfinity')}
              focused={focused === 'Clubfinity'}
              onHover={setFocus}
              onHoverLeave={clearFocus}
            >
              A modern app for managing campus organizations,
              built by UF students
            </Card>

            <Card
              label="STARTGNV"
              title="StartGNV Website & Job Board"
              websiteURL="https://startgnv.com/"
              hidden={!!(focused && focused !== 'StartGNV Website & Job Board')}
              focused={focused === 'StartGNV Website & Job Board'}
              onHover={setFocus}
              onHoverLeave={clearFocus}
            >
              A new online identity for an organization dedicated
              to growing the innovation ecosystem of Greater Gainesville
            </Card>
          </div>

          <div id="projects" className={`${styles.secondary} ${styles.columns}`}>
            <h2 className={styles.headerMobile}>HACKS & PROJECTS</h2>
            <div className="column">
              <CardSmall
                title="Storyboard.js"
                hidden={!!(focused && focused !== 'Storyboard.js')}
                figmaLink="https://www.figma.com/file/MWhOvXKbuhVFfKHY328CYsXy/Storyboard?node-id=587%3A0"
                focused={focused === 'Storyboard.js'}
                onHover={setFocus}
                onHoverLeave={clearFocus}
              >
                Create fully interactive React applications, visually or programmatically
              </CardSmall>

              <CardSmall
                awardDate="October, 2019"
                awardLocation="Georgia Tech HackGT"
                devpostLink="https://devpost.com/software/bridge-bvu0t9"
                title="Brig"
                hidden={!!(focused && focused !== 'Brig')}
                focused={focused === 'Brig'}
                onHover={setFocus}
                onHoverLeave={clearFocus}
              >
                Remote therapy and mental health services, tailored to your unique needs
              </CardSmall>
            </div>

            <div className="column">
              <CardSmall
                awardTitle="1ST PLACE - HARDWARE"
                awardDate="March, 2019"
                awardLocation="UCF KnightHacks"
                devpostLink="https://devpost.com/software/hangr-fl2zmt"
                title="Hangr"
                hidden={!!(focused && focused !== 'Hangr')}
                focused={focused === 'Hangr'}
                onHover={setFocus}
                onHoverLeave={clearFocus}
              >
                A clothing recommendation app based on the clothes you own, and your local environment.
              </CardSmall>

              <CardSmall
                awardTitle="2ST PLACE - OVERALL"
                awardDate="May, 2018"
                awardLocation="Gainesville Startup Weekend"
                title="Adulting 101"
                hidden={!!(focused && focused !== 'Adulting 101')}
                focused={focused === 'Adulting 101'}
                onHover={setFocus}
                onHoverLeave={clearFocus}
              >
                Activity-oriented event series for college students and young adults to learn basic independant skills
              </CardSmall>
            </div>
          </div>

          <div id="involvement" className={styles.tertiary}>
            <h2 className={styles.headerMobile}>INVOLVEMENT</h2>
            <CardOpen
              title="UF Software Engineering Club"
              description="Exposing students to industry standard technology through hands-on projects"
              position="HEAD OF USER EXPERIENCE - AUG 2020, PRESENT"
              websiteURL="https://ufsec.com/"
            >
              <Image src={secLogo} alt="Software Engineering Club Logo" />
            </CardOpen>

            <CardOpen
              title="UF Entrepreneurship Collective"
              description="A diverse on-campus community dedicated to building student entrepreneurs"
              position="VP OF OPERATIONS - AUG 2018, DEC 2018"
              websiteURL="https://www.facebook.com/eCoUFL"
            >
              <Bulb />
            </CardOpen>
          </div>
        </section>
      </div>
    </main>
  )
}


function hasWindow() {
  return typeof window !== 'undefined'
}


type WindowDimensions = {
  width: number
  height: number
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState<WindowDimensions | null>(null)

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: hasWindow() ? window.innerWidth : 1000,
        height: hasWindow() ? window.innerHeight : 1000,
      })
    }

    if (hasWindow()) window.addEventListener("resize", handleResize)
    
    handleResize()

    return () => {
      if (hasWindow())
        window.removeEventListener("resize", handleResize)
    }
  }, []);

  return windowSize;
}


function useFocus(): [string | null, (title: string) => void, () => void] {
  const windowSize = useWindowSize()
  const [focus, setFocus] = useState<string | null>(null)

  const setDesktopFocus = (title: string) => {
    if (windowSize && windowSize.width > 1000)
      setFocus(title)
  }

  const clearFocus = () => setFocus(null)

  return [focus, setDesktopFocus, clearFocus]
}


function useScroller() {
  const [, api] = useSpring(() => ({
    y: 0,
    from: { y: (hasWindow() ? window.scrollY : 0) },
    reset: true,
    onChange: (props) => {
      if (hasWindow()) window.scroll(0, props.value.y)
    },
    config: { tension: 200, clamp: true }
  }), [])

  const setScroll = (number: '01' | '02' | '03') => {
    switch (number) {
      case '01':
        api.start({ y: 30, from: { y: hasWindow() ? window.scrollY : 0 } })
        break
      case '02':
        api.start({ y: 750, from: { y: hasWindow() ? window.scrollY : 0 } })
        break
      case '03':
        api.start({ y: 1450, from: { y: hasWindow() ? window.scrollY : 0 } })
        break
    }
  }

  return setScroll







  // const scrollPosition = useSpringValue<number>(0, {
  //   reset: true,
  //   config: {
  //     tension: 200,
  //     clamp: true
  //   }
  // })

  // const scrollTo = (number: '01' | '02' | '03') => {
  //   console.log("Setting scroll")
  //   switch (number) {
  //     case '01':
  //       scrollPosition.start(30)
  //       setY({ y: 30, from: { y: hasWindow() ? window.scrollY : 0 } })
  //       break
  //     case '02':
  //       setY({ y: 750, from: { y: hasWindow() ? window.scrollY : 0 } })
  //       break
  //     case '03':
  //       setY({ y: 1450, from: { y: hasWindow() ? window.scrollY : 0 } })
  //       break
  //   }
  // }


}
