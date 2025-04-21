import React from 'react';

const GameInformation: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-secondary p-4">
        <h3 className="text-center text-primary text-2xl font-bold">GAME INFORMATION</h3>
      </div>
      <div className="p-6">
        <div className="mb-6">
          <h4 className="text-xl font-bold mb-2 text-primary">How to Play</h4>
          <ul className="list-disc pl-5 text-lg space-y-2">
            <li>Print or order bingo cards for your residents</li>
            <li>Join the live game on a TV or tablet at the scheduled time</li>
            <li>Mark numbers as they are called</li>
            <li>When someone wins, scan their card to verify</li>
            <li>Claims must be made within 30 minutes of the game ending</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h4 className="text-xl font-bold mb-2 text-primary">Today's Prizes</h4>
          <ul className="list-disc pl-5 text-lg space-y-2">
            <li><span className="font-bold">Line:</span> Digital Certificate</li>
            <li><span className="font-bold">Full House:</span> Winner's Trophy & Certificate</li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-xl font-bold mb-2 text-primary">Need Help?</h4>
          <p className="text-lg mb-4">Our support team is available during all scheduled games.</p>
          <a href="tel:0800123456" className="flex items-center text-primary hover:text-blue-700 text-xl">
            <span className="material-icons mr-2">phone</span> 0800 123 456
          </a>
          <a href="mailto:support@goldenbingolive.com" className="flex items-center text-primary hover:text-blue-700 text-xl mt-2">
            <span className="material-icons mr-2">email</span> support@goldenbingolive.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default GameInformation;
