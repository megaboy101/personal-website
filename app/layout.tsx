import './globals.css'
import { Gothic_A1 } from 'next/font/google'

// Font definitions
const gothic = Gothic_A1({
  weight: ['400', '600', '700'],
  style: ['normal'],
  subsets: ['latin'],
  variable: '--font',
  display: 'swap'
})

export const metadata = {
  // Basic Metadata
  title: 'Jacob Bleser',
  description: 'Jacob Bleser | Ex-CEO @ Studio Reach and Full-Stack Dev @ The Marriage Pact | TypeScript, React, Elixir, Rust',
  authors: [{name: 'Jacob Bleser'}],
  metadataBase: new URL('https://jacobbleser.dev'),
  alternatives: {
    canonical: '/'
  },

  // OpenGraph Tags
  openGraph: {
    title: 'Jacob Bleser',
    siteName: 'Jacob Bleser',
    description: 'Jacob Bleser | Ex-CEO @ Studio Reach and Full-Stack Dev @ The Marriage Pact | TypeScript, React, Elixir, Rust',
    url: 'https://jacobbleser.dev',
    images: [
      {
        url: 'https://jacobbleser.dev/og-image.jpg',
        width: 192,
        height: 192
      }
    ]
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={gothic.variable}>{children}</body>
    </html>
  )
}
