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
    queryKey: ["goldNews"],
    queryFn: async (): Promise<NewsArticle[]> => {
      return await apiRequest({
        endpoint: "/api/gold-news",
        method: "GET",
        on401: "returnNull"
      });
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: 30 * 60 * 1000, // Refresh every 30 minutes
  });
}