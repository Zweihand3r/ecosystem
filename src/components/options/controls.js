import React from 'react'

export const Checkbox = ({ children, text, value, onCheckChange }) => {
  return (
    <div className='ctrl checkbox-con'>
      <input 
        type='checkbox'
        value={value}
        onChange={e => onCheckChange(!value)}
      ></input>
      <div>{text || children}</div>
    </div>
  )
}

export const Button = ({ children, text, onClick }) => (
  <button 
    className='ctrl'
    onClick={onClick}
  >
    {text || children}
  </button>
)