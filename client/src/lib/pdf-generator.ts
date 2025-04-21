import type { BingoCard } from "@shared/schema";
import { getBingoColumnLetter } from "./bingo-helpers";

export function generatePDFCards(cards: BingoCard[], cardSize: string = "standard") {
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow pop-ups to print bingo cards');
    return;
  }
  
  let fontSize = "16px";
  let headerSize = "20px";
  let cardWidth = "350px";
  
  // Adjust sizes based on selected card size
  if (cardSize === "large") {
    fontSize = "20px";
    headerSize = "24px";
    cardWidth = "450px";
  } else if (cardSize === "extraLarge") {
    fontSize = "24px";
    headerSize = "28px";
    cardWidth = "550px";
  }
  
  const styles = `
    body { 
      font-family: Arial, sans-serif; 
      padding: 20px;
      background-color: #f9f9f9;
    }
    .page-break { 
      page-break-after: always; 
      margin-bottom: 30px;
    }
    .cards-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 20px;
    }
    .bingo-card {
      border: 2px solid #1a365d;
      border-radius: 8px;
      overflow: hidden;
      background-color: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: ${cardWidth};
      margin-bottom: 20px;
    }
    .card-header {
      background-color: #1a365d;
      color: white;
      padding: 10px;
      text-align: center;
    }
    .card-title {
      font-size: ${headerSize};
      font-weight: bold;
      margin: 0;
    }
    .card-id {
      color: #f6ad55;
      font-size: 14px;
      margin: 5px 0 0 0;
    }
    .bingo-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 5px;
      padding: 10px;
    }
    .column-header {
      background-color: #1a365d;
      color: white;
      font-weight: bold;
      font-size: ${headerSize};
      text-align: center;
      padding: 10px 0;
      border-radius: 4px;
    }
    .card-cell {
      border: 2px solid #ccc;
      text-align: center;
      font-size: ${fontSize};
      font-weight: bold;
      padding: 10px 0;
      aspect-ratio: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
    }
    .free-space {
      background-color: #f6ad55;
    }
    .qr-code {
      text-align: center;
      margin: 10px 0;
    }
    .qr-code img {
      width: 100px;
      height: 100px;
    }
    .qr-code p {
      font-size: 12px;
      color: #666;
    }
    .verification-slip {
      border-top: 1px dashed #ccc;
      padding: 10px;
      margin-top: 5px;
      text-align: center;
    }
    .instructions {
      max-width: 800px;
      margin: 0 auto 40px auto;
      background-color: #fffde7;
      padding: 15px;
      border-radius: 8px;
      border-left: 5px solid #f6ad55;
    }
    .page-title {
      text-align: center;
      color: #1a365d;
      margin-bottom: 30px;
    }
    @media print {
      body { background-color: white; }
      .instructions { display: none; }
      .page-title { margin-bottom: 20px; }
    }
  `;
  
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Golden Bingo Live - Printed Cards</title>
      <style>${styles}</style>
    </head>
    <body>
      <h1 class="page-title">Golden Bingo Live - Bingo Cards</h1>
      
      <div class="instructions">
        <h2>Printing Instructions:</h2>
        <ul>
          <li>For best results, print on card stock paper.</li>
          <li>Make sure to print in color for the easiest readability.</li>
          <li>Each card has a unique identifier and QR code for winner verification.</li>
          <li>Winners must scan their card or enter the 10-digit code within 30 minutes of the final number call.</li>
        </ul>
        <p><strong>Note:</strong> This section will not appear when printed. Click Print below or press Ctrl+P (Cmd+P on Mac) to print.</p>
        <button onclick="window.print()" style="background: #1a365d; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 10px;">Print Cards</button>
      </div>
      
      <div class="cards-container">
  `;
  
  // Render each bingo card
  cards.forEach((card, index) => {
    if (index > 0 && index % 4 === 0) {
      html += '<div class="page-break"></div>';
    }
    
    html += `
      <div class="bingo-card">
        <div class="card-header">
          <h2 class="card-title">Golden Bingo Live</h2>
          <p class="card-id">Card #${card.cardIdentifier}</p>
        </div>
        
        <div class="bingo-grid">
    `;
    
    // Column headers (B-I-N-G-O)
    for (let i = 0; i < 5; i++) {
      html += `<div class="column-header">${getBingoColumnLetter(i)}</div>`;
    }
    
    // Card data
    if (card.cardData) {
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
          // Check if it's the FREE space (middle position)
          const isFreeSpace = row === 2 && col === 2;
          const value = isFreeSpace ? 'FREE' : card.cardData[row][col];
          
          html += `
            <div class="card-cell ${isFreeSpace ? 'free-space' : ''}">
              ${value}
            </div>
          `;
        }
      }
    }
    
    html += `
        </div>
        
        <div class="verification-slip">
          <p><strong>10-Digit Code:</strong> ${card.randomCode}</p>
          <div class="qr-code">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(card.cardIdentifier)}" alt="QR Code" />
            <p>Scan this code to verify your win!</p>
          </div>
        </div>
      </div>
    `;
  });
  
  html += `
      </div>
      <script>
        // Auto print dialog when page loads (can be disabled)
        // window.onload = function() { window.print(); };
      </script>
    </body>
    </html>
  `;
  
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
