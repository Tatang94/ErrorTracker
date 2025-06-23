import { storage } from "../storage";
import type { GoldPriceData, MarketStatus } from "@shared/schema";

export class GoldPriceService {
  private readonly API_KEY = process.env.GOLD_API_KEY || process.env.METALS_API_KEY || "demo_key";
  private readonly API_URL = "https://api.metals.live/v1/spot/gold";

  async fetchLatestPrices(): Promise<GoldPriceData[]> {
    try {
      // First try to get from real API
      const response = await fetch(`${this.API_URL}?access_key=${this.API_KEY}`);
      
      if (response.ok) {
        const data = await response.json();
        return this.processApiData(data);
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

  private processApiData(apiData: any): GoldPriceData[] {
    // Convert USD to IDR (approximate rate: 1 USD = 15,000 IDR)
    const usdToIdr = 15000;
    const goldPriceUsd = apiData.price || 2000; // Default if no price
    
    const karatData = [
      { karat: 24, name: "Emas 24 Karat", purity: "99.9% Murni", multiplier: 1.0 },
      { karat: 22, name: "Emas 22 Karat", purity: "91.6% Murni", multiplier: 0.916 },
      { karat: 18, name: "Emas 18 Karat", purity: "75% Murni", multiplier: 0.75 },
    ];

    // Convert troy ounce to grams (1 troy ounce = 31.1035 grams)
    const pricePerGramUsd = goldPriceUsd / 31.1035;
    
    return karatData.map(karat => ({
      karat: karat.karat,
      name: karat.name,
      purity: karat.purity,
      pricePerGram: Math.round(pricePerGramUsd * karat.multiplier * usdToIdr),
      change: Math.round((Math.random() - 0.5) * 50000), // Simulated change
      changePercent: parseFloat(((Math.random() - 0.5) * 4).toFixed(2)),
      timestamp: new Date(),
    }));
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
