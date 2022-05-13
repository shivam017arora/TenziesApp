import './App.css';
import React, { useState, useEffect } from 'react';
import Game from './Game';
import Leaderboard from './Leaderboard';
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from './config';
import { collection, query, getDocs } from "firebase/firestore";
import { db } from './config';
import { useStopwatch } from 'react-timer-hook';


function MyStopwatch({ toggleIsStarted, isStarted }) {
  const {
    seconds,
    minutes,
    start,
  } = useStopwatch({ autoStart: false });

  const [showTime, setShowTime] = useState(false);

  const startGameButton = () => {
    start();
    toggleIsStarted();
    setShowTime(true);
  }

  const timeStyle = {
    display: showTime ? 'block' : 'none',
  }

  const buttonStyle = {
    display: showTime ? 'none' : 'block',
  }

  useEffect(() => {
    if (!isStarted) {
      setShowTime(false);
    }
  }, [isStarted])

  return (
    <div style={{ textAlign: 'center' }} className='sidebar_top'>
      <div className='stopWatch'>
        <button onClick={startGameButton} style={buttonStyle}> Start Game </button>
        {isStarted && <h5>Time Elapsed</h5>}
        <div style={timeStyle}><span>{minutes}</span>:<span>{seconds}</span></div>
      </div>
    </div>
  );
}

function App() {
  const [startGameScreen, setstartGameScreen] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [user, setUser] = useState(null);
  const [leaderboradScores, setLeaderboradScores] = useState([]);

  useEffect(() => {
    const getScores = async () => {
      const _scores = [];
      const q = query(collection(db, "scores"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        _scores.push({ id: doc.id, data: doc.data() });
      });
      _scores.sort((a, b) => a.data.score - b.data.score);
      setLeaderboradScores(_scores);
    }
    getScores();

    if (isStarted && !startGameScreen) {
      setIsStarted(false);
    }
  }, [startGameScreen, isStarted]);

  const toggleIsStarted = () => {
    setIsStarted(!isStarted);
  }

  const toggleNav = (item) => {
    switch (item) {
      case 'Play':
        setstartGameScreen(true);
        break;
      case 'Leaderboard':
        setstartGameScreen(false);
        break;
      default:
        setstartGameScreen(true);
    }
  }

  const login = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user);
        console.log(token);
        setUser(user);
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode);
        console.log(email);
        console.log(credential);
        alert(errorMessage);
      });
  }



  const logout = () => {
    signOut(auth).then(() => {
      setUser(null);
    }).catch((error) => {
      alert("Unable to Logout! Try Again!")
    });
  }

  return (
    <div className="app">
      <div className='app_sidebar'>
        <aside className="sidebar">
          <div className='app_stopwatch'>
            {startGameScreen && <MyStopwatch toggleIsStarted={toggleIsStarted} isStarted={isStarted} />}
          </div>
          <nav className="nav">
            <ul>
              <li onClick={() => toggleNav('Play')}><a className={startGameScreen ? 'white' : ''}>Play</a></li>
              <li onClick={() => toggleNav('Leaderboard')}><a className={startGameScreen ? '' : 'white'}>Leaderboard</a></li>
            </ul>
          </nav>
        </aside>
        <div className='sidebar_bottom'>
          {!user && <button onClick={login}> Sign in </button>}
          {user && <button onClick={logout}> Sign out </button>}
        </div>
      </div>
      <main>
        {startGameScreen ? <Game user={user} isStarted={isStarted} toggleIsStarted={toggleIsStarted} /> : <Leaderboard scores={leaderboradScores} />}
      </main>
    </div>
  );
}

export default App;
