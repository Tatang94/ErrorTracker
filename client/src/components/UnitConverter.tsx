import { useState, useEffect } from "react";
import { Calculator } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface UnitConverterProps {
  goldPrices: { karat: number; pricePerGram: number }[];
}

export function UnitConverter({ goldPrices }: UnitConverterProps) {
  const [amount, setAmount] = useState(1);
  const [unit, setUnit] = useState("gram");
  const [goldType, setGoldType] = useState("24");
  const [result, setResult] = useState(0);

  const units = [
    { value: "gram", label: "gram", multiplier: 1 },
    { value: "ons", label: "ons", multiplier: 28.35 },
    { value: "kg", label: "kg", multiplier: 1000 },
  ];

  useEffect(() => {
    const selectedGold = goldPrices.find(p => p.karat === parseInt(goldType));
    const selectedUnit = units.find(u => u.value === unit);
    
    if (selectedGold && selectedUnit) {
      const totalGrams = amount * selectedUnit.multiplier;
      const totalValue = totalGrams * selectedGold.pricePerGram;
      setResult(totalValue);
    }
  }, [amount, unit, goldType, goldPrices]);

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
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="flex-1 rounded-r-none text-lg font-semibold"
              placeholder="1"
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
              <SelectItem value="18">18 Karat (75%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg">
          <div className="text-sm opacity-90 mb-1">Total Nilai</div>
          <div className="text-2xl font-bold">{formatCurrency(result)}</div>
          <div className="text-xs opacity-75 mt-1">
            {amount} {getUnitLabel()} emas {goldType}K
          </div>
        </div>
      </div>
    </div>
  );
}
