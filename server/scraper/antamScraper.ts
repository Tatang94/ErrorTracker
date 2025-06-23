import * as cheerio from 'cheerio';

export interface AntamPrice {
  type: 'logam_mulia' | 'buyback';
  weight: string; // '1 gram', '5 gram', etc
  buyPrice: number;
  sellPrice?: number;
  unit: string;
  timestamp: Date;
}

export class AntamScraper {
  
  async scrapeAntamPrices(): Promise<AntamPrice[]> {
    try {
      console.log('Scraping Antam official prices...');
      
      // Scrape dari halaman resmi Antam
      const response = await fetch('https://www.antam.com/id/harga-emas', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      const prices: AntamPrice[] = [];
      
      // Cari tabel harga Logam Mulia
      $('table').each((i, table) => {
        const $table = $(table);
        const headerText = $table.find('th').text().toLowerCase();
        
        if (headerText.includes('logam mulia') || headerText.includes('emas')) {
          $table.find('tr').each((j, row) => {
            const $row = $(row);
            const cells = $row.find('td');
            
            if (cells.length >= 2) {
              const weightText = $(cells[0]).text().trim();
              const priceText = $(cells[1]).text().trim();
              
              // Extract weight dan price
              const weightMatch = weightText.match(/(\d+)\s*(gram|gr)/i);
              const priceMatch = priceText.replace(/[^\d]/g, '');
              
              if (weightMatch && priceMatch) {
                const weight = parseInt(weightMatch[1]);
                const totalPrice = parseInt(priceMatch);
                const pricePerGram = Math.round(totalPrice / weight);
                
                if (pricePerGram > 500000 && pricePerGram < 2000000) {
                  prices.push({
                    type: 'logam_mulia',
                    weight: `${weight} gram`,
                    buyPrice: pricePerGram,
                    unit: 'IDR/gram',
                    timestamp: new Date()
                  });
                }
              }
            }
          });
        }
      });
      
      return prices;
    } catch (error) {
      console.error('Error scraping Antam:', error);
      return [];
    }
  }
  
  // Fallback dengan harga referensi Antam terkini (berdasarkan market rate)
  generateAntamReference(): AntamPrice[] {
    const basePrice24K = 1125000; // Harga pasar saat ini per gram 24K
    const buybackDiscount = 0.95; // Buyback biasanya 5% lebih rendah
    
    return [
      {
        type: 'logam_mulia',
        weight: '1 gram',
        buyPrice: basePrice24K,
        sellPrice: Math.round(basePrice24K * buybackDiscount),
        unit: 'IDR/gram',
        timestamp: new Date()
      }
    ];
  }
}

export const antamScraper = new AntamScraper();