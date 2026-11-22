"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Lightbulb,
  PenTool,
  HeartHandshake,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Printer,
  Send,
  Sparkles,
  ShieldAlert,
  MessageCircle,
  Award,
  Save,
  RotateCcw,
  Calendar
} from "lucide-react";

export default function StudentViews({
  activeMenu,
  setActiveMenu,
  user,
  moduls,
  skenarios,
  progress,
  onMarkModulDone,
  onMarkSkenarioDone,
  onMarkKartuOpened,
  jurnal,
  onSaveJurnal,
  pendampinganList,
  onSubmitPendampingan,
  pengaduanList,
  onSubmitPengaduan,
  showToast
}) {
  const [selectedModulIdx, setSelectedModulIdx] = useState(0);
  const [selectedSkenarioIdx, setSelectedSkenarioIdx] = useState(0);
  const [pickedOptionIdx, setPickedOptionIdx] = useState(null);

  const [j1, setJ1] = useState(jurnal?.q1_perasaan || "");
  const [j2, setJ2] = useState(jurnal?.q2_hal_dijaga || "");
  const [j3, setJ3] = useState(jurnal?.q3_pesan_aku || "");

  const [bkNama, setBkNama] = useState(user?.nama || "");
  const [bkKelas, setBkKelas] = useState(user?.kelas || "Kelas XI MIPA 1");
  const [bkTopik, setBkTopik] = useState("Menegaskan Batasan Diri (Asertif)");
  const [bkJadwal, setBkJadwal] = useState("Saat jam istirahat pertama (09.45 WIB)");
  const [bkKontak, setBkKontak] = useState(user?.email || "");

  const [aduJenis, setAduJenis] = useState("Saran isi");
  const [aduIsi, setAduIsi] = useState("");

  const completedModulCount = (progress?.modul_selesai || []).length;
  const completedSkenarioCount = (progress?.skenario_selesai || []).length;
  const totalCompletionPercent = Math.round(
    ((completedModulCount / Math.max(moduls.length, 1)) * 40 +
      (completedSkenarioCount / Math.max(skenarios.length, 1)) * 40 +
      (progress?.kartu_dibuka ? 10 : 0) +
      (progress?.jurnal_disimpan ? 10 : 0))
  );

  const myKonseling = pendampinganList.filter(
    (item) =>
      item.kontak_siswa?.toLowerCase() === user?.email?.toLowerCase() ||
      item.nama_siswa?.toLowerCase() === user?.nama?.toLowerCase()
  );

  // -------------------------------------------------------------------------
  // 1. BERANDA SISWA (PINK & HIJAU THEME)
  // -------------------------------------------------------------------------
  if (activeMenu === "beranda") {
    return (
      <div className="space-y-6">
        {/* HERO WELCOME BANNER PINK-HIJAU */}
        <div className="rounded-3xl bg-gradient-to-r from-pink-500 via-rose-500 to-emerald-500 p-6 sm:p-8 text-white shadow-lg shadow-pink-500/15 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Ruang Belajar Pertemanan Remaja • {user?.kelas || "Siswa"}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Halo, {user?.nama}! 🌸🌿
            </h1>
            <p className="text-pink-50 text-sm sm:text-base leading-relaxed">
              Berteman secara sehat itu keterampilan yang bisa dilatih. Mari pelajari cara
              berkomunikasi asertif, menghargai privasi, dan membangun batas diri yang positif.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveMenu("modul")}
                className="px-5 py-2.5 rounded-xl bg-white text-pink-600 font-bold text-sm shadow-sm hover:bg-pink-50 transition-all inline-flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Mulai Belajar Modul
              </button>
              <button
                onClick={() => setActiveMenu("latihan")}
                className="px-5 py-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white border border-white/30 font-bold text-sm transition-all inline-flex items-center gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                Simulasi Kasus
              </button>
            </div>
          </div>
        </div>

        {/* PROGRESS KPI GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-pink-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Modul SEHAT
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {completedModulCount} / {moduls.length}
              </p>
              <p className="text-xs text-pink-600 font-semibold mt-1">Modul dipelajari</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Simulasi Kasus
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {completedSkenarioCount} / {skenarios.length}
              </p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Skenario diselesaikan</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Lightbulb className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-pink-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Jurnal Refleksi
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {progress?.jurnal_disimpan ? "Tersimpan" : "Belum"}
              </p>
              <p className="text-xs text-rose-600 font-semibold mt-1">Catatan refleksi diri</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <PenTool className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Progres
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {totalCompletionPercent}%
              </p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Capaian belajar</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 to-emerald-100 text-emerald-700 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* TWO COLUMNS: LEARNING ROADMAP & KONSELING STATUS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-3xl border border-pink-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  🎯 Peta Perjalanan Belajarmu
                </h2>
                <p className="text-xs text-slate-500">
                  Ikuti 4 langkah terstruktur di bawah ini untuk hasil optimal:
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 font-bold text-xs">
                {totalCompletionPercent}% Selesai
              </span>
            </div>

            <div className="w-full h-2.5 bg-pink-100/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${totalCompletionPercent}%` }}
              />
            </div>

            <div className="space-y-3 pt-2">
              {[
                {
                  title: "1. Pelajari 6 Modul Prinsip SEHAT",
                  sub: `${completedModulCount} dari ${moduls.length} modul selesai dibaca`,
                  done: completedModulCount >= moduls.length,
                  target: "modul"
                },
                {
                  title: "2. Uji Respons di 6 Simulasi Kasus Nyata",
                  sub: `${completedSkenarioCount} dari ${skenarios.length} skenario telah dicoba`,
                  done: completedSkenarioCount >= skenarios.length,
                  target: "latihan"
                },
                {
                  title: "3. Buka & Simpan Kartu Pedoman SEHAT",
                  sub: progress?.kartu_dibuka ? "Sudah dibuka" : "Belum dibuka",
                  done: Boolean(progress?.kartu_dibuka),
                  target: "kartu"
                },
                {
                  title: "4. Tulis Kalimat 'Pesan Aku' di Jurnal Refleksi",
                  sub: progress?.jurnal_disimpan ? "Jurnal telah tersimpan" : "Belum diisi",
                  done: Boolean(progress?.jurnal_disimpan),
                  target: "jurnal"
                }
              ].map((step, i) => (
                <div
                  key={i}
                  onClick={() => setActiveMenu(step.target)}
                  className="p-4 rounded-2xl border border-pink-100 hover:border-pink-300 hover:bg-pink-50/40 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        step.done
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-pink-100 text-pink-600"
                      }`}
                    >
                      {step.done ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-pink-600">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-500">{step.sub}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: STATUS KONSELING BK & NILAI INTI */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-emerald-600" />
                  Status Konseling Guru BK
                </h3>
                <button
                  onClick={() => setActiveMenu("bantuan")}
                  className="text-xs font-bold text-pink-600 hover:underline"
                >
                  Ajukan Baru →
                </button>
              </div>

              {myKonseling.length === 0 ? (
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 text-xs text-slate-600 space-y-2">
                  <p>Kamu belum memiliki pengajuan jadwal konseling aktif dengan Guru BK.</p>
                  <button
                    onClick={() => setActiveMenu("bantuan")}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs hover:opacity-95 transition-all inline-flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Buat Janji Konseling
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myKonseling.slice(0, 2).map((k) => (
                    <div
                      key={k.id}
                      className="p-4 rounded-2xl border border-pink-100 bg-pink-50/30 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900">{k.topik}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            k.status === "Dijadwalkan"
                              ? "bg-pink-100 text-pink-700"
                              : k.status === "Selesai"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {k.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">Waktu: {k.jadwal_preferensi}</p>
                      {k.catatan_guru && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 mt-1">
                          <b>Pesan Guru BK:</b> {k.catatan_guru}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-pink-50 via-white to-emerald-50 rounded-3xl border border-pink-200 p-6 space-y-2">
              <div className="text-xs font-extrabold uppercase tracking-wider text-pink-700">
                🌸🌿 Komitmen Ruang Aman
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Saling Menghargai & Menjaga Batas Diri
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Platform ini dirancang sebagai media psikoedukasi pertemanan yang sehat. Jika kamu
                atau temanmu mengalami perundungan (bullying) atau krisis darurat, segera hubungi
                Guru BK secara langsung.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // 2. MODUL PEMBELAJARAN SEHAT
  // -------------------------------------------------------------------------
  if (activeMenu === "modul") {
    const activeModul = moduls[selectedModulIdx] || moduls[0];
    const isCompleted = (progress?.modul_selesai || []).includes(selectedModulIdx);

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-pink-600">
              Kurikulum Psikoedukasi S-E-H-A-T
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Modul Keterampilan Pertemanan
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white px-4 py-2 rounded-xl border border-pink-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>
              {completedModulCount} dari {moduls.length} Modul Selesai
            </span>
          </div>
        </div>

        {/* MODULE SELECTOR PILLS / CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {moduls.map((m, idx) => {
            const done = (progress?.modul_selesai || []).includes(idx);
            const active = idx === selectedModulIdx;
            return (
              <button
                key={m.id || idx}
                onClick={() => setSelectedModulIdx(idx)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                  active
                    ? "bg-gradient-to-br from-pink-500 to-rose-500 text-white border-pink-500 shadow-md shadow-pink-500/20"
                    : "bg-white text-slate-800 border-pink-200/80 hover:border-pink-400"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                      active ? "bg-white/20 text-white" : "bg-pink-100 text-pink-700"
                    }`}
                  >
                    0{idx + 1} • {m.kode}
                  </span>
                  {done && (
                    <CheckCircle2
                      className={`w-4 h-4 ${active ? "text-emerald-200" : "text-emerald-500"}`}
                    />
                  )}
                </div>
                <div className="text-xs font-bold line-clamp-2 leading-snug">{m.judul}</div>
              </button>
            );
          })}
        </div>

        {/* ACTIVE MODULE READER CARD */}
        <div className="bg-white rounded-3xl border border-pink-200/90 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-pink-50 via-white to-emerald-50 p-6 sm:p-8 border-b border-pink-200/70">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-emerald-500 text-white text-xs font-extrabold">
                Modul 0{selectedModulIdx + 1} • Prinsip {activeModul.kode}
              </span>
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Estimasi baca: {activeModul.durasi || "4 Menit"}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {activeModul.judul}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">{activeModul.ringkasan}</p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <h3 className="text-base font-extrabold text-slate-900">📖 Penjelasan Materi</h3>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                {activeModul.deskripsi}
              </p>
            </div>

            {activeModul.poinUtama && (
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2.5">
                <h4 className="text-sm font-extrabold text-emerald-950">
                  🌿 Poin Kunci yang Perlu Diingat:
                </h4>
                <ul className="space-y-2">
                  {activeModul.poinUtama.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeModul.dialog && (
              <div className="p-5 rounded-2xl bg-pink-50/60 border border-pink-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-pink-950 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-pink-600" />
                    Contoh Dialog Nyata
                  </h4>
                  <span className="text-xs text-pink-700 font-medium">
                    Situasi: {activeModul.dialog.situasi}
                  </span>
                </div>
                <div className="space-y-2.5 pt-1">
                  {activeModul.dialog.percakapan.map((chat, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl text-sm ${
                        idx % 2 === 0
                          ? "bg-white border border-pink-200 text-slate-800 mr-6"
                          : "bg-gradient-to-r from-pink-500 to-rose-500 text-white ml-6"
                      }`}
                    >
                      <div
                        className={`text-xs font-extrabold mb-0.5 ${
                          idx % 2 === 0 ? "text-pink-600" : "text-pink-100"
                        }`}
                      >
                        {chat.pelaku}
                      </div>
                      <div>“{chat.teks}”</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-50 to-emerald-50 border border-emerald-200 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-emerald-500 text-white flex items-center justify-center shrink-0 font-bold">
                🎯
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  Tantangan Praktik Hari Ini
                </h4>
                <p className="text-sm text-slate-700 mt-0.5">{activeModul.tantangan}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                disabled={selectedModulIdx === 0}
                onClick={() => setSelectedModulIdx(Math.max(0, selectedModulIdx - 1))}
                className="px-4 py-2.5 rounded-xl border border-pink-200 text-slate-700 font-bold text-sm hover:bg-pink-50 disabled:opacity-40 inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Modul Sebelumnya
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onMarkModulDone(selectedModulIdx)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm inline-flex items-center gap-2 transition-all ${
                    isCompleted
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isCompleted ? "Sudah Dipahami" : "Tandai Selesai Dibaca"}
                </button>

                {selectedModulIdx < moduls.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      onMarkModulDone(selectedModulIdx);
                      setSelectedModulIdx(selectedModulIdx + 1);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm shadow-sm inline-flex items-center gap-2"
                  >
                    <span>Modul Berikutnya</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onMarkModulDone(selectedModulIdx);
                      setActiveMenu("latihan");
                    }}
                    className="px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm shadow-sm inline-flex items-center gap-2"
                  >
                    <span>Lanjut ke Simulasi Kasus</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // 3. SIMULASI KASUS (ROLEPLAY INTERAKTIF)
  // -------------------------------------------------------------------------
  if (activeMenu === "latihan") {
    const activeSk = skenarios[selectedSkenarioIdx] || skenarios[0];
    const pickedObj = pickedOptionIdx !== null ? activeSk.opsi[pickedOptionIdx] : null;

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">
              Laboratorium Keputusan Sosial
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Simulasi Kasus Pertemanan
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white px-4 py-2 rounded-xl border border-emerald-200">
            <Lightbulb className="w-4 h-4 text-pink-500" />
            <span>
              {completedSkenarioCount} dari {skenarios.length} Skenario Dicoba
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs sm:text-sm text-pink-950">
            <ShieldAlert className="w-5 h-5 text-pink-600 shrink-0" />
            <span>
              <b>Catatan Keselamatan:</b> Seluruh tokoh di bawah ini adalah rekaan untuk latihan.
              Jika kamu mengalami ancaman nyata, langsung gunakan menu <b>Konseling Guru BK</b>.
            </span>
          </div>
          <button
            onClick={() => setActiveMenu("bantuan")}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-pink-600 text-white font-bold text-xs hover:bg-pink-700"
          >
            Bantuan BK
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-2.5">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-1">
              Daftar 6 Skenario Kasus
            </div>
            {skenarios.map((sk, idx) => {
              const done = (progress?.skenario_selesai || []).includes(idx);
              const isCurrent = idx === selectedSkenarioIdx;
              return (
                <button
                  key={sk.id || idx}
                  onClick={() => {
                    setSelectedSkenarioIdx(idx);
                    setPickedOptionIdx(null);
                  }}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
                    isCurrent
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-500 shadow-md"
                      : "bg-white text-slate-800 border-pink-200/80 hover:border-pink-400"
                  }`}
                >
                  <div>
                    <div
                      className={`text-[11px] font-bold uppercase ${
                        isCurrent ? "text-pink-100" : "text-slate-400"
                      }`}
                    >
                      Skenario 0{idx + 1} • {sk.kategori}
                    </div>
                    <div className="text-sm font-extrabold mt-0.5">{sk.judul}</div>
                  </div>
                  {done && (
                    <CheckCircle2
                      className={`w-5 h-5 shrink-0 ${
                        isCurrent ? "text-emerald-200" : "text-emerald-500"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-pink-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-pink-100 pb-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                    Studi Kasus 0{selectedSkenarioIdx + 1}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                    {activeSk.judul}
                  </h2>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-lg bg-pink-50 text-pink-700">
                  Level: {activeSk.tingkat || "Menengah"}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-pink-50/40 border border-pink-200/70 space-y-3">
                <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
                  {activeSk.cerita}
                </p>
                <div className="pt-2 border-t border-pink-200/60 text-sm font-extrabold text-pink-900">
                  ❓ {activeSk.pertanyaan}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Pilih Respons yang Menurutmu Paling Tepat:
                </div>
                {activeSk.opsi.map((op, opIdx) => {
                  const isSelected = pickedOptionIdx === opIdx;
                  return (
                    <button
                      key={opIdx}
                      type="button"
                      onClick={() => {
                        setPickedOptionIdx(opIdx);
                        onMarkSkenarioDone(selectedSkenarioIdx);
                      }}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? op.skor === "ok"
                            ? "border-emerald-500 bg-emerald-50/70"
                            : "border-pink-500 bg-pink-50/70"
                          : "border-slate-200 hover:border-pink-400 bg-white"
                      }`}
                    >
                      <span
                        className={`w-8 h-8 rounded-xl font-extrabold text-sm flex items-center justify-center shrink-0 ${
                          isSelected
                            ? op.skor === "ok"
                              ? "bg-emerald-600 text-white"
                              : "bg-pink-600 text-white"
                            : "bg-pink-50 text-pink-700"
                        }`}
                      >
                        {op.label}
                      </span>
                      <span className="text-sm font-semibold text-slate-800 pt-1">{op.teks}</span>
                    </button>
                  );
                })}
              </div>

              {pickedObj && (
                <div
                  className={`p-6 rounded-2xl border-2 space-y-3 transition-all ${
                    pickedObj.skor === "ok"
                      ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                      : "bg-pink-50 border-pink-300 text-pink-950"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-white/80">
                      {pickedObj.skor === "ok"
                        ? "✅ Respons Sehat & Asertif"
                        : "⚠️ Evaluasi Respons"}
                    </span>
                    <span className="text-xs font-bold">Kategori: {pickedObj.jenis}</span>
                  </div>
                  <p className="text-sm leading-relaxed">
                    <b>Dampak Relasi:</b> {pickedObj.dampak}
                  </p>
                  <div className="p-3.5 rounded-xl bg-white/80 text-xs sm:text-sm">
                    <b>💡 Intisari Pembelajaran:</b> {pickedObj.pelajaran}
                  </div>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setPickedOptionIdx(null)}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100"
                    >
                      Coba Pilihan Lain
                    </button>
                    {selectedSkenarioIdx < skenarios.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSkenarioIdx(selectedSkenarioIdx + 1);
                          setPickedOptionIdx(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-pink-500 text-white font-bold text-xs hover:bg-pink-600 inline-flex items-center gap-1.5"
                      >
                        <span>Skenario Berikutnya</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveMenu("jurnal")}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 inline-flex items-center gap-1.5"
                      >
                        <span>Refleksikan di Jurnal</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // 4. KARTU PEDOMAN SEHAT
  // -------------------------------------------------------------------------
  if (activeMenu === "kartu") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-pink-600">
              Ringkasan Satu Halaman
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Kartu Pedoman S-E-H-A-T
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onMarkKartuOpened();
                window.print();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-emerald-500 hover:opacity-95 text-white font-bold text-sm shadow-sm inline-flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Cetak / Simpan PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border-2 border-pink-400 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-emerald-500 p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-widest text-pink-100">
                TEMANSEHAT • PANDUAN SAKU PERTEMANAN REMAJA
              </div>
              <h2 className="text-3xl font-extrabold mt-1">KARTU PRINSIP S-E-H-A-T</h2>
              <p className="text-pink-50 text-sm mt-1">
                Lima pengingat harian untuk membangun relasi pertemanan yang aman, setara, dan
                saling menghormati.
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-black shrink-0">
              🌸🌿
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-4">
            {[
              {
                letter: "S",
                title: "Sapa dan Komunikasi Asertif",
                desc: "Mulai percakapan dengan ramah, dengarkan secara aktif tanpa menyela, dan tanyakan langsung dengan lembut bila ada kesalahpahaman.",
                color: "bg-pink-100 text-pink-700 border-pink-200"
              },
              {
                letter: "E",
                title: "Empati dan Validasi Perasaan",
                desc: "Pahami sudut pandang dan emosi teman sebelum memberikan nasihat. Hindari meremehkan kesedihan teman.",
                color: "bg-emerald-100 text-emerald-700 border-emerald-200"
              },
              {
                letter: "H",
                title: "Hati Terbuka & Batas Privasi",
                desc: "Berbagi cerita secara bijak sesuai lingkaran kepercayaan. Jaga kerahasiaan pribadi dirimu maupun cerita yang dipercayakan teman.",
                color: "bg-rose-100 text-rose-700 border-rose-200"
              },
              {
                letter: "A",
                title: "Andal dan Saling Percaya",
                desc: "Tepati janji-janji kecil, jujur saat berhalangan, dan bangun integritas antara ucapan di depan maupun di belakang teman.",
                color: "bg-teal-100 text-teal-800 border-teal-200"
              },
              {
                letter: "T",
                title: "Topang dan Rujukan Bantuan",
                desc: "Hadir mendukung teman di masa sulit, dan segera libatkan Guru BK atau orang dewasa tepercaya bila menyangkut keselamatan diri.",
                color: "bg-pink-100 text-pink-700 border-pink-200"
              }
            ].map((row, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-pink-100 flex items-start gap-4 bg-pink-50/30"
              >
                <div
                  className={`w-12 h-12 rounded-2xl border font-black text-xl flex items-center justify-center shrink-0 ${row.color}`}
                >
                  {row.letter}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{row.title}</h3>
                  <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">{row.desc}</p>
                </div>
              </div>
            ))}

            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
              <div className="text-sm font-extrabold flex items-center gap-2">
                🛡️ Formula Menegaskan Batas Diri (Pesan Aku / I-Message):
              </div>
              <p className="text-sm">
                <i>
                  “Aku merasa <b>[sebutkan perasaanmu]</b> ketika <b>[sebutkan perilaku teman]</b>.
                  Aku berharap ke depannya kita bisa <b>[sebutkan batasan yang diinginkan]</b>.”
                </i>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // 5. JURNAL REFLEKSI PRIBADI SISWA
  // -------------------------------------------------------------------------
  if (activeMenu === "jurnal") {
    return (
      <div className="space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-pink-600">
            Refleksi & Kesadaran Diri
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Jurnal Refleksi Pribadi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tuliskan pemikiranmu setelah mempelajari modul dan simulasi kasus. Kamu tidak perlu
            menulis nama asli orang lain jika bersifat sensitif.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-pink-200/80 p-6 sm:p-8 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-extrabold text-slate-900 mb-2">
              1. Apa perasaan atau pelajaran terpenting yang kamu dapatkan setelah mempelajari
              situasi pertemanan hari ini?
            </label>
            <textarea
              rows={3}
              value={j1}
              onChange={(e) => setJ1(e.target.value)}
              placeholder="Contoh: Saya menyadari bahwa selama ini saya sering sungkan menolak permintaan teman meskipun saya sedang keberatan..."
              className="w-full p-4 rounded-2xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-extrabold text-slate-900 mb-2">
              2. Nilai atau batasan apa yang paling perlu kamu jaga agar pertemananmu tetap sehat?
            </label>
            <textarea
              rows={3}
              value={j2}
              onChange={(e) => setJ2(e.target.value)}
              placeholder="Contoh: Menjaga rahasia teman, tidak ikut menyindir di media sosial, dan menghargai waktu belajar..."
              className="w-full p-4 rounded-2xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-extrabold text-slate-900 mb-2">
              3. Susunlah satu kalimat “Pesan Aku” (I-Message) yang bisa kamu gunakan saat merasa
              tidak nyaman:
            </label>
            <textarea
              rows={3}
              value={j3}
              onChange={(e) => setJ3(e.target.value)}
              placeholder="Contoh: 'Aku merasa kurang nyaman kalau barangku dipakai tanpa izin. Tolong tanya aku dulu ya sebelum meminjam.'"
              className="w-full p-4 rounded-2xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none text-sm"
            />
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setJ1("");
                setJ2("");
                setJ3("");
                onSaveJurnal({ q1_perasaan: "", q2_hal_dijaga: "", q3_pesan_aku: "" }, false);
              }}
              className="px-4 py-2.5 rounded-xl border border-rose-300 text-rose-600 font-bold text-sm hover:bg-rose-50 inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Bersihkan Jurnal
            </button>

            <button
              type="button"
              onClick={() =>
                onSaveJurnal(
                  {
                    q1_perasaan: j1,
                    q2_hal_dijaga: j2,
                    q3_pesan_aku: j3
                  },
                  true
                )
              }
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-emerald-500 hover:opacity-95 text-white font-bold text-sm shadow-md inline-flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Simpan Jurnal Refleksi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // 6. LAYANAN KONSELING GURU BK
  // -------------------------------------------------------------------------
  if (activeMenu === "bantuan") {
    const handleSendBk = (e) => {
      e.preventDefault();
      onSubmitPendampingan({
        nama_siswa: bkNama || user?.nama || "Siswa",
        kelas: bkKelas,
        topik: bkTopik,
        jadwal_preferensi: bkJadwal,
        kontak_siswa: bkKontak || user?.email || ""
      });
    };

    return (
      <div className="space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">
            Layanan Pendampingan Sekolah
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Jalur Bantuan & Konseling Guru BK
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kamu tidak harus menghadapi masalah pertemanan sendirian. Jadwalkan sesi bimbingan
            dengan Guru BK sekolah.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-pink-50 border border-pink-200 text-pink-950 flex items-start gap-3.5">
          <ShieldAlert className="w-6 h-6 text-pink-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <b>Penting — Kondisi Darurat:</b> Apabila kamu menghadapi kekerasan fisik, ancaman
            keselamatan, atau keinginan menyakiti diri, segera temui Guru BK, wali kelas, orang tua,
            atau hubungi layanan darurat <b>112</b>.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-3xl border border-emerald-200/80 p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900 mb-1">
              📅 Formulir Permohonan Konseling
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Data ini dikirim langsung ke dasbor Guru BK untuk dijadwalkan.
            </p>

            <form onSubmit={handleSendBk} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Nama Siswa
                </label>
                <input
                  type="text"
                  required
                  value={bkNama}
                  onChange={(e) => setBkNama(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-sm outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Kelas
                  </label>
                  <select
                    value={bkKelas}
                    onChange={(e) => setBkKelas(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-sm bg-white outline-none focus:border-pink-500"
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
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Waktu Preferensi
                  </label>
                  <select
                    value={bkJadwal}
                    onChange={(e) => setBkJadwal(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-sm bg-white outline-none focus:border-pink-500"
                  >
                    <option>Saat jam istirahat pertama (09.45 WIB)</option>
                    <option>Jam istirahat kedua (12.15 WIB)</option>
                    <option>Sepulang sekolah (15.00 WIB)</option>
                    <option>Menyesuaikan jadwal Guru BK</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Topik Pembahasan
                </label>
                <select
                  value={bkTopik}
                  onChange={(e) => setBkTopik(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-sm bg-white outline-none focus:border-pink-500"
                >
                  <option>Menegaskan Batasan Diri (Asertif)</option>
                  <option>Konflik dengan Teman Sebaya</option>
                  <option>Adaptasi Lingkungan & Pertemanan Baru</option>
                  <option>Tekanan Kelompok (Peer Pressure)</option>
                  <option>Konsultasi Pribadi Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Email / Kontak Siswa
                </label>
                <input
                  type="text"
                  value={bkKontak}
                  onChange={(e) => setBkKontak(e.target.value)}
                  placeholder="Email atau Nomor WA untuk dihubungi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-sm outline-none focus:border-pink-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-md inline-flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Kirim Permohonan Konseling BK
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 bg-white rounded-3xl border border-pink-200/80 p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900">
              📋 Status & Balasan Jadwal Konseling
            </h2>
            <p className="text-xs text-slate-500">
              Pantau apakah permohonanmu sudah dijadwalkan oleh Guru BK:
            </p>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {pendampinganList.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-pink-100 bg-pink-50/30 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-sm font-extrabold text-slate-900">
                        {item.nama_siswa}{" "}
                        <span className="text-xs font-medium text-slate-500">({item.kelas})</span>
                      </span>
                      <div className="text-xs font-bold text-pink-600 mt-0.5">{item.topik}</div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
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
                  <div className="text-xs text-slate-500">
                    Preferensi Waktu: {item.jadwal_preferensi}
                  </div>
                  {item.catatan_guru && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                      <b className="block mb-0.5">🎓 Tanggapan Guru BK:</b>
                      {item.catatan_guru}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // 7. PENGADUAN & MASUKAN KE ADMIN
  // -------------------------------------------------------------------------
  if (activeMenu === "pengaduan") {
    const handleSendAdu = (e) => {
      e.preventDefault();
      if (aduIsi.trim().length < 5) {
        showToast("Tuliskan isi masukan minimal 5 karakter.");
        return;
      }
      onSubmitPengaduan({
        jenis: aduJenis,
        isi: aduIsi.trim()
      });
      setAduIsi("");
    };

    return (
      <div className="space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-pink-600">
            Suara Pengguna
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Kotak Aspirasi, Saran & Kendala Teknis
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Sampaikan usulan pengembangan modul atau laporkan kendala teknis kepada Administrator
            TemanSehat.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-3xl border border-pink-200/80 p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900 mb-4">
              📮 Kirim Masukan Baru
            </h2>
            <form onSubmit={handleSendAdu} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Kategori Masukan
                </label>
                <select
                  value={aduJenis}
                  onChange={(e) => setAduJenis(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-sm bg-white outline-none focus:border-pink-500"
                >
                  <option>Saran isi</option>
                  <option>Kendala teknis</option>
                  <option>Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Pesan / Detail Masukan
                </label>
                <textarea
                  rows={4}
                  required
                  value={aduIsi}
                  onChange={(e) => setAduIsi(e.target.value)}
                  placeholder="Tuliskan saran topik modul baru atau kendala penggunaan aplikasi..."
                  className="w-full p-3.5 rounded-xl border border-pink-200 text-sm outline-none focus:border-pink-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm shadow-md inline-flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Kirim ke Administrator
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900">
              💬 Daftar Masukan & Tanggapan Admin
            </h2>
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {pengaduanList.map((ad) => (
                <div
                  key={ad.id}
                  className="p-4 rounded-2xl border border-pink-100 bg-pink-50/30 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-pink-700">
                      {ad.jenis}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
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
                  <p className="text-sm text-slate-800">{ad.isi}</p>
                  {ad.tanggapan_admin && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                      <b className="block mb-0.5">👑 Tanggapan Admin:</b>
                      {ad.tanggapan_admin}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
