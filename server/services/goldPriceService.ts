import { storage } from "../storage";
import type { GoldPriceData, MarketStatus } from "@shared/schema";
import { goldScraper } from "../scraper/goldScraper";
import { antamScraper } from "../scraper/antamScraper";
import { jewelryScraper } from "../scraper/jewelryScraper";
import { goldApiService } from "./goldApiService";

export class GoldPriceService {
  private readonly API_KEY = process.env.GOLD_API_KEY || "demo_key";
  private readonly API_URL = "https://www.goldpricez.com/api/rates/currency/IDR";

  async fetchLatestPrices(): Promise<GoldPriceData[]> {
    try {
      console.log("Fetching comprehensive gold prices from GoldAPI and Indonesian sources...");
      
      // Primary: Get international gold prices from GoldAPI
      const goldApiData = await goldApiService.fetchGoldPrice();
      
      if (goldApiData) {
        console.log("Using GoldAPI.io as primary source");
        const idrData = goldApiService.convertToIDR(goldApiData);
        return await this.processGoldApiData(idrData);
      }
      
      // Fallback: Indonesian scraping sources
      console.log("GoldAPI unavailable, falling back to Indonesian sources...");
      const [scrapedPrices, antamPrices, jewelryPrices] = await Promise.allSettled([
        goldScraper.scrapeAllSources(),
        antamScraper.scrapeAntamPrices(),
        jewelryScraper.scrapePegadaianJewelry()
      ]);
      
      const allPrices: GoldPriceData[] = [];
      
      // Process scraped general prices
      if (scrapedPrices.status === 'fulfilled' && scrapedPrices.value.length > 0) {
        const processedData = goldScraper.convertToGoldPriceData(scrapedPrices.value);
        const validatedData = processedData.filter(item => 
          item.pricePerGram >= 400000 && item.pricePerGram <= 2000000
        );
        allPrices.push(...validatedData);
      }
      
      // Process Antam prices (Logam Mulia - investment grade)
      if (antamPrices.status === 'fulfilled' && antamPrices.value.length > 0) {
        antamPrices.value.forEach(price => {
          allPrices.push({
            karat: 24, // Antam selalu 24K
            name: `Logam Mulia Antam (${price.weight})`,
            purity: "99.99%",
            pricePerGram: price.buyPrice,
            change: 0,
            changePercent: 0,
            timestamp: price.timestamp
          });
        });
      } else {
        // Fallback Antam reference
        const antamRef = antamScraper.generateAntamReference();
        antamRef.forEach(price => {
          allPrices.push({
            karat: 24,
            name: "Logam Mulia Antam (Referensi)",
            purity: "99.99%",
            pricePerGram: price.buyPrice,
            change: 0,
            changePercent: 0,
            timestamp: price.timestamp
          });
        });
      }
      
      // Process jewelry prices (dengan ongkos kerja)
      if (jewelryPrices.status === 'fulfilled' && jewelryPrices.value.length > 0) {
        jewelryPrices.value.forEach(price => {
          allPrices.push({
            karat: price.karat,
            name: `Perhiasan ${price.karat}K (${price.source})`,
            purity: this.getKaratPurity(price.karat),
            pricePerGram: price.buyPrice,
            change: 0,
            changePercent: 0,
            timestamp: price.timestamp
          });
        });
      } else {
        // Fallback jewelry reference
        const jewelryRef = jewelryScraper.generateJewelryReference();
        jewelryRef.forEach(price => {
          allPrices.push({
            karat: price.karat,
            name: `Perhiasan ${price.karat}K (Est.)`,
            purity: this.getKaratPurity(price.karat),
            pricePerGram: price.buyPrice,
            change: 0,
            changePercent: 0,
            timestamp: price.timestamp
          });
        });
      }
      
      if (allPrices.length > 0) {
        console.log(`Compiled ${allPrices.length} comprehensive gold prices`);
        return await this.processScrapedData(allPrices);
      }
      
      // Final fallback to stored data
      console.log("Using stored prices as final fallback");
      const storedPrices = await storage.getLatestGoldPrices();
      return this.convertStoredPrices(storedPrices);
    } catch (error) {
      console.error("Error fetching gold prices:", error);
      const storedPrices = await storage.getLatestGoldPrices();
      return this.convertStoredPrices(storedPrices);
    }
  }
  
  private async processGoldApiData(goldApiData: any): Promise<GoldPriceData[]> {
    const karatData = [
      { karat: 24, name: "Emas 24 Karat (Internasional)", purity: "99.9%", price: goldApiData.price_gram_24k },
      { karat: 22, name: "Emas 22 Karat (Internasional)", purity: "91.6%", price: goldApiData.price_gram_22k },
      { karat: 21, name: "Emas 21 Karat (Internasional)", purity: "87.5%", price: goldApiData.price_gram_21k },
      { karat: 20, name: "Emas 20 Karat (Internasional)", purity: "83.3%", price: goldApiData.price_gram_20k },
      { karat: 18, name: "Emas 18 Karat (Internasional)", purity: "75.0%", price: goldApiData.price_gram_18k },
      { karat: 16, name: "Emas 16 Karat (Internasional)", purity: "66.7%", price: goldApiData.price_gram_16k },
      { karat: 14, name: "Emas 14 Karat (Internasional)", purity: "58.3%", price: goldApiData.price_gram_14k },
      { karat: 10, name: "Emas 10 Karat (Internasional)", purity: "41.7%", price: goldApiData.price_gram_10k }
    ];

    return Promise.all(karatData.map(async karat => {
      const pricePerGram = Math.round(karat.price);
      
      return {
        karat: karat.karat,
        name: karat.name,
        purity: karat.purity,
        pricePerGram: pricePerGram,
        change: goldApiData.ch ? Math.round(goldApiData.ch * 15500) : 0, // Convert USD change to IDR
        changePercent: goldApiData.chp || 0,
        timestamp: new Date(goldApiData.ts * 1000),
      };
    }));
  }

  private getKaratPurity(karat: number): string {
    const purityMap: { [key: number]: string } = {
      10: "41.7%",
      14: "58.3%",
      16: "66.7%", 
      18: "75.0%",
      20: "83.3%",
      21: "87.5%",
      22: "91.6%",
      24: "99.9%"
    };
    return purityMap[karat] || `${Math.round((karat/24)*100)}%`;
  }

  private async processScrapedData(scrapedData: any[]): Promise<GoldPriceData[]> {
    return Promise.all(scrapedData.map(async item => ({
      karat: item.karat,
      name: item.name,
      purity: item.purity,
      pricePerGram: item.pricePerGram,
      change: await this.calculatePriceChange(item.karat, item.pricePerGram),
      changePercent: await this.calculateChangePercent(item.karat, item.pricePerGram),
      timestamp: item.timestamp,
    })));
  }

  private async processGoldPricezData(apiData: any): Promise<GoldPriceData[]> {
    const rates = apiData.rates;
    
    const karatData = [
      { karat: 24, name: "Emas 24 Karat", purity: "99.9% Murni", rateKey: "24k" },
      { karat: 22, name: "Emas 22 Karat", purity: "91.6% Murni", rateKey: "22k" },
      { karat: 20, name: "Emas 20 Karat", purity: "83.3% Murni", rateKey: "20k" },
      { karat: 18, name: "Emas 18 Karat", purity: "75% Murni", rateKey: "18k" },
      { karat: 16, name: "Emas 16 Karat", purity: "66.7% Murni", rateKey: "16k" },
      { karat: 14, name: "Emas 14 Karat", purity: "58.3% Murni", rateKey: "14k" },
      { karat: 10, name: "Emas 10 Karat", purity: "41.7% Murni", rateKey: "10k" },
    ];

    return Promise.all(karatData.map(async karat => {
      const pricePerGram = rates[karat.rateKey] || rates.gold || 1095000;
      
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
