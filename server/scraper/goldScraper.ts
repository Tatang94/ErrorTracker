import * as cheerio from 'cheerio';

export interface ScrapedGoldPrice {
  source: string;
  karat: number;
  buyPrice: number;
  sellPrice: number;
  unit: string;
  timestamp: Date;
}

export class GoldScraper {
  
  // Scrape harga emas dari harga-emas.org
  async scrapeHargaEmasOrg(): Promise<ScrapedGoldPrice[]> {
    try {
      console.log('Scraping harga-emas.org...');
      const response = await fetch('https://harga-emas.org', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      const prices: ScrapedGoldPrice[] = [];
      
      // Cari tabel harga emas (struktur bisa bervariasi)
      $('table tr').each((i, row) => {
        const cells = $(row).find('td');
        if (cells.length >= 3) {
          const karatText = $(cells[0]).text().trim();
          const buyPriceText = $(cells[1]).text().trim();
          const sellPriceText = $(cells[2]).text().trim();
          
          // Extract karat number
          const karatMatch = karatText.match(/(\d+)/);
          if (karatMatch) {
            const karat = parseInt(karatMatch[1]);
            const buyPrice = this.parsePrice(buyPriceText);
            const sellPrice = this.parsePrice(sellPriceText);
            
            if (buyPrice > 0 && sellPrice > 0) {
              prices.push({
                source: 'harga-emas.org',
                karat,
                buyPrice,
                sellPrice,
                unit: 'gram',
                timestamp: new Date()
              });
            }
          }
        }
      });
      
      return prices;
    } catch (error) {
      console.error('Error scraping harga-emas.org:', error);
      return [];
    }
  }
  
  // Scrape harga emas dari logammulia.com
  async scrapeLogamMulia(): Promise<ScrapedGoldPrice[]> {
    try {
      console.log('Scraping logammulia.com...');
      const response = await fetch('https://logammulia.com/id/harga-emas-hari-ini', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      const prices: ScrapedGoldPrice[] = [];
      
      // Cari harga emas di halaman
      $('.price-table tr, .gold-price tr, table tr').each((i, row) => {
        const cells = $(row).find('td');
        if (cells.length >= 2) {
          const productText = $(cells[0]).text().trim();
          const priceText = $(cells[1]).text().trim();
          
          // Cek apakah ini harga emas
          if (productText.toLowerCase().includes('emas') || productText.toLowerCase().includes('gold')) {
            const price = this.parsePrice(priceText);
            
            if (price > 0) {
              // Assume 24K for logam mulia
              prices.push({
                source: 'logammulia.com',
                karat: 24,
                buyPrice: price,
                sellPrice: price * 0.95, // Estimate sell price (5% lower)
                unit: 'gram',
                timestamp: new Date()
              });
            }
          }
        }
      });
      
      return prices;
    } catch (error) {
      console.error('Error scraping logammulia.com:', error);
      return [];
    }
  }
  
  // Scrape Antam price
  async scrapeAntam(): Promise<ScrapedGoldPrice[]> {
    try {
      console.log('Scraping Antam prices...');
      // Antam doesn't have direct API, but we can try their website
      const response = await fetch('https://www.antam.com/harga-emas', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      const prices: ScrapedGoldPrice[] = [];
      
      // Look for gold price table
      $('table tr, .price-row').each((i, row) => {
        const text = $(row).text().toLowerCase();
        if (text.includes('emas') || text.includes('gold')) {
          const cells = $(row).find('td');
          if (cells.length >= 2) {
            const priceText = $(cells[cells.length - 1]).text().trim();
            const price = this.parsePrice(priceText);
            
            if (price > 0) {
              prices.push({
                source: 'antam.com',
                karat: 24,
                buyPrice: price,
                sellPrice: price * 0.96, // Antam typically has smaller spread
                unit: 'gram',
                timestamp: new Date()
              });
            }
          }
        }
      });
      
      return prices;
    } catch (error) {
      console.error('Error scraping Antam:', error);
      return [];
    }
  }
  
  // Scrape all sources and combine results
  async scrapeAllSources(): Promise<ScrapedGoldPrice[]> {
    const results = await Promise.allSettled([
      this.scrapeHargaEmasOrg(),
      this.scrapeLogamMulia(),
      this.scrapeAntam()
    ]);
    
    const allPrices: ScrapedGoldPrice[] = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allPrices.push(...result.value);
      } else {
        console.error(`Scraping failed for source ${index}:`, result.reason);
      }
    });
    
    return allPrices;
  }
  
  // Helper method to parse price from text
  private parsePrice(priceText: string): number {
    // Remove non-numeric characters except dots and commas
    const cleaned = priceText.replace(/[^\d.,]/g, '');
    
    // Handle Indonesian number format (dots as thousands separator, comma as decimal)
    const indonesianFormat = cleaned.replace(/\./g, '').replace(',', '.');
    
    // Handle international format (commas as thousands separator, dot as decimal)
    const internationalFormat = cleaned.replace(/,/g, '');
    
    // Try both formats and return the one that makes sense
    const indonesianPrice = parseFloat(indonesianFormat);
    const internationalPrice = parseFloat(internationalFormat);
    
    // Return the price that's in a reasonable range for gold (> 500000 IDR per gram)
    if (indonesianPrice > 500000) return indonesianPrice;
    if (internationalPrice > 500000) return internationalPrice;
    
    return 0;
  }
  
  // Convert scraped prices to our standard format
  convertToGoldPriceData(scrapedPrices: ScrapedGoldPrice[]): any[] {
    const priceMap = new Map<number, { totalBuy: number, totalSell: number, count: number }>();
    
    // Group by karat and calculate averages
    scrapedPrices.forEach(price => {
      const existing = priceMap.get(price.karat) || { totalBuy: 0, totalSell: 0, count: 0 };
      existing.totalBuy += price.buyPrice;
      existing.totalSell += price.sellPrice;
      existing.count += 1;
      priceMap.set(price.karat, existing);
    });
    
    const karatInfo = {
      24: { name: "Emas 24 Karat", purity: "99.9% Murni" },
      22: { name: "Emas 22 Karat", purity: "91.6% Murni" },
      18: { name: "Emas 18 Karat", purity: "75% Murni" },
    };
    
    const result: any[] = [];
    
    priceMap.forEach((data, karat) => {
      const avgBuyPrice = Math.round(data.totalBuy / data.count);
      const avgSellPrice = Math.round(data.totalSell / data.count);
      const info = karatInfo[karat as keyof typeof karatInfo];
      
      if (info) {
        result.push({
          karat,
          name: info.name,
          purity: info.purity,
          pricePerGram: avgBuyPrice,
          sellPrice: avgSellPrice,
          change: 0, // Will be calculated against previous prices
          changePercent: 0,
          timestamp: new Date(),
          sources: scrapedPrices.filter(p => p.karat === karat).map(p => p.source)
        });
      }
    });
    
    return result;
  }
}

export const goldScraper = new GoldScraper();