-- supabase/migrations/20261120000000_init_temansehat.sql
-- Deskripsi: Inisialisasi skema database TemanSehat lengkap dengan GRANT privileges & RLS

-- ── 1. EXTENSIONS & SCHEMA GRANTS ─────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

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

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Semua orang dapat membaca profil publik" ON public.profiles;
DROP POLICY IF EXISTS "Pengguna dapat mengedit profil mereka sendiri" ON public.profiles;
DROP POLICY IF EXISTS "Semua orang dapat mendaftarkan profil baru" ON public.profiles;
DROP POLICY IF EXISTS "Admin dapat menghapus profil" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles access" ON public.profiles;

CREATE POLICY "Public profiles access"
  ON public.profiles
  FOR ALL
  TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

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

ALTER TABLE public.pendampingan ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Siapapun dapat membuat permintaan pendampingan" ON public.pendampingan;
DROP POLICY IF EXISTS "Siswa, Guru, dan Admin dapat melihat daftar pendampingan" ON public.pendampingan;
DROP POLICY IF EXISTS "Guru dan Admin dapat memperbarui status pendampingan" ON public.pendampingan;
DROP POLICY IF EXISTS "Guru dan Admin dapat menghapus pendampingan" ON public.pendampingan;
DROP POLICY IF EXISTS "Public pendampingan access" ON public.pendampingan;

CREATE POLICY "Public pendampingan access"
  ON public.pendampingan
  FOR ALL
  TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

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

ALTER TABLE public.pengaduan ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Siapapun dapat mengirim pengaduan" ON public.pengaduan;
DROP POLICY IF EXISTS "Pengguna dan Admin dapat melihat pengaduan" ON public.pengaduan;
DROP POLICY IF EXISTS "Admin dapat memperbarui pengaduan" ON public.pengaduan;
DROP POLICY IF EXISTS "Admin dapat menghapus pengaduan" ON public.pengaduan;
DROP POLICY IF EXISTS "Public pengaduan access" ON public.pengaduan;

CREATE POLICY "Public pengaduan access"
  ON public.pengaduan
  FOR ALL
  TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

-- ── 5. TABEL JURNAL REFLEKSI SISWA ────────────────────────────
CREATE TABLE IF NOT EXISTS public.jurnal (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  email_siswa   TEXT UNIQUE NOT NULL,
  q1_perasaan   TEXT DEFAULT '',
  q2_hal_dijaga TEXT DEFAULT '',
  q3_pesan_aku  TEXT DEFAULT '',
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.jurnal ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Pengguna dapat mengelola jurnal mereka" ON public.jurnal;
DROP POLICY IF EXISTS "Public jurnal access" ON public.jurnal;

CREATE POLICY "Public jurnal access"
  ON public.jurnal
  FOR ALL
  TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

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

ALTER TABLE public.modul_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Pengguna dapat mengelola progres belajar mereka" ON public.modul_progress;
DROP POLICY IF EXISTS "Public progress access" ON public.modul_progress;

CREATE POLICY "Public progress access"
  ON public.modul_progress
  FOR ALL
  TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

-- ── 7. TABEL LIVE CHAT KONSELING SISWA & GURU BK ──────────────
CREATE TABLE IF NOT EXISTS public.konseling_pesan (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  pendampingan_id TEXT NOT NULL,
  sender_email    TEXT NOT NULL,
  sender_name     TEXT NOT NULL,
  sender_role     TEXT NOT NULL CHECK (sender_role IN ('siswa', 'guru', 'admin')),
  pesan           TEXT NOT NULL
);

ALTER TABLE public.konseling_pesan ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public chat access" ON public.konseling_pesan;

CREATE POLICY "Public chat access"
  ON public.konseling_pesan
  FOR ALL
  TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

-- ── 8. GRANT TABLE PRIVILEGES KE ANON, AUTHENTICATED, SERVICE_ROLE ──
GRANT ALL ON TABLE public.profiles TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.pendampingan TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.pengaduan TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.jurnal TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.modul_progress TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.konseling_pesan TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- ── 9. SEED DATA AWAL ─────────────────────────────────────────
INSERT INTO public.profiles (email, nama, role, kelas, password_hash)
VALUES 
  ('admin@temansehat.id', 'Dr. Hendra Wijaya (Admin Utama)', 'admin', 'Administrator', 'admin264'),
  ('auliaamaharanii260406@gmail.com', 'Aulia Maharani (Admin)', 'admin', 'Administrator', 'admin111'),
  ('gurubk@temansehat.id', 'Ibu Rahmawati, S.Pd., Kons.', 'guru', 'Koordinator BK', 'gurubk264'),
  ('dimas@sekolah.id', 'Dimas Prasetyo', 'siswa', 'Kelas XI MIPA 2', NULL),
  ('salsa@sekolah.id', 'Salsa Nabila Putri', 'siswa', 'Kelas XII IPS 1', NULL)
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, nama = EXCLUDED.nama, password_hash = EXCLUDED.password_hash;

INSERT INTO public.pendampingan (nama_siswa, kelas, topik, jadwal_preferensi, status, catatan_guru, kontak_siswa)
VALUES 
  ('Dimas Prasetyo', 'Kelas XI MIPA 2', 'Menegaskan Batasan Diri (Asertif)', 'Saat jam istirahat pertama (09.45 WIB)', 'Menunggu', '', 'dimas@sekolah.id'),
  ('Salsa Nabila Putri', 'Kelas XII IPS 1', 'Konflik dengan Teman Sebaya', 'Sepulang sekolah (15.00 WIB)', 'Dijadwalkan', 'Silakan temui Ibu di Ruang BK Lantai 2 pukul 15.00 WIB.', 'salsa@sekolah.id');

INSERT INTO public.pengaduan (jenis, isi, status, tanggapan_admin)
VALUES 
  ('Saran isi', 'Mohon tambahkan lebih banyak contoh latihan skenario tentang menghadapi teman yang gemar menyindir di media sosial.', 'Diproses', 'Terima kasih atas sarannya! Tim pengembang sedang menyiapkan modul edisi media sosial.'),
  ('Kendala teknis', 'Tampilan kartu sangat responsif dan nyaman diakses di smartphone.', 'Selesai', 'Terima kasih atas apresiasinya!');
