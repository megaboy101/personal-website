import { html, css } from './archive/paige.ts'

// import { page, html } from './paige.ts'

// page({
//     title: 'Jacob Bleser',
//     description: 'Jacob Bleser | Ex-CEO @ Studio Reach and Full-Stack Dev @ The Marriage Pact | TypeScript, React, Elixir, Rust',
//     author: 'Jacob Bleser',

//     html: '',
//     css: '',
// })


export default html`
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Jacob Bleser</title>

        <!-- Design Tokens -->
        <link rel="stylesheet" href="style/tokens.css">

        <!-- Normalize default browser styles -->
        <link rel="stylesheet" href="style/preflight.css">

        <!-- Layout utility classes -->
        <link rel="stylesheet" href="style/layout.css">

        <!-- Text defaults and utility classes -->
        <link rel="stylesheet" href="style/typography.css">
    </head>
    <body>
        ${page}
    </body>
</html>
`

const page = html`
    <main class="layout-page">
        ${aboutSection}
    </main>
`

/**
 * Ok so here's my problem. I have a small element that I
 * wanna re-use in a few different places. The purest way
 * to do this would be function calls in my template strings,
 * which I hate. I'd like the experience of JSX where I
 * can just use a custom element with attributes and stuff.
 * 
 * The only way I can think of to get custom elements is
 * to use custom elements, which requires shipping JS. Not
 * the end of the world, but it also complicates the
 * authoring experience as well. Like how would I define
 * these custom elements?
 * 
 * Another annoying thing with custom elements is that
 * I can't really do "partials". 
 * 
 * The alternative solution would be to just use JSX, but
 * that means I don't really have a good styling solution
 * to work with...
 */

const navItem = (label, idx) => html`
    <li className="text-label">
        <animated.button
            style={props}
            onMouseMove={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onClick(number)}
        >
            0${idx+1} <animated.div style={barProps} /> {label}
        </animated.button>
    </li>
`

const aboutSection = html`
    <section id="about">
        <h1>Hello, I’m Jacob Bleser.</h1>
        <p>
            I’m an indie web and game developer currently living the dream in
            ✨ <span class="text-rainbow">New York City</span> ✨. In college I co-founded a small web dev shop called
            Studio Reach to help bootstrap local tech startups, and more recently
            led the engineering efforts at a VC-backed social-dating startup called <a href="https://marriagepact.com/" target="_blank" rel="noopener">The Marriage Pact</a>, along with the <a href="https://apps.apple.com/us/app/checkmate-scan-your-friends/id6443729738" target="_blank" rel="noopener">Checkmate app</a>.
        </p>
        <p style="margin-top: 25px;">
            Outside of work I’m also active in the open source community, primarily
            in <a href="https://elixir-lang.org/" target="_blank" rel="noopener">Elixir</a> and the <a href="https://bevyengine.org/" target="_blank" rel="noopener">Bevy game engine</a> for Rust.
        </p>

        <nav>
            <ol>
                ${
                    ["experiences", "hacks & projects", "involvement"].map((label, idx) => html`
                        
                    `)
                }
                <nav-option @click=${() => onScroll("01")}>01 - EXPERIENCES</nav-option>
                <nav-option @click=${() => onScroll("02")}>02 - HACKS & PROJECTS</nav-option>
                <nav-option @click=${() => onScroll("03")}>03 - INVOLVEMENT</nav-option>
            </ol>
        </nav>

        <div id="social-links">
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
`
