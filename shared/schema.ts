import { pgTable, text, serial, integer, boolean, timestamp, date, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base user table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  facilityName: text("facility_name"),
  email: text("email"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  facilityName: true,
  email: true,
  phone: true,
});

// Games table
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  status: text("status").notNull().default("scheduled"), // scheduled, active, completed, cancelled
  calledNumbers: json("called_numbers").$type<string[]>().default([]),
  winningPattern: text("winning_pattern").notNull().default("standard"), // standard, blackout, four_corners, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGameSchema = createInsertSchema(games).pick({
  title: true,
  startTime: true,
  winningPattern: true,
});

// Bingo cards table
export const bingoCards = pgTable("bingo_cards", {
  id: serial("id").primaryKey(),
  cardIdentifier: text("card_identifier").notNull().unique(), // Unique ID for the card (e.g., GBL-1234567)
  randomCode: text("random_code").notNull(), // 10-digit code for verification
  cardData: json("card_data").$type<number[][]>().notNull(), // 5x5 grid of numbers
  isIssued: boolean("is_issued").default(false),
  isPrinted: boolean("is_printed").default(false),
  isOrdered: boolean("is_ordered").default(false),
  gameId: integer("game_id").references(() => games.id),
  userId: integer("user_id").references(() => users.id),
  isWinner: boolean("is_winner").default(false),
  winClaimedAt: timestamp("win_claimed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBingoCardSchema = createInsertSchema(bingoCards).pick({
  cardIdentifier: true,
  randomCode: true,
  cardData: true,
  gameId: true,
  userId: true,
});

// Card orders table
export const cardOrders = pgTable("card_orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  orderDate: timestamp("order_date").defaultNow().notNull(),
  quantity: integer("quantity").notNull(),
  cardType: text("card_type").notNull(), // standard, laminated, large_print
  status: text("status").notNull().default("pending"), // pending, processing, shipped, delivered
  shippingAddress: text("shipping_address"),
  trackingNumber: text("tracking_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCardOrderSchema = createInsertSchema(cardOrders).pick({
  userId: true,
  quantity: true,
  cardType: true,
  shippingAddress: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;

export type BingoCard = typeof bingoCards.$inferSelect;
export type InsertBingoCard = z.infer<typeof insertBingoCardSchema>;

export type CardOrder = typeof cardOrders.$inferSelect;
export type InsertCardOrder = z.infer<typeof insertCardOrderSchema>;
