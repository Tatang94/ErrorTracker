import { Clock, ExternalLink, Newspaper } from "lucide-react";
import { useGoldNews, type NewsArticle } from "@/hooks/useGoldNews";
import { formatDateRelative } from "@/lib/formatters";

export function GoldNewsSection() {
  const { data: news, isLoading } = useGoldNews();

  if (isLoading) {
    return (
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <Newspaper className="mr-2 h-5 w-5 text-blue-600" />
            Berita Emas Hari Ini
          </h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!news || news.length === 0) {
    return (
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <Newspaper className="mr-2 h-5 w-5 text-blue-600" />
            Berita Emas Hari Ini
          </h2>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
          <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Tidak ada berita emas tersedia saat ini</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center">
          <Newspaper className="mr-2 h-5 w-5 text-yellow-600" />
          Berita Emas Hari Ini
        </h2>
        <div className="text-xs text-gray-500 flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          Update otomatis
        </div>
      </div>
      
      <div className="space-y-3">
        {news.map((article, index) => (
          <NewsCard key={`news-${index}-${article.title.slice(0, 20)}`} article={article} />
        ))}
      </div>
    </section>
  );
}

function NewsCard({ article }: { article: NewsArticle }) {
  const handleClick = () => {
    if (article.url && article.url !== "#") {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all ${
        article.url !== "#" ? 'hover:shadow-md cursor-pointer hover:border-yellow-200' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800 text-sm leading-tight flex-1 pr-2">
          {article.title}
        </h3>
        {article.url !== "#" && (
          <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
        )}
      </div>
      
      <p className="text-gray-600 text-xs mb-3 leading-relaxed">
        {article.description}
      </p>
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span className="font-medium">{article.source.name}</span>
        <span>{formatDateRelative(new Date(article.publishedAt))}</span>
      </div>
    </div>
  );
}