import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { generatePDFCards } from "@/lib/pdf-generator";

export default function PrintCardsForm() {
  const [cardCount, setCardCount] = useState("10");
  const [cardSize, setCardSize] = useState("standard");
  const { toast } = useToast();

  const generateCardsMutation = useMutation({
    mutationFn: async ({ count }: { count: number }) => {
      const response = await apiRequest("POST", "/api/bingo-cards/generate", { count });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Bingo cards generated!",
        description: `${data.length} cards have been created.`,
      });
      
      // Generate PDF from the cards data
      generatePDFCards(data, cardSize);
    },
    onError: (error) => {
      toast({
        title: "Error generating cards",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleGenerateCards = () => {
    const count = parseInt(cardCount);
    if (isNaN(count) || count <= 0 || count > 100) {
      toast({
        title: "Invalid number of cards",
        description: "Please select a valid number of cards (1-100).",
        variant: "destructive",
      });
      return;
    }

    generateCardsMutation.mutate({ count });
  };

  return (
    <Card className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-primary h-full">
      <CardHeader className="bg-primary text-white p-4">
        <CardTitle className="text-2xl md:text-3xl font-bold text-center">Print Cards</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 flex flex-col items-center">
        <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center overflow-hidden">
          <div className="grid grid-cols-2 gap-2 p-4 transform scale-75">
            {/* Sample card visuals */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border-2 border-primary p-2 rounded">
                <div className="grid grid-cols-5 gap-1">
                  <div className="bg-primary text-white text-center p-1 text-xs font-bold">B</div>
                  <div className="bg-primary text-white text-center p-1 text-xs font-bold">I</div>
                  <div className="bg-primary text-white text-center p-1 text-xs font-bold">N</div>
                  <div className="bg-primary text-white text-center p-1 text-xs font-bold">G</div>
                  <div className="bg-primary text-white text-center p-1 text-xs font-bold">O</div>
                  
                  {Array(25).fill(0).map((_, j) => (
                    <div key={j} className="border border-gray-300 text-center p-1 text-xs">
                      {j === 12 ? 'FREE' : Math.floor(Math.random() * 75) + 1}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <p className="text-lg md:text-xl text-center mb-6">Generate and print custom bingo cards for your players.</p>
        
        <div className="space-y-4 w-full">
          <div className="flex items-center">
            <Label className="block text-xl w-40">Number of cards:</Label>
            <Select value={cardCount} onValueChange={setCardCount}>
              <SelectTrigger className="p-3 border border-gray-300 rounded text-xl w-24">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center">
            <Label className="block text-xl w-40">Card size:</Label>
            <Select value={cardSize} onValueChange={setCardSize}>
              <SelectTrigger className="p-3 border border-gray-300 rounded text-xl w-24">
                <SelectValue placeholder="Standard" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="extraLarge">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Button 
          onClick={handleGenerateCards}
          disabled={generateCardsMutation.isPending}
          className="mt-6 bg-[#f6ad55] hover:bg-[#fbd38d] text-primary font-bold text-xl py-4 px-8 rounded-lg w-full transition duration-300"
        >
          {generateCardsMutation.isPending ? (
            "Generating..."
          ) : (
            <>
              <Printer className="mr-2" /> Generate PDF Cards
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
