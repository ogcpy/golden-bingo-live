import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { convertGmtToLocal, formatTimerDigit } from '@/lib/utils';
import { GameSession } from '@/lib/types';

interface GameCountdownProps {
  nextGame: GameSession;
}

const GameCountdown: React.FC<GameCountdownProps> = ({ nextGame }) => {
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [localTime, setLocalTime] = useState('');

  useEffect(() => {
    // Set local time based on GMT
    const gameTimeGmt = nextGame.gameTimeGmt;
    const localTimeString = convertGmtToLocal(gameTimeGmt);
    setLocalTime(localTimeString);

    // Calculate initial countdown
    updateCountdown();

    // Update countdown every second
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [nextGame]);

  function updateCountdown() {
    const now = new Date();
    const gameDate = new Date(nextGame.scheduledDate);
    const [hours, minutes] = nextGame.gameTimeGmt.split(':').map(Number);
    
    gameDate.setUTCHours(hours, minutes, 0, 0);
    
    const timeDiff = gameDate.getTime() - now.getTime();
    
    if (timeDiff <= 0) {
      setCountdown({ hours: 0, minutes: 0, seconds: 0 });
      return;
    }
    
    const hours_ = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes_ = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    setCountdown({ hours: hours_, minutes: minutes_, seconds });
  }

  return (
    <section className="mb-12">
      <div className="bg-primary rounded-lg shadow-xl overflow-hidden">
        <div className="bg-secondary py-2 px-4">
          <h2 className="text-center text-primary text-2xl sm:text-3xl font-bold">NEXT GAME STATUS</h2>
        </div>
        <div className="p-6 sm:p-8 text-center">
          <h3 className="text-white text-3xl sm:text-4xl font-bold mb-4">GAME STARTS IN</h3>
          
          {/* Countdown timer display */}
          <div className="countdown-box bg-white text-primary rounded-lg p-4 sm:p-6 inline-block shadow-lg">
            <div className="flex justify-center items-center space-x-2 sm:space-x-4">
              <div className="text-center">
                <span className="block text-4xl sm:text-6xl font-bold">
                  {formatTimerDigit(countdown.hours)}
                </span>
                <span className="text-lg sm:text-xl">Hours</span>
              </div>
              <span className="text-4xl sm:text-6xl font-bold">:</span>
              <div className="text-center">
                <span className="block text-4xl sm:text-6xl font-bold">
                  {formatTimerDigit(countdown.minutes)}
                </span>
                <span className="text-lg sm:text-xl">Minutes</span>
              </div>
              <span className="text-4xl sm:text-6xl font-bold">:</span>
              <div className="text-center">
                <span className="block text-4xl sm:text-6xl font-bold">
                  {formatTimerDigit(countdown.seconds)}
                </span>
                <span className="text-lg sm:text-xl">Seconds</span>
              </div>
            </div>
          </div>
          
          <p className="text-white text-xl sm:text-2xl mt-6 font-medium">
            Game Time: <span className="font-bold">{nextGame.gameTimeGmt} GMT</span>
          </p>
          <p className="text-white text-xl sm:text-2xl mt-2 font-medium">
            Local Time: <span className="font-bold">{localTime}</span>
          </p>
          
          {/* Join game button appears when it's almost time */}
          {countdown.hours === 0 && countdown.minutes < 10 && (
            <div className="mt-6">
              <Link href={`/live-game/${nextGame.id}`}>
                <a className="bg-secondary hover:bg-yellow-500 text-primary text-xl font-bold py-3 px-8 rounded-lg transition-colors inline-block">
                  Join Game Now
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GameCountdown;
