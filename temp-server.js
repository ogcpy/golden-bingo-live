import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const PORT = 3000;

// Serve static client files
app.use(express.static('build-preview'));

// Create a demo page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Golden Bingo Live - Preview</title>
      <style>
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.5;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          color: #333;
        }
        header {
          margin-bottom: 2rem;
          border-bottom: 2px solid #f39c12;
          padding-bottom: 1rem;
        }
        h1 {
          color: #2c3e50;
        }
        h2 {
          color: #3498db;
          margin-top: 2rem;
        }
        .feature-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .feature {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .feature h3 {
          color: #e67e22;
          margin-top: 0;
        }
        .bingo-card {
          background: white;
          border: 2px solid #3498db;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          max-width: 400px;
        }
        .bingo-header {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 4px;
          margin-bottom: 4px;
        }
        .bingo-header div {
          background: #3498db;
          color: white;
          font-weight: bold;
          padding: 0.5rem;
          text-align: center;
        }
        .bingo-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 4px;
        }
        .bingo-cell {
          aspect-ratio: 1/1;
          border: 1px solid #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.5rem;
        }
        .free-space {
          background: #f1c40f;
        }
        .bingo-info {
          margin-top: 1rem;
          text-align: center;
          padding: 0.5rem;
          border: 1px solid #3498db;
          border-radius: 4px;
        }
        .image-container {
          margin: 2rem 0;
        }
        img {
          max-width: 100%;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .qr-code {
          width: 100px;
          height: 100px;
          margin: 0 auto;
          background: #eee;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          grid-template-rows: repeat(5, 1fr);
        }
        .qr-module {
          background: black;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>Golden Bingo Live</h1>
        <p>A live bingo game experience for care homes and community centers</p>
      </header>
      
      <main>
        <div class="image-container">
          <img src="https://via.placeholder.com/1200x600" alt="Golden Bingo Live App Preview">
        </div>
        
        <h2>Key Features</h2>
        <div class="feature-list">
          <div class="feature">
            <h3>Live Game Hosting</h3>
            <p>Real-time game sessions with automatic number calling and winner verification</p>
          </div>
          <div class="feature">
            <h3>Printable Cards</h3>
            <p>Generate and print custom bingo cards for each game session</p>
          </div>
          <div class="feature">
            <h3>QR Code Scanning</h3>
            <p>Quickly verify winning cards with built-in QR code scanner functionality</p>
          </div>
          <div class="feature">
            <h3>Accessible Design</h3>
            <p>Clear, high-contrast interface suitable for elderly users and those with visual impairments</p>
          </div>
          <div class="feature">
            <h3>Game Scheduling</h3>
            <p>Plan and organize upcoming bingo sessions with an intuitive scheduler</p>
          </div>
          <div class="feature">
            <h3>Winner Management</h3>
            <p>Track and manage prizes for different win types (line or full house)</p>
          </div>
        </div>
        
        <h2>Sample Bingo Card</h2>
        <div class="bingo-card">
          <div class="bingo-header">
            <div>B</div>
            <div>I</div>
            <div>N</div>
            <div>G</div>
            <div>O</div>
          </div>
          <div class="bingo-grid">
            <div class="bingo-cell">3</div>
            <div class="bingo-cell">16</div>
            <div class="bingo-cell">33</div>
            <div class="bingo-cell">48</div>
            <div class="bingo-cell">61</div>
            
            <div class="bingo-cell">8</div>
            <div class="bingo-cell">21</div>
            <div class="bingo-cell">35</div>
            <div class="bingo-cell">53</div>
            <div class="bingo-cell">72</div>
            
            <div class="bingo-cell">10</div>
            <div class="bingo-cell">22</div>
            <div class="bingo-cell free-space">FREE</div>
            <div class="bingo-cell">55</div>
            <div class="bingo-cell">75</div>
            
            <div class="bingo-cell">12</div>
            <div class="bingo-cell">27</div>
            <div class="bingo-cell">41</div>
            <div class="bingo-cell">59</div>
            <div class="bingo-cell">68</div>
            
            <div class="bingo-cell">14</div>
            <div class="bingo-cell">30</div>
            <div class="bingo-cell">45</div>
            <div class="bingo-cell">52</div>
            <div class="bingo-cell">70</div>
          </div>
          <div class="bingo-info">
            <p>Card ID: GB-1234567890</p>
            <div class="qr-code">
              <div class="qr-module" style="grid-row: 1; grid-column: 1;"></div>
              <div class="qr-module" style="grid-row: 1; grid-column: 2;"></div>
              <div class="qr-module" style="grid-row: 1; grid-column: 3;"></div>
              <div class="qr-module" style="grid-row: 1; grid-column: 4;"></div>
              <div class="qr-module" style="grid-row: 1; grid-column: 5;"></div>
              
              <div class="qr-module" style="grid-row: 2; grid-column: 1;"></div>
              <div class="qr-module" style="grid-row: 2; grid-column: 5;"></div>
              
              <div class="qr-module" style="grid-row: 3; grid-column: 1;"></div>
              <div class="qr-module" style="grid-row: 3; grid-column: 3;"></div>
              <div class="qr-module" style="grid-row: 3; grid-column: 5;"></div>
              
              <div class="qr-module" style="grid-row: 4; grid-column: 1;"></div>
              <div class="qr-module" style="grid-row: 4; grid-column: 5;"></div>
              
              <div class="qr-module" style="grid-row: 5; grid-column: 1;"></div>
              <div class="qr-module" style="grid-row: 5; grid-column: 2;"></div>
              <div class="qr-module" style="grid-row: 5; grid-column: 3;"></div>
              <div class="qr-module" style="grid-row: 5; grid-column: 4;"></div>
              <div class="qr-module" style="grid-row: 5; grid-column: 5;"></div>
            </div>
          </div>
        </div>
      </main>
      
      <footer>
        <p>&copy; 2025 Golden Bingo Live. All rights reserved.</p>
      </footer>
    </body>
    </html>
  `);
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Preview server running at http://0.0.0.0:${PORT}`);
});