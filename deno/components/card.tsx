import { FunctionComponent as FC } from "preact"
import { LinkIcon } from '@/components/icons.tsx'
import { Link } from "@/components/link.tsx";

type Props = {
  label: string
  title: string
  websiteURL: string
}

export const Card: FC<Props> = ({
  label,
  title,
  children,
  websiteURL,
}) => (
  <div class="template-card">
    <p class="text-label">{label}</p>
    <h3 class="text-header">{title}</h3>
    <p>
      {children}
    </p>
    <div>
      <Link href={websiteURL}>
        Website
        <LinkIcon theme="dark" />
      </Link>
    </div>
  </div>
)