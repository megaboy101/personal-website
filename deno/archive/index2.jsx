// import { signal } from 'https://esm.sh/preact/signals'
import { Link, Transition } from './elements.jsx'

export default
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Jacob Bleser</title>

    {/* Design Tokens */}
    <link rel="stylesheet" href="style/tokens.css" />

    {/* Normalize default browser styles */}
    <link rel="stylesheet" href="style/preflight.css" />

    {/* Layout utility classes */}
    <link rel="stylesheet" href="style/layout.css" />

    {/* Text defaults and utility classes */}
    <link rel="stylesheet" href="style/typography.css" />
</head>
<body>
    <main class="layout-page">
        <section id="about">
            <h1>Hello, I’m Jacob Bleser.</h1>
            <p>
                I’m an indie web and game developer currently living the dream in
                ✨ <span class="color-rainbow">New York City</span> ✨. In college I co-founded a small web dev shop called
                Studio Reach to help bootstrap local tech startups, and more recently
                led the engineering efforts at a VC-backed social-dating startup called <a href="https://marriagepact.com/" target="_blank" rel="noopener">The Marriage Pact</a>, along with the <a href="https://apps.apple.com/us/app/checkmate-scan-your-friends/id6443729738" target="_blank" rel="noopener">Checkmate app</a>.
            </p>
            <p style={{marginTop: '25px'}}>
                Outside of work I’m also active in the open source community, primarily
                in <Link href="https://elixir-lang.org/">Elixir</Link> and the <Link href="https://bevyengine.org/">Bevy game engine</Link> for Rust.
            </p>

            {/* <nav>
                <ol>
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
                </ol>
            </nav>

            <div id="social-links">
                <Image src={profilePicture} alt="Profile Picture" />
                <ul>
                    <li>
                        <a href="https://github.com/megaboy101" target="_blank" rel="noopener">
                            <Github />
                            <span>Github</span>
                            <LinkIcon theme="light" />
                        </a>
                    </li>
                    <li>
                        <a href="https://www.linkedin.com/in/jacobbleser/" target="_blank" rel="noopener">
                            <LinkedIn />
                            <span>LinkedIn</span>
                            <LinkIcon theme="light" />
                        </a>
                    </li>
                    <li>
                        <a href="https://docs.google.com/document/d/1WGUI6Ib-jkLDm7kzfFZwINk2x1Wi3TQjopYROJYNbAk/edit?usp=sharing" target="_blank" rel="noopener">
                        <Staple />
                        <span>Resume</span>
                        <LinkIcon theme="light" />
                        </a>
                    </li>
                </ul>
            </div> */}
        </section>
    </main>
</body>
</html>


// const scrollPosition = signal(window.scrollY)
// const focusedCard = signal(null)
