import { db } from "./db";
import { goldPrices, priceHistory } from "@shared/schema";

export async function seedDatabase() {
  console.log("Using in-memory data for migration compatibility...");
  // In-memory storage is already seeded in db.ts
  console.log("Data ready!");
}