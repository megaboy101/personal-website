import * as React from 'react'
import { LinkIcon } from './icons/LinkIcon'

type Props = {
  title: string
  description: string
  position: string
  websiteURL: string
  children: React.ReactNode
}

export const CardOpen = ({ title, description, position, websiteURL, children }: Props) => {
  return (
    <div className="template-card-open">
      <div>
        {children}
      </div>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
        <h4 className="text-label">{position}</h4>
        <a href={websiteURL} target="_blank" rel="noopener">
          Website
          <LinkIcon theme="dark" />
        </a>
      </div>
    </div>
  )
}