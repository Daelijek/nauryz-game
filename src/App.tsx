import { useState } from 'react';
import { SplashScreen } from './screens/SplashScreen';
import { YurtScreen } from './screens/YurtScreen';
import { GameScreen } from './screens/GameScreen';
import { ResultScreen } from './screens/ResultScreen';
import './App.css';

export type Screen = 'splash' | 'yurt' | 'game' | 'result';

function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [resultTimeSeconds, setResultTimeSeconds] = useState(0);

  return (
    <>
      {screen === 'splash' && (
        <SplashScreen onDone={() => setScreen('yurt')} />
      )}
      {screen === 'yurt' && (
        <YurtScreen onStart={() => setScreen('game')} />
      )}
      {screen === 'game' && (
        <GameScreen
          onWin={(timeInSeconds) => {
            setResultTimeSeconds(timeInSeconds);
            setScreen('result');
          }}
        />
      )}
      {screen === 'result' && (
        <ResultScreen
          timeInSeconds={resultTimeSeconds}
          onPlayAgain={() => setScreen('game')}
        />
      )}
    </>
  );
}

export default App;
