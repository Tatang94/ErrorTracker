import { storage } from "../storage";
import type { GoldPriceData, MarketStatus } from "@shared/schema";

export class GoldPriceService {
  private readonly API_KEY = process.env.GOLD_API_KEY || "demo_key";
  private readonly API_URL = "https://www.goldpricez.com/api/rates/currency/IDR";

  async fetchLatestPrices(): Promise<GoldPriceData[]> {
    try {
      // Fetch from goldpricez.com API
      const response = await fetch(`${this.API_URL}?api_key=${this.API_KEY}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.rates) {
          return await this.processGoldPricezData(data);
        }
      }
      
      // Fallback to stored data if API fails
      const storedPrices = await storage.getLatestGoldPrices();
      return this.convertStoredPrices(storedPrices);
    } catch (error) {
      console.error("Error fetching gold prices:", error);
      // Return stored data as fallback
      const storedPrices = await storage.getLatestGoldPrices();
      return this.convertStoredPrices(storedPrices);
    }
  }

  private async processGoldPricezData(apiData: any): Promise<GoldPriceData[]> {
    // goldpricez.com returns rates in IDR per gram for different purities
    const rates = apiData.rates;
    
    const karatData = [
      { karat: 24, name: "Emas 24 Karat", purity: "99.9% Murni", rateKey: "24k" },
      { karat: 22, name: "Emas 22 Karat", purity: "91.6% Murni", rateKey: "22k" },
      { karat: 18, name: "Emas 18 Karat", purity: "75% Murni", rateKey: "18k" },
    ];

    return Promise.all(karatData.map(async karat => {
      const pricePerGram = rates[karat.rateKey] || rates.gold || 1095000; // fallback to sample price
      
      return {
        karat: karat.karat,
        name: karat.name,
        purity: karat.purity,
        pricePerGram: Math.round(pricePerGram),
        change: await this.calculatePriceChange(karat.karat, pricePerGram),
        changePercent: await this.calculateChangePercent(karat.karat, pricePerGram),
        timestamp: new Date(),
      };
    }));
  }

  private async calculatePriceChange(karat: number, currentPrice: number): Promise<number> {
    try {
      const storedPrices = await storage.getLatestGoldPrices();
      const previousPrice = storedPrices.find(p => p.karat === karat);
      return previousPrice ? Math.round(currentPrice - previousPrice.pricePerGram) : 0;
    } catch {
      return 0;
    }
  }

  private async calculateChangePercent(karat: number, currentPrice: number): Promise<number> {
    try {
      const storedPrices = await storage.getLatestGoldPrices();
      const previousPrice = storedPrices.find(p => p.karat === karat);
      if (previousPrice && previousPrice.pricePerGram > 0) {
        const change = currentPrice - previousPrice.pricePerGram;
        return parseFloat(((change / previousPrice.pricePerGram) * 100).toFixed(2));
      }
      return 0;
    } catch {
      return 0;
    }
  }

  private convertStoredPrices(storedPrices: any[]): GoldPriceData[] {
    const karatInfo = {
      24: { name: "Emas 24 Karat", purity: "99.9% Murni" },
      22: { name: "Emas 22 Karat", purity: "91.6% Murni" },
      18: { name: "Emas 18 Karat", purity: "75% Murni" },
    };

    return storedPrices.map(price => ({
      karat: price.karat,
      name: karatInfo[price.karat as keyof typeof karatInfo]?.name || `Emas ${price.karat} Karat`,
      purity: karatInfo[price.karat as keyof typeof karatInfo]?.purity || `${price.karat}K`,
      pricePerGram: price.pricePerGram,
      change: price.change || 0,
      changePercent: price.changePercent || 0,
      timestamp: price.timestamp,
    }));
  }

  async getMarketStatus(): Promise<MarketStatus> {
    const now = new Date();
    const jakartaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    const hour = jakartaTime.getHours();
    
    // Market is open from 9 AM to 5 PM Jakarta time
    const isOpen = hour >= 9 && hour < 17;
    
    return {
      isOpen,
      location: "Jakarta",
      overallChange: 2.1,
      overallChangePercent: 2.1,
    };
  }

  async updatePrices(): Promise<void> {
    try {
      const latestPrices = await this.fetchLatestPrices();
      
      for (const price of latestPrices) {
        await storage.updateGoldPrice({
          karat: price.karat,
          pricePerGram: price.pricePerGram,
          currency: "IDR",
          change: price.change,
          changePercent: price.changePercent,
        });
        
        // Also add to history
        await storage.addPriceHistory({
          karat: price.karat,
          pricePerGram: price.pricePerGram,
          currency: "IDR",
          date: new Date(),
        });
      }
    } catch (error) {
      console.error("Error updating prices:", error);
    }
  }
}

export const goldPriceService = new GoldPriceService();
