import { db } from "./db";
import { goldPrices, priceHistory } from "@shared/schema";

export async function seedDatabase() {
  try {
    console.log("Seeding database with initial gold price data...");

    // Initial gold prices in IDR (updated June 2025 market prices)
    const initialPrices = [
      { karat: 24, pricePerGram: 1125000, change: 15000, changePercent: 1.4 },
      { karat: 22, pricePerGram: 1030000, change: 12500, changePercent: 1.3 },
      { karat: 20, pricePerGram: 937500, change: 8000, changePercent: 0.9 },
      { karat: 18, pricePerGram: 843750, change: -5750, changePercent: -0.7 },
      { karat: 16, pricePerGram: 750000, change: -3200, changePercent: -0.4 },
      { karat: 14, pricePerGram: 656250, change: 2100, changePercent: 0.3 },
      { karat: 10, pricePerGram: 468750, change: -1800, changePercent: -0.4 },
    ];

    // Insert initial prices
    for (const price of initialPrices) {
      await db.insert(goldPrices).values({
        karat: price.karat,
        pricePerGram: price.pricePerGram,
        currency: "IDR",
        change: price.change,
        changePercent: price.changePercent,
      }).onConflictDoNothing();
    }

    // Generate price history for the last 7 days
    for (let i = 7; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      for (const price of initialPrices) {
        const variance = (Math.random() - 0.5) * 0.05; // ±2.5% variance
        const historyPrice = price.pricePerGram * (1 + variance);
        
        await db.insert(priceHistory).values({
          karat: price.karat,
          pricePerGram: Math.round(historyPrice),
          currency: "IDR",
          date,
        }).onConflictDoNothing();
      }
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.log("Database seeding failed, using fallback data:", error);
  }
}