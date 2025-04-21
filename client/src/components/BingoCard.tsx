import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { BingoCard as BingoCardType } from '@/lib/types';
import { organizeBingoCardForDisplay, parseBingoCell, isNumberCalled } from '@/lib/bingo';

interface BingoCardProps {
  card: BingoCardType;
  calledNumbers?: string[];
  highlightCalled?: boolean;
  printable?: boolean;
  cardIndex?: number;
}

const BingoCard: React.FC<BingoCardProps> = ({
  card,
  calledNumbers = [],
  highlightCalled = false,
  printable = false,
  cardIndex
}) => {
  // Organize the bingo card numbers into a grid for display
  const numberGrid = organizeBingoCardForDisplay(card.numbers);
  
  // Class names for the printable version
  const printClass = printable ? 'page-break-inside-avoid' : '';
  
  return (
    <div className={`bingo-card-container ${printClass} max-w-md mx-auto border-2 border-primary rounded-lg p-4 mb-4 bg-white`}>
      {cardIndex !== undefined && (
        <div className="text-center mb-2">
          <span className="text-lg font-semibold">Card #{cardIndex + 1}</span>
        </div>
      )}
      
      <div className="text-center mb-3">
        <h3 className="text-2xl font-bold text-primary">GOLDEN BINGO LIVE</h3>
      </div>
      
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
            const called = isNumberCalled(cell, calledNumbers);
            const isFree = cell === "FREE";
            const { number } = parseBingoCell(cell);
            
            return (
              <div 
                key={`${rowIndex}-${colIndex}`}
                className={`
                  border-2 border-gray-300 text-xl font-bold p-2 text-center aspect-square flex items-center justify-center
                  ${isFree ? 'bg-secondary' : (called && highlightCalled) ? 'bg-green-100' : ''}
                `}
              >
                {isFree ? 'FREE' : number}
              </div>
            );
          })
        ))}
      </div>
      
      <div className="text-center">
        <div className="border-2 border-primary inline-block p-2 rounded-lg">
          <p className="font-bold text-lg">Card ID: <span className="text-primary">{card.cardIdentifier}</span></p>
          
          <div className="mx-auto my-2">
            <QRCodeSVG 
              value={card.qrCode} 
              size={96} 
              level="H" 
              fgColor="#000000"
              bgColor="#FFFFFF"
              includeMargin={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BingoCard;
