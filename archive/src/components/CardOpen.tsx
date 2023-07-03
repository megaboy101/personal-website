import * as React from 'react'
import { LinkIcon } from "./icons/LinkIcon"

interface Props {
  title: string
  description: string
  position: string
  websiteURL: string
}

export const CardOpen: React.FC<Props> = ({ title, description, position, websiteURL, children }) => {
  return (
    <div className="card-open">
      <div className="logo-container">
        {children}
      </div>
      <div className="info">
        <h3>{title}</h3>
        <p>{description}</p>
        <h4>{position}</h4>
        <a href={websiteURL} target="_blank" rel="noopener">
          Website
          <LinkIcon theme="dark" />
        </a>
      </div>
    </div>
  )
}