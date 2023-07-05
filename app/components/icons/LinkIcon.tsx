import * as React from 'react'
import styles from '../../page.module.scss'

type Props = {
  theme: 'light' | 'dark'
}

export const LinkIcon = ({ theme }: Props) => {
  return (
    <svg
      className={styles.linkIcon}
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.55554 0L7.38498 1.82944L3.49609 5.71833L4.28165 6.50389L8.17054 2.615L9.99998 4.44444V0H5.55554Z"
        fill={theme == 'light' ? '#FFFFFF' : '#949495'}
      />
      <path
        d="M8.88889 8.88889H1.11111V1.11111H5L3.88889 0H1.11111C0.498333 0 0 0.498333 0 1.11111V8.88889C0 9.50167 0.498333 10 1.11111 10H8.88889C9.50167 10 10 9.50167 10 8.88889V6.11111L8.88889 5V8.88889Z"
        fill={theme == 'light' ? '#FFFFFF' : '#949495'}
      />
    </svg>
  )
}
