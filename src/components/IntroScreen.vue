<template>
  <div class="intro-screen">
    <div class="intro-content">
      <div class="logo">🎮</div>
      <h1>Experiencia Arduino</h1>
      <h2>Guided Ball</h2>
      
      <div class="description">
        <p>Una experiencia interactiva lúdica controlada por Arduino Esplora</p>
      </div>

      <div class="controls-section">
        <h3>Como Jugar</h3>
        <div class="control-item">
          <span class="icon">🕹️</span>
          <div>
            <strong>Joystick</strong>
            <p>Mueve la bola alrededor de la pantalla</p>
          </div>
        </div>
        <div class="control-item">
          <span class="icon">🔘</span>
          <div>
            <strong>Botón 1</strong>
            <p>Dispara proyectiles para destruir obstáculos</p>
          </div>
        </div>
        <div class="control-item">
          <span class="icon">⚠️</span>
          <div>
            <strong>Objetivo</strong>
            <p>Esquiva los obstáculos que descienden y dispara para ganar puntos</p>
          </div>
        </div>
      </div>

      <div class="connection-status">
        <div class="status-indicator" :class="{ connected: isConnected, disconnected: !isConnected }"></div>
        <span>{{ isConnected ? 'Arduino conectado' : 'Esperando Arduino...' }}</span>
      </div>

      <button 
        @click="startGame" 
        class="start-button"
        :disabled="!isConnected"
      >
        {{ isConnected ? 'Empezar Juego' : 'Reconectando...' }}
      </button>

      <div class="footer">
        <p>Versión 1.0 | Créativo & Interactivo</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isConnected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['start-game'])

const startGame = () => {
  emit('start-game')
}
</script>

<style scoped>
.intro-screen {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
}

.intro-content {
  background: white;
  border-radius: 20px;
  padding: 50px;
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.logo {
  font-size: 60px;
  margin-bottom: 20px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

h1 {
  font-size: 2.5rem;
  color: #667eea;
  margin: 0;
  font-weight: 700;
}

h2 {
  font-size: 1.8rem;
  color: #764ba2;
  margin: 10px 0 30px 0;
  font-weight: 600;
}

.description {
  margin: 30px 0;
  color: #666;
  font-size: 1.1rem;
}

.controls-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 25px;
  margin: 30px 0;
  text-align: left;
}

.controls-section h3 {
  color: #333;
  margin: 0 0 20px 0;
  font-size: 1.3rem;
}

.control-item {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  align-items: flex-start;
}

.control-item:last-child {
  margin-bottom: 0;
}

.control-item .icon {
  font-size: 28px;
  min-width: 40px;
}

.control-item strong {
  color: #667eea;
  display: block;
  margin-bottom: 4px;
}

.control-item p {
  color: #666;
  margin: 0;
  font-size: 0.95rem;
}

.connection-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 25px 0;
  padding: 12px;
  background: #f0f0f0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #555;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

.status-indicator.connected {
  background-color: #00ff00;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.6);
}

.status-indicator.disconnected {
  background-color: #ff6b6b;
  box-shadow: 0 0 10px rgba(255, 107, 107, 0.6);
  animation: none;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.start-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 50px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
  margin: 20px 0;
}

.start-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.6);
}

.start-button:active:not(:disabled) {
  transform: translateY(0);
}

.start-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.footer {
  margin-top: 30px;
  color: #999;
  font-size: 0.85rem;
}

.footer p {
  margin: 0;
}

@media (max-width: 768px) {
  .intro-content {
    padding: 30px;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.4rem;
  }

  .logo {
    font-size: 45px;
  }

  .controls-section {
    padding: 15px;
  }

  .controls-section h3 {
    font-size: 1.1rem;
  }

  .control-item .icon {
    font-size: 24px;
  }

  .start-button {
    padding: 12px 40px;
    font-size: 1rem;
  }
}
</style>
