import * as React from "react"
import '../styles/index.scss'
import { LinkIcon } from "../components/icons/LinkIcon"
import profilePicture from '../images/profile-picture.png'
import secLogo from '../images/sec-logo.png'
import { Github } from "../components/icons/Github"
import { LinkedIn } from "../components/icons/LinkedIn"
import { Staple } from "../components/icons/Staple"
import { Card } from "../components/Card"
import { CardSmall } from "../components/CardSmall"
import { NavItem } from "../components/NavItem"
import { useSpring, animated } from "react-spring"
import { CardOpen } from "../components/CardOpen"
import { Bulb } from "../components/icons/Bulb"

const useWindowSize = () => {
  const [windowSize, setWindowSize] = React.useState({
    width: undefined,
    height: undefined,
  })

  React.useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: typeof window !== 'undefined' ? window.innerWidth : 1000,
        height: typeof window !== 'undefined' ? window.innerHeight : 1000,
      })
    }

    if (typeof window !== 'undefined')
      window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      if (typeof window !== 'undefined')
        window.removeEventListener("resize", handleResize)
    }
  }, []);

  return windowSize;
}

export default function Home() {
  const pageRef = React.useRef()

  const windowSize = useWindowSize()
  const [, setY] = useSpring(() => ({
    y: 0,
    reset: true,
    from: { y: (typeof window !== 'undefined' ? window.scrollY : 0) },
    onFrame: props => {
      if (typeof window !== 'undefined') window.scroll(0, props.y)
    },
    config: { tension: 200, clamp: true }
  }))

  const [focus, setFocus] = React.useState('')
  const [navFocus, setNavFocus] = React.useState('')

  const setScroll = (number: '01' | '02' | '03') => {
    switch (number) {
      case '01':
        setY({ y: 30, from: { y: typeof window !== 'undefined' ? window.scrollY : 0 } })
        break
      case '02':
        setY({ y: 750, from: { y: typeof window !== 'undefined' ? window.scrollY : 0 } })
        break
      case '03':
        setY({ y: 1450, from: { y: typeof window !== 'undefined' ? window.scrollY : 0 } })
        break
    }
  }

  const setSafeFocus = (title: string) => {
    if (windowSize.width > 1000)
      setFocus(title)
  }

  return (
    <main ref={pageRef}>
      <div className="content-container">
        <section className="about">
          <h1>Hello, I’m Jacob Bleser.</h1>
          <p>
            I’m a Software Engineer & Designer from Orlando, Florida.
            I’m the cofounder and CEO of <a href="https://www.studioreach.io/" target="_blank" rel="noopener">Studio Reach</a>, a web development
            boutique that helps founders bootstrap SaaS products. I can't
            shut up about <a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> and <a href="https://builttoadapt.io/why-tdd-489fdcdda05e" target="_blank" rel="noopener">test-driven development</a>. I love creating
            engaging software and helping others do the same.
          </p>

          <ul className="headers">
            <NavItem
              number="01"
              label="EXPERIENCES"
              selected={navFocus === '01'}
              select={setNavFocus}
              deselect={() => setNavFocus('')}
              onClick={setScroll}
            />
            <NavItem
              number="02"
              label="HACKS & PROJECTS"
              selected={navFocus === '02'}
              select={setNavFocus}
              deselect={() => setNavFocus('')}
              onClick={setScroll}
            />
            <NavItem
              number="03"
              label="INVOLVEMENT"
              selected={navFocus === '03'}
              select={setNavFocus}
              deselect={() => setNavFocus('')}
              onClick={setScroll}
            />
          </ul>

          <div className="links">
            <img src={profilePicture} alt="Profile Picture" />
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

        <section className="content">
          <div id="experiences" className="primary">
            <h2 className="header-mobile">EXPERIENCES</h2>
            <Card
              label="STUDIO REACH"
              title="Are You House Ready"
              websiteURL="https://areyouhouseready.com/"
              hidden={focus !== '' && focus !== 'Are You House Ready'}
              selected={focus === 'Are You House Ready'}
              select={title => setSafeFocus(title)}
              deselect={() => setSafeFocus('')}
            >
              A curated matchmaking service for home buyers and
              real estate professionals.
            </Card>

            <Card
              label="UF SOFTWARE ENGINEERING"
              title="Clubfinity"
              websiteURL="https://gitlab.com/ufsec/clubfinity"
              hidden={focus !== '' && focus !== 'Clubfinity'}
              selected={focus === 'Clubfinity'}
              select={title => setSafeFocus(title)}
              deselect={() => setSafeFocus('')}
            >
              A modern app for managing campus organizations,
              built by UF students
            </Card>

            <Card
              label="STARTGNV"
              title="StartGNV Website & Job Board"
              websiteURL="https://startgnv.com/"
              hidden={focus !== '' && focus !== 'StartGNV Website & Job Board'}
              selected={focus === 'StartGNV Website & Job Board'}
              select={title => setSafeFocus(title)}
              deselect={() => setSafeFocus('')}
            >
              A new online identity for an organization dedicated
              to growing the innovation ecosystem of Greater Gainesville
            </Card>
          </div>

          <div id="projects" className="secondary columns">
            <h2 className="header-mobile">HACKS & PROJECTS</h2>
            <div className="column">
              <CardSmall
                title="Storyboard.js"
                hidden={focus !== '' && focus !== 'Storyboard.js'}
                selected={focus === 'Storyboard.js'}
                select={title => setSafeFocus(title)}
                deselect={() => setSafeFocus('')}
              >
                Create fully interactive React applications, visually or programmatically
              </CardSmall>

              <CardSmall
                awardDate="October, 2019"
                awardLocation="Georgia Tech HackGT"
                devpostLink="https://devpost.com/software/bridge-bvu0t9"
                title="Brig"
                hidden={focus !== '' && focus !== 'Brig'}
                selected={focus === 'Brig'}
                select={title => setSafeFocus(title)}
                deselect={() => setSafeFocus('')}
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
                hidden={focus !== '' && focus !== 'Hangr'}
                selected={focus === 'Hangr'}
                select={title => setSafeFocus(title)}
                deselect={() => setSafeFocus('')}
              >
                A clothing recommendation app based on the clothes you own, and your local environment.
              </CardSmall>

              <CardSmall
                awardTitle="2ST PLACE - OVERALL"
                awardDate="May, 2018"
                awardLocation="Gainesville Startup Weekend"
                title="Adulting 101"
                hidden={focus !== '' && focus !== 'Adulting 101'}
                selected={focus === 'Adulting 101'}
                select={title => setSafeFocus(title)}
                deselect={() => setSafeFocus('')}
              >
                Activity-oriented event series for college students and young adults to learn basic independant skills
              </CardSmall>
            </div>
          </div>

          <div id="involvement" className="tertiary">
            <h2 className="header-mobile">INVOLVEMENT</h2>
            <CardOpen
              title="UF Software Engineering Club"
              description="Exposing students to industry standard technology through hands-on projects"
              position="HEAD OF USER EXPERIENCE - AUG 2020, PRESENT"
              websiteURL="https://ufsec.com/"
            >
              <img src={secLogo} alt="Software Engineering Club Logo" />
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
