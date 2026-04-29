import { reactive, watch } from 'vue'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const PLAYER_RADIUS = 15

export function useGameState(sensorData) {
  const gameState = reactive({
    // Jugador
    playerX: CANVAS_WIDTH / 2,
    playerY: CANVAS_HEIGHT / 2,
    playerVelX: 0,
    playerVelY: 0,
    playerRadius: PLAYER_RADIUS,
    playerColor: '#FF6B6B',

    // Game vars
    score: 0,
    lives: 3,
    gameOver: false,
    isPaused: false,

    // Obstacles
    obstacles: [],
    projectiles: [],

    // Game system
    time: 0,
    difficulty: 1,
    spawnRate: 1.5
  })

  const OBSTACLE_WIDTH = 40
  const OBSTACLE_HEIGHT = 40
  const MAX_OBSTACLES = 8

  // Normalizar valor del joystick (-512 a 512) a rango de velocidad (-6 a 6)
  const normalizeJoystick = (value) => {
    return (value / 512) * 6
  }

  // Update game state each frame
  const update = (deltaTime = 1 / 60) => {
    if (gameState.gameOver || gameState.isPaused || !sensorData) return

    gameState.time += deltaTime

    // Mover jugador según joystick
    if (sensorData.joystick) {
      gameState.playerVelX = -normalizeJoystick(sensorData.joystick.x)
      gameState.playerVelY = normalizeJoystick(sensorData.joystick.y)
    }

    // Aplicar velocidad
    gameState.playerX += gameState.playerVelX
    gameState.playerY += gameState.playerVelY

    // Limites de canvas
    gameState.playerX = Math.max(
      gameState.playerRadius,
      Math.min(CANVAS_WIDTH - gameState.playerRadius, gameState.playerX)
    )
    gameState.playerY = Math.max(
      gameState.playerRadius,
      Math.min(CANVAS_HEIGHT - gameState.playerRadius, gameState.playerY)
    )

    // Spawnar obstáculos
    if (gameState.time % (1 / gameState.spawnRate) < 0.016 && gameState.obstacles.length < MAX_OBSTACLES) {
      spawnObstacle()
    }

    // Mover obstáculos
    gameState.obstacles = gameState.obstacles.filter((obs) => {
      obs.y += obs.speed
      return obs.y < CANVAS_HEIGHT + 50
    })

    // Verificar colisiones con obstáculos
    gameState.obstacles.forEach((obs, index) => {
      if (checkCollision(gameState.playerX, gameState.playerY, gameState.playerRadius, obs)) {
        gameState.obstacles.splice(index, 1)
        gameState.lives--
        if (gameState.lives <= 0) {
          endGame()
        }
      }
    })

    // Mover proyectiles
    gameState.projectiles = gameState.projectiles.filter((proj) => proj.y > 0)
    gameState.projectiles.forEach((proj) => {
      proj.y -= proj.speed
    })

    // Colisiones entre proyectiles y obstáculos
    gameState.projectiles.forEach((proj, projIndex) => {
      gameState.obstacles.forEach((obs, obsIndex) => {
        if (
          proj.x > obs.x &&
          proj.x < obs.x + obs.width &&
          proj.y > obs.y &&
          proj.y < obs.y + obs.height
        ) {
          gameState.projectiles.splice(projIndex, 1)
          gameState.obstacles.splice(obsIndex, 1)
          gameState.score += 10
        }
      })
    })

    // Incrementar dificultad cada 15 segundos
    gameState.difficulty = 1 + Math.floor(gameState.time / 15)
    gameState.spawnRate = 1.5 + gameState.difficulty * 0.3
  }

  const spawnObstacle = () => {
    const x = Math.random() * (CANVAS_WIDTH - OBSTACLE_WIDTH)
    const obstacle = {
      x,
      y: -OBSTACLE_HEIGHT,
      width: OBSTACLE_WIDTH,
      height: OBSTACLE_HEIGHT,
      speed: 2 + gameState.difficulty * 0.5,
      color: '#4ECDC4'
    }
    gameState.obstacles.push(obstacle)
  }

  const checkCollision = (px, py, radius, obs) => {
    const closestX = Math.max(obs.x, Math.min(px, obs.x + obs.width))
    const closestY = Math.max(obs.y, Math.min(py, obs.y + obs.height))

    const distX = px - closestX
    const distY = py - closestY

    return distX * distX + distY * distY < radius * radius
  }

  const fire = () => {
    if (!gameState.gameOver && !gameState.isPaused) {
      gameState.projectiles.push({
        x: gameState.playerX,
        y: gameState.playerY - gameState.playerRadius,
        speed: 5,
        radius: 5,
        color: '#FFD93D'
      })
    }
  }

  const endGame = () => {
    gameState.gameOver = true
  }

  const reset = () => {
    gameState.playerX = CANVAS_WIDTH / 2
    gameState.playerY = CANVAS_HEIGHT / 2
    gameState.playerVelX = 0
    gameState.playerVelY = 0
    gameState.score = 0
    gameState.lives = 3
    gameState.gameOver = false
    gameState.isPaused = false
    gameState.time = 0
    gameState.difficulty = 1
    gameState.spawnRate = 1.5
    gameState.obstacles = []
    gameState.projectiles = []
  }

  const togglePause = () => {
    gameState.isPaused = !gameState.isPaused
  }

  // Detectar botón 1 para disparar
  watch(
    () => sensorData?.botones?.btn1,
    (newVal, oldVal) => {
      if (newVal === 1 && oldVal === 0) {
        fire()
      }
    }
  )

  return {
    gameState,
    update,
    fire,
    reset,
    togglePause,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  }
}
