import { Header } from "@/components/Header";
import { User, Settings, Bell, HelpCircle, Info, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Profile() {
  const menuItems = [
    { icon: Settings, label: "Pengaturan", href: "/settings" },
    { icon: Bell, label: "Notifikasi", href: "/notifications" },
    { icon: HelpCircle, label: "Bantuan", href: "/help" },
    { icon: Info, label: "Tentang Aplikasi", href: "/about" },
  ];

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen relative">
      <Header />
      
      <main className="pb-20 px-4 pt-6">
        {/* Profile Section */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Pengguna EmasKu</h2>
                <p className="text-gray-600 text-sm">Investor Emas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Statistics */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-800 mb-4">Statistik Aplikasi</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">147</div>
                <div className="text-xs text-gray-500">Kali Cek Harga</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-xs text-gray-500">Hari Aktif</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start h-12 px-4"
                  >
                    <Icon className="h-5 w-5 mr-3 text-gray-600" />
                    <span className="text-gray-700">{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-800 mb-3">Informasi Aplikasi</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Versi Aplikasi</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Terakhir Update</span>
                <span className="font-medium">23 Jun 2025</span>
              </div>
              <div className="flex justify-between">
                <span>Sumber Data</span>
                <span className="font-medium">Indonesia (Antam, Pegadaian)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full text-red-600 border-red-200 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Keluar
        </Button>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>EmasKu © 2025</p>
          <p>Aplikasi harga emas real-time</p>
        </div>
      </main>
    </div>
  );
}
