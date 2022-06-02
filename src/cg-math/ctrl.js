const POINT_SIZE = 5
const points = []
const t = {
  add: false,
  line: false,
}
const props = {
  add: 'add',
  line: 'line'
}
let si = -1
let pressed = true
let line = [-2, -1]

export const click = (x, y) => {
  if (t.add) {
    points.push({ 
      id: points.length, x, y, 
      c: `hsl(${Math.random() * 360}, 100%, 50%)` 
    })
  } else {
    const cx = x, cy = y
    points.forEach(({ x, y, c }, i) => {
      if (Math.sqrt(Math.pow(cx - x, 2) + Math.pow(cy - y, 2)) < POINT_SIZE) {
        if (t.line && si !== i) {
          line = [si, i]
          si = i
          toggle(props.line, 'Line')
        } else {
          si = i
        }
      }
    })
  }
}

export const mouseDown = (x, y) => {
  pressed = true
}

export const mouseMove = (x, y) => {
  movePoint(x, y)
}

export const mouseUp = () => {
  pressed = false
}

export const renderLoop = (ctx, findex) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  points.forEach(({ x, y, c }, i) => {
    if (si === i) {
      ctx.fillStyle = c
    } else {
      ctx.strokeStyle = c
      ctx.lineWidth = 1
    }

    ctx.beginPath()
    ctx.arc(x, y, POINT_SIZE, 0, 2 * Math.PI)
    ctx.closePath()

    if (si === i) {
      ctx.fill()
    } else {
      ctx.stroke()
    }
  })

  const [i1, i2] = line
  if (i1 > -1 && i2 > -1) {
    const x1 = points[i1].x, y1 = points[i1].y, c1 = points[i1].c
    const x2 = points[i2].x, y2 = points[i2].y, c2 = points[i2].c

    const grad = ctx.createLinearGradient(x1, y1, x2, y2)
    grad.addColorStop(0, c1)
    grad.addColorStop(1, c2)
    ctx.strokeStyle = grad
    ctx.lineWidth = 1

    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.closePath()

    ctx.stroke()

    const ax = x2 - x1
    const ay = y2 - y1
    const a = Math.atan(ay / ax)
    notify(`angle atan: ${n(Math.rad2Deg(a))}° ${n(a)}rad`)
  }
}

const movePoint = (x, y) => {
  if (pressed && !t.add && si > -1) {
    points[si].x = x
    points[si].y = y
  }
}

const notify = notification => {
  console.log(notification)
}

const toggle = (prop, name) => {
  for (let key in t) {
    t[key] = key === prop ? !t[key] : false
  }
  notify(`${name} ${t[prop] ? 'ON' : 'OFF'}`)
}

window.addEventListener('keydown', e => {
  // console.log(`keydown key=${e.key} code=${e.code}`)
  switch (e.key) {
    case 'a': toggle(props.add, 'Add'); break
    case 'l': toggle(props.line, 'Line'); break
    default: break
  }
})

const n = (v, f = 2) => Number(v).toFixed(2)  