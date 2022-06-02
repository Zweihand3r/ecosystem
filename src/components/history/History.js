import React, { useEffect, useRef } from 'react'
import { colors } from '../../constants/critconst'

const NUM_MULT = 10

let ctx

const ploty = (x) => window.innerHeight - x

const History = ({ history, trigger }) => {
  const canvasRef = useRef(null)

  const drawAxes = () => {
    ctx.strokeStyle = '#aaa'
    ctx.moveTo(20, ploty(20))
    ctx.lineTo(20, ploty(window.innerHeight - 20))
    ctx.moveTo(20, ploty(20))
    ctx.lineTo(window.innerWidth - 20, ploty(20))
    ctx.stroke()
  }

  const plotPoints = (points, color) => {
    let i = 0
    ctx.strokeStyle = color

    ctx.beginPath()
    ctx.moveTo(20, ploty(points[0] * NUM_MULT + 20))
    while (++i < points.length - 1) {
      if (points[i - 1] || points[i]) {
        ctx.lineTo(i + 20, ploty(points[i] * NUM_MULT + 20))
      }
    }
    ctx.stroke()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    canvas.setAttribute('width', window.innerWidth)
    canvas.setAttribute('height', window.innerHeight)

    ctx = canvas.getContext('2d')
    ctx.lineWidth = 1
  }, [])

  useEffect(() => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    drawAxes()

    const pList = [], hList = [], cList = []
    let step = 1

    if (history.length) {
      const graphWidth = window.innerWidth - 40
      if (history.length > graphWidth) {
        step = history.length / graphWidth
      }

      for (let i = 0; i < history.length; i += step) {
        const { p, h, c } = history[Math.floor(i)]
        pList.push(p)
        hList.push(h)
        cList.push(c)
      }

      plotPoints(pList, colors.plant)
      plotPoints(hList, colors.herbivore)
      plotPoints(cList, colors.carnivore)
    }
  }, [history, trigger])

  return (
    <canvas className='dim' ref={canvasRef} />
  )
}

export default History