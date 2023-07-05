import * as React from 'react'
import styles from '../page.module.scss'
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
    <div className={styles.cardOpen}>
      <div className={styles.logoContainer}>
        {children}
      </div>
      <div className={styles.info}>
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