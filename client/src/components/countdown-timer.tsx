import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

type CountdownProps = {
  targetDate?: Date;
  gameId?: number;
};

export default function CountdownTimer({ targetDate, gameId }: CountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Fetch next game if no targetDate is provided
  const { data: nextGame } = useQuery({
    queryKey: ['/api/games/next'],
    enabled: !targetDate && !gameId,
  });

  const effectiveTargetDate = targetDate || (nextGame ? new Date(nextGame.startTime) : null);
  const effectiveGameId = gameId || (nextGame ? nextGame.id : null);
  
  useEffect(() => {
    if (!effectiveTargetDate) return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const difference = effectiveTargetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeRemaining({ hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    
    return () => clearInterval(interval);
  }, [effectiveTargetDate]);

  // Format time for display (add leading zeros)
  const formatTime = (value: number) => {
    return value < 10 ? `0${value}` : value;
  };

  // Format GMT time
  const formatGMTTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      timeZone: 'GMT',
      hour12: false 
    });
  };

  // Format local time with timezone
  const formatLocalTime = (date: Date) => {
    const timeString = date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return `${timeString} (${timeZone})`;
  };

  if (!effectiveTargetDate) {
    return (
      <Card className="bg-white py-8 shadow-md border-t-4 border-[#f6ad55]">
        <CardContent className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary">No Upcoming Games</h2>
          <p className="text-xl">Check back later for our next scheduled bingo game.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="bg-white py-8 shadow-md border-t-4 border-[#f6ad55]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary">Next Game Starting In</h2>
        <div className="flex justify-center gap-4 mb-6">
          <div className="bg-primary text-white p-4 md:p-6 rounded-lg text-center min-w-[100px]">
            <span className="text-4xl md:text-6xl font-bold block">{formatTime(timeRemaining.hours)}</span>
            <span className="text-xl md:text-2xl">Hours</span>
          </div>
          <div className="bg-primary text-white p-4 md:p-6 rounded-lg text-center min-w-[100px]">
            <span className="text-4xl md:text-6xl font-bold block">{formatTime(timeRemaining.minutes)}</span>
            <span className="text-xl md:text-2xl">Minutes</span>
          </div>
          <div className="bg-primary text-white p-4 md:p-6 rounded-lg text-center min-w-[100px]">
            <span className="text-4xl md:text-6xl font-bold block">{formatTime(timeRemaining.seconds)}</span>
            <span className="text-xl md:text-2xl">Seconds</span>
          </div>
        </div>
        <p className="text-2xl md:text-3xl font-semibold">
          Game starts at <span className="text-primary">{formatGMTTime(effectiveTargetDate)} GMT</span>
        </p>
        <p className="text-xl md:text-2xl mt-2">
          Local time: <span className="font-semibold">{formatLocalTime(effectiveTargetDate)}</span>
        </p>
      </div>
    </section>
  );
}
