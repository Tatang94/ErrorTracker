import { useState } from "react";
import { Header } from "@/components/Header";
import { usePriceHistory } from "@/hooks/useGoldPrices";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { formatCurrency, formatDateRelative, formatPercentage } from "@/lib/formatters";
import { TrendingUp, TrendingDown, History as HistoryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function History() {
  const [selectedKarat, setSelectedKarat] = useState(24);
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const { data: priceHistory, isLoading } = usePriceHistory(selectedKarat, selectedPeriod);

  const karatOptions = [
    { karat: 24, label: "24K" },
    { karat: 22, label: "22K" },
    { karat: 20, label: "20K" },
    { karat: 18, label: "18K" },
    { karat: 16, label: "16K" },
    { karat: 14, label: "14K" },
    { karat: 10, label: "10K" },
  ];

  const periodOptions = [
    { days: 7, label: "7 Hari" },
    { days: 30, label: "30 Hari" },
    { days: 90, label: "90 Hari" },
  ];

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen relative">
      <Header />
      
      <main className="pb-20 px-4 pt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
            <HistoryIcon className="mr-3 h-7 w-7 text-blue-600" />
            Riwayat Harga
          </h1>
          <p className="text-gray-600 text-sm">Lihat pergerakan harga emas historis</p>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          {/* Karat Selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Jenis Emas</h3>
            <div className="flex bg-white rounded-xl p-2 shadow-sm border border-gray-100">
              {karatOptions.map((option) => (
                <Button
                  key={option.karat}
                  variant={selectedKarat === option.karat ? "default" : "ghost"}
                  className={`flex-1 ${selectedKarat === option.karat ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                  onClick={() => setSelectedKarat(option.karat)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Period Selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Periode</h3>
            <div className="flex bg-white rounded-xl p-2 shadow-sm border border-gray-100">
              {periodOptions.map((option) => (
                <Button
                  key={option.days}
                  variant={selectedPeriod === option.days ? "default" : "ghost"}
                  className={`flex-1 ${selectedPeriod === option.days ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                  onClick={() => setSelectedPeriod(option.days)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Price History List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : priceHistory && priceHistory.length > 0 ? (
            <div className="space-y-3">
              {priceHistory.map((history, index) => {
                const prevHistory = priceHistory[index + 1];
                const change = prevHistory ? history.pricePerGram - prevHistory.pricePerGram : 0;
                const changePercent = prevHistory ? (change / prevHistory.pricePerGram) * 100 : 0;
                const isPositive = change >= 0;
                
                return (
                  <div key={history.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <div className="font-medium text-gray-800">
                        {formatDateRelative(new Date(history.date))}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(history.date).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-800">
                        {formatCurrency(history.pricePerGram)}
                      </div>
                      {prevHistory && (
                        <div className="flex items-center text-xs justify-end">
                          {isPositive ? (
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                          )}
                          <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
                            {formatPercentage(changePercent)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <HistoryIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Riwayat harga tidak tersedia</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
