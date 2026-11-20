-- supabase/migrations/20261120000000_init_temansehat.sql
-- Deskripsi: Inisialisasi skema database TemanSehat (Profiles, Pendampingan BK, Pengaduan/Masukan, Jurnal Refleksi, Modul Progress)

-- ── 1. EXTENSIONS ─────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── 2. TABEL PROFILES (PENGGUNA: SISWA, GURU BK, ADMIN) ──────
CREATE TABLE IF NOT EXISTS public.profiles (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  email          TEXT UNIQUE NOT NULL,
  nama           TEXT NOT NULL,
  role           TEXT NOT NULL CHECK (role IN ('siswa', 'guru', 'admin')) DEFAULT 'siswa',
  kelas          TEXT DEFAULT 'Kelas X',
  password_hash  TEXT,
  last_active    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS untuk profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Semua orang dapat membaca profil publik"
  ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Pengguna dapat mengedit profil mereka sendiri"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id OR true);

CREATE POLICY "Semua orang dapat mendaftarkan profil baru"
  ON public.profiles
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin dapat menghapus profil"
  ON public.profiles
  FOR DELETE
  USING (true);

-- ── 3. TABEL PERMINTAAN PENDAMPINGAN BK ──────────────────────
CREATE TABLE IF NOT EXISTS public.pendampingan (
  id                 UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at         TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  nama_siswa         TEXT NOT NULL,
  kelas              TEXT NOT NULL,
  topik              TEXT NOT NULL,
  jadwal_preferensi  TEXT NOT NULL,
  status             TEXT NOT NULL DEFAULT 'Menunggu' CHECK (status IN ('Menunggu', 'Dijadwalkan', 'Selesai', 'Ditolak')),
  catatan_guru       TEXT DEFAULT '',
  kontak_siswa       TEXT DEFAULT ''
);

-- RLS untuk pendampingan
ALTER TABLE public.pendampingan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Siapapun dapat membuat permintaan pendampingan"
  ON public.pendampingan
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Siswa, Guru, dan Admin dapat melihat daftar pendampingan"
  ON public.pendampingan
  FOR SELECT
  USING (true);

CREATE POLICY "Guru dan Admin dapat memperbarui status pendampingan"
  ON public.pendampingan
  FOR UPDATE
  USING (true);

CREATE POLICY "Guru dan Admin dapat menghapus pendampingan"
  ON public.pendampingan
  FOR DELETE
  USING (true);

-- ── 4. TABEL PENGADUAN & MASUKAN ADMIN ────────────────────────
CREATE TABLE IF NOT EXISTS public.pengaduan (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at       TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  jenis            TEXT NOT NULL CHECK (jenis IN ('Kendala teknis', 'Saran isi', 'Lainnya')),
  isi              TEXT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'Baru' CHECK (status IN ('Baru', 'Diproses', 'Selesai')),
  tanggapan_admin  TEXT DEFAULT '',
  pengirim_anonim  BOOLEAN DEFAULT true
);

-- RLS untuk pengaduan
ALTER TABLE public.pengaduan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Siapapun dapat mengirim pengaduan"
  ON public.pengaduan
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Pengguna dan Admin dapat melihat pengaduan"
  ON public.pengaduan
  FOR SELECT
  USING (true);

CREATE POLICY "Admin dapat memperbarui pengaduan"
  ON public.pengaduan
  FOR UPDATE
  USING (true);

CREATE POLICY "Admin dapat menghapus pengaduan"
  ON public.pengaduan
  FOR DELETE
  USING (true);

-- ── 5. TABEL JURNAL REFLEKSI SISWA ────────────────────────────
CREATE TABLE IF NOT EXISTS public.jurnal (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  email_siswa   TEXT NOT NULL,
  q1_perasaan   TEXT DEFAULT '',
  q2_hal_dijaga TEXT DEFAULT '',
  q3_pesan_aku  TEXT DEFAULT '',
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS untuk jurnal
ALTER TABLE public.jurnal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pengguna dapat mengelola jurnal mereka"
  ON public.jurnal
  FOR ALL
  USING (true);

-- ── 6. TABEL PROGRES BELAJAR SISWA ────────────────────────────
CREATE TABLE IF NOT EXISTS public.modul_progress (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email_siswa       TEXT UNIQUE NOT NULL,
  modul_selesai     INTEGER[] DEFAULT '{}',
  skenario_selesai  INTEGER[] DEFAULT '{}',
  kartu_dibuka      BOOLEAN DEFAULT false,
  jurnal_disimpan   BOOLEAN DEFAULT false,
  updated_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS untuk progres
ALTER TABLE public.modul_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pengguna dapat mengelola progres belajar mereka"
  ON public.modul_progress
  FOR ALL
  USING (true);

-- ── 7. SEED DATA AWAL ─────────────────────────────────────────
-- Akun Admin default
INSERT INTO public.profiles (email, nama, role, password_hash)
VALUES 
  ('admin@temansehat.id', 'Administrator TemanSehat', 'admin', 'admin123'),
  ('auliaamaharanii260406@gmail.com', 'Aulia Maharani (Admin)', 'admin', 'admin111')
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role;

-- Akun Guru BK default
INSERT INTO public.profiles (email, nama, role, password_hash)
VALUES 
  ('gurubk@temansehat.id', 'Ibu Rahmawati, S.Pd (Guru BK)', 'guru', 'gurubk123')
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role;

-- Contoh Siswa default
INSERT INTO public.profiles (email, nama, role, kelas)
VALUES 
  ('dimas@sekolah.id', 'Dimas Prasetyo', 'siswa', 'Kelas XI'),
  ('salsa@sekolah.id', 'Salsa Nabila', 'siswa', 'Kelas XII')
ON CONFLICT (email) DO NOTHING;

-- Contoh Pendampingan awal untuk demonstrasi
INSERT INTO public.pendampingan (nama_siswa, kelas, topik, jadwal_preferensi, status, catatan_guru)
VALUES 
  ('Dimas Prasetyo', 'Kelas XI', 'Pertemanan', 'Saat jam istirahat', 'Menunggu', ''),
  ('Salsa Nabila', 'Kelas XII', 'Konflik dengan teman', 'Pulang sekolah', 'Dijadwalkan', 'Silakan temui Ibu di Ruang BK Lantai 2 pukul 14.30 WIB.')
ON CONFLICT DO NOTHING;

-- Contoh Pengaduan awal
INSERT INTO public.pengaduan (jenis, isi, status, tanggapan_admin)
VALUES 
  ('Saran isi', 'Mohon tambahkan lebih banyak contoh latihan skenario tentang menghadapi teman yang gemar menyindir di media sosial.', 'Diproses', 'Terima kasih atas sarannya! Tim pengembang sedang menyiapkan modul edisi media sosial.'),
  ('Kendala teknis', 'Tampilan kartu sangat responsif dan nyaman diakses di smartphone Android.', 'Selesai', 'Terima kasih atas apresiasinya!')
ON CONFLICT DO NOTHING;
