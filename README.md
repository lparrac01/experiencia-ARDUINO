# 🎮 Experiencia Arduino - Guided Ball

Una aplicación web interactiva lúdica que transforma los datos del Arduino Esplora en un juego arcade en tiempo real.

## 📋 Características

- ✅ **Conexión en tiempo real** vía WebSocket al Arduino Esplora
- ✅ **Juego interactivo** controlado por joystick y botones físicos
- ✅ **Visualización dinámica** con Canvas 2D procedural
- ✅ **Panel de debug** que muestra datos de sensores en vivo
- ✅ **Pantalla de bienvenida** con instrucciones
- ✅ **Responsive** - funciona en desktop y tablets
- ✅ **Sin dependencias pesadas** - Vue 3 + Vite minimal

## 🕹️ Cómo Jugar

### Controles
- **🕹️ Joystick**: Mueve la bola por la pantalla
- **🔘 Botón 1**: Dispara proyectiles para destruir obstáculos
- **🔘 Botón 2-4**: Reservados para expansiones futuras
- **📊 Objetivo**: Esquiva obstáculos que descienden y gana puntos disparando

### Mecánica
- Cada obstáculo esquivado suma automáticamente puntos
- Disparar a un obstáculo suma **+10 puntos**
- Cada colisión con un obstáculo resta **1 vida**
- La dificultad aumenta cada 15 segundos (más obstáculos, más rápidos)
- Pierde cuando llega a 0 vidas
- Puede reiniciar desde la pantalla de "Game Over"

## 🚀 Instalación

### Requisitos
- Node.js 18+ y npm 9+
- Arduino Esplora conectado y servidor Node.js ejecutándose en `https://arduino.arroyocreativa.com`

### Setup

```bash
# Clonar repo
git clone https://github.com/lparrac01/experiencia-ARDUINO.git
cd experiencia-ARDUINO

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

Abre http://localhost:5173 en tu navegador.

### Producción

```bash
npm run build
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── App.vue                 # Componente raíz
├── components/
│   ├── GameCanvas.vue      # Canvas principal + game loop
│   ├── StatusPanel.vue     # Panel de debug con datos de sensores
│   └── IntroScreen.vue     # Pantalla de bienvenida
├── composables/
│   ├── useArduino.js       # Hook WebSocket → sensorData reactivo
│   └── useGameState.js     # Lógica del juego (colisiones, puntuación)
├── utils/
│   └── canvasRenderer.js   # Funciones procedurales para dibujar
└── main.js
```

## 🔌 API Arduino

La aplicación consume datos del servidor Arduino en:

```
wss://arduino.arroyocreativa.com
```

**Sensores disponibles:**
- `joystick.x`, `joystick.y` (-512 a 512) — Control principal
- `botones.btn1`, `btn2`, `btn3`, `btn4` (0 = suelto, 1 = presionado)
- `luz` (0-1023) — Fotoresistor
- `temperatura` (°C) — Sensor thermal
- `acelerometro.x`, `.y`, `.z` (-512 a 512) — 3 ejes
- `slider` (0-1023) — Potenciómetro lineal
- `microfono` (0-1023) — Amplitud del audio
- `timestamp` (ISO 8601) — Marca de tiempo server

Para más detalles, ver [PDR.md](PDR.md).

## 🎨 Tecnologías

- **Vue 3** - Framework progression con reactivity
- **Vite** - Bundler ultrarrápido
- **Canvas 2D** - Renderizado procedural (sin imágenes)
- **WebSocket** - Comunicación en tiempo real
- **CSS3** - Animaciones y gradientes

## 🔄 Game Loop (60 FPS)

1. **Input**: Lee valores de sensores del WebSocket
2. **Update**: Calcula colisiones, movimientos, puntuación
3. **Render**: Dibuja escena en canvas a través de `canvasRenderer`

## 🐛 Panel de Debug

El `StatusPanel` en la parte superior muestra:
- 🟢/🔴 Estado de conexión WebSocket
- Valores raw de todos los sensores
- Refrescador en vivo (~10ms)

Útil para verificar que el Arduino está enviando datos correctamente.

## 📈 Roadmap Futuro

- [ ] Sensores luz/temperatura integrados en gameplay
- [ ] Diferentes niveles/modos de juego
- [ ] Sistema de potenciadores
- [ ] Leaderboard local
- [ ] Añadir sonidos (Web Audio API)
- [ ] Multijugador (múltiples placas)
- [ ] Personalización de colores/tema

## 📝 Notas Técnicas

- **Latencia**: ~50-150ms desde Arduino a pantalla (imperceptible para juego casual)
- **Frame rate**: 60 FPS target
- **Canvas resolution**: 800x600 (escalas automáticamente)
- **No requiere autenticación** - Servidor Arduino es público y read-only

## 🤝 Contribuir

Si encuentras bugs o tienes ideas, abre un issue o PR.

## 📄 Licencia

Proyecto educativo/artístico. Libre para uso no comercial.

---

**Desarrollado con ❤️ para la experiencia interactiva con Arduino Esplora**
