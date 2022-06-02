export const drawCircle = (ctx, x, y, radius, color) => {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI)
  ctx.closePath()
  ctx.fill()
}

export const drawLine = (ctx, x1, y1, x2, y2, colors, optionals) => {
  const { 
    dashed = false,
    lineWidth = 1 
  } = optionals || { 
    dashed: false,
    lineWidth: 1
  }
  if (colors.length > 1) {
    const grad = ctx.createLinearGradient(x1, y1, x2, y2)
    grad.addColorStop(0, colors[0])
    grad.addColorStop(1, colors[1])
    ctx.strokeStyle = grad
  } else {
    ctx.strokeStyle = colors[0]
  }
  if (dashed) {
    ctx.setLineDash([10, 5])
  }
  ctx.beginPath()
  ctx.lineWidth = lineWidth
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.closePath()
  ctx.stroke()
  if (dashed) {
    ctx.setLineDash([])
  }
}

export const drawCenteredGrid = ctx => {
  const vertCount = window.innerHeight / 2 % 100
  const horzCount = window.innerWidth / 2 % 100

  ctx.strokeStyle = '#222'
  ctx.lineWidth = 1
  ctx.beginPath()

  for (let i = 1; i < vertCount; i++) {
    const y = 100 * i

    ctx.moveTo(-window.innerWidth / 2, y)
    ctx.lineTo(window.innerWidth / 2, y)
    ctx.moveTo(-window.innerWidth / 2, -y)
    ctx.lineTo(window.innerWidth / 2, -y)
  }

  for (let i = 1; i < horzCount; i++) {
    const x = 100 * i

    ctx.moveTo(x, -window.innerHeight / 2)
    ctx.lineTo(x, window.innerHeight / 2)
    ctx.moveTo(-x, -window.innerHeight / 2)
    ctx.lineTo(-x, window.innerHeight / 2)
  }

  ctx.stroke()

  ctx.strokeStyle = '#555'
  ctx.beginPath()

  ctx.moveTo(-window.innerWidth / 2, 0)
  ctx.lineTo(window.innerWidth / 2, 0)
  ctx.moveTo(0, -window.innerHeight / 2)
  ctx.lineTo(0, window.innerHeight / 2)

  ctx.stroke()
}