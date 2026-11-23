"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  HeartHandshake,
  LayoutDashboard,
  BookOpen,
  Lightbulb,
  CreditCard,
  PenTool,
  MessageSquareWarning,
  GraduationCap,
  ShieldCheck,
  LogOut,
  Database,
  Menu,
  X,
  CheckCircle2,
  Copy,
  Check
} from "lucide-react";

import AuthPortal from "../components/AuthPortal";
import StudentViews from "../components/StudentViews";
import TeacherAndAdminViews from "../components/TeacherAndAdminViews";
import LiveChatModal from "../components/LiveChatModal";

import {
  initSupabase,
  checkIsOnline,
  getSupabaseConfig,
  saveSupabaseCredentials,
  fetchProfiles,
  upsertProfile,
  changeUserRole,
  removeUserProfile,
  fetchPendampingan,
  createPendampinganRequest,
  updatePendampinganItem,
  deletePendampinganItem,
  fetchPengaduan,
  createPengaduanItem,
  updatePengaduanItem,
  deletePengaduanItem,
  fetchJurnalSiswa,
  saveJurnalSiswa,
  fetchStudentProgress,
  saveStudentProgress,
  getCustomModuls,
  saveCustomModuls,
  getCustomSkenarios,
  fetchChatMessages,
  sendChatMessage
} from "../lib/supabaseService";
import { INITIAL_MODUL } from "../data/contentData";

const SUPABASE_SQL_SCHEMA = `-- Copy & Run script ini di SQL Editor Supabase Anda
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  email TEXT UNIQUE NOT NULL,
  nama TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('siswa', 'guru', 'admin')) DEFAULT 'siswa',
  kelas TEXT DEFAULT 'Kelas X',
  password_hash TEXT,
  last_active TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles access" ON public.profiles;
CREATE POLICY "Public profiles access" ON public.profiles FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.pendampingan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  nama_siswa TEXT NOT NULL,
  kelas TEXT NOT NULL,
  topik TEXT NOT NULL,
  jadwal_preferensi TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Menunggu',
  catatan_guru TEXT DEFAULT '',
  kontak_siswa TEXT DEFAULT ''
);
ALTER TABLE public.pendampingan ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public pendampingan access" ON public.pendampingan;
CREATE POLICY "Public pendampingan access" ON public.pendampingan FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.pengaduan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  jenis TEXT NOT NULL,
  isi TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Baru',
  tanggapan_admin TEXT DEFAULT '',
  pengirim_anonim BOOLEAN DEFAULT true
);
ALTER TABLE public.pengaduan ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public pengaduan access" ON public.pengaduan;
CREATE POLICY "Public pengaduan access" ON public.pengaduan FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.jurnal (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  email_siswa TEXT UNIQUE NOT NULL,
  q1_perasaan TEXT DEFAULT '',
  q2_hal_dijaga TEXT DEFAULT '',
  q3_pesan_aku TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.jurnal ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public jurnal access" ON public.jurnal;
CREATE POLICY "Public jurnal access" ON public.jurnal FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.modul_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email_siswa TEXT UNIQUE NOT NULL,
  modul_selesai INTEGER[] DEFAULT '{}',
  skenario_selesai INTEGER[] DEFAULT '{}',
  kartu_dibuka BOOLEAN DEFAULT false,
  jurnal_disimpan BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.modul_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public progress access" ON public.modul_progress;
CREATE POLICY "Public progress access" ON public.modul_progress FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.konseling_pesan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  pendampingan_id TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('siswa', 'guru', 'admin')),
  pesan TEXT NOT NULL
);
ALTER TABLE public.konseling_pesan ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public chat access" ON public.konseling_pesan;
CREATE POLICY "Public chat access" ON public.konseling_pesan FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.konseling_pesan;

GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;`;

export default function TemanSehatApp() {
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState("beranda");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [isOnline, setIsOnline] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [pendampinganList, setPendampinganList] = useState([]);
  const [pengaduanList, setPengaduanList] = useState([]);
  const [moduls, setModuls] = useState(INITIAL_MODUL);
  const [skenarios, setSkenarios] = useState([]);
  const [progress, setProgress] = useState({
    modul_selesai: [],
    skenario_selesai: [],
    kartu_dibuka: false,
    jurnal_disimpan: false
  });
  const [jurnal, setJurnal] = useState({
    q1_perasaan: "",
    q2_hal_dijaga: "",
    q3_pesan_aku: ""
  });

  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [activeChatSession, setActiveChatSession] = useState(null);

  // Modal Pengaturan Supabase
  const [dbModalOpen, setDbModalOpen] = useState(false);
  const [dbUrlInput, setDbUrlInput] = useState("");
  const [dbKeyInput, setDbKeyInput] = useState("");
  const [copiedSql, setCopiedSql] = useState(false);

  const [toastMsg, setToastMsg] = useState("");

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? "" : prev));
    }, 3200);
  }, []);

  const loadAllData = useCallback(async (currentUser) => {
    initSupabase();
    setIsOnline(checkIsOnline());

    const cfg = getSupabaseConfig();
    setDbUrlInput(cfg.url.includes("your-project") ? "" : cfg.url);
    setDbKeyInput(cfg.key.includes("your-anon") ? "" : cfg.key || "");

    setModuls(getCustomModuls());
    setSkenarios(getCustomSkenarios());

    const [profData, pendData, aduData] = await Promise.all([
      fetchProfiles(),
      fetchPendampingan(),
      fetchPengaduan()
    ]);

    setProfiles(profData);
    setPendampinganList(pendData);
    setPengaduanList(aduData);

    if (currentUser?.email) {
      const [progData, jurData] = await Promise.all([
        fetchStudentProgress(currentUser.email),
        fetchJurnalSiswa(currentUser.email)
      ]);
      setProgress(progData);
      setJurnal(jurData);
    }
  }, []);

  useEffect(() => {
    // Keamanan: Cek jika ada upaya akses via tautan bypass
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (
        params.get("login") === "admin" ||
        params.get("admin") === "true" ||
        params.get("role") === "admin"
      ) {
        showToast("🔒 Akses ditolak: Halaman Admin memerlukan login dengan akun Admin terlebih dahulu.");
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }

    try {
      const savedUser = sessionStorage.getItem("TS_NEXT_ACTIVE_USER");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        if (parsed.role === "admin") setActiveMenu("admin");
        else if (parsed.role === "guru") setActiveMenu("guru");
        else setActiveMenu("beranda");
        loadAllData(parsed);
        return;
      }
    } catch (e) {}
    loadAllData(null);
  }, [loadAllData, showToast]);

  const handleLoginSuccess = async (loggedInUser) => {
    setUser(loggedInUser);
    sessionStorage.setItem("TS_NEXT_ACTIVE_USER", JSON.stringify(loggedInUser));
    if (loggedInUser.role === "admin") setActiveMenu("admin");
    else if (loggedInUser.role === "guru") setActiveMenu("guru");
    else setActiveMenu("beranda");

    await loadAllData(loggedInUser);
    showToast(`Selamat datang, ${loggedInUser.nama}!`);
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("TS_NEXT_ACTIVE_USER");
    setMobileNavOpen(false);
    showToast("Berhasil keluar dari sesi.");
  };

  const handleMarkModulDone = async (idx) => {
    const list = Array.from(new Set([...(progress.modul_selesai || []), idx]));
    const updated = { ...progress, modul_selesai: list };
    setProgress(updated);
    if (user?.email) {
      await saveStudentProgress(user.email, updated);
    }
    showToast(`Modul 0${idx + 1} ditandai selesai!`);
  };

  const handleMarkSkenarioDone = async (idx) => {
    const list = Array.from(new Set([...(progress.skenario_selesai || []), idx]));
    const updated = { ...progress, skenario_selesai: list };
    setProgress(updated);
    if (user?.email) {
      await saveStudentProgress(user.email, updated);
    }
  };

  const handleMarkKartuOpened = async () => {
    const updated = { ...progress, kartu_dibuka: true };
    setProgress(updated);
    if (user?.email) {
      await saveStudentProgress(user.email, updated);
    }
  };

  const handleSaveJurnal = async (payload, isSaved) => {
    setJurnal(payload);
    if (user?.email) {
      await saveJurnalSiswa(user.email, payload);
      const updatedProg = { ...progress, jurnal_disimpan: isSaved };
      setProgress(updatedProg);
      await saveStudentProgress(user.email, updatedProg);
    }
    showToast(isSaved ? "Jurnal refleksi berhasil disimpan!" : "Jurnal telah dikosongkan.");
  };

  const handleSubmitPendampingan = async (form) => {
    await createPendampinganRequest(form);
    const updated = await fetchPendampingan();
    setPendampinganList(updated);
    showToast("Permohonan konseling berhasil dikirim ke Guru BK!");
  };

  const handleSubmitPengaduan = async (form) => {
    await createPengaduanItem(form);
    const updated = await fetchPengaduan();
    setPengaduanList(updated);
    showToast("Masukan/pengaduan berhasil dikirim ke Admin!");
  };

  const handleUpdatePendampingan = async (id, changes) => {
    await updatePendampinganItem(id, changes);
    setPendampinganList(await fetchPendampingan());
    showToast("Data konseling berhasil diperbarui!");
  };

  const handleDeletePendampingan = async (id) => {
    await deletePendampinganItem(id);
    setPendampinganList(await fetchPendampingan());
    showToast("Catatan konseling dihapus.");
  };

  const handleUpdateUserRole = async (email, newRole) => {
    await changeUserRole(email, newRole);
    setProfiles(await fetchProfiles());
    showToast(`Role ${email} diubah menjadi ${newRole.toUpperCase()}!`);
  };

  const handleAddUser = async (newUserObj) => {
    await upsertProfile(newUserObj);
    setProfiles(await fetchProfiles());
    showToast(`Akun ${newUserObj.nama} (${newUserObj.role}) berhasil ditambahkan!`);
  };

  const handleDeleteUser = async (email) => {
    await removeUserProfile(email);
    setProfiles(await fetchProfiles());
    showToast(`Akun ${email} telah dihapus.`);
  };

  const handleUpdatePengaduan = async (id, changes) => {
    await updatePengaduanItem(id, changes);
    setPengaduanList(await fetchPengaduan());
    showToast("Status pengaduan diperbarui!");
  };

  const handleDeletePengaduan = async (id) => {
    await deletePengaduanItem(id);
    setPengaduanList(await fetchPengaduan());
    showToast("Pengaduan dihapus.");
  };

  const handleAddCustomModul = (newModul) => {
    const nextList = [...moduls, newModul];
    setModuls(nextList);
    saveCustomModuls(nextList);
    showToast(`Modul "${newModul.judul}" berhasil ditambahkan!`);
  };

  const handleResetCustomModuls = () => {
    setModuls(INITIAL_MODUL);
    saveCustomModuls(INITIAL_MODUL);
    showToast("Kurikulum modul dikembalikan ke 6 Modul SEHAT default.");
  };

  const handleOpenChat = (session) => {
    setActiveChatSession(session);
    setChatModalOpen(true);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    showToast("Script SQL Supabase berhasil disalin ke Clipboard!");
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleSaveDbSettings = (e) => {
    e.preventDefault();
    saveSupabaseCredentials(dbUrlInput, dbKeyInput);
    setDbModalOpen(false);
    loadAllData(user);
    showToast(
      dbUrlInput && dbKeyInput
        ? "Kredensial Supabase disimpan & terhubung!"
        : "Berpindah ke Mode Penyimpanan Lokal."
    );
  };

  const getNavigationMenus = () => {
    if (!user) return [];

    const studentMenus = [
      { id: "beranda", label: "Dashboard Siswa", icon: LayoutDashboard },
      { id: "modul", label: "Modul SEHAT", icon: BookOpen },
      { id: "latihan", label: "Simulasi Kasus", icon: Lightbulb },
      { id: "kartu", label: "Kartu Pedoman", icon: CreditCard },
      { id: "jurnal", label: "Jurnal Refleksi", icon: PenTool },
      { id: "bantuan", label: "Konseling Guru BK", icon: HeartHandshake },
      { id: "pengaduan", label: "Kotak Aspirasi", icon: MessageSquareWarning }
    ];

    if (user.role === "siswa") return studentMenus;

    if (user.role === "guru") {
      return [
        { id: "guru", label: "Portal Guru BK", icon: GraduationCap },
        { id: "modul", label: "Materi Modul SEHAT", icon: BookOpen },
        { id: "latihan", label: "Simulasi Kasus", icon: Lightbulb },
        { id: "kartu", label: "Kartu Pedoman", icon: CreditCard },
        { id: "pengaduan", label: "Masukan ke Admin", icon: MessageSquareWarning }
      ];
    }

    return [
      { id: "admin", label: "Pusat Kontrol Admin", icon: ShieldCheck },
      { id: "guru", label: "Portal Guru BK", icon: GraduationCap },
      { id: "beranda", label: "Pratinjau Siswa", icon: LayoutDashboard },
      { id: "modul", label: "Modul SEHAT", icon: BookOpen },
      { id: "latihan", label: "Simulasi Kasus", icon: Lightbulb },
      { id: "kartu", label: "Kartu Pedoman", icon: CreditCard },
      { id: "bantuan", label: "Form Konseling", icon: HeartHandshake }
    ];
  };

  const navMenus = getNavigationMenus();

  return (
    <>
      {!user ? (
        <AuthPortal
          onLoginSuccess={handleLoginSuccess}
          isOnline={isOnline}
          onOpenDbModal={() => setDbModalOpen(true)}
          upsertProfile={upsertProfile}
          fetchProfiles={fetchProfiles}
        />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-pink-50/40 via-white to-emerald-50/40 flex flex-col lg:flex-row">
          {/* LEFT SIDEBAR (DESKTOP) - PINK & HIJAU */}
          <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-pink-200/80 z-30 no-print">
            {/* BRAND LOGO */}
            <div className="h-16 px-6 flex items-center justify-between border-b border-pink-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-emerald-500 flex items-center justify-center text-white shadow-sm">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <span className="text-lg font-extrabold text-slate-900">
                  Teman<span className="text-pink-600">Sehat</span>
                </span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                  user.role === "admin"
                    ? "bg-rose-100 text-rose-800"
                    : user.role === "guru"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-pink-100 text-pink-800"
                }`}
              >
                {user.role}
              </span>
            </div>

            {/* USER PROFILE SUMMARY */}
            <div className="p-4 mx-4 mt-4 rounded-2xl bg-gradient-to-br from-pink-50/80 to-emerald-50/80 border border-pink-200/70">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-pink-600 uppercase">Akun Aktif</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-white border border-pink-200 text-slate-800 shadow-sm">
                  {user.role}
                </span>
              </div>
              <div className="text-sm font-extrabold text-slate-900 truncate mt-1.5">
                {user.nama}
              </div>
              <div className="text-xs text-slate-500 truncate">{user.email}</div>
            </div>

            {/* NAVIGATION ITEMS */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              <div className="px-3 pb-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Menu Navigasi
              </div>
              {navMenus.map((item) => {
                const Icon = item.icon;
                const active = activeMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      active
                        ? "bg-gradient-to-r from-pink-500 to-emerald-500 text-white shadow-md shadow-pink-500/20"
                        : "text-slate-600 hover:bg-pink-50 hover:text-pink-700"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* SIDEBAR FOOTER: DB STATUS & LOGOUT */}
            <div className="p-4 border-t border-pink-100 space-y-2">
              <button
                onClick={() => setDbModalOpen(true)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-between ${
                  isOnline
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : "bg-pink-50 text-pink-700 border-pink-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOnline ? "bg-emerald-500" : "bg-pink-500"
                    }`}
                  />
                  {isOnline ? "Supabase Cloud" : "Setup Database ⚙️"}
                </span>
                <span>Atur</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-4 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Keluar Sesi
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
            {/* MOBILE & TABLET TOP HEADER */}
            <header className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-pink-200 px-4 h-16 flex items-center justify-between no-print">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-emerald-500 flex items-center justify-center text-white">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-lg text-slate-900">
                  Teman<span className="text-pink-600">Sehat</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-pink-100 text-pink-800 font-extrabold text-xs capitalize">
                  {user.role}
                </span>
                <button
                  onClick={() => setMobileNavOpen(!mobileNavOpen)}
                  className="p-2 rounded-xl border border-pink-200 text-slate-700"
                >
                  {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </header>

            {/* MOBILE DRAWER MENU */}
            {mobileNavOpen && (
              <div className="lg:hidden bg-white border-b border-pink-200 p-4 space-y-2 no-print">
                <div className="pb-2 border-b border-pink-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">{user.nama}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-pink-100 text-pink-800">
                    {user.role}
                  </span>
                </div>

                {navMenus.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveMenu(item.id);
                        setMobileNavOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm ${
                        activeMenu === item.id
                          ? "bg-gradient-to-r from-pink-500 to-emerald-500 text-white"
                          : "text-slate-700 hover:bg-pink-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => {
                      setDbModalOpen(true);
                      setMobileNavOpen(false);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl border border-pink-300 text-xs font-bold text-pink-700"
                  >
                    ⚙️ Setup Supabase
                  </button>
                  <button
                    onClick={handleLogout}
                    className="py-2 px-4 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            )}

            {/* PAGE BODY */}
            <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
              <StudentViews
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                user={user}
                moduls={moduls}
                skenarios={skenarios}
                progress={progress}
                onMarkModulDone={handleMarkModulDone}
                onMarkSkenarioDone={handleMarkSkenarioDone}
                onMarkKartuOpened={handleMarkKartuOpened}
                jurnal={jurnal}
                onSaveJurnal={handleSaveJurnal}
                pendampinganList={pendampinganList}
                onSubmitPendampingan={handleSubmitPendampingan}
                pengaduanList={pengaduanList}
                onSubmitPengaduan={handleSubmitPengaduan}
                onOpenChat={handleOpenChat}
                showToast={showToast}
              />

              <TeacherAndAdminViews
                activeMenu={activeMenu}
                user={user}
                profiles={profiles}
                pendampinganList={pendampinganList}
                pengaduanList={pengaduanList}
                moduls={moduls}
                onUpdatePendampingan={handleUpdatePendampingan}
                onDeletePendampingan={handleDeletePendampingan}
                onUpdateUserRole={handleUpdateUserRole}
                onAddUser={handleAddUser}
                onDeleteUser={handleDeleteUser}
                onUpdatePengaduan={handleUpdatePengaduan}
                onDeletePengaduan={handleDeletePengaduan}
                onAddCustomModul={handleAddCustomModul}
                onResetCustomModuls={handleResetCustomModuls}
                onOpenDbModal={() => setDbModalOpen(true)}
                onOpenChat={handleOpenChat}
                isOnline={isOnline}
              />
            </main>
          </div>
        </div>
      )}

      {/* MODAL LIVE CHAT KONSELING BK */}
      <LiveChatModal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        session={activeChatSession}
        currentUser={user}
        fetchChatMessages={fetchChatMessages}
        sendChatMessage={sendChatMessage}
        showToast={showToast}
      />

      {/* MODAL SETUP DATABASE SUPABASE LENGKAP + 1-CLICK COPY SQL */}
      {dbModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-2 border-pink-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-pink-600" />
                Setup Database Supabase (3 Langkah Mudah)
              </h3>
              <button
                onClick={() => setDbModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: COPY SQL */}
            <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-pink-800">
                  Langkah 1: Buat Tabel di SQL Editor Supabase
                </span>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-emerald-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSql ? "Tersalin!" : "Copy Script SQL"}
                </button>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Klik tombol <b>Copy Script SQL</b> di atas, lalu buka dashboard{" "}
                <b>Supabase &gt; SQL Editor &gt; New Query</b>, paste script-nya dan klik{" "}
                <b>Run</b>.
              </p>
            </div>

            {/* STEP 2 & 3: INPUT URL & KEY */}
            <form onSubmit={handleSaveDbSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                  Langkah 2: Masukkan Supabase Project URL
                </label>
                <input
                  type="url"
                  value={dbUrlInput}
                  onChange={(e) => setDbUrlInput(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-sm outline-none focus:border-pink-500"
                />
                <span className="text-[11px] text-slate-400">
                  Ambil dari Supabase Dashboard &gt; Project Settings &gt; API &gt; Project URL
                </span>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                  Langkah 3: Masukkan Supabase Anon Public Key
                </label>
                <input
                  type="password"
                  value={dbKeyInput}
                  onChange={(e) => setDbKeyInput(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-sm outline-none focus:border-pink-500"
                />
                <span className="text-[11px] text-slate-400">
                  Ambil dari Project Settings &gt; API &gt; Project API Keys (anon public)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                🌿 <b>Tips Permanen (.env.local / Vercel):</b> Kamu juga bisa menaruh URL & Key di
                file <code>.env.local</code> atau langsung kirimkan URL & Anon Key Supabase kamu di
                chat ini biar saya pasang otomatis!
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDbModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-emerald-500 hover:opacity-95 text-white font-bold text-xs shadow-md"
                >
                  Simpan & Hubungkan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-gradient-to-r from-pink-600 to-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-bounce no-print">
          <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}
    </>
  );
}
