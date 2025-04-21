import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { GameSession, BingoCard as BingoCardType } from '@/lib/types';
import { formatDate } from '@/lib/utils';

import BingoCardComponent from '@/components/BingoCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PrintCards: React.FC = () => {
  const [selectedGameSession, setSelectedGameSession] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(10);
  const [generatedCards, setGeneratedCards] = useState<BingoCardType[]>([]);
  const { toast } = useToast();
  
  // Fetch game sessions
  const { data: gameSessions, isLoading: isLoadingGames } = useQuery<GameSession[]>({
    queryKey: ['/api/game-sessions'],
  });
  
  // Generate cards mutation
  const generateCardsMutation = useMutation({
    mutationFn: async () => {
      if (!selectedGameSession) {
        throw new Error("Please select a game session");
      }
      
      const response = await apiRequest(
        'POST',
        '/api/bingo-cards/generate',
        { gameSessionId: selectedGameSession, quantity }
      );
      
      return response.json();
    },
    onSuccess: (data: BingoCardType[]) => {
      setGeneratedCards(data);
      toast({
        title: "Success",
        description: `Generated ${data.length} bingo cards`,
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
  
  // Mark cards as printed mutation
  const printCardsMutation = useMutation({
    mutationFn: async () => {
      if (generatedCards.length === 0) {
        throw new Error("No cards to mark as printed");
      }
      
      const cardIds = generatedCards.map(card => card.id);
      const response = await apiRequest(
        'POST',
        '/api/bingo-cards/print',
        { cardIds }
      );
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `${generatedCards.length} cards marked as printed`,
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
  
  // Handle the print functionality without using react-to-print
  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Could not open print window. Please check your popup settings.",
        variant: "destructive",
      });
      return;
    }
    
    // Get the HTML content
    const htmlContent = `
      <html>
        <head>
          <title>Golden Bingo Cards</title>
          <style>
            @media print {
              @page {
                size: portrait;
                margin: 0.5cm;
              }
              body {
                background: white;
              }
              .print-container {
                display: block !important;
              }
              .cards-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
              }
            }
            .card {
              border: 2px solid #333;
              border-radius: 8px;
              margin-bottom: 10px;
              page-break-inside: avoid;
            }
            .card-header {
              text-align: center;
              padding: 10px;
              background-color: #f0f0f0;
              border-bottom: 1px solid #ddd;
            }
            .card-grid {
              display: grid;
              grid-template-columns: repeat(5, 1fr);
              padding: 10px;
            }
            .card-cell {
              aspect-ratio: 1/1;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 24px;
              border: 1px solid #ddd;
              margin: 2px;
            }
            .header-text {
              text-align: center;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header-text">
            <h1>Golden Bingo Live</h1>
            <p>
              ${gameSessions?.find(s => s.id === selectedGameSession)?.gameTimeGmt} GMT - 
              ${gameSessions?.find(s => s.id === selectedGameSession)?.scheduledDate && 
                formatDate(gameSessions?.find(s => s.id === selectedGameSession)?.scheduledDate || '')}
            </p>
          </div>
          <div class="cards-grid">
            ${generatedCards.map((card, index) => {
              // Simple rendering of a bingo card
              const rows = [];
              for (let i = 0; i < 5; i++) {
                const rowCells = [];
                for (let j = 0; j < 5; j++) {
                  const cellIndex = i * 5 + j;
                  let cellContent = card.numbers[cellIndex] || '';
                  // Add free space in the middle
                  if (i === 2 && j === 2) {
                    cellContent = 'FREE';
                  }
                  rowCells.push(`<div class="card-cell">${cellContent}</div>`);
                }
                rows.push(rowCells.join(''));
              }
              
              return `
                <div class="card">
                  <div class="card-header">
                    <div>Card ID: ${card.cardIdentifier}</div>
                  </div>
                  <div class="card-grid">
                    ${rows.join('')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </body>
      </html>
    `;
    
    // Write the content to the new window and print it
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for the content to load and then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
        // Mark the cards as printed after successful print
        printCardsMutation.mutate();
      };
    };
  };

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= 100) {
      setQuantity(value);
    }
  };
  
  // Handle game session change
  const handleGameSessionChange = (value: string) => {
    setSelectedGameSession(parseInt(value));
  };
  
  // Handle generate cards
  const handleGenerateCards = () => {
    if (!selectedGameSession) {
      toast({
        title: "Error",
        description: "Please select a game session",
        variant: "destructive",
      });
      return;
    }
    
    generateCardsMutation.mutate();
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Print Bingo Cards</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Generate Cards</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="game-session" className="text-lg mb-2 block">Select Game Session</Label>
            <Select 
              onValueChange={handleGameSessionChange}
              disabled={isLoadingGames}
            >
              <SelectTrigger id="game-session" className="w-full text-lg p-6">
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
          
          <div>
            <Label htmlFor="quantity" className="text-lg mb-2 block">Number of Cards (1-100)</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-full text-lg p-6"
            />
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={handleGenerateCards}
            disabled={generateCardsMutation.isPending || !selectedGameSession}
            className="bg-primary hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg text-xl"
          >
            {generateCardsMutation.isPending ? 'Generating...' : 'Generate Cards'}
          </Button>
        </div>
      </div>
      
      {generatedCards.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Generated Cards</h2>
          
          <div className="flex justify-center mb-6">
            <Button 
              onClick={handlePrint}
              disabled={printCardsMutation.isPending}
              className="bg-secondary hover:bg-yellow-500 text-primary font-bold py-3 px-8 rounded-lg text-xl"
            >
              {printCardsMutation.isPending ? 'Processing...' : 'Print Cards'}
            </Button>
          </div>
          
          <div className="print-preview max-h-96 overflow-y-auto p-4 border rounded-lg">
            <p className="text-lg mb-4">Preview (showing first 3 cards):</p>
            {generatedCards.slice(0, 3).map((card, index) => (
              <BingoCardComponent key={card.id} card={card} cardIndex={index} />
            ))}
            {generatedCards.length > 3 && (
              <p className="text-center text-lg mt-4">
                ...and {generatedCards.length - 3} more cards
              </p>
            )}
          </div>
        </div>
      )}
      

    </main>
  );
};

export default PrintCards;
