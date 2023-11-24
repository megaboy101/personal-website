import { FunctionComponent as FC } from "preact"
import { LinkIcon } from '@/components/icons.tsx'
import { Link } from "@/components/link.tsx"

type Props = {
  title: string
  description: string
  position: string
  websiteURL: string
}

export const CardOpen: FC<Props> = ({ title, description, position, websiteURL, children }) => {
  return (
    <div className="template-card-open">
      <div>
        {children}
      </div>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
        <h4 className="text-label">{position}</h4>
        <Link href={websiteURL}>
          Website
          <LinkIcon theme="dark" />
        </Link>
      </div>
    </div>
  )
}