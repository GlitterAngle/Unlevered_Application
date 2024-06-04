import React from 'react'

interface AppleProps{
    stockInfo: any
}

const Apple: React.FC<AppleProps> = ({stockInfo}) => {
  return (
    <div>Apple</div>
  )
}

export default Apple