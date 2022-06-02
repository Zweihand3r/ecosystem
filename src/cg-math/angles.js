import { drawCenteredGrid, drawCircle, drawLine } from "./cgm-util"

const POINT_SIZE = 5

let x1 = 0, y1 = 0, c1 = ''
let x2 = 0, y2 = 0, c2 = ''
let at1 = 0, atd1 = 0, a1 = 0, ad1 = 0
let at2 = 0, atd2 = 0, a2 = 0, ad2 = 0 

let point1Selected = true
let a = 0, ad = 0, va = 0, vda = 0

export const init = ctx => {
  x1 = 200
  y1 = 100
  x2 = 100
  y2 = 200

  const rand360_1 = Math.floor(Math.random() * 300)
  let rand360_2 = Math.floor(Math.random() * 300)
  rand360_2 += Math.abs(rand360_2 - rand360_1) < 60 ? 60 : 0
  console.log(rand360_1, rand360_2)
  c1 = `hsl(${rand360_1}, 100%, 65%)`
  c2 = `hsl(${rand360_2}, 100%, 65%)`
 
  ctx.translate(window.innerWidth / 2, window.innerHeight / 2)
}

export const renderLoop = (ctx, findex) => {
  update(findex)
  draw(ctx)
}

export const selectPoint = (x, y) => {
  x = ox(x)
  y = oy(y)
  const d1 = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2))
  const d2 = Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2))
  point1Selected = d1 < d2
}

export const movePoint = (x, y) => {
  if (point1Selected) {
    x1 = x - window.innerWidth / 2
    y1 = y - window.innerHeight / 2
  } else {
    x2 = x - window.innerWidth / 2
    y2 = y - window.innerHeight / 2
  }
}

const update = findex => {
  const a1x = x1 - 0
  const a1y = y1 - 0
  at1 = Math.atan(a1y / a1x)
  atd1 = Math.floor(Math.rad2Deg(at1))
  a1 = at1 + (a1x < 0 ? Math.PI : 0)
  a1 += a1 < 0 ? 2 * Math.PI : 0
  ad1 = Math.floor(Math.rad2Deg(a1))

  const a2x = x2 - 0
  const a2y = y2 - 0
  at2 = Math.atan(a2y / a2x)
  atd2 = Math.floor(Math.rad2Deg(at2))
  a2 = at2 + (a2x < 0 ? Math.PI : 0)
  a2 += a2 < 0 ? 2 * Math.PI : 0
  ad2 = Math.floor(Math.rad2Deg(a2))

  a = Math.abs(a2 - a1)
  a = a > Math.PI ? (2 * Math.PI - a) : a
  ad = Math.floor(Math.rad2Deg(a))
  
  const dot = x1 * x2 + y1 * y2
  const d1 = Math.sqrt(Math.pow(x1, 2) + Math.pow(y1, 2))
  const d2 = Math.sqrt(Math.pow(x2, 2) + Math.pow(y2, 2))
  va = Math.acos(dot / (d1 * d2))
  const _vda = Math.floor(Math.rad2Deg(va))
  
  if (vda !== _vda) {
    vda = _vda
    console.log(`Using vector math: ${vda.toFixed(0)}`)
  }
}

const draw = ctx => {
  ctx.clearRect(ox(0), oy(0), window.innerWidth, window.innerHeight)
  drawCenteredGrid(ctx)

  drawCircle(ctx, 0, 0, POINT_SIZE, '#fff')

  drawCircle(ctx, x1, y1, POINT_SIZE, c1)
  drawCircle(ctx, x1, 0, POINT_SIZE / 1.5, c1)
  drawCircle(ctx, 0, y1, POINT_SIZE / 1.5, c1)
  drawLine(ctx, 0, 0, x1, y1, ['#fff', c1])
  drawLine(ctx, x1, 0, x1, y1, [c1], { lineWidth: .35 })
  drawLine(ctx, 0, y1, x1, y1, [c1], { lineWidth: .35 })

  drawCircle(ctx, x2, y2, POINT_SIZE, c2)
  drawCircle(ctx, x2, 0, POINT_SIZE / 1.5, c2)
  drawCircle(ctx, 0, y2, POINT_SIZE / 1.5, c2)
  drawLine(ctx, 0, 0, x2, y2, ['#fff', c2])
  drawLine(ctx, x2, 0, x2, y2, [c2], { lineWidth: .35 })
  drawLine(ctx, 0, y2, x2, y2, [c2], { lineWidth: .35 })

  ctx.font = '15px verdana'
  ctx.fillStyle = c1
  ctx.fillText(y1, 10, y1 - 10)
  ctx.fillText(x1, x1 + 10, -10)
  const textA1 = `${atd1}°`
  let { width } = ctx.measureText(textA1)
  ctx.fillText(`${atd1}°`, x1 * .3 - width / 2, y1 * .1 + 6)
  ctx.fillText(`${ad1}° | ${at1.toFixed(2)} rads`, ox(12), oy(24))
  
  ctx.fillStyle = c2
  ctx.fillText(y2, 10, y2 - 10)
  ctx.fillText(x2, x2 + 10, -10)
  const textA2 = `${atd2}°`;
  ({ width } = ctx.measureText(textA2))
  ctx.fillText(`${atd2}°`, x2 * .3 - width / 2, y2 * .1 + 6)
  ctx.fillText(`${ad2}° | ${at2.toFixed(2)} rads`, ox(12), oy(48))
  
  ctx.fillStyle = '#777'
  ctx.fillText('Angle Between', ox(12), oy(80))
  ctx.fillStyle = '#fff'
  ctx.fillText(`${ad}° | ${a.toFixed(2)} rads`, ox(12), oy(104))
}

const ox = x => x - window.innerWidth / 2
const oy = y => y - window.innerHeight / 2
