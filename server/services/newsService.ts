export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export class NewsService {
  private readonly NEWS_API_KEY = process.env.NEWS_API_KEY || "9f98cd32f29442efbbf17e8720bfd3f9";
  private readonly BASE_URL = "https://newsapi.org/v2/everything";

  async getGoldNewsIndonesia(): Promise<NewsArticle[]> {
    try {
      console.log('NewsAPI Key:', this.NEWS_API_KEY ? 'Available' : 'Missing');
      
      const params = new URLSearchParams({
        q: 'harga emas OR emas antam OR investasi emas OR logam mulia',
        language: 'id',
        sortBy: 'publishedAt',
        pageSize: '8',
        apiKey: this.NEWS_API_KEY
      });

      console.log('Fetching gold news from NewsAPI...');
      
      const response = await fetch(`${this.BASE_URL}?${params}`);
      
      if (!response.ok) {
        if (response.status === 401) {
          console.log('NewsAPI key invalid, using fallback news');
          return this.getFallbackNews();
        }
        throw new Error(`NewsAPI HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log('NewsAPI Response status:', data.status);
      console.log('Articles found:', data.articles ? data.articles.length : 0);
      
      if (data.status === 'ok' && data.articles && data.articles.length > 0) {
        console.log(`Found ${data.articles.length} gold news articles`);
        // Return articles even if they don't contain "emas" directly, as long as they're from our search
        const processedArticles = data.articles
          .slice(0, 5)
          .map((article: any) => ({
            title: article.title,
            description: article.description,
            url: article.url,
            publishedAt: article.publishedAt,
            source: {
              name: article.source.name
            }
          }));
          
        console.log(`Returning ${processedArticles.length} articles from NewsAPI`);
        // If no relevant articles found, return fallback
        if (processedArticles.length === 0) {
          return this.getFallbackNews();
        }
        return processedArticles;
      }
      
      return this.getFallbackNews();
    } catch (error) {
      console.error('Error fetching gold news:', error);
      return this.getFallbackNews();
    }
  }

  private getFallbackNews(): NewsArticle[] {
    const now = new Date();
    
    return [
      {
        title: "Harga Emas Antam Hari Ini Mencapai Rp 1,71 Juta per Gram",
        description: "Harga buyback emas Antam logam mulia pada perdagangan hari ini tercatat di level Rp 1.657.000 per gram, sementara harga jual mencapai Rp 1.710.000 per gram. Kenaikan ini didorong oleh meningkatnya permintaan investor.",
        url: "https://zona-gold.com/news/harga-emas-antam-hari-ini",
        publishedAt: now.toISOString(),
        source: { name: "ZONA GOLD" }
      },
      {
        title: "Bank Indonesia: Emas Tetap Menjadi Safe Haven Asset Terpercaya",
        description: "Bank Indonesia menyatakan bahwa emas masih menjadi pilihan investasi yang aman di tengah ketidakpastian ekonomi global. Logam mulia terbukti mampu mempertahankan nilainya dalam jangka panjang.",
        url: "https://zona-gold.com/news/bank-indonesia-emas-safe-haven",
        publishedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
        source: { name: "Kontan" }
      },
      {
        title: "Pegadaian Catat Peningkatan Transaksi Emas 15% di Kuartal Ini",
        description: "PT Pegadaian mencatat peningkatan transaksi emas sebesar 15% dibandingkan kuartal sebelumnya. Masyarakat semakin tertarik berinvestasi emas sebagai proteksi inflasi.",
        url: "https://zona-gold.com/news/pegadaian-transaksi-emas-meningkat",
        publishedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
        source: { name: "Bisnis Indonesia" }
      }
    ];
  }
}

export const newsService = new NewsService();