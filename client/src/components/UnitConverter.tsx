import { useState, useEffect } from "react";
import { Calculator, MessageCircle } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface UnitConverterProps {
  goldPrices: { karat: number; pricePerGram: number }[];
}

export function UnitConverter({ goldPrices }: UnitConverterProps) {
  const [amount, setAmount] = useState<number>(1);
  const [amountInput, setAmountInput] = useState<string>("1");
  const [unit, setUnit] = useState("gram");
  const [goldType, setGoldType] = useState("24");
  const [result, setResult] = useState(0);

  const units = [
    { value: "gram", label: "gram", multiplier: 1 },
    { value: "ons", label: "ons", multiplier: 28.35 },
    { value: "kg", label: "kg", multiplier: 1000 },
  ];

  // Handle input change dengan validation
  const handleAmountChange = (value: string) => {
    setAmountInput(value);
    
    // Parse nilai, pastikan tetap positif dan tidak NaN
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setAmount(numValue);
    } else if (value === "" || value === "0") {
      setAmount(0);
    }
  };

  // Hitung harga perhiasan dengan ongkos kerja
  const calculateJewelryPrice = (basePrice: number, karat: number) => {
    const workmanshipRates: { [key: number]: number } = {
      24: 0.10, // 10% untuk 24K (paling sederhana)
      22: 0.12, // 12% untuk 22K 
      21: 0.14, // 14% untuk 21K
      20: 0.15, // 15% untuk 20K
      18: 0.18, // 18% untuk 18K (paling umum)
      16: 0.19, // 19% untuk 16K
      14: 0.20, // 20% untuk 14K
      10: 0.20  // 20% untuk 10K
    };
    
    const workmanshipRate = workmanshipRates[karat] || 0.15;
    return Math.round(basePrice * (1 + workmanshipRate));
  };

  useEffect(() => {
    const selectedGold = goldPrices.find(p => p.karat === parseInt(goldType));
    const selectedUnit = units.find(u => u.value === unit);
    
    if (selectedGold && selectedUnit && amount > 0) {
      const totalGrams = amount * selectedUnit.multiplier;
      const jewelryPricePerGram = calculateJewelryPrice(selectedGold.pricePerGram, selectedGold.karat);
      const totalValue = totalGrams * jewelryPricePerGram;
      setResult(totalValue);
    } else {
      setResult(0);
    }
  }, [amount, unit, goldType, goldPrices]);

  // Handle WhatsApp contact
  const handleContactSeller = () => {
    const selectedGold = goldPrices.find(p => p.karat === parseInt(goldType));
    const selectedUnit = units.find(u => u.value === unit);
    
    if (selectedGold && selectedUnit && amount > 0) {
      const jewelryPricePerGram = calculateJewelryPrice(selectedGold.pricePerGram, selectedGold.karat);
      const message = `Halo, saya tertarik untuk membeli perhiasan emas ${goldType}K sebanyak ${amount} ${getUnitLabel()} dengan estimasi harga ${formatCurrency(result)}. Mohon info lebih lanjut.`;
      const whatsappUrl = `https://wa.me/89663596711?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const getUnitLabel = () => {
    const selectedUnit = units.find(u => u.value === unit);
    return selectedUnit ? selectedUnit.label : "gram";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
        <Calculator className="text-blue-600 mr-2 h-5 w-5" />
        Kalkulator Emas
      </h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Jumlah
          </Label>
          <div className="flex">
            <Input
              id="amount"
              type="number"
              value={amountInput}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="flex-1 rounded-r-none text-lg font-semibold"
              placeholder="1"
              min="0"
              step="0.01"
            />
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className="w-24 rounded-l-none border-l-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {units.map(u => (
                  <SelectItem key={u.value} value={u.value}>
                    {u.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="goldType" className="block text-sm font-medium text-gray-700 mb-2">
            Jenis Emas
          </Label>
          <Select value={goldType} onValueChange={setGoldType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24">24 Karat (99.9%)</SelectItem>
              <SelectItem value="22">22 Karat (91.6%)</SelectItem>
              <SelectItem value="21">21 Karat (87.5%)</SelectItem>
              <SelectItem value="20">20 Karat (83.3%)</SelectItem>
              <SelectItem value="18">18 Karat (75%)</SelectItem>
              <SelectItem value="16">16 Karat (66.7%)</SelectItem>
              <SelectItem value="14">14 Karat (58.3%)</SelectItem>
              <SelectItem value="10">10 Karat (41.7%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg">
          <div className="text-sm opacity-90 mb-1">Harga Perhiasan (Termasuk Ongkos Kerja)</div>
          <div className="text-2xl font-bold">{formatCurrency(result)}</div>
          <div className="text-xs opacity-75 mt-1">
            {amount > 0 ? `${amount} ${getUnitLabel()} perhiasan emas ${goldType}K` : "Masukkan jumlah untuk menghitung"}
          </div>
        </div>

        {amount > 0 && result > 0 && (
          <Button 
            onClick={handleContactSeller}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-5 w-5" />
            Hubungi Penjual via WhatsApp
          </Button>
        )}
      </div>
    </div>
  );
}
