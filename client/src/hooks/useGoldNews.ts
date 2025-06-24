import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export function useGoldNews() {
  return useQuery({
    queryKey: ["/api/gold-news"],
    queryFn: async (): Promise<NewsArticle[]> => {
      const response = await fetch("/api/gold-news");
      if (!response.ok) {
        throw new Error("Failed to fetch gold news");
      }
      return response.json();
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: 30 * 60 * 1000, // Refresh every 30 minutes
  });
}