import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebSocketServer } from "ws";
import { z } from "zod";
import { insertGameSchema, insertCardOrderSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up API routes under /api prefix
  const apiRouter = express.Router();

  // Games routes
  apiRouter.get("/games", async (req: Request, res: Response) => {
    try {
      const games = await storage.getGames();
      return res.json(games);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch games" });
    }
  });

  apiRouter.get("/games/next", async (req: Request, res: Response) => {
    try {
      const nextGame = await storage.getNextScheduledGame();
      if (!nextGame) {
        return res.status(404).json({ message: "No upcoming games scheduled" });
      }
      return res.json(nextGame);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch next game" });
    }
  });

  apiRouter.get("/games/active", async (req: Request, res: Response) => {
    try {
      const activeGame = await storage.getActiveGame();
      if (!activeGame) {
        return res.status(404).json({ message: "No active game found" });
      }
      return res.json(activeGame);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch active game" });
    }
  });

  apiRouter.get("/games/:id", async (req: Request, res: Response) => {
    try {
      const gameId = parseInt(req.params.id);
      if (isNaN(gameId)) {
        return res.status(400).json({ message: "Invalid game ID" });
      }

      const game = await storage.getGame(gameId);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      return res.json(game);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch game" });
    }
  });

  apiRouter.post("/games", async (req: Request, res: Response) => {
    try {
      const parsedBody = insertGameSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ message: "Invalid game data", errors: parsedBody.error });
      }

      const game = await storage.createGame(parsedBody.data);
      return res.status(201).json(game);
    } catch (error) {
      return res.status(500).json({ message: "Failed to create game" });
    }
  });

  // Bingo cards routes
  apiRouter.get("/bingo-cards", async (req: Request, res: Response) => {
    try {
      const gameId = req.query.gameId ? parseInt(req.query.gameId as string) : undefined;
      const cards = await storage.getBingoCards(gameId);
      return res.json(cards);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch bingo cards" });
    }
  });

  apiRouter.post("/bingo-cards/generate", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        count: z.number().min(1).max(100),
        gameId: z.number().optional(),
        userId: z.number().optional(),
      });

      const parsedBody = schema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ message: "Invalid request data", errors: parsedBody.error });
      }

      const { count, gameId, userId } = parsedBody.data;
      const cards = await storage.createBingoCards(count, gameId, userId);
      return res.status(201).json(cards);
    } catch (error) {
      return res.status(500).json({ message: "Failed to generate bingo cards" });
    }
  });

  apiRouter.post("/bingo-cards/print", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        cardIds: z.array(z.number()),
      });

      const parsedBody = schema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ message: "Invalid request data", errors: parsedBody.error });
      }

      const { cardIds } = parsedBody.data;
      const updatedCards = [];

      for (const cardId of cardIds) {
        const updatedCard = await storage.markCardAsPrinted(cardId);
        if (updatedCard) {
          updatedCards.push(updatedCard);
        }
      }

      return res.json(updatedCards);
    } catch (error) {
      return res.status(500).json({ message: "Failed to mark cards as printed" });
    }
  });

  apiRouter.post("/bingo-cards/verify", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        cardIdentifier: z.string(),
        gameId: z.number(),
      });

      const parsedBody = schema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ message: "Invalid verification data", errors: parsedBody.error });
      }

      const { cardIdentifier, gameId } = parsedBody.data;
      const verificationResult = await storage.verifyWinningCard(cardIdentifier, gameId);
      
      return res.json(verificationResult);
    } catch (error) {
      return res.status(500).json({ message: "Failed to verify winning card" });
    }
  });

  apiRouter.post("/bingo-cards/verify-code", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        randomCode: z.string(),
        gameId: z.number(),
      });

      const parsedBody = schema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ message: "Invalid verification data", errors: parsedBody.error });
      }

      const { randomCode, gameId } = parsedBody.data;
      const card = await storage.getBingoCardByRandomCode(randomCode);
      
      if (!card) {
        return res.json({ isValid: false, message: "Card not found with provided code" });
      }

      // Use the card identifier to verify the win
      const verificationResult = await storage.verifyWinningCard(card.cardIdentifier, gameId);
      return res.json(verificationResult);
    } catch (error) {
      return res.status(500).json({ message: "Failed to verify winning card" });
    }
  });

  // Card orders routes
  apiRouter.post("/card-orders", async (req: Request, res: Response) => {
    try {
      const parsedBody = insertCardOrderSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ message: "Invalid order data", errors: parsedBody.error });
      }

      const order = await storage.createCardOrder(parsedBody.data);
      return res.status(201).json(order);
    } catch (error) {
      return res.status(500).json({ message: "Failed to create card order" });
    }
  });

  apiRouter.get("/card-orders", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      
      if (userId) {
        const orders = await storage.getCardOrdersByUser(userId);
        return res.json(orders);
      } else {
        const orders = await storage.getCardOrders();
        return res.json(orders);
      }
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch card orders" });
    }
  });

  // Register API routes under /api prefix
  app.use("/api", apiRouter);

  // Set up WebSocket for live game updates
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: "/ws",
    // Allow all origins
    verifyClient: () => true
  });

  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle different message types
        if (data.type === "join-game" && data.gameId) {
          const gameId = parseInt(data.gameId);
          const game = await storage.getGame(gameId);
          
          if (game) {
            ws.send(JSON.stringify({
              type: "game-update",
              game
            }));
          }
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });
  });

  // Function to broadcast game updates to all connected clients
  const broadcastGameUpdate = (gameId: number) => {
    storage.getGame(gameId).then((game) => {
      if (game) {
        const message = JSON.stringify({
          type: "game-update",
          game
        });

        wss.clients.forEach((client) => {
          if (client.readyState === 1) { // OPEN
            client.send(message);
          }
        });
      }
    });
  };

  // Sample endpoint to call a new number (in a real app, this would be protected)
  apiRouter.post("/games/:id/call-number", async (req: Request, res: Response) => {
    try {
      const gameId = parseInt(req.params.id);
      if (isNaN(gameId)) {
        return res.status(400).json({ message: "Invalid game ID" });
      }

      const game = await storage.getGame(gameId);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      if (game.status !== "active") {
        return res.status(400).json({ message: "Game is not active" });
      }

      // Generate a random bingo number that hasn't been called yet
      const letters = ["B", "I", "N", "G", "O"];
      const ranges = [[1, 15], [16, 30], [31, 45], [46, 60], [61, 75]];
      
      let calledNumber;
      let attempts = 0;
      
      // Try to find a number that hasn't been called yet
      while (!calledNumber && attempts < 100) {
        attempts++;
        const letterIndex = Math.floor(Math.random() * 5);
        const letter = letters[letterIndex];
        const [min, max] = ranges[letterIndex];
        const number = Math.floor(min + Math.random() * (max - min + 1));
        const candidate = `${letter}-${number}`;
        
        if (!game.calledNumbers?.includes(candidate)) {
          calledNumber = candidate;
        }
      }

      if (!calledNumber) {
        return res.status(400).json({ message: "All numbers have been called" });
      }

      const updatedGame = await storage.addCalledNumber(gameId, calledNumber);
      
      // Broadcast the update to all connected clients
      broadcastGameUpdate(gameId);
      
      return res.json({ game: updatedGame, calledNumber });
    } catch (error) {
      return res.status(500).json({ message: "Failed to call number" });
    }
  });

  return httpServer;
}
