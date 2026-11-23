"use client";

import React, { useState } from "react";
import {
  HeartHandshake,
  GraduationCap,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Smile,
  ShieldAlert,
  ChevronRight
} from "lucide-react";
import { loginWithCredentials } from "../lib/supabaseService";

const PROTOTYPE_PREVIEWS = [
  {
    id: "modul-1",
    tag: "Modul 01",
    title: "Mengenali Emosi & Nilai Diri",
    desc: "Pahami apa yang kamu rasakan, akui emosimu tanpa rasa malu, dan kenali potensi kebaikan dalam dirimu.",
    highlight: "Kunci: Kamu berharga apa adanya, bukan karena validasi orang lain.",
    action: "Latihan: Skala Suasana Hati Harian"
  },
  {
    id: "modul-2",
    tag: "Modul 02",
    title: "Menegaskan Batasan Diri (Boundaries)",
    desc: "Belajar menetapkan batasan yang sehat dalam pertemanan. Katakan 'TIDAK' pada hal yang merugikan dirimu.",
    highlight: "Kunci: Menolak hal negatif bukan berarti kamu teman yang jahat.",
    action: "Simulasi: Menolak diajak bolos / menyontek"
  },
  {
    id: "modul-3",
    tag: "Modul 03",
    title: "Komunikasi Asertif Tanpa Menyakiti",
    desc: "Sampaikan perasaan dan pendapatmu secara jujur, tegas, namun tetap santun dan saling menghargai.",
    highlight: "Kunci: Gunakan kalimat 'Saya merasa...' daripada menyalahkan.",
    action: "Studi Kasus: Menyelesaikan salah paham teman"
  },
  {
    id: "modul-4",
    tag: "Modul 04",
    title: "Tangkal Bullying & Sindiran Online",
    desc: "Kenali tanda perundungan terselubung di medsos dan ketahui langkah tepat untuk mencari pertolongan.",
    highlight: "Kunci: Jangan hadapi sendirian, laporkan ke Guru BK yang siap membantu.",
    action: "Fitur: Tombol Pengaduan Rahasia"
  }
];

export default function AuthPortal({
  onLoginSuccess,
  isOnline,
  upsertProfile
}) {
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'register'
  const [activePreviewIdx, setActivePreviewIdx] = useState(0);

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
      setErrorMsg("Harap masukkan email dan kata sandi akun Anda.");
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

  const currentPreview = PROTOTYPE_PREVIEWS[activePreviewIdx];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/70 via-white to-emerald-50/70 flex flex-col justify-between">
      {/* TOP HEADER */}
      <header className="w-full border-b border-pink-100 bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                Teman<span className="text-pink-600">Sehat</span>
              </span>
              <p className="hidden sm:block text-[11px] text-slate-500 font-medium -mt-0.5">
                Layanan Bimbingan Konseling & Psikoedukasi Ramah Remaja
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Ruang Konseling Aman & Rahasia</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN HERO & AUTH SECTION */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* LEFT COLUMN: HERO INFORMATION & PROTOTYPE PREVIEW */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/80 border border-pink-200 text-pink-800 text-xs font-extrabold">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              Ruang Aman Remaja Sekolah
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Tempat Nyaman untuk Bercerita, Belajar{" "}
              <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-emerald-600 bg-clip-text text-transparent">
                Pertemanan Sehat,
              </span>{" "}
              dan Berkembang.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              Platform interaktif bagi siswa untuk mengasah kecerdasan sosial, menetapkan batasan
              pribadi secara asertif, serta berkonsultasi privat bersama Guru BK melalui Live Chat
              tanpa rasa cemas atau dihakimi.
            </p>

            {/* INTERACTIVE PROTOTYPE PREVIEW CARD */}
            <div className="rounded-3xl bg-white border-2 border-pink-200/90 p-5 shadow-lg shadow-pink-950/5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-pink-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center font-black text-xs">
                    💡
                  </div>
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-wider text-pink-900">
                      Pratinjau Materi Kurikulum S-E-H-A-T
                    </h2>
                    <p className="text-[11px] text-slate-500">Klik modul untuk melihat contoh topik pembelajaran:</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Interaktif
                </span>
              </div>

              {/* CHIP SELECTOR MODUL */}
              <div className="flex flex-wrap gap-1.5">
                {PROTOTYPE_PREVIEWS.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActivePreviewIdx(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activePreviewIdx === idx
                        ? "bg-gradient-to-r from-pink-500 to-emerald-500 text-white shadow-sm scale-102"
                        : "bg-pink-50/70 text-slate-700 hover:bg-pink-100/70"
                    }`}
                  >
                    {p.tag}
                  </button>
                ))}
              </div>

              {/* CARD PREVIEW CONTENT */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50/50 via-white to-emerald-50/50 border border-pink-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-pink-600 uppercase tracking-wider">
                    {currentPreview.tag}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {currentPreview.action}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {currentPreview.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentPreview.desc}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200/80">
                  <Smile className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{currentPreview.highlight}</span>
                </div>
              </div>
            </div>

            {/* 3 CORE PILLARS OVERVIEW */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
              <div className="p-4 rounded-2xl bg-white border border-pink-200 shadow-xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">6 Modul & Kasus</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Studi kasus nyata menghadapi perundungan dan tekanan teman.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Live Chat Guru BK</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Konsultasi 1-on-1 privat real-time langsung bersama Guru BK.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-pink-200 shadow-xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Privasi & Keamanan</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Catatan jurnal dan curhat terlindungi penuh dengan akun terotentikasi.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: UNIFIED AUTH CARD (MASUK / DAFTAR) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border-2 border-pink-200 shadow-2xl shadow-pink-950/10 p-6 sm:p-8">
              
              {/* AUTH TABS: MASUK vs DAFTAR */}
              <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-pink-50/80 border border-pink-100 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setErrorMsg("");
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-black transition-all ${
                    authMode === "login"
                      ? "bg-gradient-to-r from-pink-500 to-emerald-500 text-white shadow-md shadow-pink-500/20"
                      : "text-slate-600 hover:text-pink-600"
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  Masuk Akun
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("register");
                    setErrorMsg("");
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-black transition-all ${
                    authMode === "register"
                      ? "bg-gradient-to-r from-pink-500 to-emerald-500 text-white shadow-md shadow-pink-500/20"
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
                    <h2 className="text-xl font-extrabold text-slate-900">Selamat Datang Kembali</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Masukkan email dan kata sandi. Sistem otomatis mendeteksi apakah Anda Siswa, Guru BK, atau Admin.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Akun
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-pink-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="contoh: nama@sekolah.id atau gurubk@temansehat.id"
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
                        title={showLoginPw ? "Sembunyikan sandi" : "Lihat sandi"}
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
                    className="w-full py-3 px-5 rounded-xl font-bold text-white shadow-md bg-gradient-to-r from-pink-500 via-rose-500 to-emerald-500 hover:opacity-95 shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? "Memverifikasi Akun..." : (
                      <>
                        <span>Masuk ke TemanSehat</span>
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
                      Daftar akun siswa di sini
                    </button>
                  </div>
                </form>
              ) : (
                /* FORM DAFTAR (REGISTER SISWA) */
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="mb-2">
                    <h2 className="text-xl font-extrabold text-slate-900">Daftar Akun Siswa Baru</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Buat akun pribadi untuk mulai belajar modul pertemanan dan mengakses pendampingan BK.
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
                      Alamat Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="salsa@sekolah.id atau email pribadimu"
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
                      Buat Kata Sandi Akun
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
                        title={showRegPw ? "Sembunyikan sandi" : "Lihat sandi"}
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
                      Saya setuju menggunakan platform ini untuk tujuan positif. Jurnal dan chat konseling bersifat privat bersama Guru BK.
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
                    className="w-full py-3 px-5 rounded-xl font-bold text-white shadow-md bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? "Mendaftarkan Akun..." : (
                      <>
                        <span>Daftar Akun Siswa Baru</span>
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

      {/* FOOTER EDUKASI SEKOLAH RESMI */}
      <footer className="border-t border-pink-100 bg-white/95 py-5 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">TemanSehat</span>
            <span>—</span>
            <span>Layanan Bimbingan Konseling & Psikoedukasi Ramah Remaja Sekolah</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-600">
            <span className="flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" /> Kerahasiaan Terjamin
            </span>
            <span>•</span>
            <span>Didampingi Guru BK</span>
            <span>•</span>
            <span>Terbuka untuk Seluruh Siswa</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
