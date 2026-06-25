// Keep track of a queued ping so we can cancel it if a page is viewed
// very briefly
let delayRef = null;

// Ping function to send stats to insights api
function ping() {
  // Disable pings if analytics are disabled via localStorage.
  // Useful for disabling in production setting
  if (localStorage.getItem('insights') === 'false') return

  // Cancel an existing ping, if it exists
  if (delayRef !== null) clearTimeout(delayRef)

  // Trigger ping to go out 1s after viewing page
  delayRef = setTimeout(() => {
    fetch('/p', {
      body: JSON.stringify({
        referrer: document.referrer,
        pathname: location.pathname,
      }),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST'
    })
  }, 1000)
}

// Ping on initial script load
ping()

// Intercept pushState calls from history, and report them to analytics
history.pushState = new Proxy(history.pushState, {
  apply: (target, thisArg, argArray) => {
    // Trigger page change
    const result = target.apply(thisArg, argArray)

    // report page viewed
    ping()

    // Return as expected
    return result
  },
});