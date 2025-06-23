import { goldPrices, priceHistory, type GoldPrice, type InsertGoldPrice, type PriceHistory, type InsertPriceHistory } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private goldPrices: Map<number, GoldPrice>;
  private priceHistory: PriceHistory[];
  private currentId: number;
  private historyId: number;

  constructor() {
    this.goldPrices = new Map();
    this.priceHistory = [];
    this.currentId = 1;
    this.historyId = 1;
    
    // Initialize with some base data
    this.initializeData();
  }

  private initializeData() {
    const baseTimestamp = new Date();
    
    // Initialize current prices
    const initialPrices = [
      { karat: 24, pricePerGram: 1095000, change: 15000, changePercent: 1.4 },
      { karat: 22, pricePerGram: 1003000, change: 12500, changePercent: 1.3 },
      { karat: 18, pricePerGram: 821250, change: -5750, changePercent: -0.7 },
    ];

    initialPrices.forEach(price => {
      const goldPrice: GoldPrice = {
        id: this.currentId++,
        karat: price.karat,
        pricePerGram: price.pricePerGram,
        currency: "IDR",
        change: price.change,
        changePercent: price.changePercent,
        timestamp: baseTimestamp,
      };
      this.goldPrices.set(price.karat, goldPrice);
    });

    // Initialize history data (last 7 days)
    for (let i = 7; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      initialPrices.forEach(price => {
        const variance = (Math.random() - 0.5) * 0.05; // ±2.5% variance
        const historyPrice = price.pricePerGram * (1 + variance);
        
        const history: PriceHistory = {
          id: this.historyId++,
          karat: price.karat,
          pricePerGram: historyPrice,
          currency: "IDR",
          date,
        };
        this.priceHistory.push(history);
      });
    }
  }

  async getLatestGoldPrices(): Promise<GoldPrice[]> {
    return Array.from(this.goldPrices.values());
  }

  async updateGoldPrice(price: InsertGoldPrice): Promise<GoldPrice> {
    const goldPrice: GoldPrice = {
      id: this.currentId++,
      ...price,
      timestamp: new Date(),
    };
    this.goldPrices.set(price.karat, goldPrice);
    return goldPrice;
  }

  async getPriceHistory(karat: number, days: number): Promise<PriceHistory[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return this.priceHistory
      .filter(p => p.karat === karat && p.date >= cutoffDate)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async addPriceHistory(history: InsertPriceHistory): Promise<PriceHistory> {
    const priceHistory: PriceHistory = {
      id: this.historyId++,
      ...history,
    };
    this.priceHistory.push(priceHistory);
    return priceHistory;
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

export const storage = new MemStorage();
