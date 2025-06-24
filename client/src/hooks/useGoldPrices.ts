import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { goldPriceApi } from "@/lib/goldPriceApi";
import { useToast } from "@/hooks/use-toast";

export const useGoldPrices = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ["/api/gold-prices"],
    queryFn: async () => {
      try {
        return await goldPriceApi.getLatestPrices();
      } catch (error) {
        toast({
          title: "Koneksi Bermasalah", 
          description: "Tidak dapat memuat data harga emas terbaru",
          variant: "destructive",
        });
        throw error;
      }
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
  });
};

export const useMarketStatus = () => {
  return useQuery({
    queryKey: ["/api/market-status"],
    queryFn: async () => await goldPriceApi.getMarketStatus(),
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

export const usePriceHistory = (karat: number, days: number = 7) => {
  return useQuery({
    queryKey: ["/api/price-history", karat, days],
    queryFn: async () => await goldPriceApi.getPriceHistory(karat, days),
    enabled: !!karat,
  });
};

export const useChartData = (karat: number, timeframe: string = "1D") => {
  return useQuery({
    queryKey: ["/api/chart-data", karat, timeframe],
    queryFn: async () => await goldPriceApi.getChartData(karat, timeframe),
    enabled: !!karat,
  });
};

export const useRefreshPrices = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async () => await goldPriceApi.refreshPrices(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gold-prices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/price-history"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chart-data"] });
      toast({
        title: "Berhasil",
        description: "Data harga emas telah diperbarui",
      });
    },
    onError: () => {
      toast({
        title: "Gagal",
        description: "Tidak dapat memperbarui data harga emas",
        variant: "destructive",
      });
    },
  });
};
