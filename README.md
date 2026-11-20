# 🤝 TemanSehat — Ruang Belajar Pertemanan Sehat & Bimbingan Konseling

Aplikasi web modern, cerah, ringan, dan cepat untuk edukasi pertemanan sehat remaja sekolah dan portal bimbingan konseling (BK). Siap dipublikasikan ke **Vercel** dengan backend database **Supabase**.

---

## 🌟 Fitur Utama

- 🎨 **Tampilan Baru & Segar (Cerah):** Palet warna modern (Fresh Sky Azure, Mint Emerald, Sunny Amber), ramah untuk remaja & pendidik, bersih dan tidak berat.
- ⚡ **Ringan & Super Cepat:** Zero-bloat, tanpa dependensi berat, langsung jalan instan di browser dan mobile.
- 👥 **3 Role Terintegrasi:**
  1. **Siswa:** Belajar 6 Modul SEHAT interaktif, latihan 6 skenario kasus dunia nyata dengan ulasan psikologis langsung, Kartu SEHAT (unduh/cetak), jurnal refleksi pribadi, ajukan konseling ke Guru BK, dan kirim aspirasi/pengaduan.
  2. **Guru BK:** Dasbor pelayanan konseling, pantau statistik permintaan bimbingan siswa, atur jadwal temu, beri catatan tindak lanjut, dan monitor daftar siswa aktif.
  3. **Admin (Full Control):** Kendali penuh sistem! Manajemen pengguna & ubah hak akses role (`siswa` ⇄ `guru` ⇄ `admin`) secara instan, kelola kotak pengaduan/masukan, pantau seluruh sesi konseling, serta integrasi database Supabase.
- 🗄️ **Database Supabase Ready:** Skema database lengkap dengan PostgreSQL, Row Level Security (RLS), dan otomatis fallback ke *Mode Demo / Lokal* jika kredensial belum diisi (tanpa pernah error/layar putih).

---

## 🚀 Panduan Publikasi ke Vercel

Aplikasi ini sudah dilengkapi file konfigurasi `vercel.json` dan struktur statis yang dioptimalkan untuk Vercel.

### Cara 1: Lewat Dashboard Vercel (GitHub Integration)
1. Push repositori ini ke akun GitHub Anda:
   ```bash
   git add -A
   git commit -m "feat: inisialisasi temansehat ready to publish vercel"
   git push origin main
   ```
2. Buka [Vercel Dashboard](https://vercel.com/dashboard) dan klik **Add New... > Project**.
3. Hubungkan repositori GitHub Anda.
4. Pada bagian **Build & Development Settings**, biarkan default (Framework Preset: *Other*).
5. (Opsional) Tambahkan Environment Variables:
   - `SUPABASE_URL`: `https://your-project.supabase.co`
   - `SUPABASE_ANON_KEY`: `your-anon-key`
6. Klik **Deploy**! Website Anda akan live dalam beberapa detik.

### Cara 2: Lewat Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 🗄️ Panduan Setup Supabase Database

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) dan buat proyek baru.
2. Buka menu **SQL Editor** di sisi kiri.
3. Buka file `supabase/migrations/20261120000000_init_temansehat.sql` pada proyek ini, copy seluruh kodenya, lalu paste di SQL Editor Supabase dan klik **Run**.
4. Semua tabel (`profiles`, `pendampingan`, `pengaduan`, `jurnal`, `modul_progress`) serta data awal langsung dibuat.
5. Masuk ke menu **Project Settings > API**:
   - Salin **Project URL**
   - Salin **Project API Anon Key**
6. Hubungkan ke aplikasi web:
   - **Lewat Tampilan Web:** Buka web TemanSehat, klik tombol **Mode Demo / Lokal** atau tombol **⚙️ DB** di pojok kanan atas, masukkan URL & Anon Key, lalu klik Simpan.
   - **Atau lewat kode:** Buka `js/config.js` dan isi `SUPABASE_URL` serta `SUPABASE_ANON_KEY`.

---

## 🔑 Akun Uji Coba / Demo

| Peran (Role) | Email | Kata Sandi | Hak Akses |
| :--- | :--- | :--- | :--- |
| **🎒 Siswa** | Masukkan nama & email bebas | Tanpa password | Modul, Skenario, Kartu SEHAT, Jurnal, Ajukan BK |
| **🎓 Guru BK** | `gurubk@temansehat.id` | `gurubk123` | Manajemen Konseling Siswa & Jadwal Temu BK |
| **👑 Admin** | `admin@temansehat.id` | `admin123` | Kontrol Penuh User, Role, Pengaduan & Sistem |

*(Catatan: Akun prototipe lama `auliaamaharanii260406@gmail.com` juga tetap dapat digunakan).*

---

## 📂 Struktur Proyek

```
teman-sehat/
├── index.html                   # Halaman web utama responsif & cerah
├── css/
│   └── style.css                # Desain tema cerah, segar, kartu modern, tombol kontras
├── js/
│   ├── config.js                # Konfigurasi Supabase URL & kredensial
│   ├── data.js                  # Konten 6 Modul SEHAT & 6 Skenario interaktif
│   ├── supabaseClient.js        # Data layer Supabase + LocalStorage Fallback (Fail-Fast)
│   └── app.js                   # Kontroler 3 Role (Siswa, Guru, Admin)
├── supabase/
│   └── migrations/
│       └── 20261120000000_init_temansehat.sql  # Skema SQL, RLS, dan seed data
├── scripts/
│   ├── push.sh                  # Skrip protokol auto git push
│   └── deploy.sh                # Skrip protokol deploy Vercel + Supabase
├── .github/
│   └── workflows/
│       └── deploy.yml           # CI/CD otomatis GitHub Actions
├── vercel.json                  # Konfigurasi routing & keamanan Vercel
├── .env.example                 # Template environment variables
└── README.md                    # Dokumentasi lengkap
```
