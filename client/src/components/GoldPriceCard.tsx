import { TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency, formatPercentage, getKaratInfo } from "@/lib/formatters";
import type { GoldPriceData } from "@shared/schema";

interface GoldPriceCardProps {
  goldPrice: GoldPriceData;
}

export function GoldPriceCard({ goldPrice }: GoldPriceCardProps) {
  const karatInfo = getKaratInfo(goldPrice.karat);
  const isPositive = goldPrice.changePercent >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${karatInfo.class} rounded-full flex items-center justify-center`}>
            <span className="text-white font-bold text-xs">{goldPrice.karat}K</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{karatInfo.name}</h3>
            <p className="text-xs text-gray-500">{karatInfo.purity}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-800">
            {formatCurrency(goldPrice.pricePerGram)}
          </div>
          <div className="flex items-center text-xs">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={`font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(goldPrice.change)} ({formatPercentage(goldPrice.changePercent)})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
