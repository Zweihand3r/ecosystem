import React, { useEffect, useState, useRef, useCallback } from 'react'
import History from '../history/History'
import Options from '../options/Options'
import { draw, getHistory, restart, update } from '../../controllers/world'

import './world.css'

const NUM_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

let tindex = 1
let findex = 0, animationFrameId, isRunning = true
let history = [], historyRefreshInterval

const World = props => {
  const [historyTrigger, setHistoryTrigger] = useState(0)

  const canvasRef = useRef(null)

  window.isIndicateTarget = false
  window.isDrawRange = false
  window.accel = 0

  const toggleHistory = useCallback(() => {
    const setHistory = h => {
      history = h
      setHistoryTrigger(pv => 1 - pv)
    }
  
    const refreshHistory = () => {
      setHistory(getHistory())
    }
  
    if (history.length) {
      setHistory([])
      if (historyRefreshInterval) {
        clearInterval(historyRefreshInterval)
      }
    } else {
      refreshHistory()
      historyRefreshInterval = setInterval(refreshHistory, 50)
    }
  }, [])

  useEffect(() => {
    const keypress = e => {
      // console.log(e.code)
      if (e.code === 'KeyH') {
        toggleHistory()
      } else if (NUM_KEYS.includes(e.key)) {
        const num = parseInt(e.key)
        tindex = num * num
      }
    }
      
    window.addEventListener('keypress', keypress)

    return () => {
      window.removeEventListener('keypress', keypress)
    }
  }, [toggleHistory])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    canvas.setAttribute('width', window.innerWidth)
    canvas.setAttribute('height', window.innerHeight)

    const render = () => {
      findex += 1

      if (findex % tindex === 0) {
        update(findex)
        draw(context, findex)
      }
    }

    const renderLoop = () => {
      render()
      animationFrameId = window.requestAnimationFrame(renderLoop)
    }

    const keypress = e => {
      // console.log(e.code)
      if (e.code === 'Space') {
        isRunning = !isRunning
        if (!isRunning) {
          window.cancelAnimationFrame(animationFrameId)
        } else {
          animationFrameId = window.requestAnimationFrame(renderLoop)
        }
      } else if (e.code === 'KeyN') {
        if (!isRunning) {
          animationFrameId = window.requestAnimationFrame(render)
        }
      }
    }

    animationFrameId = window.requestAnimationFrame(renderLoop)
    window.addEventListener('keypress', keypress)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      window.removeEventListener('keypress', keypress)
    }
  }, [])

  return (
    <div className='world'>
      <canvas ref={canvasRef} {...props} />
      {history.length && (
        <History 
          history={history}
          trigger={historyTrigger} 
        />
      )}
      <Options
        onRestart={restart}
        onHistoryToggle={toggleHistory} 
      />
    </div>
  )
}

export default World