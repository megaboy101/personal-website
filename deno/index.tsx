import { FunctionComponent as FC } from 'preact'
import { NavItem } from "@/components/navitem.tsx";
import { Bulb, Github, LinkIcon, LinkedIn, Staple } from "@/components/icons.tsx";
import { Card } from "./components/card.tsx";
import { CardSmall } from "./components/card-small.tsx";
import { CardOpen } from "./components/card-open.tsx";
import { Link } from "./components/link.tsx";

export const Document: FC = () => (
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <title>Jacob Bleser</title>

      {/* Design Tokens */}
      <link rel="stylesheet" href="style/tokens.css" />

      {/* Default styles */}
      <link rel="stylesheet" href="style/preflight.css" />

      {/* Layout Utils */}
      <link rel="stylesheet" href="style/layout.css" />

      {/* Typography presets */}
      <link rel="stylesheet" href="style/typography.css" />

      {/* Page-specific styles */}
      <link rel="stylesheet" href="style/page.css" />

      {/* Custom elements */}
      <script type="module" src="elements/navitem.js" defer async></script>
    </head>
    <body>
      <Page />
    </body>
  </html>
);

const Page: FC = () => (
  <main class="layout-page">
    <AboutSection />
    <ContentSection />
  </main>
)

const AboutSection: FC = () => (
  <section id="about">
    <h1>Hello, I’m Jacob Bleser.</h1>
    <p>
      I’m an indie web and game developer currently living the dream in ✨{" "}
      <RainbowText>New York City</RainbowText>{" "}
      ✨. In college I co-founded a small web dev shop called Studio Reach to
      help bootstrap local tech startups, and more recently led the engineering
      efforts at a VC-backed social-dating startup called{" "}
      <Link href="https://marriagepact.com/">
        The Marriage Pact
      </Link>
      , along with the{" "}
      <Link
        href="https://apps.apple.com/us/app/checkmate-scan-your-friends/id6443729738"
      >
        Checkmate app
      </Link>
      .
    </p>
    <p style={{ marginTop: "25px" }}>
      Outside of work I’m also active in the open source community, primarily in{" "}
      <Link href="https://elixir-lang.org/">
        Elixir
      </Link>{" "}
      and the{" "}
      <Link href="https://bevyengine.org/">
        Bevy game engine
      </Link>{" "}
      for Rust.
    </p>

    <nav>
      <ol>
        <NavItem number="01" label="EXPERIENCES" section="#experiences" />
        <NavItem number="02" label="HACKS & PROJECTS" section="#projects" />
        <NavItem number="03" label="INVOLVEMENT" section="#involvement" />
      </ol>
    </nav>

    <div id="social-links">
      <img src="/assets/img/profile-picture.png" alt="Profile Picture" />
      <ul>
        <li>
          <Link
            href="https://github.com/megaboy101"
          >
            <Github />
            <span>Github</span>
            <LinkIcon theme="light" />
          </Link>
        </li>
        <li>
          <Link
            href="https://www.linkedin.com/in/jacobbleser/"
          >
            <LinkedIn />
            <span>LinkedIn</span>
            <LinkIcon theme="light" />
          </Link>
        </li>
        <li>
          <Link
            href="https://docs.google.com/document/d/1WGUI6Ib-jkLDm7kzfFZwINk2x1Wi3TQjopYROJYNbAk/edit?usp=sharing"
          >
            <Staple />
            <span>Resume</span>
            <LinkIcon theme="light" />
          </Link>
        </li>
      </ul>
    </div>
  </section>
);

const ContentSection: FC = () => (
  <section id="content" class="grid-page__content">
    <ExperiencesSection />

    <ProjectsSection />

    <InvolvementSection />
  </section>
)

const ExperiencesSection: FC = () => (
  <div id="experiences" class="primary">
    <h2 class="text-label">EXPERIENCES</h2>
    <Card
      label="STUDIO REACH"
      title="Are You House Ready"
      websiteURL="https://areyouhouseready.com/"
    >
      A curated matchmaking service for home buyers and
      real estate professionals.
    </Card>

    <Card
      label="UF SOFTWARE ENGINEERING"
      title="Clubfinity"
      websiteURL="https://gitlab.com/ufsec/clubfinity"
    >
      A modern app for managing campus organizations,
      built by UF students
    </Card>

    <Card
      label="STARTGNV"
      title="StartGNV Website & Job Board"
      websiteURL="https://startgnv.com/"
    >
      A new online identity for an organization dedicated
      to growing the innovation ecosystem of Greater Gainesville
    </Card>
  </div>
)

const ProjectsSection: FC = () => (
  <div id="projects" class="grid-col-2">
    <h2 class="text-label">HACKS & PROJECTS</h2>
    <div>
      <CardSmall
        title="Storyboard.js"
        figmaLink="https://www.figma.com/file/MWhOvXKbuhVFfKHY328CYsXy/Storyboard?node-id=587%3A0"
      >
        Create fully interactive React applications, visually or programmatically
      </CardSmall>

      <CardSmall
        awardDate="October, 2019"
        awardLocation="Georgia Tech HackGT"
        devpostLink="https://devpost.com/software/bridge-bvu0t9"
        title="Brig"
      >
        Remote therapy and mental health services, tailored to your unique needs
      </CardSmall>
    </div>

    <div>
      <CardSmall
        awardTitle="1ST PLACE - HARDWARE"
        awardDate="March, 2019"
        awardLocation="UCF KnightHacks"
        devpostLink="https://devpost.com/software/hangr-fl2zmt"
        title="Hangr"
      >
        A clothing recommendation app based on the clothes you own, and your local environment.
      </CardSmall>

      <CardSmall
        awardTitle="2ST PLACE - OVERALL"
        awardDate="May, 2018"
        awardLocation="Gainesville Startup Weekend"
        title="Adulting 101"
      >
        Activity-oriented event series for college students and young adults to learn basic independant skills
      </CardSmall>
    </div>
  </div>
)

const InvolvementSection: FC = () => (
  <div id="involvement">
    <h2 class="text-label">INVOLVEMENT</h2>
    <CardOpen
      title="UF Software Engineering Club"
      description="Exposing students to industry standard technology through hands-on projects"
      position="HEAD OF USER EXPERIENCE - AUG 2020, PRESENT"
      websiteURL="https://ufsec.com/"
    >
      <img src="/assets/img/sec-logo.png" alt="Software Engineering Club Logo" />
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
)




const RainbowText: FC = ({ children }) => (
  <span
    style={{
      background:
        "linear-gradient(to right, #ef5350, #f48fb1, #7e57c2, #2196f3, #26c6da, #43a047, #eeff41, #f9a825, #ff5722)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    {children}
  </span>
)

export function thing() {
  
}
