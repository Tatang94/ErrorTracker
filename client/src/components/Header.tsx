import { Bell, RefreshCw } from "lucide-react";
import { formatTime } from "@/lib/formatters";
import { useRefreshPrices } from "@/hooks/useGoldPrices";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  lastUpdate?: Date;
}

export function Header({ lastUpdate }: HeaderProps) {
  const refreshPrices = useRefreshPrices();

  const handleRefresh = () => {
    refreshPrices.mutate();
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">₹</span>
          </div>
          <h1 className="text-lg font-bold">ZONA GOLD</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshPrices.isPending}
            className="p-2 rounded-full hover:bg-blue-600 transition-colors text-white"
          >
            <RefreshCw className={`h-4 w-4 ${refreshPrices.isPending ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 rounded-full hover:bg-blue-600 transition-colors text-white"
            title="Notifikasi"
          >
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {lastUpdate && (
        <div className="flex items-center justify-center mt-2 text-xs opacity-90">
          <span>Update terakhir: {formatTime(lastUpdate)}</span>
          <div className="w-2 h-2 bg-green-400 rounded-full ml-2 animate-pulse" />
        </div>
      )}
    </header>
  );
}
