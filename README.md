# 💰 UBAK PRO - Smart Financial Tracker

![Version](https://img.shields.io/badge/version-1.1.0-rose)
![React](https://img.shields.io/badge/Frontend-React%20%7C%20TS-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-emerald)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Docker](https://img.shields.io/badge/Deployment-Docker-blue)
![AI](https://img.shields.io/badge/AI-Gemini%20%7C%20OpenAI-violet)

**UBAK PRO** adalah platform manajemen keuangan cerdas yang dirancang untuk membantu Anda melacak pendapatan, mengelola pengeluaran, dan mencapai target tabungan impian dengan antarmuka yang modern, cepat, dan elegan.

---

## ✨ Fitur Unggulan

### 🏦 Multi-Wallet Management (NEW!)
- **Smart Onboarding**: Pemasukan bulanan saat setup awal otomatis masuk ke **"Main Wallet"**.
- **Flexible Wallets**: Tambah, edit, dan hapus dompet dengan tipe **Bank, E-Wallet, atau Cash**.
- **Unique Name Constraint**: Menghindari kebingungan dengan sistem nama dompet unik per pengguna.
- **Dynamic Dashboard**: Klik pada kartu dompet untuk memfilter seluruh dashboard (Saldo, Analytics, & Transaksi Terakhir).
- **All-In-One Summary**: Mode "All Wallets" untuk melihat total akumulasi seluruh aset dan pengeluaran Anda.

### 📊 Per-Wallet Insights
- **Filtered Logs**: Halaman Income & Expense kini dilengkapi dropdown untuk memfilter histori berdasarkan dompet tertentu.
- **Visual Analytics**: Grafik perbandingan pendapatan vs pengeluaran yang menyesuaikan dengan dompet yang dipilih.
- **Real-time Balance**: Saldo dompet diupdate secara otomatis setiap kali ada transaksi (Income/Expense).

### 🤖 Smart AI Financial Assistant (NEW!)
- **UBAK AI**: Konsultan keuangan pribadi berbasis AI (OpenAI & Gemini).
- **Persistent Chat History**: Riwayat percakapan tersimpan secara otomatis di database.
- Fitur eksklusif untuk pengguna **VIP**.

### 🛡️ Role-Based Access Control (RBAC)
- **Admin**: Akses penuh ke konsol administratif dan manajemen sistem.
- **VIP**: Fitur eksklusif, AI Chatbot dengan riwayat, dan Multi-Wallet.
- **Free**: Fitur dasar pelacakan keuangan untuk pengguna umum.

### 🚀 Modern User Experience
- **Smooth Navigation**: Sidebar interaktif dengan animasi *cubic-bezier*.
- **Responsive Design**: Dioptimalkan untuk Desktop dan Mobile.
- **Onboarding Stepper**: Setup awal wajib (Pemasukan, Goal Nabung, Limit Belanja).
- **Glassmorphism UI**: Antarmuka modern menggunakan efek blur dan gradien.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** (TypeScript)
- **Tailwind CSS** (Styling)
- **Lucide React** (Icons)
- **Vite** (Build Tool)
- **Recharts** (Visualisasi Data)

### Backend
- **FastAPI** (Python High Performance)
- **SQLAlchemy** (ORM)
- **PostgreSQL** (Database)
- **AI Integration**: Gemini 1.5 Flash & GPT-4o Mini.

---

## 🚀 Cara Menjalankan Project

### 1. Production Mode
```bash
docker-compose -f docker-compose-prod.yml up -d --build
# Seed & Migrasi Database
docker exec -it ubak_backend python seed_db.py
```

### 2. Development Mode
1.  **Backend & DB**: `docker-compose up -d`
2.  **Seed Database**: `docker exec -it ubak_backend_dev python seed_db.py`
3.  **Frontend**:
    ```bash
    cd frontend
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

## 📝 Catatan Migrasi Database v1.1.0

Jika Anda mengupgrade dari versi lama, jalankan script `migrate_db.py` (jika tersedia) atau jalankan query berikut untuk mendukung fitur Multi-Wallet dan AI History:

```sql
-- Tabel Baru
CREATE TABLE accounts (...);
CREATE TABLE chat_sessions (...);
CREATE TABLE chat_messages (...);

-- Update Transaksi
ALTER TABLE transactions ADD COLUMN account_id INTEGER REFERENCES accounts(id);
```

Developed with ❤️ for better financial future.
