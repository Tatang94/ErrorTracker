import { useState } from "react";
import { useChartData } from "@/hooks/useGoldPrices";
import { formatCurrency, formatTime } from "@/lib/formatters";
import { LoadingSpinner } from "./LoadingSpinner";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface PriceChartProps {
  karat: number;
}

export function PriceChart({ karat }: PriceChartProps) {
  const [timeframe, setTimeframe] = useState("1D");
  const { data: chartData, isLoading } = useChartData(karat, timeframe);

  const timeframes = [
    { label: "1H", value: "1H" },
    { label: "1D", value: "1D" },
    { label: "1W", value: "1W" },
    { label: "1M", value: "1M" },
  ];

  const formattedData = chartData?.map(point => ({
    time: formatTime(new Date(point.date)),
    price: point.pricePerGram,
    fullDate: point.date,
  })) || [];

  const latestPrice = formattedData[formattedData.length - 1];
  const firstPrice = formattedData[0];
  const priceChange = latestPrice && firstPrice ? latestPrice.price - firstPrice.price : 0;
  const changePercent = latestPrice && firstPrice ? (priceChange / firstPrice.price) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Grafik Harga {karat}K</h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                timeframe === tf.value
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-48 mb-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        ) : formattedData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis 
                domain={['dataMin - 1000', 'dataMax + 1000']}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickFormatter={(value) => `${Math.round(value / 1000)}K`}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Harga"]}
                labelFormatter={(label) => `Waktu: ${label}`}
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '12px'
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#2563EB"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#2563EB' }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <div className="text-center">
              <div className="text-blue-600 text-2xl mb-2">📈</div>
              <p className="text-gray-600 text-sm">Data grafik tidak tersedia</p>
            </div>
          </div>
        )}
      </div>

      {latestPrice && firstPrice && (
        <div className="flex justify-between items-center text-sm">
          <div className="text-gray-500">
            <span>{timeframe === "1H" ? "1 jam terakhir" : 
                   timeframe === "1D" ? "Hari ini" : 
                   timeframe === "1W" ? "7 hari terakhir" : 
                   "30 hari terakhir"}</span>
          </div>
          <div className="text-right">
            <span className={`font-medium ${changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
