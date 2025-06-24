import { goldPrices, priceHistory, type GoldPrice, type InsertGoldPrice, type PriceHistory, type InsertPriceHistory } from "@shared/schema";
import { db } from "./db";
import { eq, gte } from "drizzle-orm";

export interface IStorage {
  // Gold prices
  getLatestGoldPrices(): Promise<GoldPrice[]>;
  updateGoldPrice(price: InsertGoldPrice): Promise<GoldPrice>;
  
  // Price history
  getPriceHistory(karat: number, days: number): Promise<PriceHistory[]>;
  addPriceHistory(history: InsertPriceHistory): Promise<PriceHistory>;
  
  // Chart data
  getChartData(karat: number, timeframe: string): Promise<PriceHistory[]>;
}

export class DatabaseStorage implements IStorage {
  async getLatestGoldPrices(): Promise<GoldPrice[]> {
    try {
      const results = await db.select().from(goldPrices);
      return results;
    } catch (error) {
      console.log("Database not available, using fallback data");
      return [
        { id: 1, karat: 24, pricePerGram: 1125000, currency: "IDR", change: 15000, changePercent: 1.4, timestamp: new Date() },
        { id: 2, karat: 22, pricePerGram: 1030000, currency: "IDR", change: 12500, changePercent: 1.3, timestamp: new Date() },
        { id: 3, karat: 20, pricePerGram: 937500, currency: "IDR", change: 8000, changePercent: 0.9, timestamp: new Date() },
        { id: 4, karat: 18, pricePerGram: 843750, currency: "IDR", change: -5750, changePercent: -0.7, timestamp: new Date() },
        { id: 5, karat: 16, pricePerGram: 750000, currency: "IDR", change: -3200, changePercent: -0.4, timestamp: new Date() },
        { id: 6, karat: 14, pricePerGram: 656250, currency: "IDR", change: 2100, changePercent: 0.3, timestamp: new Date() },
        { id: 7, karat: 10, pricePerGram: 468750, currency: "IDR", change: -1800, changePercent: -0.4, timestamp: new Date() },
      ];
    }
  }

  async updateGoldPrice(price: InsertGoldPrice): Promise<GoldPrice> {
    try {
      // First, try to update existing record
      const existing = await db.select().from(goldPrices).where(eq(goldPrices.karat, price.karat));
      
      if (existing.length > 0) {
        const [updated] = await db
          .update(goldPrices)
          .set({
            pricePerGram: price.pricePerGram,
            currency: price.currency || "IDR",
            change: price.change || null,
            changePercent: price.changePercent || null,
            timestamp: new Date(),
          })
          .where(eq(goldPrices.karat, price.karat))
          .returning();
        return updated;
      } else {
        // Insert new record
        const [inserted] = await db
          .insert(goldPrices)
          .values({
            karat: price.karat,
            pricePerGram: price.pricePerGram,
            currency: price.currency || "IDR",
            change: price.change || null,
            changePercent: price.changePercent || null,
          })
          .returning();
        return inserted;
      }
    } catch (error) {
      console.log("Database operation failed, using fallback");
      return {
        id: Math.floor(Math.random() * 1000),
        karat: price.karat,
        pricePerGram: price.pricePerGram,
        currency: price.currency || "IDR",
        change: price.change || null,
        changePercent: price.changePercent || null,
        timestamp: new Date(),
      };
    }
  }

  async getPriceHistory(karat: number, days: number): Promise<PriceHistory[]> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const results = await db
        .select()
        .from(priceHistory)
        .where(eq(priceHistory.karat, karat))
        .orderBy(priceHistory.date);
      
      return results.filter(p => p.date >= cutoffDate);
    } catch (error) {
      console.log("Database query failed, generating fallback history");
      // Generate fallback price history data
      const mockHistory: PriceHistory[] = [];
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const basePrice = this.getBasePriceForKarat(karat);
        const variance = (Math.random() - 0.5) * 0.05; // ±2.5% variance
        const price = basePrice * (1 + variance);
        
        mockHistory.push({
          id: i + 1,
          karat,
          pricePerGram: Math.round(price),
          currency: "IDR",
          date
        });
      }
      
      return mockHistory;
    }
  }

  private getBasePriceForKarat(karat: number): number {
    const basePrices: { [key: number]: number } = {
      24: 1125000,
      22: 1030000,
      20: 937500,
      18: 843750,
      16: 750000,
      14: 656250,
      10: 468750
    };
    return basePrices[karat] || 1000000;
  }

  async addPriceHistory(history: InsertPriceHistory): Promise<PriceHistory> {
    try {
      const [inserted] = await db
        .insert(priceHistory)
        .values({
          karat: history.karat,
          pricePerGram: history.pricePerGram,
          currency: history.currency || "IDR",
          date: history.date,
        })
        .returning();
      return inserted;
    } catch (error) {
      console.log("Database insert failed, using fallback");
      return {
        id: Math.floor(Math.random() * 1000),
        karat: history.karat,
        pricePerGram: history.pricePerGram,
        currency: history.currency || "IDR",
        date: history.date,
      };
    }
  }

  async getChartData(karat: number, timeframe: string): Promise<PriceHistory[]> {
    let days = 1;
    switch (timeframe) {
      case '1H':
        days = 1;
        break;
      case '1D':
        days = 1;
        break;
      case '1W':
        days = 7;
        break;
      case '1M':
        days = 30;
        break;
    }
    
    return this.getPriceHistory(karat, days);
  }
}

export const storage = new DatabaseStorage();
