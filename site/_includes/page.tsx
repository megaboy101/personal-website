export default ({ title, children }: Lume.Data) => (
  <>
    {{ __html: "<!DOCTYPE html>" }}
    <html lang="en">
      <head>
        <meta charset="UTF-8" />

        {/* Basic metadata */}
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Critical CSS */}
        <style>{`
          @view-transition {
            navigation: auto;
          }

          view-transition-old(root) {
            animation: slide-out 0.5s forwards;
            cubic-bezier(0.33, 1, 0.68, 1);
          }

          ::view-transition-new(root) {
            animation: slide-in 0.3s forwards;
            cubic-bezier(0.33, 1, 0.68, 1);
          }

          @keyframes slide-in {
            from {
              transform: translateX(3vw);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes slide-out {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(-3vw);
              opacity: 0;
            }
          }
        `}</style>

        {/* Scripts */}
        <script type="module" async src="/scripts/cursor-tracker.js"></script>
        <script type="module" async src="/scripts/insights.js"></script>
        <script type="module" async src="/scripts/light-dark.js"></script>
        <script type="module" async src="/scripts/select-link.js"></script>

        {/* Stylesheets */}
        <link rel="stylesheet" href="/styles/style.css" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Besley:ital,wght@0,400..900;1,400..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>{children}</body>
    </html>
  </>
);