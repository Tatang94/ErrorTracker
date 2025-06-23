import { pgTable, text, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const goldPrices = pgTable("gold_prices", {
  id: serial("id").primaryKey(),
  karat: integer("karat").notNull(),
  pricePerGram: real("price_per_gram").notNull(),
  currency: text("currency").notNull().default("IDR"),
  change: real("change"),
  changePercent: real("change_percent"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const priceHistory = pgTable("price_history", {
  id: serial("id").primaryKey(),
  karat: integer("karat").notNull(),
  pricePerGram: real("price_per_gram").notNull(),
  currency: text("currency").notNull().default("IDR"),
  date: timestamp("date").notNull(),
});

export const insertGoldPriceSchema = createInsertSchema(goldPrices).omit({
  id: true,
  timestamp: true,
});

export const insertPriceHistorySchema = createInsertSchema(priceHistory).omit({
  id: true,
});

export type GoldPrice = typeof goldPrices.$inferSelect;
export type InsertGoldPrice = z.infer<typeof insertGoldPriceSchema>;
export type PriceHistory = typeof priceHistory.$inferSelect;
export type InsertPriceHistory = z.infer<typeof insertPriceHistorySchema>;

export interface GoldPriceData {
  karat: number;
  name: string;
  purity: string;
  pricePerGram: number;
  change: number;
  changePercent: number;
  timestamp: Date;
}

export interface PriceChartData {
  time: string;
  price: number;
}

export interface MarketStatus {
  isOpen: boolean;
  location: string;
  overallChange: number;
  overallChangePercent: number;
}
