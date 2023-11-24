const ID = (window.name = window.name || Math.random().toString(36).slice(2))
const KEY = 'instances'
let CANVAS, CTX

window.addEventListener('load', () => {
  CANVAS = document.getElementsByTagName('canvas')[0]
  CANVAS.width = screen.availWidth
  CANVAS.height = screen.availHeight
  CTX = CANVAS.getContext('2d')

  // Update when localStorage changed
  window.addEventListener('storage', update)

  // Update when window is moved
  let cache
  setInterval(() => {
    if (screenX !== cache?.x || screenY !== cache?.y) {
      cache = { x: screenX, y: screenY }
      update()
    }
  }, 10)

  // Update when window is resized
  window.addEventListener('resize', update)

  window.addEventListener('unload', () => {
    const rects = JSON.parse(localStorage.getItem(KEY) ?? '{}')
    rects[ID].hidden = true
    localStorage.setItem(KEY, JSON.stringify(rects))
  })
})

function update() {
  // Update localStorage
  const instances = JSON.parse(localStorage.getItem(KEY) ?? '{}')
  instances[ID] = {
    x: screenX,
    y: screenY,
    width: innerWidth,
    height: innerHeight,
    color: instances[ID]?.color ?? `#${Math.random().toString(16).slice(2, 8)}`,
  }
  localStorage.setItem(KEY, JSON.stringify(instances))

  // Update canvas position
  Object.assign(CANVAS.style, { left: `${-screenX}px`, top: `${-screenY}px` })

  // Redraw
  CTX.clearRect(0, 0, screen.availWidth, screen.availHeight)
  Object.values(instances).forEach(instance => {
    if (!instance.hidden) {
      CTX.fillStyle = instance.color + '33'
      CTX.strokeStyle = instance.color
      CTX.lineWidth = 3
      CTX.strokeRect(instance.x, instance.y, instance.width, instance.height)
      CTX.fillRect(instance.x, instance.y, instance.width, instance.height)
    }
  })
}
