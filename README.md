# 🤝 TemanSehat — Platform Psikoedukasi Pertemanan Remaja & Bimbingan Konseling Digital (Next.js + Supabase)

Aplikasi web profesional berbasis **Next.js (App Router)**, **Tailwind CSS**, dan **Supabase** dengan tema warna cerah modern. Dirancang untuk edukasi pertemanan sehat remaja sekolah dan pelayanan Bimbingan Konseling (BK) yang siap dipublikasikan langsung ke **Vercel**.

---

## 🌟 Keunggulan & Fitur Utama

1. **⚡ Framework Next.js + Tailwind CSS (Native Vercel Ready):**
   - Tampilan profesional, widescreen dashboard dengan sidebar interaktif, kartu KPI modern, dan desain cerah (Fresh Sky, Cyan, Mint Emerald, Sunny Amber).
   - Sangat ringan, responsif di desktop maupun smartphone.

2. **👥 3 Role Terintegrasi + Ganti Peran Instan (1-Klik Demo):**
   - **🎒 Siswa:**
     - **Dashboard Siswa:** Statistik capaian belajar, peta perjalanan belajar, dan pantauan status pengajuan konseling BK secara langsung.
     - **6 Modul Psikoedukasi SEHAT:** Penjelasan lengkap, poin kunci, simulasi percakapan bentuk *chat bubble*, dan tantangan praktik harian.
     - **6 Simulasi Kasus (Roleplay):** Studi kasus nyata dengan evaluasi psikologis langsung (*Asertif vs Pasif vs Agresif*).
     - **Kartu Pedoman SEHAT:** Poster satu halaman siap cetak / simpan PDF.
     - **Jurnal Refleksi Pribadi:** Ruang aman menyusun *I-Message (Pesan Aku)* yang tersimpan ke database.
     - **Konseling Guru BK & Kotak Aspirasi:** Formulir pengajuan janji temu BK beserta tabel riwayat balasan dari Guru BK dan Admin.
   - **🎓 Guru BK:**
     - **Portal Pelayanan Konseling:** 4 Kartu KPI, filter status (*Menunggu, Dijadwalkan, Selesai*), pencarian siswa, serta editor langsung untuk menjadwalkan pertemuan & memberi catatan ruang konseling.
     - **Direktori Siswa Terdaftar:** Pantau daftar siswa aktif dan kelasnya.
   - **👑 Admin (Full Control / Superuser):**
     - **Manajemen Pengguna & Hak Akses:** Tambah akun pengguna baru, hapus akun, dan **ubah role siapa pun secara instan** (`Siswa` ⇄ `Guru BK` ⇄ `Admin`).
     - **Kontrol Seluruh Konseling BK:** Pantau dan ubah status seluruh jadwal konseling.
     - **Manajemen Pengaduan & Masukan:** Berikan tanggapan resmi Admin dan perbarui status laporan.
     - **CMS Kurikulum Modul:** Tambah modul pembelajaran baru secara dinamis dari dashboard Admin!

3. **🗄️ Database Supabase + Fail-Safe Local Fallback:**
   - Skema SQL lengkap di `supabase/migrations/20261120000000_init_temansehat.sql`.
   - Mendukung konfigurasi via `.env.local` (`NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`) maupun langsung melalui tombol **Konfigurasi Database Supabase** di dalam web.

---

## 🚀 Cara Menjalankan di Lokal

```bash
# 1. Install dependencies
npm install

# 2. Jalankan server development Next.js (Port 3005)
npm run dev
```

Buka **[http://localhost:3005](http://localhost:3005)** di browser Anda.

---

## 🌐 Cara Deploy ke Vercel

1. Push repositori ini ke GitHub.
2. Buka [Vercel Dashboard](https://vercel.com/new) dan import repositori ini.
3. Vercel otomatis mendeteksi **Next.js**.
4. Tambahkan Environment Variables di Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL` = URL proyek Supabase Anda
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Anon Public Key Supabase Anda
5. Klik **Deploy**!
