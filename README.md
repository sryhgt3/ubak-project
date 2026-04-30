# 💰 UBAK (UANG BIJAK) - Smart Financial Tracker

![Version](https://img.shields.io/badge/version-1.0.0-rose)
![React](https://img.shields.io/badge/Frontend-React%20%7C%20TS-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-emerald)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Docker](https://img.shields.io/badge/Deployment-Docker-blue)

**UBAK (UANG BIJAK)** adalah platform manajemen keuangan cerdas yang dirancang untuk membantu Anda melacak pendapatan, mengelola pengeluaran, dan mencapai target tabungan impian dengan antarmuka yang modern, cepat, dan elegan.

---

## ✨ Fitur Unggulan

### 🛡️ Role-Based Access Control (RBAC)
Sistem akses yang aman dengan tiga level pengguna:
- **Admin**: Akses penuh ke konsol administratif dan manajemen sistem.
- **VIP**: Fitur eksklusif, prioritas sistem, dan tanpa batas akses.
- **Free**: Fitur dasar pelacakan keuangan untuk pengguna umum.

### 🚀 Modern User Experience
- **Smooth Navigation**: Sidebar interaktif dengan animasi *cubic-bezier* yang sangat halus.
- **Responsive Design**: Tampilan yang dioptimalkan untuk Desktop dan Mobile (Mobile Drawer).
- **Onboarding Stepper**: Proses setup awal wajib yang interaktif untuk membantu Anda menetapkan tujuan finansial (Pemasukan, Goal Nabung, Barang Impian, & Limit Belanja).
- **Glassmorphism UI**: Antarmuka modern menggunakan efek blur dan gradien yang memanjakan mata.

### 📊 Dashboard Cerdas
- Visualisasi data yang bersih.
- Pelacakan metrik sistem untuk Admin.
- Ringkasan aset eksklusif untuk VIP.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** (TypeScript)
- **Tailwind CSS** (Styling)
- **Lucide React** (Icons)
- **Vite** (Build Tool)

### Backend
- **FastAPI** (Python High Performance)
- **SQLAlchemy** (ORM)
- **PostgreSQL** (Database)
- **Jose / JWT** (Authentication)
- **Bcrypt** (Password Hashing)

---

## 🚀 Memulai (Docker)

Kami menyediakan dua mode lingkungan menggunakan Docker:

### 1. Mode Development (Hot Reload)
Gunakan mode ini untuk pengembangan lokal. Perubahan pada kode backend atau frontend akan langsung terlihat tanpa perlu build ulang.

```bash
# Jalankan environment development
docker compose -f docker-compose.dev.yml up -d

# Frontend: http://localhost:5173
# Backend API: http://localhost:8800
# PgAdmin: http://localhost:5051
```

### 2. Mode Production
Gunakan mode ini untuk melihat versi aplikasi yang sudah dioptimasi.

```bash
# Jalankan environment production
docker compose -f docker-compose.prod.yml up -d

# App: http://localhost (dilayani oleh Nginx)
# Backend API: http://localhost:8800
# PgAdmin: http://localhost:5050
```

---

## 🏗️ Arsitektur Backend

Backend UBAK (UANG BIJAK) menggunakan pola **Service Layer** dengan pendekatan **OOP (Object-Oriented Programming)**:
- **Routers**: Bertindak sebagai Controller yang menangani HTTP Request.
- **Services**: Berisi logika bisnis utama yang dibungkus dalam Class (misal: `AuthService`, `UserService`).
- **Dependency Injection**: Menggunakan FastAPI `Depends` untuk menyuntikkan instance service ke dalam router.
- **Clean Code**: Pemisahan tanggung jawab yang jelas memudahkan pemeliharaan dan pengujian kode.

---

## 🔑 Akun Demo (Default)

| Username | Password | Role |
| :--- | :--- | :--- |
| `admin` | `admin123` | Administrator |
| `vip_user` | `vip123` | VIP Member |
| `free_user` | `free123` | Free Member |

---

## 📝 Konfigurasi Database

Jika Anda melakukan update manual pada database yang sudah ada, pastikan untuk menjalankan migrasi kolom baru:

```sql
ALTER TABLE users ADD COLUMN monthly_income INTEGER;
ALTER TABLE users ADD COLUMN savings_goal VARCHAR;
ALTER TABLE users ADD COLUMN dream_item VARCHAR;
ALTER TABLE users ADD COLUMN max_spending INTEGER;
```

---

Developed with ❤️ for better financial future.
