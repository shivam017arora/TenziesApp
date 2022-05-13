import React, { useEffect, useState } from 'react';
import './Game.css';
import Die from './Die';
import Confetti from 'react-confetti'
import { doc, setDoc } from "firebase/firestore";
import { db } from './config';


const Game = ({ user, isStarted, toggleIsStarted }) => {
    const [dices, setDices] = useState([]);
    const [tenzies, setTenzies] = useState(false);
    const [score, setScore] = useState(0);
    const [startTime, setStartTime] = useState(null);

    useEffect(() => {
        if (isStarted) {
            setDices(() => allNewDice());
            setStartTime(Date.now());
            setTenzies(false);
        } else {
            setStartTime(null);
        }
    }, [isStarted]);

    useEffect(() => {
        if (tenzies) {
            const score = Date.now() - startTime;
            toggleIsStarted(); // stop the game
            setScore(score);
            if (user) {
                const uploadScore = async () => {
                    await setDoc(doc(db, 'scores', user?.email),
                        {
                            score,
                            name: user?.displayName,
                        });
                }
                uploadScore();
            }
        }
    }, [tenzies]);

    useEffect(() => {
        const _dices = dices.filter((dice) => dice.isHeld)
        if (_dices.length === 10) {
            if (_dices.every(die => die.value === _dices[0].value)) {
                setTenzies(true);
            }
        }
    }, [dices]);

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const allNewDice = () => {
        const randomArray = [];
        for (let index = 0; index < 10; index++) {
            randomArray.push({ id: index, value: getRandomInt(1, 6), isHeld: false })
        }
        return (randomArray);
    }

    const toggleHeld = (index) => {
        const _dices = dices.map(dice => (dice.id === index ? { ...dice, isHeld: !dice.isHeld } : dice));
        setDices(_dices);
    }

    useEffect(() => {
        setDices(allNewDice());
        setStartTime(Date.now());
    }, []);

    const rollDice = () => {
        setDices((oldDices) => {
            return oldDices.map((die, index) => {
                return die.isHeld ? die :
                    { id: index, value: getRandomInt(1, 6), isHeld: false }
            })
        });
        if (tenzies === true) {
            setDices(allNewDice());
            setTenzies(false);
        }
    }
    return (
        <main className={isStarted ? '' : 'disable'}>
            <u><h1 className="title">Tenzies</h1></u>
            <p className="instructions"> {tenzies ? <span> Congratulations! You Won! <br /> Your Score: {score}</span> : 'Roll until all dice are the same. Click each die to freeze it at its current value between rolls.'}
            </p>
            {isStarted && <> <div className='die_container'>
                {
                    dices.map((die, index) => (
                        <Die key={index} value={die.value} isHeld={die.isHeld} toggleHeld={() => toggleHeld(index)} />
                    ))
                }
            </div>
                <button
                    className='roll_dice_button'
                    onClick={rollDice}> {tenzies ? 'New Game' : 'Roll'} </button>
            </>}
            {tenzies && <Confetti />}
        </main>
    )
}

export default Game;