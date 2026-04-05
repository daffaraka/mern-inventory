# Inventory Management System

Aplikasi manajemen inventori berbasis web yang dibangun menggunakan MERN stack (MongoDB, Express, React, Node.js). Sistem ini dirancang untuk membantu tim dalam mengelola stok barang, mencatat pergerakan inventori, serta memantau kondisi stok secara real-time dengan alur persetujuan yang terstruktur.

---

## Tentang Aplikasi

Aplikasi ini mendukung multi-role pengguna dengan alur kerja yang berbeda untuk setiap peran. Staff dapat mengajukan permintaan stock in maupun stock out, kemudian permintaan tersebut akan melalui proses persetujuan oleh Finance atau Management sesuai jenisnya, sebelum akhirnya di-acknowledge oleh pihak terkait.

Selain manajemen stok, aplikasi juga menyediakan dashboard analitik, laporan inventori, serta fitur ekspor data ke format PDF dan Excel.

---

## Fitur Utama

- Autentikasi pengguna dengan JWT dan sistem role-based access control
- Manajemen produk lengkap dengan SKU, kategori, harga, dan minimum stok
- Alur persetujuan stock in: Staff input, Finance approve, Management acknowledge
- Alur persetujuan stock out: Staff input, Management approve, Finance acknowledge
- Dashboard dengan KPI cards dan grafik pergerakan stok
- Notifikasi produk dengan stok rendah atau habis
- Ekspor laporan ke PDF dan Excel
- Riwayat lengkap setiap pergerakan stok beserta status dan pelakunya

---

## Role Pengguna

| Role | Akses |
|---|---|
| Admin | Akses penuh ke semua fitur |
| Staff | Input stock in dan stock out |
| Finance | Approve stock in, acknowledge stock out |
| Management | Acknowledge stock in, approve stock out |

---

## Tech Stack

**Backend**
- Node.js dengan Express
- MongoDB dengan Mongoose
- JWT untuk autentikasi, Bcrypt untuk enkripsi password
- Helmet dan Express Rate Limit untuk keamanan API
- PDFKit dan XLSX untuk ekspor laporan

**Frontend**
- React 19 dengan Vite
- Tailwind CSS untuk styling
- Recharts untuk visualisasi data
- Framer Motion untuk animasi
- React Hook Form dan Yup untuk validasi form
- Axios untuk HTTP client

---

## Struktur Proyek

```
inventory-management/
├── backend/
│   ├── controllers/      # Logic handler untuk setiap fitur
│   ├── models/           # Skema database Mongoose
│   ├── routes/           # Definisi endpoint API
│   ├── middlewares/      # Auth, role guard, error handler
│   ├── utils/            # Helper functions
│   ├── seed.js           # Script untuk mengisi data dummy
│   └── server.js         # Entry point aplikasi backend
│
└── frontend/
    └── src/
        ├── components/   # Komponen UI yang dapat digunakan ulang
        ├── pages/        # Halaman-halaman aplikasi
        ├── services/     # Layer komunikasi dengan API
        └── context/      # Global state management
```

---

## Cara Menjalankan

Pastikan sudah menginstall Node.js versi 18 ke atas dan memiliki akses ke MongoDB (lokal atau Atlas).

**Backend**

```bash
cd backend
npm install
```

Buat file `.env` di folder backend dengan isi berikut:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/mern_inventory
JWT_SECRET=isi_dengan_secret_key_kamu
FRONTEND_URL=http://localhost:5173
```

Jalankan server:

```bash
npm run dev
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

**Isi data dummy (opsional)**

```bash
cd backend
node seed.js
```

Script ini akan membuat 4 akun pengguna dan 16 produk contoh secara otomatis.

---

## Akun Demo

Setelah menjalankan seed, akun berikut tersedia untuk login:

| Role | Email | Password |
|---|---|---|
| Admin | admin@demo.com | password123 |
| Staff | staff@demo.com | password123 |
| Finance | finance@demo.com | password123 |
| Management | management@demo.com | password123 |

---

## API Endpoints

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | /api/auth/register | Registrasi pengguna baru |
| POST | /api/auth/login | Login dan mendapatkan token |
| GET | /api/products | Ambil semua produk |
| POST | /api/products | Tambah produk baru (admin) |
| POST | /api/stock/in | Ajukan stock in |
| POST | /api/stock/out | Ajukan stock out |
| PATCH | /api/stock/:id/approve | Approve stock in (finance) |
| PATCH | /api/stock/:id/approve-out | Approve stock out (management) |
| PATCH | /api/stock/:id/acknowledge | Acknowledge stock in (management) |
| PATCH | /api/stock/:id/acknowledge-out | Acknowledge stock out (finance) |
| GET | /api/reports/summary | Ringkasan inventori |
| GET | /api/export/products/pdf | Ekspor produk ke PDF |
| GET | /api/export/products/excel | Ekspor produk ke Excel |

---

## Lisensi

MIT License
