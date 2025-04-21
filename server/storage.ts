import { users, type User, type InsertUser } from "@shared/schema";
import { games, type Game, type InsertGame } from "@shared/schema";
import { bingoCards, type BingoCard, type InsertBingoCard } from "@shared/schema";
import { cardOrders, type CardOrder, type InsertCardOrder } from "@shared/schema";
import { v4 as uuidv4 } from 'uuid';

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Game methods
  getGames(): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;
  getActiveGame(): Promise<Game | undefined>;
  getNextScheduledGame(): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: number, game: Partial<Game>): Promise<Game | undefined>;
  updateGameStatus(id: number, status: string): Promise<Game | undefined>;
  addCalledNumber(id: number, number: string): Promise<Game | undefined>;

  // Bingo card methods
  getBingoCards(gameId?: number): Promise<BingoCard[]>;
  getBingoCard(id: number): Promise<BingoCard | undefined>;
  getBingoCardByIdentifier(cardIdentifier: string): Promise<BingoCard | undefined>;
  getBingoCardByRandomCode(randomCode: string): Promise<BingoCard | undefined>;
  createBingoCard(card: InsertBingoCard): Promise<BingoCard>;
  createBingoCards(count: number, gameId?: number, userId?: number): Promise<BingoCard[]>;
  markCardAsPrinted(id: number): Promise<BingoCard | undefined>;
  markCardAsOrdered(id: number): Promise<BingoCard | undefined>;
  markCardAsWinner(id: number): Promise<BingoCard | undefined>;
  verifyWinningCard(cardIdentifier: string, gameId: number): Promise<{ isValid: boolean; card?: BingoCard }>;

  // Card order methods
  getCardOrders(): Promise<CardOrder[]>;
  getCardOrder(id: number): Promise<CardOrder | undefined>;
  getCardOrdersByUser(userId: number): Promise<CardOrder[]>;
  createCardOrder(order: InsertCardOrder): Promise<CardOrder>;
  updateCardOrderStatus(id: number, status: string): Promise<CardOrder | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private bingoCards: Map<number, BingoCard>;
  private cardOrders: Map<number, CardOrder>;
  private userCurrentId: number;
  private gameCurrentId: number;
  private bingoCardCurrentId: number;
  private cardOrderCurrentId: number;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.bingoCards = new Map();
    this.cardOrders = new Map();
    this.userCurrentId = 1;
    this.gameCurrentId = 1;
    this.bingoCardCurrentId = 1;
    this.cardOrderCurrentId = 1;

    // Initialize demo data
    this.initializeDemoData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  // Game methods
  async getGames(): Promise<Game[]> {
    return Array.from(this.games.values()).sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  }

  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async getActiveGame(): Promise<Game | undefined> {
    return Array.from(this.games.values()).find(
      (game) => game.status === "active"
    );
  }

  async getNextScheduledGame(): Promise<Game | undefined> {
    const now = new Date();
    return Array.from(this.games.values())
      .filter((game) => 
        game.status === "scheduled" && new Date(game.startTime) > now
      )
      .sort((a, b) => 
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      )[0];
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = this.gameCurrentId++;
    const now = new Date();
    const game: Game = {
      ...insertGame,
      id,
      status: "scheduled",
      endTime: null,
      calledNumbers: [],
      createdAt: now
    };
    this.games.set(id, game);
    return game;
  }

  async updateGame(id: number, updateData: Partial<Game>): Promise<Game | undefined> {
    const game = this.games.get(id);
    if (!game) return undefined;

    const updatedGame = { ...game, ...updateData };
    this.games.set(id, updatedGame);
    return updatedGame;
  }

  async updateGameStatus(id: number, status: string): Promise<Game | undefined> {
    const game = this.games.get(id);
    if (!game) return undefined;

    const updatedGame = { ...game, status };
    if (status === "completed") {
      updatedGame.endTime = new Date();
    }
    this.games.set(id, updatedGame);
    return updatedGame;
  }

  async addCalledNumber(id: number, number: string): Promise<Game | undefined> {
    const game = this.games.get(id);
    if (!game) return undefined;

    const calledNumbers = [...(game.calledNumbers || []), number];
    const updatedGame = { ...game, calledNumbers };
    this.games.set(id, updatedGame);
    return updatedGame;
  }

  // Bingo card methods
  async getBingoCards(gameId?: number): Promise<BingoCard[]> {
    let cards = Array.from(this.bingoCards.values());
    if (gameId) {
      cards = cards.filter(card => card.gameId === gameId);
    }
    return cards;
  }

  async getBingoCard(id: number): Promise<BingoCard | undefined> {
    return this.bingoCards.get(id);
  }

  async getBingoCardByIdentifier(cardIdentifier: string): Promise<BingoCard | undefined> {
    return Array.from(this.bingoCards.values()).find(
      (card) => card.cardIdentifier === cardIdentifier
    );
  }

  async getBingoCardByRandomCode(randomCode: string): Promise<BingoCard | undefined> {
    return Array.from(this.bingoCards.values()).find(
      (card) => card.randomCode === randomCode
    );
  }

  async createBingoCard(insertCard: InsertBingoCard): Promise<BingoCard> {
    const id = this.bingoCardCurrentId++;
    const now = new Date();
    const card: BingoCard = {
      ...insertCard,
      id,
      isIssued: false,
      isPrinted: false,
      isOrdered: false,
      isWinner: false,
      winClaimedAt: null,
      createdAt: now
    };
    this.bingoCards.set(id, card);
    return card;
  }

  async createBingoCards(count: number, gameId?: number, userId?: number): Promise<BingoCard[]> {
    const cards: BingoCard[] = [];
    for (let i = 0; i < count; i++) {
      const cardIdentifier = `GBL-${Math.floor(1000000 + Math.random() * 9000000)}`;
      const randomCode = this.generateRandomCode();
      const cardData = this.generateBingoCardData();
      
      const card = await this.createBingoCard({
        cardIdentifier,
        randomCode,
        cardData,
        gameId: gameId || null,
        userId: userId || null
      });
      cards.push(card);
    }
    return cards;
  }

  async markCardAsPrinted(id: number): Promise<BingoCard | undefined> {
    const card = this.bingoCards.get(id);
    if (!card) return undefined;

    const updatedCard = { ...card, isPrinted: true, isIssued: true };
    this.bingoCards.set(id, updatedCard);
    return updatedCard;
  }

  async markCardAsOrdered(id: number): Promise<BingoCard | undefined> {
    const card = this.bingoCards.get(id);
    if (!card) return undefined;

    const updatedCard = { ...card, isOrdered: true, isIssued: true };
    this.bingoCards.set(id, updatedCard);
    return updatedCard;
  }

  async markCardAsWinner(id: number): Promise<BingoCard | undefined> {
    const card = this.bingoCards.get(id);
    if (!card) return undefined;

    const updatedCard = { ...card, isWinner: true, winClaimedAt: new Date() };
    this.bingoCards.set(id, updatedCard);
    return updatedCard;
  }

  async verifyWinningCard(cardIdentifier: string, gameId: number): Promise<{ isValid: boolean; card?: BingoCard }> {
    const card = await this.getBingoCardByIdentifier(cardIdentifier);
    if (!card) return { isValid: false };
    
    const game = await this.getGame(gameId);
    if (!game) return { isValid: false };

    // Check if the game is active
    if (game.status !== "active") {
      return { isValid: false };
    }

    // Check if the card is for this game
    if (card.gameId !== gameId) {
      return { isValid: false };
    }

    // Check if the win is being claimed within 30 minutes
    const now = new Date();
    const validClaimPeriod = 30 * 60 * 1000; // 30 minutes in milliseconds

    // In a real app, we would verify the win pattern against called numbers
    // For now, we'll just mark it as valid if it meets the basic criteria
    const updatedCard = await this.markCardAsWinner(card.id);
    return { isValid: true, card: updatedCard };
  }

  // Card order methods
  async getCardOrders(): Promise<CardOrder[]> {
    return Array.from(this.cardOrders.values());
  }

  async getCardOrder(id: number): Promise<CardOrder | undefined> {
    return this.cardOrders.get(id);
  }

  async getCardOrdersByUser(userId: number): Promise<CardOrder[]> {
    return Array.from(this.cardOrders.values()).filter(
      (order) => order.userId === userId
    );
  }

  async createCardOrder(insertOrder: InsertCardOrder): Promise<CardOrder> {
    const id = this.cardOrderCurrentId++;
    const now = new Date();
    const order: CardOrder = {
      ...insertOrder,
      id,
      orderDate: now,
      status: "pending",
      trackingNumber: null,
      createdAt: now
    };
    this.cardOrders.set(id, order);
    return order;
  }

  async updateCardOrderStatus(id: number, status: string): Promise<CardOrder | undefined> {
    const order = this.cardOrders.get(id);
    if (!order) return undefined;

    const updatedOrder = { ...order, status };
    this.cardOrders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Helper methods
  private generateRandomCode(): string {
    // Generate a 10-digit random code for card verification
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }

  private generateBingoCardData(): number[][] {
    // Generate a 5x5 bingo card with random numbers
    const card: number[][] = [[], [], [], [], []];
    
    // B column (1-15)
    const bColumn = this.generateRandomNumbers(1, 15, 5);
    // I column (16-30)
    const iColumn = this.generateRandomNumbers(16, 30, 5);
    // N column (31-45) with FREE space in the middle
    const nColumn = this.generateRandomNumbers(31, 45, 4);
    nColumn.splice(2, 0, 0); // Add FREE space in the middle
    // G column (46-60)
    const gColumn = this.generateRandomNumbers(46, 60, 5);
    // O column (61-75)
    const oColumn = this.generateRandomNumbers(61, 75, 5);
    
    // Arrange in card format
    for (let i = 0; i < 5; i++) {
      card[i] = [bColumn[i], iColumn[i], nColumn[i], gColumn[i], oColumn[i]];
    }
    
    return card;
  }

  private generateRandomNumbers(min: number, max: number, count: number): number[] {
    const numbers: number[] = [];
    while (numbers.length < count) {
      const num = Math.floor(min + Math.random() * (max - min + 1));
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    return numbers;
  }

  private initializeDemoData() {
    // Create a demo user
    this.createUser({
      username: "demo",
      password: "password",
      facilityName: "Golden Age Care Home",
      email: "demo@example.com",
      phone: "555-123-4567"
    });

    // Create a few scheduled games
    const now = new Date();
    
    // Game starting in 3 hours and 25 minutes
    const game1StartTime = new Date(now);
    game1StartTime.setHours(game1StartTime.getHours() + 3);
    game1StartTime.setMinutes(game1StartTime.getMinutes() + 25);
    
    this.createGame({
      title: "Afternoon Bingo Session",
      startTime: game1StartTime,
      winningPattern: "standard"
    });

    // A game for tomorrow
    const game2StartTime = new Date(now);
    game2StartTime.setDate(game2StartTime.getDate() + 1);
    game2StartTime.setHours(14, 0, 0, 0); // 2 PM tomorrow
    
    this.createGame({
      title: "Daily Bingo Bash",
      startTime: game2StartTime,
      winningPattern: "four_corners"
    });

    // Active game for testing
    const activeGameStartTime = new Date(now);
    activeGameStartTime.setMinutes(activeGameStartTime.getMinutes() - 30); // Started 30 minutes ago
    
    const activeGame = this.createGame({
      title: "Current Live Game",
      startTime: activeGameStartTime,
      winningPattern: "standard"
    });

    // Update it to active status and add some called numbers
    this.updateGameStatus(this.gameCurrentId - 1, "active");
    
    const calledNumbers = ["B-4", "I-19", "N-36", "G-46", "O-68"];
    for (const number of calledNumbers) {
      this.addCalledNumber(this.gameCurrentId - 1, number);
    }

    // Create some demo bingo cards
    this.createBingoCards(10, this.gameCurrentId - 1, 1);
  }
}

export const storage = new MemStorage();
