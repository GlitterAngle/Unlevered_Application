// import React from 'react'
import {Link} from 'react-router-dom'


const nav = () => {

  return (
    <div>
      <ul>
        <li><Link to="apple">Apple</Link></li>
        <li><Link to="">Home</Link></li>
      </ul>
    </div>
  )
}

export default nav