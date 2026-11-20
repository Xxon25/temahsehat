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
  CheckCircle2
} from "lucide-react";

import AuthPortal from "../components/AuthPortal";
import StudentViews from "../components/StudentViews";
import TeacherAndAdminViews from "../components/TeacherAndAdminViews";

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
  getCustomSkenarios
} from "../lib/supabaseService";
import { INITIAL_MODUL } from "../data/contentData";

export default function TemanSehatApp() {
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState("beranda");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // State Data
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

  // Modal Pengaturan Supabase
  const [dbModalOpen, setDbModalOpen] = useState(false);
  const [dbUrlInput, setDbUrlInput] = useState("");
  const [dbKeyInput, setDbKeyInput] = useState("");

  // Toast Notification
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
    setDbKeyInput(cfg.key || "");

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
  }, [loadAllData]);

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

  // Switch Role Instan saat sedang login untuk memudahkan testing
  const handleQuickRoleSwitch = async (targetRole) => {
    if (!user) return;
    let demoAccount = null;
    if (targetRole === "siswa") {
      demoAccount = await upsertProfile({
        nama: "Dimas Prasetyo",
        email: "dimas@sekolah.id",
        role: "siswa",
        kelas: "Kelas XI MIPA 2"
      });
    } else if (targetRole === "guru") {
      demoAccount = await upsertProfile({
        nama: "Ibu Rahmawati, S.Pd., Kons.",
        email: "gurubk@temansehat.id",
        role: "guru",
        kelas: "Koordinator BK"
      });
    } else if (targetRole === "admin") {
      demoAccount = await upsertProfile({
        nama: "Dr. Hendra Wijaya (Admin)",
        email: "admin@temansehat.id",
        role: "admin",
        kelas: "Administrator"
      });
    }
    if (demoAccount) {
      handleLoginSuccess(demoAccount);
    }
  };

  // -------------------------------------------------------------------------
  // HANDLERS SISWA
  // -------------------------------------------------------------------------
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

  // -------------------------------------------------------------------------
  // HANDLERS GURU BK & ADMIN
  // -------------------------------------------------------------------------
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

  const handleSaveDbSettings = (e) => {
    e.preventDefault();
    saveSupabaseCredentials(dbUrlInput, dbKeyInput);
    setDbModalOpen(false);
    loadAllData(user);
    showToast(
      dbUrlInput && dbKeyInput
        ? "Kredensial Supabase disimpan & diaktifkan!"
        : "Berpindah ke Mode Penyimpanan Lokal."
    );
  };

  // Definisi Menu Sidebar Berdasarkan Role
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

    // Admin punya akses ke SEMUA menu
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
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
          {/* LEFT SIDEBAR (DESKTOP) */}
          <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-slate-200/90 z-30 no-print">
            {/* BRAND LOGO */}
            <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-500 flex items-center justify-center text-white shadow-sm">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <span className="text-lg font-extrabold text-slate-900">
                  Teman<span className="text-sky-600">Sehat</span>
                </span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                  user.role === "admin"
                    ? "bg-amber-100 text-amber-800"
                    : user.role === "guru"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-sky-100 text-sky-800"
                }`}
              >
                {user.role}
              </span>
            </div>

            {/* USER PROFILE SUMMARY */}
            <div className="p-4 mx-4 mt-4 rounded-2xl bg-gradient-to-br from-slate-50 to-sky-50/60 border border-slate-200/80">
              <div className="text-xs font-bold text-slate-400 uppercase">Masuk Sebagai</div>
              <div className="text-sm font-extrabold text-slate-900 truncate mt-0.5">
                {user.nama}
              </div>
              <div className="text-xs text-slate-500 truncate">{user.email}</div>

              {/* ROLE SWITCHER CEPAT UNTUK DEMO */}
              <div className="mt-3 pt-3 border-t border-slate-200/80">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                  ⚡ Ganti Peran Instan (Demo):
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {["siswa", "guru", "admin"].map((r) => (
                    <button
                      key={r}
                      onClick={() => handleQuickRoleSwitch(r)}
                      className={`py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                        user.role === r
                          ? "bg-sky-600 text-white shadow-sm"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
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
                        ? "bg-gradient-to-r from-sky-500 to-cyan-600 text-white shadow-md shadow-sky-500/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* SIDEBAR FOOTER: DB STATUS & LOGOUT */}
            <div className="p-4 border-t border-slate-200 space-y-2">
              <button
                onClick={() => setDbModalOpen(true)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-between ${
                  isOnline
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOnline ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  {isOnline ? "Supabase Cloud" : "Database Lokal"}
                </span>
                <span>Atur ⚙️</span>
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
            <header className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 h-16 flex items-center justify-between no-print">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-500 flex items-center justify-center text-white">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-lg text-slate-900">
                  Teman<span className="text-sky-600">Sehat</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 font-extrabold text-xs capitalize">
                  {user.role}
                </span>
                <button
                  onClick={() => setMobileNavOpen(!mobileNavOpen)}
                  className="p-2 rounded-xl border border-slate-200 text-slate-700"
                >
                  {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </header>

            {/* MOBILE DRAWER MENU */}
            {mobileNavOpen && (
              <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-2 no-print">
                <div className="grid grid-cols-3 gap-1.5 pb-2 border-b border-slate-100">
                  {["siswa", "guru", "admin"].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        handleQuickRoleSwitch(r);
                        setMobileNavOpen(false);
                      }}
                      className={`py-1.5 rounded-lg text-xs font-bold capitalize ${
                        user.role === r
                          ? "bg-sky-600 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      Role: {r}
                    </button>
                  ))}
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
                          ? "bg-sky-600 text-white"
                          : "text-slate-700 hover:bg-slate-100"
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
                    className="flex-1 py-2 px-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                  >
                    ⚙️ Pengaturan Supabase
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
                isOnline={isOnline}
              />
            </main>
          </div>
        </div>
      )}

      {/* MODAL PENGATURAN KONEKSI SUPABASE */}
      {dbModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-sky-600" />
                Konfigurasi Database Supabase
              </h3>
              <button
                onClick={() => setDbModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Masukkan <b>Project URL</b> dan <b>Anon Key</b> dari dashboard Supabase Anda (atau
              melalui Environment Variables <code>NEXT_PUBLIC_SUPABASE_URL</code> di Vercel).
            </p>

            <form onSubmit={handleSaveDbSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  value={dbUrlInput}
                  onChange={(e) => setDbUrlInput(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Supabase Anon Public Key
                </label>
                <input
                  type="password"
                  value={dbKeyInput}
                  onChange={(e) => setDbKeyInput(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-sky-500"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900">
                💡 <b>Mode Fail-Safe:</b> Apabila dikosongkan, aplikasi otomatis berjalan menggunakan
                penyimpanan lokal browser tanpa error.
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
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md"
                >
                  Simpan & Sinkronkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-bounce no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}
    </>
  );
}
