import { Home, TrendingUp, Calculator, History, User } from "lucide-react";
import { useLocation } from "wouter";
import { Link } from "wouter";

export function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Beranda" },
    { path: "/chart", icon: TrendingUp, label: "Grafik" },
    { path: "/calculator", icon: Calculator, label: "Kalkulator" },
    { path: "/history", icon: History, label: "Riwayat" },
    { path: "/profile", icon: User, label: "Profil" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <button className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}>
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
