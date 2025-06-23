export interface GoldApiResponse {
  metal: string;
  currency: string;
  exchange: string;
  symbol: string;
  prev_close_price: number;
  open_price: number;
  low_price: number;
  high_price: number;
  open_time: string;
  price: number;
  ch: number;
  chp: number;
  ask: number;
  bid: number;
  price_gram_24k: number;
  price_gram_22k: number;
  price_gram_21k: number;
  price_gram_20k: number;
  price_gram_18k: number;
  price_gram_16k: number;
  price_gram_14k: number;
  price_gram_10k: number;
  ts: number;
}

export class GoldApiService {
  private readonly API_TOKEN = 'goldapi-1z9019mboum1uw-io';
  private readonly BASE_URL = 'https://www.goldapi.io/api';
  private readonly USD_TO_IDR_RATE = 15500; // Approximate rate, should be updated regularly

  async fetchGoldPrice(): Promise<GoldApiResponse | null> {
    try {
      console.log('Fetching gold price from GoldAPI.io...');
      
      const response = await fetch(`${this.BASE_URL}/XAU/USD`, {
        headers: {
          'x-access-token': this.API_TOKEN,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`GoldAPI HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('GoldAPI response received successfully');
      return data;
      
    } catch (error) {
      console.error('Error fetching from GoldAPI:', error);
      return null;
    }
  }

  // Convert USD prices to IDR
  convertToIDR(data: GoldApiResponse): GoldApiResponse {
    return {
      ...data,
      currency: 'IDR',
      price: Math.round(data.price * this.USD_TO_IDR_RATE),
      prev_close_price: Math.round(data.prev_close_price * this.USD_TO_IDR_RATE),
      open_price: Math.round(data.open_price * this.USD_TO_IDR_RATE),
      low_price: Math.round(data.low_price * this.USD_TO_IDR_RATE),
      high_price: Math.round(data.high_price * this.USD_TO_IDR_RATE),
      ask: Math.round(data.ask * this.USD_TO_IDR_RATE),
      bid: Math.round(data.bid * this.USD_TO_IDR_RATE),
      price_gram_24k: Math.round(data.price_gram_24k * this.USD_TO_IDR_RATE),
      price_gram_22k: Math.round(data.price_gram_22k * this.USD_TO_IDR_RATE),
      price_gram_21k: Math.round(data.price_gram_21k * this.USD_TO_IDR_RATE),
      price_gram_20k: Math.round(data.price_gram_20k * this.USD_TO_IDR_RATE),
      price_gram_18k: Math.round(data.price_gram_18k * this.USD_TO_IDR_RATE),
      price_gram_16k: Math.round(data.price_gram_16k * this.USD_TO_IDR_RATE),
      price_gram_14k: Math.round(data.price_gram_14k * this.USD_TO_IDR_RATE),
      price_gram_10k: Math.round(data.price_gram_10k * this.USD_TO_IDR_RATE)
    };
  }

  // Get current USD to IDR rate (simplified - in production should use currency API)
  async getUSDToIDRRate(): Promise<number> {
    try {
      // In production, fetch from currency API
      // For now, using approximate rate
      return this.USD_TO_IDR_RATE;
    } catch (error) {
      console.error('Error fetching USD/IDR rate:', error);
      return this.USD_TO_IDR_RATE;
    }
  }
}

export const goldApiService = new GoldApiService();