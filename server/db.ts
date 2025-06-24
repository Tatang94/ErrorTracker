import * as schema from "@shared/schema";

// In-memory storage for development/migration compatibility
class InMemoryStorage {
  private goldPricesData: any[] = [
    { id: 1, karat: 24, pricePerGram: 1125000, currency: "IDR", change: 15000, changePercent: 1.4, timestamp: new Date() },
    { id: 2, karat: 22, pricePerGram: 1030000, currency: "IDR", change: 12500, changePercent: 1.3, timestamp: new Date() },
    { id: 3, karat: 20, pricePerGram: 937500, currency: "IDR", change: 8000, changePercent: 0.9, timestamp: new Date() },
    { id: 4, karat: 18, pricePerGram: 843750, currency: "IDR", change: -5750, changePercent: -0.7, timestamp: new Date() },
    { id: 5, karat: 16, pricePerGram: 750000, currency: "IDR", change: -3200, changePercent: -0.4, timestamp: new Date() },
    { id: 6, karat: 14, pricePerGram: 656250, currency: "IDR", change: 2100, changePercent: 0.3, timestamp: new Date() },
    { id: 7, karat: 10, pricePerGram: 468750, currency: "IDR", change: -1800, changePercent: -0.4, timestamp: new Date() },
  ];

  private priceHistoryData: any[] = [];

  constructor() {
    // Generate price history for the last 7 days
    for (let i = 7; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      this.goldPricesData.forEach((price, index) => {
        const variance = (Math.random() - 0.5) * 0.05;
        const historyPrice = price.pricePerGram * (1 + variance);
        
        this.priceHistoryData.push({
          id: (i * 7) + index + 1,
          karat: price.karat,
          pricePerGram: Math.round(historyPrice),
          currency: "IDR",
          date,
        });
      });
    }
  }

  select() {
    return {
      from: (table: any) => ({
        where: (condition: any) => this.goldPricesData,
        data: this.goldPricesData
      }),
      data: this.goldPricesData
    };
  }

  insert(table: any) {
    return {
      values: (data: any) => ({
        onConflictDoNothing: () => Promise.resolve([data]),
        returning: () => Promise.resolve([data])
      })
    };
  }

  update(table: any) {
    return {
      set: (data: any) => ({
        where: (condition: any) => ({
          returning: () => Promise.resolve([{ ...this.goldPricesData[0], ...data }])
        })
      })
    };
  }
}

// Mock db interface for compatibility
export const db = new InMemoryStorage();
export const pool = null; // Not needed for in-memory storage