// Parse a bingo card cell value
export function parseBingoCell(cell: string): { letter: string; number: number | null } {
  if (cell === "FREE") {
    return { letter: "", number: null };
  }
  
  const letter = cell.charAt(0);
  const number = parseInt(cell.substring(1));
  
  return { letter, number: isNaN(number) ? null : number };
}

// Check if a row is a winning combination
export function checkRow(numbers: string[], calledNumbers: string[], rowIndex: number): boolean {
  // Each row has 5 cells, so calculate start and end indices
  const start = rowIndex * 5;
  const end = start + 5;
  const rowCells = numbers.slice(start, end);
  
  // Check if all numbers in the row have been called
  return rowCells.every(cell => {
    if (cell === "FREE") return true;
    
    const { letter, number } = parseBingoCell(cell);
    return number !== null && calledNumbers.includes(number.toString());
  });
}

// Check if a column is a winning combination
export function checkColumn(numbers: string[], calledNumbers: string[], colIndex: number): boolean {
  const colCells = [];
  for (let i = 0; i < 5; i++) {
    colCells.push(numbers[i * 5 + colIndex]);
  }
  
  // Check if all numbers in the column have been called
  return colCells.every(cell => {
    if (cell === "FREE") return true;
    
    const { letter, number } = parseBingoCell(cell);
    return number !== null && calledNumbers.includes(number.toString());
  });
}

// Check diagonal from top-left to bottom-right
export function checkDiagonal1(numbers: string[], calledNumbers: string[]): boolean {
  const diagonalCells = [
    numbers[0],  // Top-left
    numbers[6],  // Second row, second column
    numbers[12], // Middle (often FREE)
    numbers[18], // Fourth row, fourth column
    numbers[24]  // Bottom-right
  ];
  
  // Check if all numbers in the diagonal have been called
  return diagonalCells.every(cell => {
    if (cell === "FREE") return true;
    
    const { letter, number } = parseBingoCell(cell);
    return number !== null && calledNumbers.includes(number.toString());
  });
}

// Check diagonal from top-right to bottom-left
export function checkDiagonal2(numbers: string[], calledNumbers: string[]): boolean {
  const diagonalCells = [
    numbers[4],  // Top-right
    numbers[8],  // Second row, fourth column
    numbers[12], // Middle (often FREE)
    numbers[16], // Fourth row, second column
    numbers[20]  // Bottom-left
  ];
  
  // Check if all numbers in the diagonal have been called
  return diagonalCells.every(cell => {
    if (cell === "FREE") return true;
    
    const { letter, number } = parseBingoCell(cell);
    return number !== null && calledNumbers.includes(number.toString());
  });
}

// Check if the card has a winning line (row, column, or diagonal)
export function checkForLine(numbers: string[], calledNumbers: string[]): boolean {
  // Check rows
  for (let i = 0; i < 5; i++) {
    if (checkRow(numbers, calledNumbers, i)) return true;
  }
  
  // Check columns
  for (let i = 0; i < 5; i++) {
    if (checkColumn(numbers, calledNumbers, i)) return true;
  }
  
  // Check diagonals
  if (checkDiagonal1(numbers, calledNumbers)) return true;
  if (checkDiagonal2(numbers, calledNumbers)) return true;
  
  return false;
}

// Check if the card has a full house (all numbers called)
export function checkForFullHouse(numbers: string[], calledNumbers: string[]): boolean {
  return numbers.every(cell => {
    if (cell === "FREE") return true;
    
    const { letter, number } = parseBingoCell(cell);
    return number !== null && calledNumbers.includes(number.toString());
  });
}

// Organize bingo card numbers into a grid
export function organizeBingoCardForDisplay(numbers: string[]): string[][] {
  const grid: string[][] = [[], [], [], [], []];
  
  // B column
  for (let i = 0; i < 5; i++) {
    grid[i][0] = numbers[i];
  }
  
  // I column
  for (let i = 0; i < 5; i++) {
    grid[i][1] = numbers[i + 5];
  }
  
  // N column
  for (let i = 0; i < 5; i++) {
    grid[i][2] = numbers[i + 10];
  }
  
  // G column
  for (let i = 0; i < 5; i++) {
    grid[i][3] = numbers[i + 15];
  }
  
  // O column
  for (let i = 0; i < 5; i++) {
    grid[i][4] = numbers[i + 20];
  }
  
  return grid;
}

// Check if a number is called
export function isNumberCalled(cell: string, calledNumbers: string[]): boolean {
  if (cell === "FREE") return true;
  
  const { number } = parseBingoCell(cell);
  return number !== null && calledNumbers.includes(number.toString());
}
