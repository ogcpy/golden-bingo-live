import { Html5QrcodeScanType, Html5QrcodeScannerState, Html5QrcodeScanner } from "html5-qrcode";

let scanner: Html5QrcodeScanner | null = null;

export function initializeScanner(
  element: HTMLElement,
  onScanSuccess: (decodedText: string) => void,
  onScanError: (error: any) => void
) {
  // Stop any existing scanner
  stopScanner();
  
  // Create a new scanner
  scanner = new Html5QrcodeScanner(
    element.id || "qr-reader",
    {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
      aspectRatio: 1.0,
      showTorchButtonIfSupported: true,
      showZoomSliderIfSupported: true,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
    },
    /* verbose= */ false
  );
  
  // Render and start scanning
  scanner.render(onScanSuccess, onScanError);
  
  // Set a unique ID on the element if it doesn't have one
  if (!element.id) {
    element.id = "qr-reader";
  }
}

export function stopScanner() {
  if (scanner && scanner.getState() === Html5QrcodeScannerState.SCANNING) {
    try {
      scanner.clear();
    } catch (error) {
      console.error("Failed to stop scanner:", error);
    }
  }
  scanner = null;
}

export function isScannerActive(): boolean {
  return scanner !== null && scanner.getState() === Html5QrcodeScannerState.SCANNING;
}
