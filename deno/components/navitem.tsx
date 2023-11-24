import { FunctionComponent as FC } from "preact"

type Props = {
  number: '01' | '02' | '03'
  label: string
  section: string
}

export const NavItem: FC<Props> = ({ number, label, section }) => (
  <li class="text-label">
    <a href={section}>
      {number}
      <div />
      {label}
    </a>
  </li>
)
