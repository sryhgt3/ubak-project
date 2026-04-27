# 💰 UBAK PRO - Smart Financial Tracker

![Version](https://img.shields.io/badge/version-1.0.0-rose)
![React](https://img.shields.io/badge/Frontend-React%20%7C%20TS-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-emerald)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Docker](https://img.shields.io/badge/Deployment-Docker-blue)

**UBAK PRO** adalah platform manajemen keuangan cerdas yang dirancang untuk membantu Anda melacak pendapatan, mengelola pengeluaran, dan mencapai target tabungan impian dengan antarmuka yang modern, cepat, dan elegan.

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

## 🚀 Cara Menjalankan Project

### Menggunakan Docker (Rekomendasi)

Hanya satu perintah untuk menjalankan seluruh ekosistem:

```bash
docker-compose up -d --build
```

Aplikasi akan tersedia di:
- **Frontend**: `http://localhost` (Docker) atau `http://localhost:5173` (Manual)
- **Backend API**: `http://localhost:8800`
- **API Documentation**: `http://localhost:8800/docs`
- **pgAdmin**: `http://localhost:5050`

### Menjalankan Manual

#### 1. Backend
```bash
cd backend
cp .env.example .env  # Buat file .env dari template
# Update DATABASE_URL di .env jika diperlukan
python -m venv venv
source venv/bin/activate  # atau venv\Scripts\activate di Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8800
```

#### 2. Frontend
```bash
cd frontend
cp .env.example .env  # Buat file .env dari template
npm install
npm run dev
```

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
