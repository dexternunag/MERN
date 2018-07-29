import React from 'react'
import spinner from './spinner.gif'

export default () => {
  return (
    <div>
      <img 
        src={spinner}
        alt="Loading..." 
        style={{
          display: 'block',
          margin: 'auto',
          width: '200px'
        }}
      />
    </div>
  )
}
