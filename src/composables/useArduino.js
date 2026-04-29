import { ref, reactive } from 'vue'

const ARDUINO_WS_URL = 'wss://arduino.arroyocreativa.com'

export function useArduino() {
  const isConnected = ref(false)
  const sensorData = reactive({
    joystick: { x: 0, y: 0 },
    luz: 0,
    temperatura: 0,
    slider: 0,
    acelerometro: { x: 0, y: 0, z: 0 },
    botones: { btn1: 0, btn2: 0, btn3: 0, btn4: 0 },
    microfono: 0,
    timestamp: null
  })

  let ws = null
  let reconnectTimeout = null

  const connect = () => {
    try {
      ws = new WebSocket(ARDUINO_WS_URL)

      ws.onopen = () => {
        console.log('[Arduino] Conectado a WebSocket')
        isConnected.value = true
        clearTimeout(reconnectTimeout)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          Object.assign(sensorData, data)
        } catch (error) {
          console.error('[Arduino] Error parseando JSON:', error)
        }
      }

      ws.onerror = (error) => {
        console.error('[Arduino] Error WebSocket:', error)
        isConnected.value = false
      }

      ws.onclose = () => {
        console.log('[Arduino] Desconectado, intentando reconectar en 3s...')
        isConnected.value = false
        reconnectTimeout = setTimeout(connect, 3000)
      }
    } catch (error) {
      console.error('[Arduino] Error creando WebSocket:', error)
      isConnected.value = false
      reconnectTimeout = setTimeout(connect, 3000)
    }
  }

  const disconnect = () => {
    if (ws) {
      ws.close()
      ws = null
    }
    clearTimeout(reconnectTimeout)
  }

  // Iniciar conexión automáticamente
  connect()

  return {
    isConnected,
    sensorData,
    connect,
    disconnect
  }
}
