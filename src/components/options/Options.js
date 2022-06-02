import React, { useState } from 'react'
import { Button, Checkbox } from './controls'

import './options.css'

const Options = ({ onRestart, onHistoryToggle }) => {
  const [show, setShow] = useState(false)
  const [drawLines, setDrawLines] = useState(false)
  const [drawRange, setDrawRange] = useState(false)
  const [useAccel, setUseAccel] = useState(false)
  
  const updateDrawLines = v => {
    setDrawLines(v)
    window.isIndicateTarget = v
  }

  const updateDrawRange = v => {
    setDrawRange(v)
    window.isDrawRange = v
  }

  const updateUseAccel = v => {
    setUseAccel(v)
    window.useAccel = v
  }

  return (
    <div className='options-root'>
      {!show && (
        <div className='options-ico' onClick={() => setShow(true)}>
          <img src='images/setting.svg' alt='Options' />
        </div>
      )}
      {show && (
        <div className='options-panel'>
          <Checkbox 
            text='Draw line to target'
            value={drawLines}
            onCheckChange={updateDrawLines}
          />
          
          <Checkbox
            text='Draw sense range'
            value={drawRange}
            onCheckChange={updateDrawRange}
          />
          
          <Checkbox
            text='Use Acceleration'
            value={useAccel}
            onCheckChange={updateUseAccel}
          />

          <Button onClick={onRestart}>Restart</Button>
          <Button onClick={onHistoryToggle}>Toggle history</Button>

          <div className='info'>
            <span>Keyboard Shortcuts</span>
            <Shortcut key1='Space' desc='Play / Pause' />
            <Shortcut key1='H' desc='Toggle History' />
            <Shortcut key1='1-9' desc='Sim Speed' />
          </div>
          
          <Button onClick={() => setShow(false)}>Close this panel</Button>
        </div>
      )}
    </div>
  )
}

const Shortcut = ({ key1, desc }) => (
  <div>
    <span>{key1}</span>
    <span>{desc}</span>
  </div>
)

export default Options