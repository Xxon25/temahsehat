"use client";

import React, { useState } from "react";
import {
  HeartHandshake,
  GraduationCap,
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Lock,
  Mail,
  User,
  Database,
  Eye,
  EyeOff,
  UserPlus,
  LogIn
} from "lucide-react";
import { loginWithCredentials } from "../lib/supabaseService";

export default function AuthPortal({
  onLoginSuccess,
  isOnline,
  onOpenDbModal,
  upsertProfile
}) {
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'register'

  // State Form Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);

  // State Form Register
  const [regNama, setRegNama] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regKelas, setRegKelas] = useState("Kelas XI MIPA 1");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPw, setShowRegPw] = useState(false);
  const [setuju, setSetuju] = useState(true);

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // ── SUBMIT LOGIN (AUTO-ROUTING KE ROLE ADMIN / GURU BK / SISWA) ─────────
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const email = loginEmail.trim();
    const password = loginPassword.trim();

    if (!email || !password) {
      setErrorMsg("Harap masukkan email dan kata sandi Anda.");
      return;
    }

    setLoading(true);
    try {
      const user = await loginWithCredentials(email, password);
      onLoginSuccess(user);
    } catch (err) {
      setErrorMsg(err.message || "Gagal masuk. Periksa kembali email dan kata sandi Anda.");
    } finally {
      setLoading(false);
    }
  };

  // ── SUBMIT REGISTER (DAFTAR AKUN SISWA BARU) ───────────────────────────
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const nama = regNama.trim();
    const email = regEmail.trim().toLowerCase();
    const password = regPassword.trim();

    if (nama.length < 2) {
      setErrorMsg("Harap isi nama lengkap Anda (minimal 2 karakter).");
      return;
    }
    if (!email.includes("@")) {
      setErrorMsg("Harap masukkan alamat email yang valid.");
      return;
    }
    if (password.length < 5) {
      setErrorMsg("Kata sandi minimal 5 karakter demi keamanan akun.");
      return;
    }
    if (!setuju) {
      setErrorMsg("Harap centang persetujuan layanan sebelum mendaftar.");
      return;
    }

    setLoading(true);
    try {
      const user = await upsertProfile({
        nama,
        email,
        role: "siswa",
        kelas: regKelas,
        password_hash: password
      });
      onLoginSuccess(user);
    } catch (err) {
      setErrorMsg(err.message || "Gagal mendaftarkan akun. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-emerald-50 flex flex-col justify-between">
      {/* TOP HEADER */}
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
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700">
                Next.js + Supabase
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenDbModal}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isOnline
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : "bg-pink-100 text-pink-800 border border-pink-200"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isOnline ? "Supabase Cloud Aktif" : "Setup Supabase ⚙️"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN HERO & AUTH SECTION */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* LEFT COLUMN: HERO INFORMATION */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/80 border border-pink-200 text-pink-800 text-xs font-extrabold">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
              Platform Edukasi Remaja & Bimbingan Konseling
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Membangun Pertemanan yang{" "}
              <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-emerald-600 bg-clip-text text-transparent">
                Sehat, Asertif, dan Saling Menghargai.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Pelajari keterampilan sosial lewat kurikulum <b>S-E-H-A-T</b>, latih pengambilan
              keputusan dalam simulasi kasus nyata, tulis jurnal refleksi pribadi, dan terhubung
              langsung dengan Guru BK secara aman via Live Chat.
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
                <h3 className="font-bold text-slate-900 text-sm">Portal Guru BK</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Jadwalkan konseling dan dampingi siswa lewat Live Chat realtime.
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
          </div>

          {/* RIGHT COLUMN: UNIFIED AUTH CARD (MASUK / DAFTAR) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border-2 border-pink-200/80 shadow-xl shadow-pink-950/5 p-6 sm:p-8">
              
              {/* AUTH TABS: MASUK vs DAFTAR */}
              <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-pink-50/80 border border-pink-100 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setErrorMsg("");
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-bold transition-all ${
                    authMode === "login"
                      ? "bg-gradient-to-r from-pink-500 to-emerald-500 text-white shadow-sm"
                      : "text-slate-600 hover:text-pink-600"
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  Masuk
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("register");
                    setErrorMsg("");
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-bold transition-all ${
                    authMode === "register"
                      ? "bg-gradient-to-r from-pink-500 to-emerald-500 text-white shadow-sm"
                      : "text-slate-600 hover:text-pink-600"
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Daftar Baru
                </button>
              </div>

              {/* FORM MASUK (LOGIN) */}
              {authMode === "login" ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="mb-2">
                    <h2 className="text-xl font-extrabold text-slate-900">Masuk ke Akun</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Sistem akan mendeteksi peran Anda secara otomatis (Siswa, Guru BK, atau Admin).
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Terdaftar
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-pink-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="contoh: email@sekolah.id atau admin@temansehat.id"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Kata Sandi
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-pink-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showLoginPw ? "text" : "password"}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Masukkan kata sandi akun Anda"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPw(!showLoginPw)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showLoginPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                      ⚠️ {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-5 rounded-xl font-bold text-white shadow-md bg-gradient-to-r from-pink-500 via-rose-500 to-emerald-500 hover:opacity-95 shadow-pink-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? "Memverifikasi Akun..." : (
                      <>
                        <span>Masuk Sekarang</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center text-xs text-slate-500">
                    Belum memiliki akun siswa?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("register");
                        setErrorMsg("");
                      }}
                      className="text-pink-600 font-bold hover:underline"
                    >
                      Daftar di sini
                    </button>
                  </div>
                </form>
              ) : (
                /* FORM DAFTAR (REGISTER SISWA) */
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="mb-2">
                    <h2 className="text-xl font-extrabold text-slate-900">Daftar Akun Siswa</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Buat akun baru untuk mengakses modul SEHAT dan konseling BK.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Nama Lengkap Siswa
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={regNama}
                        onChange={(e) => setRegNama(e.target.value)}
                        placeholder="Contoh: Salsa Nabila Putri"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Siswa
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="salsa@sekolah.id atau gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Kelas
                    </label>
                    <select
                      value={regKelas}
                      onChange={(e) => setRegKelas(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm bg-white"
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

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Buat Kata Sandi
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3.5" />
                      <input
                        type={showRegPw ? "text" : "password"}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Minimal 5 karakter"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPw(!showRegPw)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showRegPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={setuju}
                      onChange={(e) => setSetuju(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-500"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      Saya setuju menggunakan platform ini secara positif. Data jurnal bersifat
                      pribadi dan permohonan konseling hanya dilihat oleh Guru BK.
                    </span>
                  </label>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                      ⚠️ {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-5 rounded-xl font-bold text-white shadow-md bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? "Mendaftarkan Akun..." : (
                      <>
                        <span>Daftar Akun Siswa</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center text-xs text-slate-500">
                    Sudah memiliki akun?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("login");
                        setErrorMsg("");
                      }}
                      className="text-emerald-700 font-bold hover:underline"
                    >
                      Masuk di sini
                    </button>
                  </div>
                </form>
              )}
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
