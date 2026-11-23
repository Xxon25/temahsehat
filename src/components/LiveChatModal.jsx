"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  Send,
  GraduationCap,
  Sparkles,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ArrowLeft
} from "lucide-react";

export default function LiveChatModal({
  isOpen,
  onClose,
  session,
  currentUser,
  fetchChatMessages,
  sendChatMessage,
  showToast
}) {
  const [messages, setMessages] = useState([]);
  const [inputPesan, setInputPesan] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load chat & set polling
  useEffect(() => {
    if (!isOpen || !session?.id) return;

    let isMounted = true;
    const load = async () => {
      try {
        const data = await fetchChatMessages(session.id);
        if (isMounted) {
          setMessages(data || []);
        }
      } catch (e) {
        console.error("Gagal memuat pesan live chat:", e);
      }
    };

    load();
    const interval = setInterval(load, 2500); // Polling setiap 2.5 detik untuk live sync

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isOpen, session?.id, fetchChatMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle ESC key to go back / close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !session) return null;

  const handleSend = async (e) => {
    e?.preventDefault?.();
    if (!inputPesan.trim() || loading) return;

    const textToSend = inputPesan.trim();
    setInputPesan("");
    setLoading(true);

    try {
      const newMsg = await sendChatMessage({
        pendampingan_id: session.id,
        sender_email: currentUser?.email || "anon@temansehat.id",
        sender_name: currentUser?.nama || (currentUser?.role === "siswa" ? session.nama_siswa : "Guru BK"),
        sender_role: currentUser?.role || "siswa",
        pesan: textToSend
      });
      setMessages((prev) => [...prev, newMsg]);
      scrollToBottom();
    } catch (err) {
      showToast("Gagal mengirim pesan: " + (err.message || "Error jaringan"));
    } finally {
      setLoading(false);
    }
  };

  // Quick chips
  const quickChips =
    currentUser?.role === "siswa"
      ? [
          "Baik Bu, terima kasih banyak.",
          "Apakah jadwal pertemuannya sudah pasti?",
          "Saya sudah di depan Ruang BK ya Bu.",
          "Boleh izin konsultasi berdua saja?"
        ]
      : [
          "Silakan langsung ke Ruang BK Lantai 2 ya.",
          "Halo, apakah ada yang ingin kamu ceritakan terlebih dahulu?",
          "Tenang saja, seluruh ceritamu di sini aman dan rahasia.",
          "Apakah waktu tersebut cocok untukmu?"
        ];

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 no-print animate-fadeIn"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[90vh] max-h-[680px] shadow-2xl border-2 border-pink-200 flex flex-col overflow-hidden">
        {/* HEADER MODAL LIVE CHAT DENGAN TOMBOL KEMBALI JELAS */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-emerald-500 p-3.5 sm:p-5 text-white flex items-center justify-between shrink-0 shadow-sm gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* TOMBOL KEMBALI DI HEADER */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0 active:scale-95"
              title="Kembali ke halaman utama"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
              <span className="hidden sm:inline">Kembali</span>
            </button>

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-inner">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base tracking-tight truncate">
                  Live Chat Konseling BK
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/20 text-white shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  Online
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-pink-50 truncate max-w-[170px] sm:max-w-md">
                Siswa: <b>{session.nama_siswa}</b> ({session.kelas}) • Topik: {session.topik}
              </p>
            </div>
          </div>

          {/* TOMBOL TUTUP DI KANAN */}
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-black/15 hover:bg-black/25 text-white text-xs font-bold flex items-center gap-1 transition-all shrink-0 active:scale-95"
            title="Tutup Chat"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Tutup</span>
          </button>
        </div>

        {/* INFO BAR SESI KONSELING */}
        <div className="px-5 py-2.5 bg-gradient-to-r from-pink-50 to-emerald-50 border-b border-pink-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-pink-600" />
            <span>Jadwal: <b>{session.jadwal_preferensi}</b></span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                session.status === "Dijadwalkan"
                  ? "bg-pink-100 text-pink-800"
                  : session.status === "Selesai"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {session.status}
            </span>
          </div>
          {session.catatan_guru && (
            <div className="text-[11px] text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 truncate max-w-sm">
              <b>Catatan BK:</b> {session.catatan_guru}
            </div>
          )}
        </div>

        {/* CHAT MESSAGES BODY */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 bg-slate-50/60">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-700 text-sm">Ruang Chat Konseling Terbuka</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Belum ada percakapan. Kirimkan pesan atau sapaan pertama untuk memulai sesi
                pendampingan langsung ini.
              </p>
            </div>
          ) : (
            messages.map((m) => {
              const isMe =
                m.sender_email?.toLowerCase() === currentUser?.email?.toLowerCase() ||
                (currentUser?.role === "siswa" && m.sender_role === "siswa") ||
                (currentUser?.role === "guru" && m.sender_role === "guru");

              const isGuru = m.sender_role === "guru";
              const isAdmin = m.sender_role === "admin";

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"} space-y-1`}
                >
                  <div className="flex items-center gap-1.5 px-1 text-[11px] font-bold text-slate-500">
                    {isGuru ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" /> Guru BK ({m.sender_name})
                      </span>
                    ) : isAdmin ? (
                      <span className="text-rose-700 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Admin ({m.sender_name})
                      </span>
                    ) : (
                      <span className="text-pink-700">🌸 Siswa ({m.sender_name})</span>
                    )}
                    <span className="text-[10px] text-slate-400">
                      • {new Date(m.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      isMe
                        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-tr-none"
                        : isGuru
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-tl-none"
                        : "bg-white border border-pink-200 text-slate-800 rounded-tl-none"
                    }`}
                  >
                    {m.pesan}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* QUICK SUGGESTIONS CHIPS */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 shrink-0">
            Balas Cepat:
          </span>
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInputPesan(chip)}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-pink-100 hover:text-pink-700 text-slate-600 font-medium shrink-0 transition-all border border-slate-200"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* INPUT PESAN FOOTER */}
        <form
          onSubmit={handleSend}
          className="p-3 sm:p-4 bg-white border-t border-pink-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputPesan}
            onChange={(e) => setInputPesan(e.target.value)}
            placeholder={`Ketik pesan konseling sebagai ${
              currentUser?.role === "siswa" ? "Siswa" : "Guru BK"
            }...`}
            className="flex-1 px-4 py-2.5 rounded-2xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none text-sm"
          />
          <button
            type="submit"
            disabled={!inputPesan.trim() || loading}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-emerald-500 hover:opacity-95 disabled:opacity-40 text-white font-bold text-sm shadow-md inline-flex items-center gap-1.5 transition-all shrink-0"
          >
            <span>Kirim</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
