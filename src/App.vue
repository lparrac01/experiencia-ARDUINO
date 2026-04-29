<template>
  <div class="app-container">
    <IntroScreen 
      v-if="!gameStarted" 
      :isConnected="isConnected"
      @start-game="startGame"
    />
    <template v-else>
      <div class="header">
        <h1>🎮 Experiencia Arduino - Guided Ball</h1>
        <StatusPanel />
      </div>
      <div class="main-content">
        <GameCanvas />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GameCanvas from './components/GameCanvas.vue'
import StatusPanel from './components/StatusPanel.vue'
import IntroScreen from './components/IntroScreen.vue'
import { useArduino } from './composables/useArduino'

const { isConnected } = useArduino()
const gameStarted = ref(false)

const startGame = () => {
  gameStarted.value = true
}
</script>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
}

.header {
  text-align: center;
  color: white;
}

.header h1 {
  font-size: 2rem;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 1.5rem;
  }
}
</style>
