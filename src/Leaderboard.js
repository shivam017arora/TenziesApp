import React, { useEffect, useState } from 'react'
import './Leaderboard.css'


const LeaderBoardItem = ({ score }) => {
    return (
        <div className='leaderboard-item'>
            <div className='leaderboard-item-name'>
                {score.name}
            </div>
            <div className='leaderboard-item-score'>
                {score.score}
            </div>
        </div>
    )
}


const Leaderboard = ({ scores }) => {
    return (
        <div className='leaderboard'>
            <h4> Top Scores </h4>
            <div className='leaderboard_items_container'>
                {scores.map(score => <LeaderBoardItem key={score.id} score={score.data} />)}
            </div>
        </div>
    )
}

export default Leaderboard;