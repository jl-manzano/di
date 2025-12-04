import React, { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      const intervalId = setInterval(() => {
        setSecondsLeft(prevSeconds => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }

    if (secondsLeft <= 0) {
      setIsRunning(false);
    }
  }, [isRunning, secondsLeft]);

  const toggleRunning = () => {
    setIsRunning(prevState => !prevState);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(60);
  };

  return (
    <div style={styles.container}>
      <div style={styles.timerBox}>
        <h1 style={styles.time}>{secondsLeft} s</h1>
        <div style={styles.buttons}>
          <button style={styles.button} onClick={toggleRunning}>
            {isRunning ? 'Pausar' : 'Iniciar'}
          </button>
          <button style={{ ...styles.button, backgroundColor: '#ff6347' }} onClick={resetTimer}>
            Reiniciar
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f7f7f7',
  },
  timerBox: {
    textAlign: 'center',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    width: '250px',
  },
  time: {
    fontSize: '48px',
    marginBottom: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default CountdownTimer;
