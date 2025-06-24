import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { useGoldPrices, useMarketStatus, usePriceHistory } from "@/hooks/useGoldPrices";
import { Header } from "@/components/Header";
import { GoldPriceCard } from "@/components/GoldPriceCard";
import { PriceChart } from "@/components/PriceChart";
import { UnitConverter } from "@/components/UnitConverter";
import { GoldNewsSection } from "@/components/GoldNewsSection";
import { LoadingSkeleton } from "@/components/LoadingSpinner";
import { ErrorToast } from "@/components/ErrorToast";
import { formatDateRelative, formatCurrency, formatPercentage } from "@/lib/formatters";

export default function Home() {
  const [showError, setShowError] = useState(false);
  const { data: goldPrices, isLoading: pricesLoading, error: pricesError } = useGoldPrices();
  const { data: marketStatus } = useMarketStatus();
  const { data: priceHistory } = usePriceHistory(24, 7);

  // Show error toast if there's an error
  if (pricesError && !showError) {
    setShowError(true);
  }

  const lastUpdate = goldPrices?.[0]?.timestamp ? new Date(goldPrices[0].timestamp) : undefined;
  
  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen relative">
      <Header lastUpdate={lastUpdate} />
      
      <main className="pb-20">
        {/* Market Status Banner */}
        {marketStatus && (
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 m-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">Pasar Emas</h3>
                <p className="text-xs opacity-90">
                  {marketStatus.isOpen ? 'Buka' : 'Tutup'} • {marketStatus.location}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">
                  {formatPercentage(marketStatus.overallChangePercent)}
                </div>
                <div className="text-xs opacity-90">Hari ini</div>
              </div>
            </div>
          </div>
        )}

        {/* Gold Prices Section */}
        <section className="px-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Harga Emas Hari Ini</h2>
          </div>

          {pricesLoading ? (
            <LoadingSkeleton />
          ) : goldPrices ? (
            <div className="space-y-3">
              {goldPrices.map((price) => (
                <GoldPriceCard key={`home-gold-${price.karat}`} goldPrice={price} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Data harga emas tidak tersedia</p>
            </div>
          )}
        </section>

        {/* Gold News Section */}
        <GoldNewsSection />

        {/* Price Chart Section */}
        {goldPrices && goldPrices.length > 0 && (
          <section className="px-4 mb-6">
            <PriceChart karat={24} />
          </section>
        )}

        {/* Unit Converter Section */}
        {goldPrices && goldPrices.length > 0 && (
          <section className="px-4 mb-6">
            <UnitConverter goldPrices={goldPrices} />
          </section>
        )}

        {/* Price History Section */}
        {priceHistory && priceHistory.length > 0 && (
          <section className="px-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="text-blue-600 mr-2 h-5 w-5" />
                Riwayat Harga 7 Hari (24K)
              </h3>
              
              <div className="space-y-3">
                {priceHistory.slice(0, 5).map((history, index) => {
                  const prevHistory = priceHistory[index + 1];
                  const change = prevHistory ? history.pricePerGram - prevHistory.pricePerGram : 0;
                  const changePercent = prevHistory ? (change / prevHistory.pricePerGram) * 100 : 0;
                  
                  return (
                    <div key={history.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <div className="font-medium text-gray-800">
                          {formatDateRelative(new Date(history.date))}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(history.date).toLocaleDateString('id-ID')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-800">
                          {formatCurrency(history.pricePerGram)}
                        </div>
                        {prevHistory && (
                          <div className="flex items-center text-xs">
                            <TrendingUp className={`h-3 w-3 mr-1 ${change >= 0 ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
                            <span className={change >= 0 ? 'text-green-500' : 'text-red-500'}>
                              {formatPercentage(changePercent)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Data Sources Section */}
        <section className="px-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-green-600 mr-2">🇮🇩</span>
              Sumber Data Indonesia
            </h3>
            
            <div className="space-y-3">
              <div className="flex space-x-3 p-3 bg-green-50 rounded-lg">
                <span className="text-green-600 mt-1">🏛️</span>
                <div>
                  <h4 className="font-medium text-sm text-gray-800">Antam (Resmi)</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Harga emas resmi dari PT Antam Tbk, produsen logam mulia terpercaya
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-600 mt-1">🏪</span>
                <div>
                  <h4 className="font-medium text-sm text-gray-800">Pegadaian (Resmi)</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Harga emas resmi dari PT Pegadaian, BUMN terpercaya untuk investasi emas
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3 p-3 bg-yellow-50 rounded-lg">
                <span className="text-yellow-600 mt-1">📊</span>
                <div>
                  <h4 className="font-medium text-sm text-gray-800">Update Otomatis</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Harga diperbarui setiap 5 menit dari berbagai sumber terpercaya
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {showError && (
        <ErrorToast
          message="Tidak dapat memuat data terbaru. Periksa koneksi internet Anda."
          onDismiss={() => setShowError(false)}
        />
      )}
    </div>
  );
}
