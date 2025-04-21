import React, { useState, useEffect, useRef } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { GameSession } from '@/lib/types';
import { formatDate, formatTimerDigit } from '@/lib/utils';
import { useWebSocket } from '@/lib/websocket';

import CardPreview from '@/components/CardPreview';
import BingoBall from '@/components/BingoBall';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Volume2, VolumeX } from 'lucide-react';

const LiveGame: React.FC = () => {
  const [, params] = useRoute<{ id: string }>('/live-game/:id');
  const gameId = params ? parseInt(params.id) : 0;
  
  const [countdownText, setCountdownText] = useState<string>('Waiting for game to start...');
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [calledNumbers, setCalledNumbers] = useState<string[]>([]);
  const [lastCalledNumber, setLastCalledNumber] = useState<number | null>(null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const { toast } = useToast();
  const announcementRef = useRef<HTMLAudioElement | null>(null);
  
  // Fetch game data
  const { data: gameSession, isLoading, error } = useQuery<GameSession>({
    queryKey: [`/api/game-sessions/${gameId}`],
    enabled: gameId > 0,
  });
  
  // Setup WebSocket connection
  const { sendMessage, lastMessage } = useWebSocket();
  
  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data);
        
        if (data.type === 'number_called' && data.gameSessionId === gameId) {
          // Update called numbers
          setCalledNumbers(data.calledNumbers);
          setLastCalledNumber(data.calledNumber);
          
          // Play audio announcement
          if (audioEnabled && announcementRef.current) {
            // In a real app, you would have pre-recorded audio files for each number
            // For this demo, we're using the browser's speech synthesis
            const utterance = new SpeechSynthesisUtterance(`${data.calledNumber}`);
            utterance.rate = 0.8; // Slightly slower for clarity
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
          }
          
          // Show toast
          toast({
            title: "Number Called",
            description: `Number ${data.calledNumber} has been called`,
          });
        }
        
        if (data.type === 'game_over' && data.gameSessionId === gameId) {
          setGameEnded(true);
          toast({
            title: "Game Over",
            description: "All numbers have been called. Please verify winners.",
            variant: "default",
          });
        }
        
        if (data.type === 'game_started' && data.gameSessionId === gameId) {
          setGameStarted(true);
          toast({
            title: "Game Started",
            description: "The bingo game has started! Good luck to all players.",
          });
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    }
  }, [lastMessage, gameId, toast, audioEnabled]);
  
  // Setup game countdown
  useEffect(() => {
    if (gameSession) {
      const gameDate = new Date(gameSession.scheduledDate);
      const [hours, minutes] = gameSession.gameTimeGmt.split(':').map(Number);
      gameDate.setUTCHours(hours, minutes, 0, 0);
      
      const updateCountdown = () => {
        const now = new Date();
        const timeDiff = gameDate.getTime() - now.getTime();
        
        if (timeDiff <= 0) {
          // Game start time has passed
          if (gameSession.gameStatus === 'in-progress') {
            setGameStarted(true);
            setCountdownText('Game in progress');
            setCalledNumbers(gameSession.calledNumbers || []);
            setLastCalledNumber(gameSession.lastNumberCalled);
          } else if (gameSession.gameStatus === 'completed') {
            setGameEnded(true);
            setGameStarted(true);
            setCountdownText('Game has ended');
            setCalledNumbers(gameSession.calledNumbers || []);
          } else {
            // Game should be starting
            setCountdownText('Game starting momentarily...');
            
            // After a short delay, start the game if status is still 'scheduled'
            if (gameSession.gameStatus === 'scheduled' && timeDiff > -60000) { // Within 1 minute of start time
              setTimeout(() => {
                sendMessage(JSON.stringify({
                  type: 'game_started',
                  gameSessionId: gameId
                }));
              }, 5000);
            }
          }
        } else {
          // Game hasn't started yet, show countdown
          const hours = Math.floor(timeDiff / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
          
          setCountdownText(`Starts in: ${formatTimerDigit(hours)}:${formatTimerDigit(minutes)}:${formatTimerDigit(seconds)}`);
        }
      };
      
      // Initial update
      updateCountdown();
      
      // Update countdown every second
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [gameSession, gameId, sendMessage]);
  
  // Function to call next number
  const callNextNumber = () => {
    if (gameId && gameStarted && !gameEnded) {
      sendMessage(JSON.stringify({
        type: 'call_number',
        gameSessionId: gameId
      }));
    }
  };
  
  // Function to toggle audio
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };
  
  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6 text-primary">Loading Game...</h1>
          <p className="text-xl">Please wait while we set up the bingo game.</p>
        </div>
      </main>
    );
  }
  
  if (error || !gameSession) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6 text-primary">Game Not Found</h1>
          <p className="text-xl text-red-500">Sorry, we couldn't find this game session.</p>
          <Button
            onClick={() => window.history.back()}
            className="mt-4 bg-primary hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg text-xl"
          >
            Go Back
          </Button>
        </div>
      </main>
    );
  }
  
  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="mb-8 border-2 border-primary">
        <CardHeader className="bg-primary text-white text-center">
          <CardTitle className="text-3xl">{gameSession.title || 'Golden Bingo Live'}</CardTitle>
          <CardDescription className="text-xl text-white">
            {formatDate(gameSession.scheduledDate)} - {gameSession.gameTimeGmt} GMT
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-primary mb-2">{countdownText}</h2>
            {gameStarted && !gameEnded && (
              <p className="text-lg">Numbers called: {calledNumbers.length} of 75</p>
            )}
          </div>
          
          {/* Last called number */}
          {gameStarted && lastCalledNumber && (
            <div className="mb-6 flex justify-center">
              <BingoBall number={lastCalledNumber} large />
            </div>
          )}
          
          {/* Game controls */}
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {gameStarted && !gameEnded && (
              <Button
                onClick={callNextNumber}
                className="bg-secondary hover:bg-yellow-500 text-primary font-bold py-3 px-8 rounded-lg text-xl"
              >
                Call Next Number
              </Button>
            )}
            
            <Button
              onClick={toggleAudio}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 px-6 rounded-lg text-xl"
            >
              {audioEnabled ? (
                <>
                  <Volume2 className="mr-2 h-5 w-5" /> Audio On
                </>
              ) : (
                <>
                  <VolumeX className="mr-2 h-5 w-5" /> Audio Off
                </>
              )}
            </Button>
          </div>
          
          {/* Game status */}
          {gameEnded && (
            <div className="text-center my-6 p-4 bg-green-100 rounded-lg">
              <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-green-800">Game Complete!</h3>
              <p className="text-lg mt-2">All numbers have been called. Please verify winners.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Tabs defaultValue="called-numbers" className="mb-8">
        <TabsList className="w-full grid grid-cols-2 text-xl">
          <TabsTrigger value="called-numbers" className="py-3">Called Numbers</TabsTrigger>
          <TabsTrigger value="bingo-card" className="py-3">Sample Card</TabsTrigger>
        </TabsList>
        
        <TabsContent value="called-numbers" className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-primary text-center">Called Numbers</h3>
          
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-2 sm:gap-3 justify-items-center">
            {[...Array(75)].map((_, index) => {
              const number = index + 1;
              const isCalled = calledNumbers.includes(number.toString());
              
              return (
                <BingoBall
                  key={number}
                  number={number}
                  called={isCalled}
                />
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="bingo-card" className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-primary text-center">Sample Bingo Card</h3>
          <CardPreview gridOnly calledNumbers={calledNumbers} />
        </TabsContent>
      </Tabs>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Game Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-2 text-primary">Game Rules</h3>
              <ul className="list-disc pl-5 text-lg space-y-2">
                <li>Standard UK/US 75-ball bingo rules apply</li>
                <li>The first player to complete a line (horizontal, vertical, or diagonal) wins a line prize</li>
                <li>The first player to mark all numbers on their card wins the full house prize</li>
                <li>All winners must be verified by scanning the QR code on their card</li>
                <li>Claims must be made within 30 minutes of the game ending</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-2 text-primary">Today's Prizes</h3>
              <ul className="list-disc pl-5 text-lg space-y-2">
                <li><span className="font-bold">Line:</span> Digital Certificate</li>
                <li><span className="font-bold">Full House:</span> {gameSession.prize || "Winner's Trophy & Certificate"}</li>
              </ul>
              
              <Separator className="my-4" />
              
              <h3 className="text-xl font-bold mb-2 text-primary">Theme</h3>
              <p className="text-lg">{gameSession.specialTheme || "Regular Bingo Game"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Hidden audio elements for announcements */}
      <audio ref={announcementRef} style={{ display: 'none' }} />
    </main>
  );
};

export default LiveGame;
