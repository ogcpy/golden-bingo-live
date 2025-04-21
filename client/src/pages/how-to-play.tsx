import BingoCardDisplay from "@/components/bingo-card-display";
import HowToPlaySteps from "@/components/how-to-play-steps";

export default function HowToPlay() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How To Play Golden Bingo Live</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Our bingo games are designed for care homes, with accessible cards and clear number calling.
            Here's everything you need to know to get started.
          </p>
        </div>
      </section>
      
      <HowToPlaySteps />
      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-primary">Detailed Instructions</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-primary">For Care Home Staff</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary">
                    <h4 className="font-bold text-xl">Before the Game</h4>
                    <ul className="list-disc ml-5 mt-2 space-y-2">
                      <li>Print cards from our website or order physical cards</li>
                      <li>Distribute cards to residents before the scheduled game time</li>
                      <li>Prepare a TV or large tablet to display the live game</li>
                      <li>Ensure good audio for residents with hearing impairments</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary">
                    <h4 className="font-bold text-xl">During the Game</h4>
                    <ul className="list-disc ml-5 mt-2 space-y-2">
                      <li>Connect to the live game page 5 minutes before start time</li>
                      <li>Ensure audio is enabled for clear number calling</li>
                      <li>Assist residents with marking their cards as needed</li>
                      <li>When someone calls "Bingo!", verify their card quickly</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary">
                    <h4 className="font-bold text-xl">Winner Verification</h4>
                    <ul className="list-disc ml-5 mt-2 space-y-2">
                      <li>Scan the QR code on the winning card</li>
                      <li>Alternatively, enter the 10-digit code printed on the card</li>
                      <li>Claims must be verified within 30 minutes of the last number call</li>
                      <li>Celebrate winners with applause and recognition!</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4 text-primary">For Residents</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#f6ad55]">
                    <h4 className="font-bold text-xl">How Bingo Works</h4>
                    <ul className="list-disc ml-5 mt-2 space-y-2">
                      <li>Each card has 24 numbers plus a FREE space in the middle</li>
                      <li>Numbers are called one at a time</li>
                      <li>Mark off called numbers on your card with a dauber</li>
                      <li>Call out "Bingo!" when you've completed the winning pattern</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#f6ad55]">
                    <h4 className="font-bold text-xl">Winning Patterns</h4>
                    <ul className="list-disc ml-5 mt-2 space-y-2">
                      <li><strong>Standard:</strong> Complete any row, column, or diagonal</li>
                      <li><strong>Four Corners:</strong> Mark the four corner numbers</li>
                      <li><strong>Blackout:</strong> Mark all numbers on the card</li>
                      <li>The game host will announce which pattern to play for</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#f6ad55]">
                    <h4 className="font-bold text-xl">Accessibility Features</h4>
                    <ul className="list-disc ml-5 mt-2 space-y-2">
                      <li>Large print cards available</li>
                      <li>High contrast colors for better visibility</li>
                      <li>Clear audio calling of numbers</li>
                      <li>Staff assistance for marking cards if needed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6 text-primary">Sample Bingo Card</h3>
              <div className="max-w-md mx-auto">
                <BingoCardDisplay />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-primary">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Return to the home page to print cards, schedule a game, or join a live session!
          </p>
          <a href="/" className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg text-xl inline-block">
            Back to Home
          </a>
        </div>
      </section>
    </div>
  );
}
