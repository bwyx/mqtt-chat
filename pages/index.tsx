import Head from 'next/head'
import { Container, Stack, Text } from '~/components/primitives'
import TextBubble, { TextBubbleProps } from '~/components/TextBubble'

const chatHistory: TextBubbleProps[] = [
  { text: 'hello', color: 'red', received: false },
  { text: 'hello', color: 'green', received: true },
  { text: 'ehehe', color: 'red', received: false },
  { text: 'ehehe too', color: 'green', received: true },
  {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    color: 'red',
    received: false
  },
  { text: '69', color: 'red', received: false },
  { text: 'nice', color: 'red', received: false },
  { text: 'xixixi', color: 'red', received: false }
]

const Home = () => {
  return (
    <Container>
      <Head>
        <title>MQTT Chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Text as="h1" size="4xl">
          MQTT Chat
        </Text>
        <Stack dir="col">
          {chatHistory.map((chat, i) => (
            <TextBubble key={i} {...chat} />
          ))}
        </Stack>
      </main>
    </Container>
  )
}

export default Home
