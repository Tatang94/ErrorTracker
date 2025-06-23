import * as cheerio from 'cheerio';

export interface JewelryPrice {
  source: 'toko_emas' | 'pegadaian' | 'jeweler';
  karat: number;
  type: 'perhiasan' | 'batangan' | 'koin';
  buyPrice: number;
  sellPrice?: number;
  workmanshipCost?: number; // Ongkos kerja untuk perhiasan
  unit: string;
  timestamp: Date;
}

export class JewelryScraper {
  
  // Scrape harga perhiasan dari Pegadaian
  async scrapePegadaianJewelry(): Promise<JewelryPrice[]> {
    try {
      console.log('Scraping Pegadaian jewelry prices...');
      
      const response = await fetch('https://pegadaian.co.id/produk/tabungan-emas', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      const prices: JewelryPrice[] = [];
      
      // Cari informasi harga per gram
      $('.price, .harga, [class*="price"], [class*="harga"]').each((i, element) => {
        const $element = $(element);
        const text = $element.text();
        const priceMatch = text.match(/(\d{1,3}(?:[.,]\d{3})*)/);
        
        if (priceMatch) {
          const price = parseInt(priceMatch[1].replace(/[.,]/g, ''));
          if (price > 800000 && price < 1500000) { // Range wajar untuk perhiasan
            prices.push({
              source: 'pegadaian',
              karat: 22, // Pegadaian umumnya 22K
              type: 'perhiasan',
              buyPrice: price,
              sellPrice: Math.round(price * 0.85), // Buyback biasanya 85%
              workmanshipCost: Math.round(price * 0.15), // Ongkos kerja ~15%
              unit: 'IDR/gram',
              timestamp: new Date()
            });
          }
        }
      });
      
      return prices;
    } catch (error) {
      console.error('Error scraping Pegadaian jewelry:', error);
      return this.generateJewelryReference();
    }
  }
  
  // Generate harga perhiasan berdasarkan harga emas murni
  generateJewelryReference(): JewelryPrice[] {
    const basePrice24K = 1125000;
    
    const jewelryTypes = [
      { karat: 18, purity: 0.75, workmanship: 0.20 },
      { karat: 20, purity: 0.833, workmanship: 0.18 },
      { karat: 22, purity: 0.916, workmanship: 0.15 },
      { karat: 24, purity: 1.0, workmanship: 0.10 }
    ];
    
    return jewelryTypes.map(type => {
      const materialCost = Math.round(basePrice24K * type.purity);
      const workmanshipCost = Math.round(materialCost * type.workmanship);
      const totalPrice = materialCost + workmanshipCost;
      const buybackPrice = Math.round(materialCost * 0.85); // Buyback tanpa ongkos kerja
      
      return {
        source: 'toko_emas',
        karat: type.karat,
        type: 'perhiasan',
        buyPrice: totalPrice,
        sellPrice: buybackPrice,
        workmanshipCost: workmanshipCost,
        unit: 'IDR/gram',
        timestamp: new Date()
      };
    });
  }
}

export const jewelryScraper = new JewelryScraper();