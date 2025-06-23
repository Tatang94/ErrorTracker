import { useState } from "react";
import { Header } from "@/components/Header";
import { PriceChart } from "@/components/PriceChart";
import { useGoldPrices } from "@/hooks/useGoldPrices";
import { Button } from "@/components/ui/button";
import { getKaratInfo } from "@/lib/formatters";

export default function Chart() {
  const [selectedKarat, setSelectedKarat] = useState(24);
  const { data: goldPrices } = useGoldPrices();

  const karatOptions = [
    { karat: 24, label: "24K" },
    { karat: 22, label: "22K" },
    { karat: 18, label: "18K" },
  ];

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen relative">
      <Header />
      
      <main className="pb-20 px-4 pt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Grafik Harga Emas</h1>
          <p className="text-gray-600 text-sm">Pantau pergerakan harga emas real-time</p>
        </div>

        {/* Karat Selection */}
        <div className="mb-6">
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

        {/* Current Price Display */}
        {goldPrices && (
          <div className="mb-6">
            {goldPrices
              .filter(price => price.karat === selectedKarat)
              .map(price => {
                const karatInfo = getKaratInfo(price.karat);
                return (
                  <div key={price.karat} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${karatInfo.class} rounded-full flex items-center justify-center`}>
                          <span className="text-white font-bold text-xs">{price.karat}K</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{karatInfo.name}</h3>
                          <p className="text-xs text-gray-500">{karatInfo.purity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-800">
                          Rp {price.pricePerGram.toLocaleString('id-ID')}
                        </div>
                        <div className={`text-sm ${price.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {price.changePercent >= 0 ? '+' : ''}{price.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* Price Chart */}
        <PriceChart karat={selectedKarat} />
      </main>
    </div>
  );
}
