import { useState, useEffect, useCallback } from 'react'
import mqtt, { MqttClient } from 'mqtt'

const useMqtt = (host: string, mqttOption: MqttClient['options']) => {
  const [client, setClient] = useState<MqttClient>()
  const [status, setStatus] = useState<
    | 'Connecting'
    | 'Reconnecting'
    | 'Connected'
    | 'Disconnecting'
    | 'Disconnected'
  >('Connecting')

  const connect = useCallback(() => {
    setStatus('Connecting')
    setClient(mqtt.connect(host, mqttOption))
  }, [host, mqttOption])

  useEffect(() => {
    if (!client) return connect()

    console.log(`Connected to MQTT broker ${host}`)
    console.log(client)

    client.on('connect', () => {
      setStatus('Connected')
    })
    client.on('error', (err) => {
      console.error('Connection error: ', err)
      client.end()
    })
    client.on('reconnect', () => {
      setStatus('Reconnecting')
    })
  }, [client, connect, host])

  return { connect, client, status }
}

export default useMqtt
