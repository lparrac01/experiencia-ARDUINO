<template>
  <div class="status-panel">
    <div class="status-item">
      <span class="status-indicator" :class="{ connected: isConnected, disconnected: !isConnected }"></span>
      <span class="status-text">{{ isConnected ? 'Conectado' : 'Desconectado' }}</span>
    </div>
    <div class="sensor-values">
      <div class="sensor-line">
        <strong>Joystick:</strong> X: {{ sensorData.joystick.x.toFixed(0) }} Y: {{ sensorData.joystick.y.toFixed(0) }}
      </div>
      <div class="sensor-line">
        <strong>Botones:</strong> Btn1: {{ sensorData.botones.btn1 }} Btn2: {{ sensorData.botones.btn2 }} Btn3:
        {{ sensorData.botones.btn3 }} Btn4: {{ sensorData.botones.btn4 }}
      </div>
      <div class="sensor-line">
        <strong>Luz:</strong> {{ sensorData.luz }} | <strong>Temp:</strong> {{ sensorData.temperatura }}°C
      </div>
      <div class="sensor-line">
        <strong>Acelerómetro:</strong> X: {{ sensorData.acelerometro.x }} Y: {{ sensorData.acelerometro.y }}
        Z: {{ sensorData.acelerometro.z }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useArduino } from '../composables/useArduino'

const { isConnected, sensorData } = useArduino()
</script>

<style scoped>
.status-panel {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 15px;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 0.85rem;
  font-family: 'Courier New', monospace;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

.status-indicator.connected {
  background-color: #00ff00;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.6);
}

.status-indicator.disconnected {
  background-color: #ff3333;
  box-shadow: 0 0 10px rgba(255, 51, 51, 0.6);
  animation: none;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.status-text {
  font-weight: bold;
  color: #333;
}

.sensor-values {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 10px;
}

.sensor-line {
  color: #555;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .sensor-values {
    grid-template-columns: 1fr;
  }

  .status-panel {
    font-size: 0.7rem;
  }
}
</style>
