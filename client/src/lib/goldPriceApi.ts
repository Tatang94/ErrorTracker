import { apiRequest } from "./queryClient";
import type { GoldPriceData, MarketStatus, PriceHistory } from "@shared/schema";

export const goldPriceApi = {
  async getLatestPrices(): Promise<GoldPriceData[]> {
    const response = await apiRequest("GET", "/api/gold-prices");
    return response.json();
  },

  async getMarketStatus(): Promise<MarketStatus> {
    const response = await apiRequest("GET", "/api/market-status");
    return response.json();
  },

  async getPriceHistory(karat: number, days: number = 7): Promise<PriceHistory[]> {
    const response = await apiRequest("GET", `/api/price-history/${karat}?days=${days}`);
    return response.json();
  },

  async getChartData(karat: number, timeframe: string = "1D"): Promise<PriceHistory[]> {
    const response = await apiRequest("GET", `/api/chart-data/${karat}?timeframe=${timeframe}`);
    return response.json();
  },

  async refreshPrices(): Promise<{ message: string; prices: GoldPriceData[] }> {
    const response = await apiRequest("POST", "/api/refresh-prices");
    return response.json();
  },
};
