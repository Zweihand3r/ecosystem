import React, { useRef, useEffect } from 'react'
import { 
  init as initAngles,
  renderLoop as renderLoopAngles, 
  movePoint,
  selectPoint,
} from './angles'

import './cg-math.css'

let animationFrameId, findex = 0
let isMouseDown = false

const CgMath = props => {
  const canvasRef = useRef(null)

  const mouseDown = e => {
    isMouseDown = true
    selectPoint(e.clientX, e.clientY)
  }
  const mouseMove = e => {
    if (isMouseDown) {
      movePoint(e.clientX, e.clientY)
    }
  }
  const mouseUp = () => isMouseDown = false

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    canvas.setAttribute('width', window.innerWidth)
    canvas.setAttribute('height', window.innerHeight)

    const init = () => {
      context.save()
      initAngles(context)
    }

    const render = () => {
      findex += 1
      renderLoopAngles(context, findex)
      animationFrameId = window.requestAnimationFrame(render)
    }

    init()
    animationFrameId = window.requestAnimationFrame(render)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div 
      className='cg-math'
      onMouseDown={mouseDown}
      onMouseMove={mouseMove}
      onMouseUp={mouseUp}
    >
      <canvas ref={canvasRef} {...props} />
    </div>
  )
}

export default CgMath