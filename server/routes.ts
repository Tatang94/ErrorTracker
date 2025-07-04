import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { goldPriceService } from "./services/goldPriceService";
import { newsService } from "./services/newsService";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get latest gold prices
  app.get("/api/gold-prices", async (req, res) => {
    try {
      const prices = await goldPriceService.fetchLatestPrices();
      res.json(prices);
    } catch (error) {
      console.error("Error fetching gold prices:", error);
      res.status(500).json({ error: "Failed to fetch gold prices" });
    }
  });

  // Get market status
  app.get("/api/market-status", async (req, res) => {
    try {
      const status = await goldPriceService.getMarketStatus();
      res.json(status);
    } catch (error) {
      console.error("Error fetching market status:", error);
      res.status(500).json({ error: "Failed to fetch market status" });
    }
  });

  // Get price history
  app.get("/api/price-history/:karat", async (req, res) => {
    try {
      const karat = parseInt(req.params.karat);
      const days = parseInt(req.query.days as string) || 7;
      
      if (!karat || ![10, 14, 16, 18, 20, 22, 24].includes(karat)) {
        return res.status(400).json({ error: "Invalid karat value" });
      }
      
      const history = await storage.getPriceHistory(karat, days);
      res.json(history);
    } catch (error) {
      console.error("Error fetching price history:", error);
      res.status(500).json({ error: "Failed to fetch price history" });
    }
  });

  // Get chart data
  app.get("/api/chart-data/:karat", async (req, res) => {
    try {
      const karat = parseInt(req.params.karat);
      const timeframe = req.query.timeframe as string || "1D";
      
      if (!karat || ![10, 14, 16, 18, 20, 22, 24].includes(karat)) {
        return res.status(400).json({ error: "Invalid karat value" });
      }
      
      const chartData = await storage.getChartData(karat, timeframe);
      res.json(chartData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      res.status(500).json({ error: "Failed to fetch chart data" });
    }
  });

  // Refresh prices (manual trigger)
  app.post("/api/refresh-prices", async (req, res) => {
    try {
      await goldPriceService.updatePrices();
      const prices = await goldPriceService.fetchLatestPrices();
      res.json({ 
        message: "Harga emas berhasil diperbarui dari sumber Indonesia", 
        prices,
        sources: ["harga-emas.org", "logammulia.com", "pegadaian.co.id"]
      });
    } catch (error) {
      console.error("Error refreshing prices:", error);
      res.status(500).json({ error: "Failed to refresh prices" });
    }
  });

  // Get gold news from Indonesia
  app.get("/api/gold-news", async (req, res) => {
    try {
      const news = await newsService.getGoldNewsIndonesia();
      res.json(news);
    } catch (error) {
      console.error("Error fetching gold news:", error);
      res.status(500).json({ error: "Failed to fetch gold news" });
    }
  });

  // Get available sources
  app.get("/api/sources", async (req, res) => {
    try {
      const sources = [
        { name: "harga-emas.org", type: "Market Data", country: "Indonesia" },
        { name: "logammulia.com", type: "Dealer", country: "Indonesia" },
        { name: "pegadaian.co.id", type: "Pawnshop", country: "Indonesia" }
      ];
      res.json(sources);
    } catch (error) {
      res.status(500).json({ error: "Failed to get sources" });
    }
  });

  const httpServer = createServer(app);

  // Set up price update interval (every 1 week)
  setInterval(async () => {
    try {
      await goldPriceService.updatePrices();
      console.log("Gold prices updated automatically (weekly)");
    } catch (error) {
      console.error("Error in automatic price update:", error);
    }
  }, 7 * 24 * 60 * 60 * 1000); // 1 week

  return httpServer;
}
