import { useState, useEffect } from 'react'
import Head from 'next/head'
import { formatDistance, isSameDay } from 'date-fns'
import useMqtt from '~/hooks/useMqtt'

import { Container, Stack, Text } from '~/components/primitives'
import TextBubble, { TextBubbleProps } from '~/components/TextBubble'

import { styled } from '~/styles'

const StyledInput = styled('input', {
  py: '$2',
  px: '$4',
  width: '100%',
  fontSize: '$base',
  lineHeight: '$snug',
  color: 'white',
  border: 'none',
  borderRadius: '$2xl',
  '&:focus': { outline: 'none' },
  '&::placeholder': { color: 'rgb(255 255 255 / 0.25)' },
  variants: {
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

const colors: TextBubbleProps['color'][] = [
  'gray',
  'brown',
  'orange',
  'yellow',
  'blue',
  'purple',
  'pink',
  'red'
]

const ColorCircle = styled('button', {
  display: 'block',
  width: '24px',
  height: '24px',
  border: 0,
  borderRadius: '$full',
  mr: '$2',
  variants: {
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

const mqttHost = process.env.NEXT_PUBLIC_MQTT_HOST as string

const mqttOptions = {
  username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
  password: process.env.NEXT_PUBLIC_MQTT_PASSWORD
}

type Chats = {
  date: number
  chats: TextBubbleProps[]
}

const Home = () => {
  const { client, status } = useMqtt('wss://' + mqttHost, mqttOptions)
  const [chatHistoryLoaded, setChatHistoryLoaded] = useState(false)
  const [messages, setMessages] = useState<TextBubbleProps[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [newMessageColor, setNewMessageColor] =
    useState<TextBubbleProps['color']>('red')

  const datedMessages = messages.reduce((chats: Chats[], msg) => {
    const existing = chats.find((c) => isSameDay(c.date, msg.time))
    if (!existing) {
      chats.push({
        date: msg.time,
        chats: [msg]
      })

      return chats
    }

    existing.chats.push(msg)
    return chats
  }, [])

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newMessage) return

    client?.publish(
      'chat/guest',
      JSON.stringify({ text: newMessage, color: newMessageColor })
    )
    fetch(`https://${mqttHost}/history`, {
      mode: 'no-cors',
      method: 'POST',
      body: JSON.stringify({
        text: newMessage,
        color: newMessageColor
      })
    })
    setNewMessage('')
  }

  const handleIncomingMessage = (topic: string, message: string) => {
    let host = false
    let { color, text, time = Date.now() } = JSON.parse(message)

    if (topic === 'chat/guest') {
      const availableColors = [
        'black',
        'gray',
        'brown',
        'orange',
        'yellow',
        'blue',
        'purple',
        'pink',
        'red'
      ]

      if (!availableColors.includes(color)) color = 'black'
    }
    if (topic === 'chat/host') {
      host = true
    }

    setMessages((messages) => [...messages, { text, color, time, host }])
  }

  useEffect(() => {
    const fetchChatHistory = async () => {
      const response = await fetch(`https://${mqttHost}/history`)
      const messages = await response.json()
      setMessages(messages)
      setChatHistoryLoaded(true)
    }
    fetchChatHistory()
  }, [])

  useEffect(() => {
    if (!chatHistoryLoaded || !client) return

    client.subscribe('chat/host')
    client.subscribe('chat/guest')
    client.on('message', handleIncomingMessage)
  }, [chatHistoryLoaded, client])

  useEffect(() => {
    document.documentElement.scrollTop = document.documentElement.scrollHeight
  }, [messages])

  return (
    <>
      <Head>
        <title>MQTT Chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: 'white',
          padding: '1rem 0',
          zIndex: 999
        }}
      >
        <Container>
          <Text as="h1" size="4xl" css={{ margin: 0 }}>
            MQTT Chat
          </Text>
        </Container>
      </header>

      <Stack as="main" y="bottom" grow={true} style={{ minHeight: '100vh' }}>
        <Container style={{ paddingBottom: 100, paddingTop: 150 }}>
          {datedMessages.map(({ chats, date }) => {
            const isToday = isSameDay(date, new Date())
            return (
              <Stack key={date} dir="col">
                <Text
                  size="sm"
                  css={{
                    color: 'rgb(140 144 137 / 0.35)',
                    textAlign: 'center'
                  }}
                >
                  {isToday
                    ? 'Today'
                    : formatDistance(date, new Date(), {
                        addSuffix: true
                      })}
                </Text>
                {chats.map((chat, i) => (
                  <TextBubble key={i} {...chat} />
                ))}
              </Stack>
            )
          })}
        </Container>
      </Stack>

      <Stack
        y="center"
        css={{
          position: 'fixed',
          height: 100,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundImage: 'linear-gradient(transparent, white)'
        }}
      >
        <Container>
          <Stack dir="col" x="right">
            <form onSubmit={sendMessage} style={{ width: '100%' }}>
              <StyledInput
                color={newMessageColor}
                type="text"
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
                placeholder={`${status}, Press Enter to send...`}
              />
            </form>
            <Stack style={{ marginTop: '.5rem' }}>
              {colors.map((color, i) => (
                <ColorCircle
                  key={i}
                  color={color}
                  onClick={() => {
                    setNewMessageColor(color)
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </Container>
      </Stack>
    </>
  )
}

export default Home
