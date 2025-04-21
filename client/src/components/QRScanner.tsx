import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface QRScannerProps {
  onScanSuccess: (cardIdentifier: string) => void;
  onScanError?: (error: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ 
  onScanSuccess,
  onScanError
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannerInitialized, setScannerInitialized] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerDivId = "qr-scanner";
  const { toast } = useToast();
  
  useEffect(() => {
    return () => {
      // Clean up scanner on component unmount
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (error) {
          console.error("Failed to clear scanner:", error);
        }
      }
    };
  }, []);
  
  const initializeScanner = () => {
    if (scannerInitialized) return;
    
    try {
      // Initialize the scanner with high contrast settings and large UI elements
      scannerRef.current = new Html5QrcodeScanner(
        scannerDivId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true,
          aspectRatio: 1.0,
          formatsToSupport: ['QR_CODE'],
        },
        /* verbose= */ false
      );
      
      setScannerInitialized(true);
    } catch (error) {
      console.error("Failed to initialize scanner:", error);
      toast({
        title: "Scanner Error",
        description: "Failed to initialize the QR scanner. Please try again.",
        variant: "destructive"
      });
      
      if (onScanError) {
        onScanError("Failed to initialize scanner");
      }
    }
  };
  
  const startScanning = () => {
    initializeScanner();
    setIsScanning(true);
    
    if (scannerRef.current) {
      scannerRef.current.render(
        (decodedText: string) => {
          // Check if it's a valid Golden Bingo card format (GB-XXXXXXXXXX)
          if (decodedText.startsWith('GB-')) {
            onScanSuccess(decodedText);
            setIsScanning(false);
            
            // Clear the scanner after successful scan
            if (scannerRef.current) {
              scannerRef.current.clear();
            }
          } else {
            toast({
              title: "Invalid QR Code",
              description: "The scanned QR code is not a valid Golden Bingo card. Please try again.",
              variant: "destructive"
            });
            
            if (onScanError) {
              onScanError("Invalid QR code format");
            }
          }
        },
        (errorMessage: string) => {
          console.error("QR scan error:", errorMessage);
          
          if (onScanError) {
            onScanError(errorMessage);
          }
        }
      );
    }
  };
  
  const stopScanning = () => {
    setIsScanning(false);
    if (scannerRef.current) {
      scannerRef.current.clear();
    }
  };
  
  return (
    <div className="qr-scanner-container">
      {!isScanning ? (
        <div className="text-center py-8">
          <div className="material-icons text-primary text-6xl mb-4">qr_code_scanner</div>
          <p className="text-xl mb-6">Click the button below to scan a winning bingo card</p>
          <Button 
            onClick={startScanning}
            className="bg-primary hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg text-xl"
          >
            Start Scanning
          </Button>
        </div>
      ) : (
        <div className="scanner-active">
          <div id={scannerDivId} className="mx-auto"></div>
          <div className="text-center mt-4">
            <Button 
              onClick={stopScanning}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-xl"
            >
              Cancel Scan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
