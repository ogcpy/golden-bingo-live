// Generate a random bingo card data
export function generateBingoCardData(): number[][] {
  const card: number[][] = [[], [], [], [], []];
  
  // B column (1-15)
  const bColumn = generateRandomNumbers(1, 15, 5);
  // I column (16-30)
  const iColumn = generateRandomNumbers(16, 30, 5);
  // N column (31-45) with FREE space in the middle
  const nColumn = generateRandomNumbers(31, 45, 4);
  nColumn.splice(2, 0, 0); // Add FREE space in the middle
  // G column (46-60)
  const gColumn = generateRandomNumbers(46, 60, 5);
  // O column (61-75)
  const oColumn = generateRandomNumbers(61, 75, 5);
  
  // Arrange in card format
  for (let i = 0; i < 5; i++) {
    card[i] = [bColumn[i], iColumn[i], nColumn[i], gColumn[i], oColumn[i]];
  }
  
  return card;
}

// Generate an array of random numbers within a range, without duplicates
export function generateRandomNumbers(min: number, max: number, count: number): number[] {
  const numbers: number[] = [];
  while (numbers.length < count) {
    const num = Math.floor(min + Math.random() * (max - min + 1));
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers;
}

// Format bingo numbers for display with the column letter
export function formatBingoNumber(number: number): string {
  if (number <= 15) return `B-${number}`;
  if (number <= 30) return `I-${number}`;
  if (number <= 45) return `N-${number}`;
  if (number <= 60) return `G-${number}`;
  return `O-${number}`;
}

// Parse a formatted bingo number (e.g., "B-12") into its numeric value
export function parseBingoNumber(formattedNumber: string): number | null {
  const parts = formattedNumber.split('-');
  if (parts.length !== 2) return null;
  return parseInt(parts[1]);
}

// Get the letter for a specific column index
export function getBingoColumnLetter(columnIndex: number): string {
  return "BINGO".charAt(columnIndex);
}

// Check if a card has won based on standard bingo patterns
export function checkForWin(
  cardData: number[][],
  calledNumbers: string[],
  pattern: 'standard' | 'blackout' | 'four_corners' = 'standard'
): boolean {
  // Convert called numbers to numeric values
  const calledNumericValues = calledNumbers.map(n => parseBingoNumber(n)).filter(n => n !== null) as number[];
  
  // Check if the number is called or is the FREE space (0)
  const isMarked = (num: number) => num === 0 || calledNumericValues.includes(num);
  
  // Transpose card for easier column checking
  const columns = [0, 1, 2, 3, 4].map(colIndex =>
    [0, 1, 2, 3, 4].map(rowIndex => cardData[rowIndex][colIndex])
  );
  
  // Standard pattern: any row, column, or diagonal
  if (pattern === 'standard') {
    // Check rows
    for (const row of cardData) {
      if (row.every(isMarked)) return true;
    }
    
    // Check columns
    for (const column of columns) {
      if (column.every(isMarked)) return true;
    }
    
    // Check main diagonal (top-left to bottom-right)
    if ([0, 1, 2, 3, 4].every(i => isMarked(cardData[i][i]))) return true;
    
    // Check other diagonal (top-right to bottom-left)
    if ([0, 1, 2, 3, 4].every(i => isMarked(cardData[i][4-i]))) return true;
  }
  
  // Blackout pattern: all squares must be marked
  if (pattern === 'blackout') {
    return cardData.every(row => row.every(isMarked));
  }
  
  // Four corners pattern
  if (pattern === 'four_corners') {
    return isMarked(cardData[0][0]) && isMarked(cardData[0][4]) && 
           isMarked(cardData[4][0]) && isMarked(cardData[4][4]);
  }
  
  return false;
}
