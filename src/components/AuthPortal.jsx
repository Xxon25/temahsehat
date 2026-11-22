"use client";

import React, { useState } from "react";
import {
  HeartHandshake,
  GraduationCap,
  ShieldCheck,
  Users,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Lock,
  Mail,
  User,
  Database,
  Eye,
  EyeOff
} from "lucide-react";

export default function AuthPortal({
  onLoginSuccess,
  isOnline,
  onOpenDbModal,
  upsertProfile,
  fetchProfiles
}) {
  const [roleTab, setRoleTab] = useState("siswa"); // 'siswa' | 'guru' | 'admin'
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [kelas, setKelas] = useState("Kelas XI MIPA 1");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [setuju, setSetuju] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleSwitch = (newRole) => {
    setRoleTab(newRole);
    setErrorMsg("");
    if (newRole === "guru") {
      setEmail("gurubk@temansehat.id");
      setPassword("gurubk123");
    } else if (newRole === "admin") {
      setEmail("admin@temansehat.id");
      setPassword("admin123");
    } else {
      setEmail("");
      setPassword("");
    }
  };

  const handleQuickDemo = async (demoRole) => {
    setErrorMsg("");
    setLoading(true);
    try {
      if (demoRole === "siswa") {
        const user = await upsertProfile({
          nama: "Dimas Prasetyo",
          email: "dimas@sekolah.id",
          role: "siswa",
          kelas: "Kelas XI MIPA 2"
        });
        onLoginSuccess(user);
      } else if (demoRole === "guru") {
        const user = await upsertProfile({
          nama: "Ibu Rahmawati, S.Pd., Kons.",
          email: "gurubk@temansehat.id",
          role: "guru",
          kelas: "Koordinator BK"
        });
        onLoginSuccess(user);
      } else if (demoRole === "admin") {
        const user = await upsertProfile({
          nama: "Dr. Hendra Wijaya (Admin)",
          email: "admin@temansehat.id",
          role: "admin",
          kelas: "Administrator"
        });
        onLoginSuccess(user);
      }
    } catch (err) {
      setErrorMsg(err.message || "Gagal masuk akun demo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (roleTab === "siswa") {
      if (nama.trim().length < 2) {
        setErrorMsg("Harap isi nama lengkap atau panggilanmu (minimal 2 karakter).");
        return;
      }
      if (!email.includes("@")) {
        setErrorMsg("Masukkan alamat email yang valid (contoh: nama@sekolah.id).");
        return;
      }
      if (!setuju) {
        setErrorMsg("Harap centang persetujuan layanan edukasi TemanSehat.");
        return;
      }

      setLoading(true);
      try {
        const user = await upsertProfile({
          nama: nama.trim(),
          email: email.trim().toLowerCase(),
          role: "siswa",
          kelas
        });
        onLoginSuccess(user);
      } catch (err) {
        setErrorMsg(err.message || "Terjadi kesalahan saat masuk.");
      } finally {
        setLoading(false);
      }
    } else {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPw = password.trim();

      if (!cleanEmail || !cleanPw) {
        setErrorMsg("Email dan kata sandi wajib diisi.");
        return;
      }

      setLoading(true);
      try {
        let validRole = null;
        let displayName = roleTab === "guru" ? "Guru BK Sekolah" : "Administrator Sistem";

        if (
          roleTab === "guru" &&
          ((cleanEmail === "gurubk@temansehat.id" && cleanPw === "gurubk123") ||
            (cleanEmail === "auliaamaharanii260406@gmail.com" && cleanPw === "gurubk111"))
        ) {
          validRole = "guru";
          displayName =
            cleanEmail === "gurubk@temansehat.id"
              ? "Ibu Rahmawati, S.Pd., Kons."
              : "Aulia Maharani (Guru BK)";
        } else if (
          roleTab === "admin" &&
          ((cleanEmail === "admin@temansehat.id" && cleanPw === "admin123") ||
            (cleanEmail === "auliaamaharanii260406@gmail.com" && cleanPw === "admin111"))
        ) {
          validRole = "admin";
          displayName =
            cleanEmail === "admin@temansehat.id"
              ? "Dr. Hendra Wijaya (Admin)"
              : "Aulia Maharani (Admin)";
        } else {
          const allProfiles = await fetchProfiles();
          const matched = allProfiles.find((p) => p.email === cleanEmail);
          if (matched && (matched.role === roleTab || matched.role === "admin")) {
            validRole = matched.role;
            displayName = matched.nama;
          }
        }

        if (!validRole) {
          setErrorMsg(
            `Kredensial tidak cocok untuk peran ${
              roleTab === "guru" ? "Guru BK" : "Administrator"
            }. Gunakan tombol Akun Demo di bawah untuk uji cepat.`
          );
          setLoading(false);
          return;
        }

        const user = await upsertProfile({
          nama: displayName,
          email: cleanEmail,
          role: validRole,
          kelas: validRole === "admin" ? "Administrator" : "Guru BK"
        });
        onLoginSuccess(user);
      } catch (err) {
        setErrorMsg(err.message || "Gagal memverifikasi akun.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-emerald-50 flex flex-col justify-between">
      {/* TOP BAR */}
      <header className="w-full border-b border-pink-200/70 bg-white/85 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Teman<span className="text-pink-600">Sehat</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-100 to-emerald-100 text-pink-700 border border-pink-200">
                Pink & Green Edition
              </span>
            </div>
          </div>

          <button
            onClick={onOpenDbModal}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
              isOnline
                ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                : "bg-pink-50 text-pink-700 border-pink-300 hover:bg-pink-100"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? "bg-emerald-500 animate-pulse" : "bg-pink-500 animate-ping"
              }`}
            />
            <Database className="w-3.5 h-3.5" />
            {isOnline ? "Supabase Cloud Aktif" : "Setup Database Supabase ⚙️"}
          </button>
        </div>
      </header>

      {/* HERO & LOGIN GRID */}
      <main className="flex-1 flex items-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* LEFT COLUMN: BRANDING & QUICK DEMO */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/90 border border-pink-200 text-pink-800 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-pink-600" />
              Platform Psikoedukasi Remaja & Bimbingan Konseling Sekolah
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Bangun Pertemanan yang{" "}
              <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-emerald-500 bg-clip-text text-transparent">
                Sehat, Asertif, dan Saling Menghargai.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Pelajari keterampilan sosial lewat kurikulum <b>S-E-H-A-T</b>, latih pengambilan
              keputusan dalam simulasi kasus nyata, tulis jurnal refleksi pribadi, dan terhubung
              langsung dengan Guru BK secara aman.
            </p>

            {/* 3 PILLAR CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-pink-200/80 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">6 Modul & Simulasi</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Materi ringkas disertai latihan studi kasus pertemanan remaja.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Layanan Guru BK</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Jadwalkan sesi pendampingan konseling dan pantau respon guru.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-pink-200/80 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-100 to-emerald-100 text-pink-700 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Kontrol Penuh Admin</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kelola hak akses pengguna, konten modul, pengaduan, & Supabase.
                </p>
              </div>
            </div>

            {/* 1-CLICK INSTANT DEMO LOGIN */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-emerald-500/10 border border-pink-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-pink-900">
                  ⚡ Akses Demo Instan (1-Klik Langsung Masuk)
                </span>
                <span className="text-xs text-slate-500">Tanpa perlu mengetik</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickDemo("siswa")}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white hover:bg-pink-50 text-slate-800 border border-pink-200 shadow-sm transition-all text-left group"
                >
                  <div>
                    <div className="text-xs font-bold text-pink-600">Role 1</div>
                    <div className="text-sm font-extrabold text-slate-900">Masuk Siswa</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-pink-500 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo("guru")}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-800 border border-emerald-200 shadow-sm transition-all text-left group"
                >
                  <div>
                    <div className="text-xs font-bold text-emerald-600">Role 2</div>
                    <div className="text-sm font-extrabold text-slate-900">Masuk Guru BK</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo("admin")}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white hover:bg-pink-50 text-slate-800 border border-pink-300 shadow-sm transition-all text-left group"
                >
                  <div>
                    <div className="text-xs font-bold text-rose-600">Role 3 (Full)</div>
                    <div className="text-sm font-extrabold text-slate-900">Masuk Admin</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-rose-500 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: AUTH CARD */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border-2 border-pink-200/80 shadow-xl shadow-pink-950/5 p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-slate-900">Masuk ke Portal</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Pilih peran akses di bawah ini untuk memulai sesi:
                </p>
              </div>

              {/* 3 ROLE TABS */}
              <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-pink-50/80 border border-pink-100 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("siswa")}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    roleTab === "siswa"
                      ? "bg-pink-500 text-white shadow-sm"
                      : "text-slate-600 hover:text-pink-600"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Siswa
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("guru")}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    roleTab === "guru"
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "text-slate-600 hover:text-emerald-600"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Guru BK
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("admin")}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    roleTab === "admin"
                      ? "bg-gradient-to-r from-pink-500 to-emerald-500 text-white shadow-sm"
                      : "text-slate-600 hover:text-pink-600"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {roleTab === "siswa" ? (
                  <>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Nama Lengkap / Panggilan
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-pink-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          value={nama}
                          onChange={(e) => setNama(e.target.value)}
                          placeholder="Contoh: Nara Aditya"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Email Siswa
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-pink-400 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="nama@sekolah.id atau gmail.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Kelas
                      </label>
                      <select
                        value={kelas}
                        onChange={(e) => setKelas(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none text-sm bg-white"
                      >
                        <option>Kelas X Merdeka 1</option>
                        <option>Kelas X Merdeka 2</option>
                        <option>Kelas XI MIPA 1</option>
                        <option>Kelas XI MIPA 2</option>
                        <option>Kelas XI IPS 1</option>
                        <option>Kelas XII MIPA 1</option>
                        <option>Kelas XII IPS 1</option>
                      </select>
                    </div>

                    <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={setuju}
                        onChange={(e) => setSetuju(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded text-pink-600 focus:ring-pink-500 accent-pink-500"
                      />
                      <span className="text-xs text-slate-600 leading-relaxed">
                        Saya setuju menggunakan platform ini secara positif. Data jurnal bersifat
                        pribadi dan permohonan konseling hanya dilihat oleh Guru BK.
                      </span>
                    </label>
                  </>
                ) : (
                  <>
                    <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-slate-600">
                      <div className="font-bold text-emerald-900 mb-0.5">
                        {roleTab === "guru"
                          ? "🎓 Portal Guru Bimbingan Konseling"
                          : "👑 Portal Administrator (Full Control)"}
                      </div>
                      <div>
                        Akun default telah terisi otomatis. Anda dapat langsung menekan tombol{" "}
                        <b>Masuk</b> di bawah.
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Email Terdaftar
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="email@temansehat.id"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Kata Sandi
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3.5" />
                        <input
                          type={showPw ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Kata sandi"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw(!showPw)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                        >
                          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                    ⚠️ {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-5 rounded-xl font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                    roleTab === "siswa"
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-pink-500/25"
                      : roleTab === "guru"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/25"
                      : "bg-gradient-to-r from-pink-500 via-rose-500 to-emerald-500 hover:opacity-95 shadow-pink-500/25"
                  }`}
                >
                  {loading ? (
                    "Memproses..."
                  ) : (
                    <>
                      <span>
                        Masuk sebagai{" "}
                        {roleTab === "siswa"
                          ? "Siswa"
                          : roleTab === "guru"
                          ? "Guru BK"
                          : "Administrator"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-pink-200/60 bg-white py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <b>TemanSehat</b> — Platform Psikoedukasi & Bimbingan Konseling Remaja (Next.js +
            Supabase)
          </span>
          <span className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Vercel
            </span>
          </span>
        </div>
      </footer>
    </div>
  );
}
