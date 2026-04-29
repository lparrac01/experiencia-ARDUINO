// Funciones para dibujar en canvas de forma procedural

export const canvasRenderer = {
  drawBackground(ctx, width, height, time) {
    // Gradiente de fondo
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, '#1a1a2e')
    gradient.addColorStop(1, '#16213e')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Lineas animadas de fondo
    ctx.strokeStyle = 'rgba(100, 200, 255, 0.1)'
    ctx.lineWidth = 2
    for (let i = 0; i < 5; i++) {
      const offset = ((time * 20 + i * 120) % (width + 200)) - 200
      ctx.beginPath()
      ctx.moveTo(offset, 0)
      ctx.lineTo(offset + width, height)
      ctx.stroke()
    }
  },

  drawPlayer(ctx, x, y, radius, color) {
    // Sombra
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.beginPath()
    ctx.ellipse(x, y + radius + 5, radius, radius * 0.3, 0, 0, Math.PI * 2)
    ctx.fill()

    // Cuerpo principal
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()

    // Borde brillante
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(x, y, radius - 2, 0, Math.PI * 2)
    ctx.stroke()

    // Detalle en el centro
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.beginPath()
    ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.3, 0, Math.PI * 2)
    ctx.fill()
  },

  drawObstacle(ctx, x, y, width, height, color) {
    // Sombra
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.fillRect(x, y + 3, width, 3)

    // Cuerpo
    ctx.fillStyle = color
    ctx.fillRect(x, y, width, height)

    // Borde
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 2
    ctx.strokeRect(x, y, width, height)

    // Patrón de peligro
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(x + i * 15, y, 8, height)
    }
  },

  drawProjectile(ctx, x, y, radius, color) {
    // Glow
    ctx.fillStyle = `rgba(255, 217, 61, 0.3)`
    ctx.beginPath()
    ctx.arc(x, y, radius * 2, 0, Math.PI * 2)
    ctx.fill()

    // Core
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()

    // Brightness
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.beginPath()
    ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.4, 0, Math.PI * 2)
    ctx.fill()
  },

  drawHUD(ctx, score, lives, difficulty, isPaused, isGameOver, width, height) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
    ctx.fillRect(0, 0, width, 60)

    // Score
    ctx.fillStyle = '#00FF88'
    ctx.font = 'bold 24px Arial'
    ctx.fillText(`Score: ${score}`, 20, 40)

    // Lives
    ctx.fillStyle = lives > 1 ? '#00FF88' : '#FF6B6B'
    ctx.fillText(`❤️ ${lives}`, width / 2 - 50, 40)

    // Difficulty
    ctx.fillStyle = '#FFD93D'
    ctx.fillText(`Nivel: ${difficulty}`, width - 200, 40)

    // Paused message
    if (isPaused) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = 'white'
      ctx.font = 'bold 48px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('PAUSADO', width / 2, height / 2 - 40)
      ctx.font = '20px Arial'
      ctx.fillText('Presiona cualquier botón para continuar', width / 2, height / 2 + 40)
      ctx.textAlign = 'left'
    }

    // Game Over message
    if (isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = '#FF6B6B'
      ctx.font = 'bold 60px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('GAME OVER', width / 2, height / 2 - 60)

      ctx.fillStyle = 'white'
      ctx.font = '28px Arial'
      ctx.fillText(`Score Final: ${score}`, width / 2, height / 2 + 20)
      ctx.font = '18px Arial'
      ctx.fillText('Presiona btn1 para jugar de nuevo', width / 2, height / 2 + 80)
      ctx.textAlign = 'left'
    }
  },

  drawGame(ctx, gameState, canvasWidth, canvasHeight, time) {
    // Fondo
    this.drawBackground(ctx, canvasWidth, canvasHeight, time)

    // Obstáculos
    gameState.obstacles.forEach((obs) => {
      this.drawObstacle(ctx, obs.x, obs.y, obs.width, obs.height, obs.color)
    })

    // Proyectiles
    gameState.projectiles.forEach((proj) => {
      this.drawProjectile(ctx, proj.x, proj.y, proj.radius, proj.color)
    })

    // Jugador
    this.drawPlayer(ctx, gameState.playerX, gameState.playerY, gameState.playerRadius, gameState.playerColor)

    // HUD
    this.drawHUD(
      ctx,
      gameState.score,
      gameState.lives,
      gameState.difficulty,
      gameState.isPaused,
      gameState.gameOver,
      canvasWidth,
      canvasHeight
    )
  }
}
