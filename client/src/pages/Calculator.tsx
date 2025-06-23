import { Header } from "@/components/Header";
import { UnitConverter } from "@/components/UnitConverter";
import { useGoldPrices } from "@/hooks/useGoldPrices";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Calculator as CalculatorIcon } from "lucide-react";

export default function Calculator() {
  const { data: goldPrices, isLoading } = useGoldPrices();

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen relative">
      <Header />
      
      <main className="pb-20 px-4 pt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
            <CalculatorIcon className="mr-3 h-7 w-7 text-blue-600" />
            Kalkulator Emas
          </h1>
          <p className="text-gray-600 text-sm">Hitung nilai investasi emas Anda</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : goldPrices ? (
          <UnitConverter goldPrices={goldPrices} />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <CalculatorIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Data harga emas tidak tersedia</p>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Informasi Penting</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Harga sudah termasuk dalam satuan per gram</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>1 ons = 28.35 gram</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Harga dapat berubah sewaktu-waktu sesuai kondisi pasar</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
