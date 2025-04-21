import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { BingoCard } from '@/lib/types';

import QRScanner from '@/components/QRScanner';
import CardPreview from '@/components/CardPreview';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { GameSession } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const ScanCard: React.FC = () => {
  const [scannedCardId, setScannedCardId] = useState<string>('');
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [winType, setWinType] = useState<'line' | 'full-house'>('line');
  const [manualCardId, setManualCardId] = useState<string>('');
  const { toast } = useToast();

  // Fetch game sessions
  const { data: gameSessions, isLoading } = useQuery<GameSession[]>({
    queryKey: ['/api/game-sessions'],
  });

  // Fetch card by ID
  const fetchCardByIdMutation = useMutation({
    mutationFn: async (cardIdentifier: string) => {
      // This would normally fetch the card data from the server
      // For this demo, we'll create a placeholder card
      return {
        id: 1,
        cardIdentifier,
        numbers: [
          "B1", "I16", "N31", "G46", "O61",
          "B2", "I17", "N32", "G47", "O62", 
          "B3", "I18", "FREE", "G48", "O63", 
          "B4", "I19", "N33", "G49", "O64", 
          "B5", "I20", "N34", "G50", "O65"
        ],
        qrCode: cardIdentifier,
        isPrinted: true,
        isOrdered: false,
        printedTime: new Date().toISOString(),
        orderedTime: null,
        gameSessionId: 1,
        userId: null
      } as BingoCard;
    },
    onSuccess: (card: BingoCard) => {
      setScannedCardId(card.cardIdentifier);
      toast({
        title: "Card Found",
        description: `Successfully found card: ${card.cardIdentifier}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Verify winner mutation
  const verifyWinnerMutation = useMutation({
    mutationFn: async () => {
      if (!scannedCardId) {
        throw new Error("No card has been scanned");
      }
      
      if (!selectedGameId) {
        throw new Error("Please select a game session");
      }

      const response = await apiRequest(
        'POST',
        '/api/winners/verify',
        { 
          cardIdentifier: scannedCardId, 
          gameSessionId: selectedGameId,
          winType
        }
      );
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Winner Verified!",
        description: `The card ${scannedCardId} has been verified as a ${winType === 'line' ? 'line' : 'full house'} winner.`,
      });
      
      // Reset form
      setScannedCardId('');
      setSelectedGameId(null);
      setWinType('line');
    },
    onError: (error: Error) => {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle QR scan success
  const handleScanSuccess = (cardIdentifier: string) => {
    fetchCardByIdMutation.mutate(cardIdentifier);
  };

  // Handle manual card ID input
  const handleManualSubmit = () => {
    if (!manualCardId || !manualCardId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid card ID",
        variant: "destructive",
      });
      return;
    }
    
    fetchCardByIdMutation.mutate(manualCardId);
  };

  // Handle game session change
  const handleGameSessionChange = (value: string) => {
    setSelectedGameId(parseInt(value));
  };

  // Handle verify winner
  const handleVerifyWinner = () => {
    if (!scannedCardId) {
      toast({
        title: "Error",
        description: "Please scan a card first",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedGameId) {
      toast({
        title: "Error",
        description: "Please select a game session",
        variant: "destructive",
      });
      return;
    }
    
    verifyWinnerMutation.mutate();
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Scan Winning Card</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Scan QR Code</CardTitle>
            <CardDescription>Use your device's camera to scan the QR code on the winning bingo card</CardDescription>
          </CardHeader>
          <CardContent>
            <QRScanner onScanSuccess={handleScanSuccess} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Manual Entry</CardTitle>
            <CardDescription>Alternatively, enter the card ID manually</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="card-id" className="text-lg mb-2 block">Card ID (Format: GB-XXXXXXXXXX)</Label>
                <div className="flex gap-2">
                  <Input
                    id="card-id"
                    value={manualCardId}
                    onChange={(e) => setManualCardId(e.target.value)}
                    placeholder="GB-1234567890"
                    className="text-lg p-5"
                  />
                  <Button 
                    onClick={handleManualSubmit}
                    className="bg-primary hover:bg-blue-800 text-white font-bold py-1 px-4 rounded-lg text-lg"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {scannedCardId && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Verify Winner</CardTitle>
            <CardDescription>Please complete the verification form</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="card-identifier" className="text-lg mb-2 block">Card Identifier</Label>
                <Input
                  id="card-identifier"
                  value={scannedCardId}
                  readOnly
                  className="text-lg p-5 bg-gray-50"
                />
              </div>
              
              <div>
                <Label htmlFor="game-session" className="text-lg mb-2 block">Game Session</Label>
                <Select 
                  onValueChange={handleGameSessionChange}
                  disabled={isLoading}
                >
                  <SelectTrigger id="game-session" className="w-full text-lg p-5">
                    <SelectValue placeholder="Select a game" />
                  </SelectTrigger>
                  <SelectContent>
                    {gameSessions?.map((session) => (
                      <SelectItem key={session.id} value={session.id.toString()} className="text-lg">
                        {formatDate(session.scheduledDate)} - {session.gameTimeGmt} GMT
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <Label className="text-lg mb-2 block">Win Type</Label>
                <RadioGroup 
                  value={winType} 
                  onValueChange={(value) => setWinType(value as 'line' | 'full-house')}
                  className="flex space-x-8"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="line" id="line" className="w-5 h-5" />
                    <Label htmlFor="line" className="text-lg">Line</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full-house" id="full-house" className="w-5 h-5" />
                    <Label htmlFor="full-house" className="text-lg">Full House</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={handleVerifyWinner}
                disabled={verifyWinnerMutation.isPending || !selectedGameId}
                className="bg-secondary hover:bg-yellow-500 text-primary font-bold py-3 px-8 rounded-lg text-xl"
              >
                {verifyWinnerMutation.isPending ? 'Verifying...' : 'Verify Winner'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Verification Instructions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-2 text-primary">How to Verify Winners</h3>
            <ol className="list-decimal pl-5 text-lg space-y-2">
              <li>Scan the QR code on the winning card or enter the card ID manually</li>
              <li>Select the game session this card was used for</li>
              <li>Choose whether the win is for a line or full house</li>
              <li>Click "Verify Winner" to confirm the win</li>
              <li>The system will check if the claim is valid and record the win</li>
            </ol>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-2 text-primary">Important Notes</h3>
            <ul className="list-disc pl-5 text-lg space-y-2">
              <li>Claims must be made within 30 minutes of the game ending</li>
              <li>The card must have been registered for the selected game</li>
              <li>Only verified staff members can confirm winners</li>
              <li>Each card can only win once per game session</li>
              <li>For help with verification, contact our support team</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ScanCard;
