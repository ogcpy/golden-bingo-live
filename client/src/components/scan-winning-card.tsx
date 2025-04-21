import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScanLine, Camera, XCircle, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { initializeScanner, stopScanner } from "@/lib/qr-scanner";

export default function ScanWinningCard() {
  const [isScanning, setIsScanning] = useState(false);
  const [randomCode, setRandomCode] = useState("");
  const [scanResult, setScanResult] = useState<null | { isValid: boolean; message?: string }>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Get the active game ID for verification
  const { data: activeGame } = useQuery({
    queryKey: ['/api/games/active'],
  });

  const verifyByCodeMutation = useMutation({
    mutationFn: async ({ randomCode, gameId }: { randomCode: string; gameId: number }) => {
      const response = await apiRequest("POST", "/api/bingo-cards/verify-code", { randomCode, gameId });
      return response.json();
    },
    onSuccess: (data) => {
      setScanResult(data);
      if (data.isValid) {
        toast({
          title: "Winner verified!",
          description: "This card has been verified as a winner.",
        });
      } else {
        toast({
          title: "Invalid card",
          description: data.message || "This card is not a valid winner.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error verifying card",
        description: error.message,
        variant: "destructive",
      });
      setScanResult(null);
    }
  });

  const verifyByQRMutation = useMutation({
    mutationFn: async ({ cardIdentifier, gameId }: { cardIdentifier: string; gameId: number }) => {
      const response = await apiRequest("POST", "/api/bingo-cards/verify", { cardIdentifier, gameId });
      return response.json();
    },
    onSuccess: (data) => {
      setScanResult(data);
      if (data.isValid) {
        toast({
          title: "Winner verified!",
          description: "This card has been verified as a winner.",
        });
      } else {
        toast({
          title: "Invalid card",
          description: data.message || "This card is not a valid winner.",
          variant: "destructive",
        });
      }
      setIsScanning(false);
    },
    onError: (error) => {
      toast({
        title: "Error verifying card",
        description: error.message,
        variant: "destructive",
      });
      setScanResult(null);
      setIsScanning(false);
    }
  });

  const handleVerifyCode = () => {
    if (!randomCode || randomCode.length !== 10) {
      toast({
        title: "Invalid code",
        description: "Please enter a valid 10-digit code.",
        variant: "destructive",
      });
      return;
    }

    if (!activeGame) {
      toast({
        title: "No active game",
        description: "There is no active game to verify a winner for.",
        variant: "destructive",
      });
      return;
    }

    verifyByCodeMutation.mutate({ randomCode, gameId: activeGame.id });
  };

  const handleActivateScanner = () => {
    if (!activeGame) {
      toast({
        title: "No active game",
        description: "There is no active game to verify a winner for.",
        variant: "destructive",
      });
      return;
    }

    setScanResult(null);
    setIsScanning(true);
  };

  useEffect(() => {
    if (isScanning && scannerRef.current) {
      const onScanSuccess = (decodedText: string) => {
        // Assume the QR code contains the card identifier
        stopScanner();
        if (activeGame) {
          verifyByQRMutation.mutate({ cardIdentifier: decodedText, gameId: activeGame.id });
        }
      };

      const onScanError = (error: any) => {
        console.error("QR Scan Error:", error);
        // Don't set error state immediately, as this could be just a frame that didn't contain a QR code
      };

      initializeScanner(scannerRef.current, onScanSuccess, onScanError);

      return () => {
        stopScanner();
      };
    }
  }, [isScanning, activeGame]);

  return (
    <Card className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-primary h-full">
      <CardHeader className="bg-primary text-white p-4">
        <CardTitle className="text-2xl md:text-3xl font-bold text-center">Scan Winning Card</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 flex flex-col items-center">
        <div ref={scannerRef} className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
          {isScanning ? (
            <div className="text-center">
              <Camera className="h-12 w-12 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-700">Camera is active. Point to QR code.</p>
            </div>
          ) : scanResult ? (
            <div className="text-center">
              {scanResult.isValid ? (
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-2" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-2" />
              )}
              <p className={`text-lg font-bold ${scanResult.isValid ? 'text-green-600' : 'text-red-600'}`}>
                {scanResult.isValid ? 'Valid Winner!' : 'Invalid Card'}
              </p>
              <p className="text-gray-700 text-sm">{scanResult.message || ''}</p>
            </div>
          ) : (
            <div className="text-center">
              <ScanLine className="h-16 w-16 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-700">Ready to scan winning card</p>
            </div>
          )}
        </div>
        
        <p className="text-lg md:text-xl text-center mb-6">Scan the QR code on the winning card to verify the win.</p>
        
        <p className="text-md font-semibold mb-6 bg-yellow-100 p-3 rounded text-center">
          Winners must claim within 30 minutes of the last number call!
        </p>
        
        <Button 
          onClick={handleActivateScanner}
          disabled={isScanning || verifyByQRMutation.isPending || !activeGame}
          className="mt-2 bg-[#f6ad55] hover:bg-[#fbd38d] text-primary font-bold text-xl py-4 px-8 rounded-lg w-full transition duration-300"
        >
          {isScanning ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Scanning...
            </>
          ) : verifyByQRMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...
            </>
          ) : (
            <>
              <ScanLine className="mr-2" /> Scan QR Code
            </>
          )}
        </Button>
        
        <div className="mt-4 w-full">
          <label className="block text-xl mb-2">Or enter 10-digit code:</label>
          <div className="flex">
            <Input 
              type="text" 
              className="p-3 border border-gray-300 rounded-l text-xl flex-grow" 
              placeholder="Enter code here"
              maxLength={10}
              value={randomCode}
              onChange={(e) => setRandomCode(e.target.value)}
            />
            <Button 
              onClick={handleVerifyCode}
              disabled={verifyByCodeMutation.isPending || !activeGame}
              className="bg-primary hover:bg-primary-light text-white font-bold text-xl p-3 rounded-r transition duration-300"
            >
              {verifyByCodeMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Verify"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
