# TemanSehat — Platform Psikoedukasi Pertemanan Remaja & BK Digital

> **Dibuat oleh:** Aulia Maharani (2411080198)  
> **Mata Kuliah:** Pengembangan Teknologi Bimbingan dan Konseling  
> **Dosen Pengampu:** Mega Aria Monica, M.Pd  
> **Program Studi:** Bimbingan dan Konseling Pendidikan Islam — UIN Raden Intan Lampung  
> **Stack:** Next.js 14 + Tailwind CSS + Supabase (opsional, ada fallback localStorage)

---

## Tentang Produk

**TemanSehat** adalah website edukasi interaktif (_media layanan informasi_) tentang pertemanan sehat bagi remaja madya usia 15–18 tahun (SMA/MA/SMK). Dikembangkan berdasarkan proposal UTS mata kuliah Pengembangan Teknologi BK menggunakan model **ADDIE**.

Platform ini **bukan alat konseling, tidak mendiagnosis, tidak melabeli pengguna atau teman, dan tidak menggantikan Guru BK.**

---

## Fitur Inti

| Fitur | Deskripsi |
|---|---|
| **6 Modul S-E-H-A-T** | Sapa & Komunikasi, Empati, Hati Terbuka, Andal, Topang, Waspada |
| **6 Simulasi Kasus** | Studi kasus pertemanan interaktif dengan umpan balik psikologis |
| **Kartu Pedoman SEHAT** | Ringkasan satu halaman, dapat dicetak/diunduh PDF |
| **Jurnal Refleksi** | Refleksi pribadi, tersimpan di browser, tidak dikirim ke server |
| **Konseling Guru BK** | Formulir jadwal pendampingan langsung ke dasbor Guru BK |
| **Kotak Aspirasi** | Saran & kendala teknis ke Admin |
| **Portal Guru BK** | Kelola antrean konseling siswa, beri jadwal & catatan |
| **Pusat Kontrol Admin** | Manajemen pengguna & role, CMS modul, monitoring pengaduan |

---

## Akun Demo (Login 1-Klik)

Gunakan tombol **Akses Demo Instan** di halaman login, atau isi manual:

| Role | Email | Password |
|---|---|---|
| **Siswa** | Isi nama + email bebas | — (tidak perlu password) |
| **Guru BK** | `gurubk@temansehat.id` | `gurubk123` |
| **Admin** | `admin@temansehat.id` | `admin123` |
| **Aulia (Admin/Guru)** | `auliaamaharanii260406@gmail.com` | `admin111` atau `gurubk111` |

---

## Cara Menjalankan

```bash
# 1. Install dependencies
npm install

# 2. Salin file environment
cp .env.example .env.local

# 3. Jalankan development server
npm run dev
# Akses di http://localhost:3005
```

### Setup Supabase (Opsional)

Tanpa Supabase, aplikasi berjalan penuh menggunakan **localStorage** sebagai fail-safe. Untuk mode cloud:

1. Buat project di [supabase.com](https://supabase.com)
2. Jalankan migration: `supabase/migrations/20261120000000_init_temansehat.sql`
3. Isi `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
4. Atau atur langsung di UI melalui tombol **⚙️ Atur DB** di sidebar

---

## Struktur Proyek

```
src/
├── app/
│   ├── layout.js          # Root layout + font
│   ├── page.js            # Halaman utama (state management + handlers)
│   └── globals.css        # Tailwind + print styles + animasi
├── components/
│   ├── AuthPortal.jsx     # Halaman login (3 role: Siswa, Guru BK, Admin)
│   ├── StudentViews.jsx   # Semua tampilan siswa (7 menu)
│   └── TeacherAndAdminViews.jsx  # Portal Guru BK + Pusat Kontrol Admin
├── data/
│   └── contentData.js     # 6 modul SEHAT + 6 skenario simulasi
└── lib/
    └── supabaseService.js # Layanan DB (Supabase Cloud + localStorage fallback)

supabase/
└── migrations/
    └── 20261120000000_init_temansehat.sql
```

---

## Landasan Teoritis (dari Proposal)

- **5 Aspek Kemampuan Pertemanan** (Rohimah dkk., 2025): Keterampilan sosial, empati, pengungkapan diri, dukungan emosional, kepercayaan → Modul 1–5
- **Pertemanan Merugikan** (Noffiyanti, 2024) → Modul 6 (Waspada & Batas Diri)
- **Teori Belajar Sosial** (Bandura, 1977): dialog model, simulasi kasus, kartu pengingat
- **Nilai Islami** (QS. Al-Hujurat): persaudaraan, larangan mengolok-olok, menghargai perbedaan

---

## Batasan Produk

- Tidak mendiagnosis, tidak melabeli, tidak menentukan tindak lanjut
- **Bukan** kanal pelaporan perundungan atau kekerasan
- Jurnal hanya tersimpan di perangkat pengguna
- Formulir konseling dikirim hanya atas inisiatif pengguna

---

## Deploy ke Vercel

```bash
# Build terlebih dahulu untuk memastikan tidak ada error
npm run build

# Push ke GitHub, lalu connect di vercel.com
# Tambahkan Environment Variables di dashboard Vercel
```

---

*Platform ini dikembangkan sebagai prototipe akademik untuk mata kuliah Pengembangan Teknologi BK. Untuk penggunaan nyata di sekolah, diperlukan validasi ahli materi BK dan ahli media sesuai rencana uji pada proposal.*
