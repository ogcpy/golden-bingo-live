import React from 'react';
import { formatBingoBall } from '@/lib/utils';

interface BingoBallProps {
  number: number;
  called?: boolean;
  large?: boolean;
}

const BingoBall: React.FC<BingoBallProps> = ({ 
  number, 
  called = true,
  large = false 
}) => {
  const { letter, number: ballNumber } = formatBingoBall(number);
  
  // Calculate ball color based on letter
  const getBallColor = () => {
    if (!called) return 'bg-gray-200 text-gray-500';
    
    switch (letter) {
      case 'B': return 'bg-blue-600 text-white';
      case 'I': return 'bg-red-600 text-white';
      case 'N': return 'bg-green-600 text-white';
      case 'G': return 'bg-yellow-500 text-black';
      case 'O': return 'bg-purple-600 text-white';
      default: return 'bg-gray-200 text-gray-500';
    }
  };
  
  // Scale the ball based on the large prop
  const sizeClasses = large 
    ? 'w-32 h-32 text-5xl border-4' 
    : 'w-12 h-12 sm:w-14 sm:h-14 text-lg sm:text-xl border-2';
  
  return (
    <div 
      className={`
        ${getBallColor()} 
        ${sizeClasses} 
        rounded-full flex flex-col items-center justify-center font-bold 
        shadow-md transition-transform ${large ? 'animate-bounce-slow' : ''}
      `}
    >
      <div className="flex flex-col items-center justify-center">
        {large && (
          <span className="text-2xl font-bold">{letter}</span>
        )}
        <span>{ballNumber}</span>
      </div>
    </div>
  );
};

export default BingoBall;
