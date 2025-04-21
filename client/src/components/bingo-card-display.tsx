import { 
  Card, 
  CardContent, 
  CardHeader,
  CardFooter 
} from "@/components/ui/card";

type BingoCardDisplayProps = {
  cardNumber?: string;
  cardData?: number[][];
}

export default function BingoCardDisplay({ 
  cardNumber = "GBL-1024976", 
  cardData 
}: BingoCardDisplayProps) {
  // Default card data if none provided
  const defaultCardData = [
    [12, 16, 43, 51, 63],
    [8, 29, 33, 46, 71],
    [5, 24, 0, 56, 70], // 0 represents the FREE space
    [11, 19, 36, 48, 68],
    [3, 17, 44, 53, 67],
  ];

  const data = cardData || defaultCardData;

  // Maps index to BINGO letter
  const getBingoLetter = (colIndex: number) => {
    return "BINGO".charAt(colIndex);
  };

  // QR code URL (in a real app, this would be generated server-side)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${cardNumber}`;

  return (
    <Card className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-primary max-w-lg mx-auto">
      <CardHeader className="bg-primary text-white p-2">
        <h3 className="text-2xl font-bold text-center">Golden Bingo Live</h3>
        <p className="text-center text-[#f6ad55]">Card #{cardNumber}</p>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-5 gap-2 mb-4">
          {/* Column headers (B-I-N-G-O) */}
          {[0, 1, 2, 3, 4].map((index) => (
            <div key={`header-${index}`} className="bg-primary text-white text-center p-2 font-bold text-2xl">
              {getBingoLetter(index)}
            </div>
          ))}
          
          {/* Card squares */}
          {data.map((row, rowIndex) => (
            row.map((num, colIndex) => (
              <div 
                key={`${rowIndex}-${colIndex}`}
                className={`aspect-square flex items-center justify-center border-2 border-gray-300 text-2xl font-bold
                  ${rowIndex === 2 && colIndex === 2 ? 'bg-[#f6ad55]' : ''}`}
              >
                {rowIndex === 2 && colIndex === 2 ? 'FREE' : num}
              </div>
            ))
          ))}
        </div>
        
        <div className="flex justify-center">
          <img src={qrCodeUrl} alt="QR Code" className="h-32 mx-auto" />
        </div>
        <p className="text-center text-sm mt-2">Scan this code to verify your win!</p>
      </CardContent>
    </Card>
  );
}
