import { styled } from '~/styles'

import type { VariantProps } from '@stitches/react'

const Bubble = styled('span', {
  margin: '$1 0 0 auto',
  py: '$2',
  px: '$4',
  maxWidth: '80%',
  color: 'white',
  fontSize: '$base',
  lineHeight: '$snug',
  borderRadius: '$2xl $2xl 0 $2xl',
  variants: {
    host: {
      true: {
        margin: '$1 auto 0 0',
        borderRadius: '$2xl $2xl $2xl 0'
      }
    },
    color: {
      black: { background: 'rgb(40 40 40)' },
      gray: { background: 'rgb(107 114 128)' },
      brown: { background: 'rgb(214 93 14)' },
      orange: { background: 'rgb(254 128 25)' },
      yellow: { background: 'rgb(181 118 20)' },
      green: { background: 'rgb(121 116 14)' },
      blue: { background: 'rgb(7 102 120)' },
      purple: { background: 'rgb(177 98 134)' },
      pink: { background: 'rgb(211 134 155)' },
      red: { background: 'rgb(157 0 6)' }
    }
  }
})

export interface TextBubbleProps {
  text: string
  color: VariantProps<typeof Bubble>['color']
  time: number
  host?: boolean
}

const TextBubble = ({ text, time, ...msg }: TextBubbleProps) => {
  return <Bubble {...msg}>{text}</Bubble>
}

export default TextBubble
