<template>
  <div class="game-wrapper">
    <div class="game-container">
      <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight" class="game-canvas"></canvas>
    </div>
    <div class="instructions">
      <p><strong>Controles:</strong></p>
      <p>🕹️ <strong>Joystick:</strong> Mueve la bola</p>
      <p>🔘 <strong>Btn1:</strong> Dispara proyectiles</p>
      <p>📊 <strong>Objetivo:</strong> Esquiva los obstáculos y dispara para ganar puntos</p>
      <button v-if="gameState.gameOver" @click="resetGame" class="reset-button">Jugar de nuevo</button>
      <button @click="togglePause" class="pause-button">{{ gameState.isPaused ? 'Reanudar' : 'Pausar' }}</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useArduino } from '../composables/useArduino'
import { useGameState } from '../composables/useGameState'
import { canvasRenderer } from '../utils/canvasRenderer'

const canvas = ref(null)
let ctx = null
let animationFrameId = null
let gameLoopTime = 0

const { sensorData, isConnected } = useArduino()
const { gameState, update, reset, togglePause, CANVAS_WIDTH, CANVAS_HEIGHT } = useGameState(sensorData)

const canvasWidth = CANVAS_WIDTH
const canvasHeight = CANVAS_HEIGHT

const gameLoop = () => {
  if (!ctx) return

  // Actualizar lógica del juego
  update(1 / 60)
  gameLoopTime += 1 / 60

  // Renderizar
  canvasRenderer.drawGame(ctx, gameState, canvasWidth, canvasHeight, gameLoopTime)

  animationFrameId = requestAnimationFrame(gameLoop)
}

const resetGame = () => {
  reset()
  gameLoopTime = 0
}

const setupCanvas = () => {
  if (!canvas.value) return

  ctx = canvas.value.getContext('2d')

  // HD canvas scaling
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.value.getBoundingClientRect()
  canvas.value.width = canvasWidth * dpr
  canvas.value.height = canvasHeight * dpr
  ctx.scale(dpr, dpr)

  // Initial draw
  canvasRenderer.drawBackground(ctx, canvasWidth, canvasHeight, 0)
  canvasRenderer.drawPlayer(ctx, gameState.playerX, gameState.playerY, gameState.playerRadius, gameState.playerColor)
}

// Detectar cambios en botones para disparar
watch(
  () => sensorData?.botones?.btn1,
  (newVal, oldVal) => {
    if (!gameState.gameOver && !gameState.isPaused && newVal === 1 && oldVal === 0) {
      // El disparo se maneja en useGameState
    }
  }
)

onMounted(() => {
  setupCanvas()
  gameLoop()
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<style scoped>
.game-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.game-container {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  padding: 5px;
}

.game-canvas {
  display: block;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  max-width: 100%;
  height: auto;
  width: 800px;
  max-width: 90vw;
}

.instructions {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  max-width: 600px;
  text-align: left;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.instructions p {
  margin: 8px 0;
  color: #333;
  font-size: 0.95rem;
  line-height: 1.6;
}

.instructions strong {
  color: #667eea;
}

.reset-button,
.pause-button {
  margin-top: 15px;
  margin-right: 10px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.reset-button:hover,
.pause-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
}

.reset-button:active,
.pause-button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .game-canvas {
    width: 100%;
    max-width: 90vw;
  }

  .instructions {
    font-size: 0.85rem;
  }

  .reset-button,
  .pause-button {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}
</style>
