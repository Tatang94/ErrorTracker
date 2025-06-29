# ZONA GOLD - Gold Price Tracking Application

## Overview

ZONA GOLD adalah aplikasi modern untuk memantau harga emas real-time dengan mata uang Rupiah Indonesia. Aplikasi ini dibangun dengan arsitektur full-stack TypeScript dan menggunakan desain mobile-first yang mirip dengan superapp.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 dengan TypeScript
- **Build Tool**: Vite untuk development dan build produksi yang optimal
- **Routing**: Wouter untuk client-side routing yang ringan
- **State Management**: TanStack Query untuk manajemen server state
- **UI Components**: Radix UI primitives dengan shadcn/ui design system
- **Styling**: Tailwind CSS dengan custom design tokens bertema emas
- **Charts**: Recharts untuk visualisasi harga
- **Mobile-First**: Desain responsif yang dioptimalkan untuk perangkat mobile

### Backend Architecture
- **Runtime**: Node.js dengan Express.js framework
- **Language**: TypeScript dengan ES modules
- **API Pattern**: RESTful API design
- **Database**: PostgreSQL dengan Drizzle ORM untuk operasi type-safe
- **External API**: goldpricez.com untuk data harga emas real-time
- **Session Management**: Connect-pg-simple untuk penyimpanan session PostgreSQL
- **Development**: Hot module replacement dengan integrasi Vite

### Database Schema
Dua tabel utama untuk mengelola data harga emas:
- **gold_prices**: Harga emas terkini dengan indikator perubahan
- **price_history**: Data harga historis untuk analisis tren

Mendukung berbagai jenis emas (18K, 22K, 24K) dengan harga per gram dalam mata uang IDR.

## Key Components

### Data Services
- **Gold Price Service**: Menangani integrasi API eksternal dan pemrosesan data
- **Storage Layer**: Interface storage yang diabstraksi dengan database PostgreSQL
- **Price Calculator**: Konversi unit dan kalkulasi investasi

### Frontend Features
- **Real-time Price Display**: Harga emas live dengan indikator perubahan
- **Interactive Charts**: Visualisasi riwayat harga dengan berbagai timeframe  
- **Unit Calculator**: Konversi antara gram, ons, dan kilogram
- **Price History**: Analisis data historis dengan opsi filter
- **Market Status**: Status pasar real-time (buka/tutup)
- **Indonesian Sources**: Scraping data dari sumber lokal terpercaya

### API Endpoints
- `GET /api/gold-prices` - Harga emas terbaru untuk semua jenis karat
- `GET /api/market-status` - Status pasar saat ini dan tren keseluruhan
- `GET /api/price-history/:karat` - Data harga historis dengan rentang tanggal
- `GET /api/chart-data/:karat` - Data terformat untuk visualisasi grafik
- `POST /api/refresh-prices` - Trigger refresh harga manual
- `GET /api/sources` - Daftar sumber data yang tersedia

## Data Flow

1. **Price Fetching**: Integrasi API eksternal dengan goldpricez.com
2. **Data Processing**: Pemrosesan data harga emas dalam IDR untuk berbagai karat
3. **Storage**: Penyimpanan persisten di PostgreSQL dengan layer caching
4. **Real-time Updates**: Interval refresh 5 menit dengan opsi refresh manual
5. **Client Sync**: React Query mengelola caching dan sinkronisasi client-side

## External Dependencies

### Core Dependencies
- **Database**: @neondatabase/serverless untuk koneksi PostgreSQL
- **ORM**: drizzle-orm dengan dialect PostgreSQL
- **UI Framework**: React dengan Radix UI primitives
- **Charts**: recharts untuk visualisasi data
- **Forms**: react-hook-form dengan validasi zod
- **Dates**: date-fns untuk manipulasi tanggal

### Development Tools
- **Build**: Vite dengan React plugin
- **TypeScript**: Type safety penuh di seluruh stack
- **Database Migrations**: drizzle-kit untuk manajemen schema
- **Process Management**: tsx untuk eksekusi TypeScript

## External API Integration

### goldpricez.com API
- **Endpoint**: `https://www.goldpricez.com/api/rates/currency/IDR`
- **Authentication**: Menggunakan API key (`GOLD_API_KEY`)
- **Data Format**: Harga per gram dalam IDR untuk berbagai karat emas
- **Update Frequency**: Setiap 1 minggu dengan option manual refresh

## Recent Changes

### News Integration & UI Updates (December 27, 2024)
- Implementasi berita emas Indonesia menggunakan NewsAPI
- Section berita khusus harga emas hari ini dari sumber Indonesia
- Update otomatis setiap 30 menit untuk berita terbaru
- Fallback news system dengan konten relevan tentang emas
- Header dengan tema emas (gradient yellow) dan icon koin emas

### ZONA GOLD Branding & Market Status (December 27, 2024)
- Rebranding aplikasi dari EmasKu menjadi ZONA GOLD
- Status pasar emas selalu menampilkan "Buka" untuk operasional 24/7
- Update harga emas otomatis setiap 1 minggu untuk efisiensi API
- Kalkulator menggunakan harga perhiasan dengan PPN 11% untuk semua karat
- Tombol WhatsApp otomatis redirect ke wa.me/89663596711
- PPN 11% konsisten untuk semua jenis emas (10K-24K)

### GoldAPI.io Integration (December 27, 2024)
- Integrasi dengan GoldAPI.io sebagai sumber utama harga emas internasional
- Data real-time dari pasar global dengan konversi USD ke IDR
- Mendukung semua karat emas: 10K, 14K, 16K, 18K, 20K, 21K, 22K, 24K
- Sistem fallback ke scraping lokal jika GoldAPI tidak tersedia
- Akurasi tinggi dengan update data pasar internasional

### Enhanced Price Accuracy System (December 27, 2024)
- Implementasi sistem harga yang lebih akurat dengan membedakan jenis emas:
  * Logam Mulia Antam (investasi grade 24K, 99.99% kemurnian)
  * Perhiasan emas dengan berbagai karat (18K, 20K, 22K, 24K) + ongkos kerja
  * Harga buyback yang terpisah untuk setiap kategori
- Scraper khusus untuk Antam dan toko perhiasan
- Sistem fallback berlapis untuk memastikan data selalu tersedia

### Database Implementation (June 23, 2025)
- Migrasi dari in-memory storage ke PostgreSQL database
- Implementasi Drizzle ORM untuk operasi database type-safe
- Schema tabel untuk gold_prices dan price_history
- Seeding otomatis database dengan data sampel

### Migration to Replit Environment (June 2025)
- Successfully migrated project from Replit Agent to Replit environment
- Fixed API endpoints and database compatibility issues
- Configured PostgreSQL database with fallback system for reliability
- All core features working: gold prices, charts, calculator, market status
- Database setup complete with proper error handling and fallback mechanisms
- NewsAPI integration configured with real API key for authentic gold news
- Fixed duplicate React key warnings across all components
- GoldAPI quota exceeded, system now relies on Indonesian scraping sources (Pegadaian, harga-emas.org)

### Current Data Sources (June 2025)
- Primary: Web scraping from Pegadaian and harga-emas.org (working)
- Secondary: Database fallback system (reliable)
- NewsAPI: Configured with valid API key for gold news
- Market reference price: Rp 1.710.000 per gram (24K gold from Pegadaian)

### Web Scraping Implementation (June 23, 2025)
- Implementasi web scraping untuk sumber Indonesia (harga-emas.org, logammulia.com, pegadaian.co.id)
- Sistem fallback multi-layer: scraping → API external → database
- User-Agent headers untuk bypass proteksi anti-bot
- Penghapusan halaman Profile untuk menyederhanakan UI (tidak perlu login)
- Expanded gold karat options dari 3 ke 7 jenis (10K, 14K, 16K, 18K, 20K, 22K, 24K)
- Pergantian target scraping dari Antam ke Pegadaian untuk akses yang lebih stabil

### Price Accuracy Implementation (June 23, 2025)
- Implementasi harga pasar realistis berdasarkan kondisi Juni 2025
- Harga base emas 24K: Rp 1.125.000 per gram (sesuai pasar Indonesia)
- Sistem validasi harga untuk mencegah data tidak akurat
- Fallback ke harga pasar terkini jika scraping gagal

## User Preferences

- **Bahasa**: Indonesia - pengguna lebih nyaman dengan penjelasan dalam bahasa Indonesia
- **Communication Style**: Penjelasan sederhana dan mudah dipahami, hindari istilah teknis yang rumit  
- **Data Source**: Prioritas sumber Indonesia (scraping lokal) daripada API internasional
- **UI Simplicity**: Tidak perlu sistem login/registrasi, hapus halaman Profile