import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { parseBingoNumber } from "@/lib/bingo-helpers";

export default function LiveGame() {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [currentNumber, setCurrentNumber] = useState<string | null>(null);
  const [previousNumbers, setPreviousNumbers] = useState<string[]>([]);
  const webSocketRef = useRef<WebSocket | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Fetch active game
  const { data: activeGame, isLoading } = useQuery({
    queryKey: ['/api/games/active'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Connect to WebSocket when active game is found
  useEffect(() => {
    if (activeGame) {
      const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`);
      
      ws.onopen = () => {
        console.log("WebSocket connected");
        ws.send(JSON.stringify({
          type: "join-game",
          gameId: activeGame.id
        }));
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === "game-update" && data.game) {
            const calledNumbers = data.game.calledNumbers || [];
            setPreviousNumbers(calledNumbers);
            
            // Check for a new number
            if (calledNumbers.length > 0 && calledNumbers[calledNumbers.length - 1] !== currentNumber) {
              const newNumber = calledNumbers[calledNumbers.length - 1];
              setCurrentNumber(newNumber);
              
              // Speak the number if audio is enabled
              if (audioEnabled) {
                speakBingoNumber(newNumber);
              }
            }
          }
        } catch (error) {
          console.error("Error processing WebSocket message:", error);
        }
      };
      
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      
      ws.onclose = () => {
        console.log("WebSocket disconnected");
      };
      
      webSocketRef.current = ws;
      
      // Initialize speech synthesis
      if ('speechSynthesis' in window) {
        speechSynthesisRef.current = new SpeechSynthesisUtterance();
        speechSynthesisRef.current.rate = 0.8; // Slightly slower for clarity
        speechSynthesisRef.current.pitch = 1;
        speechSynthesisRef.current.volume = 1;
      }
      
      return () => {
        ws.close();
      };
    }
  }, [activeGame?.id]);

  // Update the state from active game data when it changes
  useEffect(() => {
    if (activeGame && activeGame.calledNumbers) {
      setPreviousNumbers(activeGame.calledNumbers);
      
      if (activeGame.calledNumbers.length > 0) {
        setCurrentNumber(activeGame.calledNumbers[activeGame.calledNumbers.length - 1]);
      }
    }
  }, [activeGame]);

  // Function to speak bingo numbers using speech synthesis
  const speakBingoNumber = (bingoNumber: string) => {
    if (!('speechSynthesis' in window) || !speechSynthesisRef.current) return;
    
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    
    const parts = bingoNumber.split('-');
    if (parts.length !== 2) return;
    
    const [letter, number] = parts;
    
    // Format speech: "B 12" with a pause between letter and number
    speechSynthesisRef.current.text = `${letter}. ${number}`;
    window.speechSynthesis.speak(speechSynthesisRef.current);
  };

  // Toggle audio
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    
    if (!audioEnabled && currentNumber) {
      // Turn audio back on and announce current number
      speakBingoNumber(currentNumber);
    }
  };

  // Get the background color for called numbers
  const getNumberBackgroundColor = (number: string, index: number) => {
    // Make the most recent 5 numbers more prominent
    const mostRecent = previousNumbers.length - index <= 5;
    return mostRecent ? "bg-primary text-white" : "bg-gray-200";
  };

  return (
    <div className="py-8 bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4">
        <Card className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-primary">
          <CardHeader className="bg-primary text-white p-4">
            <CardTitle className="text-3xl md:text-4xl font-bold text-center">Live Bingo Game</CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-xl">Loading game status...</p>
              </div>
            ) : !activeGame ? (
              <div className="text-center py-20">
                <div className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded-full text-xl font-bold mb-4">
                  No Active Game
                </div>
                <p className="text-xl">There is no bingo game in progress right now.</p>
                <p className="text-lg mt-4">Check the homepage for the next scheduled game time.</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-xl font-bold">
                    Game Active
                  </div>
                  <p className="text-xl mt-2">{activeGame.title}</p>
                  
                  <Button 
                    onClick={toggleAudio}
                    variant="outline" 
                    className="mt-4"
                    aria-label={audioEnabled ? "Mute sound" : "Enable sound"}
                  >
                    {audioEnabled ? <Volume2 className="mr-2" /> : <VolumeX className="mr-2" />}
                    {audioEnabled ? "Sound On" : "Sound Off"}
                  </Button>
                </div>
                
                {currentNumber && (
                  <>
                    <h3 className="text-2xl font-bold mb-4 text-center">Current Number</h3>
                    <div className="flex justify-center">
                      <div className="bg-primary text-white text-6xl md:text-8xl font-bold p-8 rounded-xl w-40 h-40 flex items-center justify-center">
                        {currentNumber}
                      </div>
                    </div>
                  </>
                )}
                
                {previousNumbers.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-2xl font-bold mb-4 text-center">Called Numbers</h3>
                    <div className="mt-4 grid grid-cols-5 sm:grid-cols-10 gap-2 max-w-3xl mx-auto">
                      {previousNumbers.map((number, index) => (
                        <div 
                          key={index} 
                          className={`aspect-square flex items-center justify-center rounded font-bold ${getNumberBackgroundColor(number, index)}`}
                        >
                          {number}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
