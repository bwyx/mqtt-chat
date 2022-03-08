import { globalCss } from '~/styles'

export const globalStyles = globalCss({
  'html,body': {
    padding: '0',
    margin: '0',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,\n    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif'
  },
  a: { color: 'inherit', textDecoration: 'none' },
  '*': { boxSizing: 'border-box' }
})
