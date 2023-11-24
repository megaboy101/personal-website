import { FunctionComponent as FC } from "preact"
import { LinkIcon, Github, Award, Devpost, Figma } from '@/components/icons.tsx'
import { Link } from "@/components/link.tsx"

type Props = {
  awardTitle?: string
  awardLocation?: string
  awardDate?: string
  title: string
  githubLink?: string
  devpostLink?: string
  figmaLink?: string
}

export const CardSmall: FC<Props> = ({
  awardTitle,
  awardDate,
  awardLocation,
  title,
  children,
  githubLink,
  devpostLink,
  figmaLink,
}) => (
  <div class="template-card-sm">
    { awardTitle &&
      <p class="template-card-sm__award text-label">
        <Award/>
        {awardTitle}
      </p>
    }
    { awardDate &&
      <>
      <p class="template-card-sm__award-info">
        {awardLocation}
        <br/>
        {awardDate}
      </p>
      </>
    }
    <h3>{title}</h3>
    <p>
      {children}
    </p>
    <div>
      { githubLink &&
        <Link href={githubLink}>
          <Github />
          Github
          <LinkIcon theme="light" />
        </Link>
      }
      { devpostLink &&
      <Link href={devpostLink}>
        <Devpost />
        Devpost
        <LinkIcon theme="light" />
      </Link>
      }
      { figmaLink &&
      <Link href={figmaLink}>
        <Figma />
        Figma
        <LinkIcon theme="light" />
      </Link>
      }
    </div>
  </div>
)