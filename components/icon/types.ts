import type { SVGProps } from 'react'
import type { ClassNameProps } from '~/types'

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'className'>, ClassNameProps {
  size?: number
}
