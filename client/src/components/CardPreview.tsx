import React from 'react';
import { BingoCard } from '@/lib/types';
import { organizeBingoCardForDisplay, parseBingoCell } from '@/lib/bingo';

interface CardPreviewProps {
  card?: BingoCard;
  gridOnly?: boolean;
  showCardId?: boolean;
  showQrCode?: boolean;
  calledNumbers?: string[];
}

const CardPreview: React.FC<CardPreviewProps> = ({ 
  card, 
  gridOnly = false,
  showCardId = true,
  showQrCode = true,
  calledNumbers = []
}) => {
  // If no card is provided, use a default sample card
  const defaultNumbers = [
    "B1", "I16", "N31", "G46", "O61",
    "B2", "I17", "N32", "G47", "O62", 
    "B3", "I18", "FREE", "G48", "O63", 
    "B4", "I19", "N33", "G49", "O64", 
    "B5", "I20", "N34", "G50", "O65"
  ];
  
  const bingoNumbers = card?.numbers || defaultNumbers;
  const cardId = card?.cardIdentifier || "GB-0000000000";
  
  // Organize the bingo card numbers into a grid for display
  const numberGrid = organizeBingoCardForDisplay(bingoNumbers);
  
  // Function to check if a number has been called
  const isNumberCalled = (cell: string) => {
    if (cell === "FREE") return true;
    
    const { letter, number } = parseBingoCell(cell);
    return number !== null && calledNumbers.includes(number.toString());
  };
  
  // Render just the grid if gridOnly is true
  if (gridOnly) {
    return (
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-5 gap-1 mb-2">
          <div className="bg-primary text-white text-center text-2xl font-bold p-2">B</div>
          <div className="bg-primary text-white text-center text-2xl font-bold p-2">I</div>
          <div className="bg-primary text-white text-center text-2xl font-bold p-2">N</div>
          <div className="bg-primary text-white text-center text-2xl font-bold p-2">G</div>
          <div className="bg-primary text-white text-center text-2xl font-bold p-2">O</div>
        </div>
        
        <div className="grid grid-cols-5 gap-1">
          {numberGrid.map((row, rowIndex) => (
            row.map((cell, colIndex) => {
              const called = isNumberCalled(cell);
              const isFree = cell === "FREE";
              
              return (
                <div 
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    border-2 border-gray-300 text-xl font-bold p-2 text-center aspect-square flex items-center justify-center
                    ${isFree ? 'bg-secondary' : called ? 'bg-green-100' : ''}
                  `}
                >
                  {isFree ? 'FREE' : parseBingoCell(cell).number}
                </div>
              );
            })
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-secondary p-4">
        <h3 className="text-center text-primary text-2xl font-bold">CARD PREVIEW</h3>
      </div>
      <div className="p-6">
        <div className="max-w-md mx-auto border-2 border-primary rounded-lg p-4">
          <div className="grid grid-cols-5 gap-1 mb-2">
            <div className="bg-primary text-white text-center text-2xl font-bold p-2">B</div>
            <div className="bg-primary text-white text-center text-2xl font-bold p-2">I</div>
            <div className="bg-primary text-white text-center text-2xl font-bold p-2">N</div>
            <div className="bg-primary text-white text-center text-2xl font-bold p-2">G</div>
            <div className="bg-primary text-white text-center text-2xl font-bold p-2">O</div>
          </div>
          
          <div className="grid grid-cols-5 gap-1 mb-4">
            {numberGrid.map((row, rowIndex) => (
              row.map((cell, colIndex) => {
                const called = isNumberCalled(cell);
                const isFree = cell === "FREE";
                
                return (
                  <div 
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                      border-2 border-gray-300 text-xl font-bold p-2 text-center aspect-square flex items-center justify-center
                      ${isFree ? 'bg-secondary' : called ? 'bg-green-100' : ''}
                    `}
                  >
                    {isFree ? 'FREE' : parseBingoCell(cell).number}
                  </div>
                );
              })
            ))}
          </div>
          
          {showCardId && (
            <div className="text-center">
              <div className="border-2 border-primary inline-block p-2 rounded-lg">
                <p className="font-bold text-lg">Card ID: <span className="text-primary">{cardId}</span></p>
                
                {showQrCode && (
                  <div className="w-24 h-24 mx-auto my-2 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="#000" strokeWidth="1" />
                      <rect x="10" y="10" width="30" height="30" fill="#000" />
                      <rect x="60" y="10" width="30" height="30" fill="#000" />
                      <rect x="10" y="60" width="30" height="30" fill="#000" />
                      <rect x="25" y="25" width="50" height="50" fill="#000" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
