import React from 'react'
import './App.css'

const Die = ({ value, toggleHeld, isHeld }) => {
    const style = {
        backgroundColor: isHeld ? '#1DA1F2' : 'white',
        color: isHeld ? 'white' : 'black',
    };
    return (
        <div
            className='die'
            onClick={toggleHeld}
            style={style}
        >
            <span className="die-num"> {value} </span>
        </div>
    )
}

export default Die;