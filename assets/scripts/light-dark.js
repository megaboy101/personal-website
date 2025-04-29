let html
let btn

if (document.readyState !== 'loading') {
  init()
} else {
  document.addEventListener('DOMContentLoaded', init)
}

function init() {
  console.log('initializing')
  html = document.querySelector('html')
  btn = document.querySelector('#theme-toggle')
  const theme = localStorage.getItem('theme')

  // Check storage for theme
  if (theme === 'light') setTheme('light', html)
  else if (theme === 'dark') setTheme('dark', html)

  btn.addEventListener('click', toggleTheme)
}

function setTheme(theme, element) {
  element.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

function toggleTheme() {
  // Check if theme was already set
  if (html.getAttribute('data-theme') === 'light') setTheme('dark', html)
  else if (html.getAttribute('data-theme') === 'dark') setTheme('light', html)
  
  // Fallback on user preference
  else if (window.matchMedia('(prefers-color-scheme: light)').matches) setTheme('dark', html)
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('light', html)
}