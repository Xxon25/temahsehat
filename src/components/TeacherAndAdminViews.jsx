"use client";

import React, { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Trash2,
  MessageSquare,
  Plus,
  Search,
  ShieldCheck,
  GraduationCap,
  Database,
  RefreshCw,
  UserPlus,
  Share2,
  Copy
} from "lucide-react";

export default function TeacherAndAdminViews({
  activeMenu,
  user,
  profiles,
  pendampinganList,
  pengaduanList,
  moduls,
  onUpdatePendampingan,
  onDeletePendampingan,
  onUpdateUserRole,
  onAddUser,
  onDeleteUser,
  onUpdatePengaduan,
  onDeletePengaduan,
  onAddCustomModul,
  onResetCustomModuls,
  onOpenDbModal,
  onOpenChat,
  showToast,
  isOnline
}) {
  const [bkTab, setBkTab] = useState("konseling");
  const [bkFilter, setBkFilter] = useState("Semua");
  const [bkSearch, setBkSearch] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteText, setNoteText] = useState("");

  const [adminSubTab, setAdminSubTab] = useState("users");
  const [userSearch, setUserSearch] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserKelas, setNewUserKelas] = useState("Kelas XI MIPA 1");
  const [newUserRole, setNewUserRole] = useState("siswa");

  const [replyingAduanId, setReplyingAduanId] = useState(null);
  const [replyAduanText, setReplyAduanText] = useState("");

  const [modKode, setModKode] = useState("PLUS");
  const [modJudul, setModJudul] = useState("");
  const [modRingkasan, setModRingkasan] = useState("");
  const [modDeskripsi, setModDeskripsi] = useState("");
  const [modTantangan, setModTantangan] = useState("");

  const statTotalBk = pendampinganList.length;
  const statMenungguBk = pendampinganList.filter((x) => x.status === "Menunggu").length;
  const statJadwalBk = pendampinganList.filter((x) => x.status === "Dijadwalkan").length;
  const statSelesaiBk = pendampinganList.filter((x) => x.status === "Selesai").length;

  const siswaProfiles = profiles.filter((p) => p.role === "siswa");
  const guruProfiles = profiles.filter((p) => p.role === "guru");

  // -------------------------------------------------------------------------
  // 1. PORTAL GURU BK (HIJAU & PINK THEME)
  // -------------------------------------------------------------------------
  if (activeMenu === "guru") {
    const filteredBk = pendampinganList.filter((item) => {
      const matchStatus = bkFilter === "Semua" || item.status === bkFilter;
      const q = bkSearch.toLowerCase();
      const matchQuery =
        !q ||
        item.nama_siswa?.toLowerCase().includes(q) ||
        item.kelas?.toLowerCase().includes(q) ||
        item.topik?.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });

    return (
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-500 to-pink-500 p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-2">
              <GraduationCap className="w-4 h-4" />
              Portal Bimbingan & Konseling (Guru BK)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Dasbor Pelayanan Konseling Siswa
            </h1>
            <p className="text-emerald-50 text-sm mt-1">
              Kelola jadwal pendampingan siswa, berikan catatan lokasi/jam temu, dan pantau siswa
              aktif.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setBkTab("konseling")}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                bkTab === "konseling"
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "bg-white/15 text-white hover:bg-white/25"
              }`}
            >
              📅 Antrean Konseling ({statTotalBk})
            </button>
            <button
              onClick={() => setBkTab("siswa")}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                bkTab === "siswa"
                  ? "bg-white text-pink-700 shadow-sm"
                  : "bg-white/15 text-white hover:bg-white/25"
              }`}
            >
              👥 Direktori Siswa ({siswaProfiles.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-pink-200/80 shadow-sm">
            <div className="text-xs font-bold uppercase text-slate-400">Total Permohonan</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{statTotalBk}</div>
            <div className="text-xs text-slate-500 mt-1">Seluruh pengajuan masuk</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-pink-200 shadow-sm">
            <div className="text-xs font-bold uppercase text-pink-600">Menunggu Respon</div>
            <div className="text-3xl font-extrabold text-pink-600 mt-1">{statMenungguBk}</div>
            <div className="text-xs text-slate-500 mt-1">Perlu segera dijadwalkan</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm">
            <div className="text-xs font-bold uppercase text-emerald-600">Terjadwal</div>
            <div className="text-3xl font-extrabold text-emerald-600 mt-1">{statJadwalBk}</div>
            <div className="text-xs text-slate-500 mt-1">Menunggu sesi tatap muka</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-teal-200 shadow-sm">
            <div className="text-xs font-bold uppercase text-teal-600">Selesai</div>
            <div className="text-3xl font-extrabold text-teal-600 mt-1">{statSelesaiBk}</div>
            <div className="text-xs text-slate-500 mt-1">Pendampingan tuntas</div>
          </div>
        </div>

        {bkTab === "konseling" ? (
          <div className="bg-white rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-1.5 bg-pink-50/80 p-1.5 rounded-2xl border border-pink-100">
                {["Semua", "Menunggu", "Dijadwalkan", "Selesai"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setBkFilter(st)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      bkFilter === st
                        ? "bg-gradient-to-r from-pink-500 to-emerald-500 text-white shadow-sm"
                        : "text-slate-600 hover:text-pink-600"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-pink-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={bkSearch}
                  onChange={(e) => setBkSearch(e.target.value)}
                  placeholder="Cari nama siswa, kelas, topik..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-pink-200 text-xs outline-none focus:border-pink-500"
                />
              </div>
            </div>

            {filteredBk.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-500">
                Tidak ada data permohonan konseling yang sesuai filter.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBk.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl border border-pink-100 hover:border-emerald-300 transition-all bg-pink-50/20 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-slate-900">
                            {item.nama_siswa}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-md bg-pink-100 text-pink-700 font-bold text-xs">
                            {item.kelas}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Kontak: {item.kontak_siswa || "-"} • Waktu Harapan:{" "}
                          <b>{item.jadwal_preferensi}</b>
                        </p>
                      </div>

                      <span
                        className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-extrabold ${
                          item.status === "Dijadwalkan"
                            ? "bg-pink-100 text-pink-700"
                            : item.status === "Selesai"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-pink-100 text-xs sm:text-sm">
                      <span className="font-bold text-slate-700">Topik Konseling: </span>
                      <span className="font-semibold text-pink-600">{item.topik}</span>
                    </div>

                    {item.catatan_guru && (
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950">
                        <b>📝 Catatan Jadwal / Pesan Guru BK:</b> {item.catatan_guru}
                      </div>
                    )}

                    {editingNoteId === item.id && (
                      <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 space-y-3">
                        <label className="block text-xs font-extrabold text-pink-900">
                          Tulis Pesan Jadwal & Lokasi Pertemuan untuk {item.nama_siswa}:
                        </label>
                        <textarea
                          rows={2}
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Contoh: Silakan temui Ibu di Ruang BK Lantai 2 saat jam istirahat pukul 09.45 WIB ya."
                          className="w-full p-3 rounded-xl border border-pink-300 text-xs sm:text-sm outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onUpdatePendampingan(item.id, {
                                status: "Dijadwalkan",
                                catatan_guru: noteText
                              });
                              setEditingNoteId(null);
                            }}
                            className="px-4 py-2 rounded-xl bg-pink-600 text-white font-bold text-xs hover:bg-pink-700"
                          >
                            Simpan & Jadwalkan
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingNoteId(null)}
                            className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-600 font-bold text-xs"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onOpenChat && onOpenChat(item)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-emerald-500 hover:opacity-95 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Live Chat Siswa
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingNoteId(item.id);
                          setNoteText(
                            item.catatan_guru ||
                              `Halo ${item.nama_siswa}, silakan datang ke Ruang Konseling BK sesuai jadwal preferensimu (${item.jadwal_preferensi}).`
                          );
                        }}
                        className="px-3.5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs inline-flex items-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        {item.catatan_guru ? "Ubah Jadwal / Pesan" : "Terima & Jadwalkan"}
                      </button>

                      {item.status !== "Selesai" && (
                        <button
                          type="button"
                          onClick={() =>
                            onUpdatePendampingan(item.id, {
                              status: "Selesai"
                            })
                          }
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Tandai Selesai
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onDeletePendampingan(item.id)}
                        className="px-3.5 py-2 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 font-bold text-xs inline-flex items-center gap-1.5 ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-pink-200/80 p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900">
              👥 Daftar Siswa Terdaftar di TemanSehat
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {siswaProfiles.map((s) => (
                <div
                  key={s.id || s.email}
                  className="p-4 rounded-2xl border border-pink-200 flex items-center justify-between bg-pink-50/30"
                >
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm">{s.nama}</div>
                    <div className="text-xs text-slate-500">{s.email}</div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs">
                    {s.kelas || "Siswa"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // 2. PUSAT KONTROL ADMIN (PINK & HIJAU SUPERUSER THEME)
  // -------------------------------------------------------------------------
  if (activeMenu === "admin") {
    // PROTEKSI AKSES: Hanya role admin yang diizinkan
    if (user?.role !== "admin") {
      return (
        <div className="p-8 max-w-lg mx-auto my-12 bg-white rounded-3xl border-2 border-rose-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Akses Terbatas: Wajib Login Administrator</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Halaman Pusat Kontrol Admin tidak dapat dibuka secara langsung via tautan atau oleh pengguna non-admin. Anda harus login menggunakan akun Administrator yang sah terlebih dahulu.
          </p>
          <div className="pt-2">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              Peran Akun Anda: <b className="text-pink-600 uppercase">{user?.role || "Belum Login"}</b>
            </span>
          </div>
        </div>
      );
    }

    const filteredUsers = profiles.filter((u) => {
      const q = userSearch.toLowerCase();
      return (
        !q ||
        u.nama?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q)
      );
    });

    const handleCreateUser = (e) => {
      e.preventDefault();
      if (!newUserName.trim() || !newUserEmail.includes("@")) return;
      onAddUser({
        nama: newUserName.trim(),
        email: newUserEmail.trim().toLowerCase(),
        kelas: newUserKelas,
        role: newUserRole
      });
      setNewUserName("");
      setNewUserEmail("");
    };

    const handleCreateModul = (e) => {
      e.preventDefault();
      if (!modJudul.trim() || !modDeskripsi.trim()) return;
      onAddCustomModul({
        id: "mod-" + Date.now(),
        kode: modKode.trim().toUpperCase() || "PLUS",
        judul: modJudul.trim(),
        kategori: "Modul Tambahan Admin",
        durasi: "5 Menit",
        ringkasan: modRingkasan.trim() || modJudul.trim(),
        deskripsi: modDeskripsi.trim(),
        poinUtama: [
          "Praktikkan komunikasi yang jujur dan saling menghormati.",
          "Hubungi Guru BK jika membutuhkan pendampingan lebih lanjut."
        ],
        tantangan:
          modTantangan.trim() || "Bagikan pelajaran dari modul ini kepada satu teman baikmu."
      });
      setModJudul("");
      setModRingkasan("");
      setModDeskripsi("");
      setModTantangan("");
    };

    return (
      <div className="space-y-6">
        {/* ADMIN SUPERUSER BANNER PINK-HIJAU */}
        <div className="rounded-3xl bg-gradient-to-r from-pink-600 via-rose-500 to-emerald-600 p-6 sm:p-8 text-white shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold mb-2">
              <ShieldCheck className="w-4 h-4" />
              Superuser Access • Full System Control
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Pusat Kontrol Administrator TemanSehat 🌸🌿
            </h1>
            <p className="text-pink-50 text-sm mt-1">
              Kendali penuh atas seluruh akun pengguna, promosi Role (Siswa / Guru BK / Admin),
              jadwal konseling, pengaduan, hingga kurikulum modul.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenDbModal}
              className="self-start lg:self-auto px-4 py-2.5 rounded-xl bg-white text-pink-700 hover:bg-pink-50 font-bold text-xs sm:text-sm inline-flex items-center gap-2 shrink-0 shadow-md"
            >
              <Database className="w-4 h-4 text-emerald-600" />
              {isOnline ? "Supabase Cloud Terhubung" : "Setup Database Supabase ⚙️"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-pink-200/90 shadow-sm">
            <div className="text-xs font-bold uppercase text-slate-400">Total Akun</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{profiles.length}</div>
            <div className="text-xs text-pink-600 font-semibold mt-1">
              {siswaProfiles.length} Siswa • {guruProfiles.length} Guru BK
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-emerald-200/90 shadow-sm">
            <div className="text-xs font-bold uppercase text-slate-400">Sesi Konseling BK</div>
            <div className="text-3xl font-extrabold text-emerald-600 mt-1">
              {pendampinganList.length}
            </div>
            <div className="text-xs text-slate-500 mt-1">{statMenungguBk} menunggu jadwal</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-pink-200/90 shadow-sm">
            <div className="text-xs font-bold uppercase text-slate-400">Pengaduan & Saran</div>
            <div className="text-3xl font-extrabold text-rose-600 mt-1">
              {pengaduanList.length}
            </div>
            <div className="text-xs text-slate-500 mt-1">Kotak aspirasi pengguna</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-emerald-200/90 shadow-sm">
            <div className="text-xs font-bold uppercase text-slate-400">Modul Aktif</div>
            <div className="text-3xl font-extrabold text-teal-600 mt-1">{moduls.length}</div>
            <div className="text-xs text-slate-500 mt-1">Kurikulum psikoedukasi</div>
          </div>
        </div>

        {/* ADMIN SUB-NAVIGATION TABS */}
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-pink-200 shadow-sm">
          {[
            { id: "users", label: "👥 Manajemen Pengguna & Role", count: profiles.length },
            { id: "konseling", label: "📅 Kontrol Konseling BK", count: pendampinganList.length },
            { id: "pengaduan", label: "📮 Kotak Pengaduan & Masukan", count: pengaduanList.length },
            { id: "cms", label: "📚 Kelola Konten Modul (CMS)", count: moduls.length }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setAdminSubTab(t.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                adminSubTab === t.id
                  ? "bg-gradient-to-r from-pink-500 to-emerald-500 text-white shadow-sm"
                  : "text-slate-600 hover:bg-pink-50"
              }`}
            >
              <span>{t.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] ${
                  adminSubTab === t.id ? "bg-white/20 text-white" : "bg-pink-100 text-pink-700"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* SUB-TAB 1: MANAJEMEN PENGGUNA & HAK AKSES ROLE */}
        {adminSubTab === "users" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 bg-white rounded-3xl border border-pink-200/90 p-6 shadow-sm h-fit">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 mb-1">
                <UserPlus className="w-5 h-5 text-pink-600" />
                Tambah Akun Pengguna Baru
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Daftarkan akun Siswa, Guru BK, atau Admin baru secara langsung.
              </p>

              <form onSubmit={handleCreateUser} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Nama lengkap"
                    className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-sm outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="user@sekolah.id"
                    className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-sm outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Kelas / Jabatan
                  </label>
                  <input
                    type="text"
                    value={newUserKelas}
                    onChange={(e) => setNewUserKelas(e.target.value)}
                    placeholder="Kelas XI / Guru BK"
                    className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-sm outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Peran (Role Akses)
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-sm bg-white outline-none focus:border-pink-500"
                  >
                    <option value="siswa">🎒 Siswa</option>
                    <option value="guru">🎓 Guru BK</option>
                    <option value="admin">👑 Admin (Full Control)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-emerald-500 hover:opacity-95 text-white font-bold text-sm shadow-sm inline-flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Simpan Akun Baru
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 bg-white rounded-3xl border border-emerald-200/90 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Daftar Seluruh Pengguna ({filteredUsers.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ubah dropdown role di sebelah kanan untuk mempromosikan Siswa menjadi Guru BK
                    atau Admin.
                  </p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-pink-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Cari nama atau email..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-pink-200 text-xs outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                {filteredUsers.map((u) => {
                  const isSelf = u.email === user?.email;
                  return (
                    <div
                      key={u.id || u.email}
                      className="p-4 rounded-2xl border border-pink-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-pink-50/20 hover:bg-white transition-all"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">{u.nama}</span>
                          {isSelf && (
                            <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-bold text-[10px]">
                              Anda
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">
                          {u.email} • <b>{u.kelas || "-"}</b>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={u.role}
                          onChange={(e) => onUpdateUserRole(u.email, e.target.value)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold outline-none ${
                            u.role === "admin"
                              ? "bg-rose-100 text-rose-800 border-rose-300"
                              : u.role === "guru"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : "bg-pink-50 text-pink-800 border-pink-300"
                          }`}
                        >
                          <option value="siswa">🎒 Role: Siswa</option>
                          <option value="guru">🎓 Role: Guru BK</option>
                          <option value="admin">👑 Role: Admin</option>
                        </select>

                        {!isSelf && (
                          <button
                            type="button"
                            onClick={() => onDeleteUser(u.email)}
                            className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50"
                            title="Hapus Pengguna"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: KONTROL SEMUA KONSELING BK */}
        {adminSubTab === "konseling" && (
          <div className="bg-white rounded-3xl border border-pink-200/90 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900">
              📅 Manajemen Seluruh Jadwal Konseling BK
            </h3>
            <div className="space-y-3">
              {pendampinganList.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-pink-100 bg-pink-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">
                        {item.nama_siswa} ({item.kelas})
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          item.status === "Dijadwalkan"
                            ? "bg-pink-100 text-pink-700"
                            : item.status === "Selesai"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-pink-700">
                      Topik: {item.topik} • Waktu: {item.jadwal_preferensi}
                    </div>
                    {item.catatan_guru && (
                      <div className="text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                        <b>Catatan BK:</b> {item.catatan_guru}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onOpenChat && onOpenChat(item)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-emerald-500 hover:opacity-95 text-white font-bold text-xs inline-flex items-center gap-1 shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Live Chat
                    </button>
                    <select
                      value={item.status}
                      onChange={(e) =>
                        onUpdatePendampingan(item.id, { status: e.target.value })
                      }
                      className="px-3 py-1.5 rounded-xl border border-pink-200 text-xs font-bold bg-white"
                    >
                      <option value="Menunggu">Menunggu</option>
                      <option value="Dijadwalkan">Dijadwalkan</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                    <button
                      onClick={() => onDeletePendampingan(item.id)}
                      className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-TAB 3: KOTAK PENGADUAN & MASUKAN */}
        {adminSubTab === "pengaduan" && (
          <div className="bg-white rounded-3xl border border-pink-200/90 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900">
              📮 Manajemen Kotak Pengaduan & Masukan Pengguna
            </h3>
            {pengaduanList.length === 0 ? (
              <p className="text-sm text-slate-500">Belum ada pengaduan atau masukan.</p>
            ) : (
              <div className="space-y-4">
                {pengaduanList.map((ad) => (
                  <div
                    key={ad.id}
                    className="p-5 rounded-2xl border border-pink-100 bg-pink-50/20 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-800 font-extrabold text-xs">
                        Kategori: {ad.jenis}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                          ad.status === "Selesai"
                            ? "bg-emerald-100 text-emerald-700"
                            : ad.status === "Diproses"
                            ? "bg-pink-100 text-pink-700"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {ad.status}
                      </span>
                    </div>

                    <p className="text-sm text-slate-800 font-medium">{ad.isi}</p>

                    {ad.tanggapan_admin && (
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                        <b>👑 Tanggapan Resmi Admin:</b> {ad.tanggapan_admin}
                      </div>
                    )}

                    {replyingAduanId === ad.id && (
                      <div className="p-4 rounded-2xl bg-white border border-pink-300 space-y-2.5">
                        <label className="block text-xs font-extrabold text-slate-700">
                          Tulis Balasan / Tindak Lanjut Admin:
                        </label>
                        <textarea
                          rows={2}
                          value={replyAduanText}
                          onChange={(e) => setReplyAduanText(e.target.value)}
                          placeholder="Tulis balasan untuk masukan ini..."
                          className="w-full p-2.5 rounded-xl border border-pink-200 text-xs outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onUpdatePengaduan(ad.id, {
                                status: "Diproses",
                                tanggapan_admin: replyAduanText
                              });
                              setReplyingAduanId(null);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-pink-600 text-white font-bold text-xs"
                          >
                            Simpan Tanggapan
                          </button>
                          <button
                            type="button"
                            onClick={() => setReplyingAduanId(null)}
                            className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setReplyingAduanId(ad.id);
                          setReplyAduanText(ad.tanggapan_admin || "");
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs inline-flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Beri Tanggapan
                      </button>

                      {ad.status !== "Selesai" && (
                        <button
                          type="button"
                          onClick={() => onUpdatePengaduan(ad.id, { status: "Selesai" })}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Tandai Selesai
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onDeletePengaduan(ad.id)}
                        className="px-3.5 py-1.5 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 font-bold text-xs ml-auto"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUB-TAB 4: CMS KURIKULUM MODUL */}
        {adminSubTab === "cms" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white rounded-3xl border border-pink-200/90 p-6 shadow-sm h-fit">
              <h3 className="text-base font-extrabold text-slate-900 mb-1">
                ➕ Tambah Modul Pembelajaran Baru
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Modul yang ditambahkan akan langsung muncul di halaman belajar seluruh Siswa.
              </p>

              <form onSubmit={handleCreateModul} className="space-y-3.5">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Kode
                    </label>
                    <input
                      type="text"
                      value={modKode}
                      onChange={(e) => setModKode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Judul Modul
                    </label>
                    <input
                      type="text"
                      required
                      value={modJudul}
                      onChange={(e) => setModJudul(e.target.value)}
                      placeholder="Etika Pertemanan Digital"
                      className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Ringkasan Singkat
                  </label>
                  <input
                    type="text"
                    value={modRingkasan}
                    onChange={(e) => setModRingkasan(e.target.value)}
                    placeholder="Bijak berkomentar dan menjaga privasi di grup chat"
                    className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Isi Penjelasan Materi
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={modDeskripsi}
                    onChange={(e) => setModDeskripsi(e.target.value)}
                    placeholder="Tuliskan penjelasan lengkap modul..."
                    className="w-full p-3 rounded-xl border border-pink-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Tantangan Praktik Siswa
                  </label>
                  <input
                    type="text"
                    value={modTantangan}
                    onChange={(e) => setModTantangan(e.target.value)}
                    placeholder="Tulis komentar positif di karya temanmu hari ini."
                    className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-emerald-500 hover:opacity-95 text-white font-bold text-sm"
                >
                  + Publikasikan Modul
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white rounded-3xl border border-emerald-200/90 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900">
                  📚 Daftar Modul Kurikulum Aktif ({moduls.length})
                </h3>
                <button
                  onClick={onResetCustomModuls}
                  className="px-3 py-1.5 rounded-xl border border-pink-200 text-pink-700 hover:bg-pink-50 text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset ke Default (6 Modul)
                </button>
              </div>

              <div className="space-y-2.5">
                {moduls.map((m, idx) => (
                  <div
                    key={m.id || idx}
                    className="p-4 rounded-2xl border border-pink-100 bg-pink-50/20 flex items-start justify-between gap-3"
                  >
                    <div>
                      <span className="px-2.5 py-0.5 rounded-md bg-pink-100 text-pink-700 font-extrabold text-xs">
                        Modul 0{idx + 1} • {m.kode}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-1">{m.judul}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{m.ringkasan}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
