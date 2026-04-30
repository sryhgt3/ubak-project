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

This project can be run in two modes: **Production** (fully containerized) and **Development** (hybrid).

### 1. Production Mode

This mode is recommended for deployment or for running the application as a complete, self-contained unit. It builds the frontend into static files and serves everything via Docker.

**Steps:**
1.  Run the main Docker Compose command:
    ```bash
    docker-compose -f docker-compose-prod.yml up -d --build
    ```
2.  (First time only) Seed the database to create default user accounts:
    ```bash
    docker exec -it ubak_backend python seed_db.py
    ```

**Endpoints:**
- **Application**: `http://localhost:3001`
- **Backend API Docs**: `http://localhost:8800/docs`
- **pgAdmin**: `http://localhost:5050`


### 2. Development Mode

This mode is recommended for active development on the frontend. The frontend runs on your local machine with hot-reloading, while the backend and database run in Docker.

**Steps:**
1.  **Create Frontend Environment File:** Create a file named `.env` inside the `frontend` directory (`frontend/.env`) with the following content:
    ```
    VITE_API_URL=http://localhost:8800
    ```
2.  **Start Backend Services:** In your project's root directory, run the development Docker Compose file in detached mode:
    ```bash
    docker-compose up -d
    ```
3.  **(First time only) Seed the database to create default user accounts:**
    ```bash
    docker exec -it ubak_backend_dev python seed_db.py
    ```
4.  **Start Frontend Service:** In a **separate terminal**, navigate to the `frontend` directory and start the dev server:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

**Endpoints:**
- **Application (Dev)**: `http://localhost:3001` (as configured in `vite.config.ts`)
- **Backend API Docs**: `http://localhost:8800/docs`
- **pgAdmin**: `http://localhost:5050`

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
