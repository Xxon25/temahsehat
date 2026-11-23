/**
 * src/lib/supabaseService.js
 * Layanan Database Terpusat (Supabase Cloud + LocalStorage Fail-Safe Fallback)
 * Mendukung 3 Role: Siswa, Guru BK, Admin (Full Control)
 */

import { createClient } from "@supabase/supabase-js";
import { INITIAL_MODUL, INITIAL_SKENARIO } from "../data/contentData";

const STORAGE_KEYS = {
  URL: "TS_NEXT_SUPABASE_URL",
  KEY: "TS_NEXT_SUPABASE_KEY",
  PROFILES: "TS_NEXT_PROFILES",
  PENDAMPINGAN: "TS_NEXT_PENDAMPINGAN",
  PENGADUAN: "TS_NEXT_PENGADUAN",
  JURNAL: "TS_NEXT_JURNAL",
  PROGRESS: "TS_NEXT_PROGRESS",
  MODUL: "TS_NEXT_CUSTOM_MODUL",
  SKENARIO: "TS_NEXT_CUSTOM_SKENARIO",
  CHAT: "TS_NEXT_CHAT_MESSAGES"
};

let supabaseClient = null;
let isCloudConnected = false;

export function getSupabaseConfig() {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (typeof window === "undefined") {
    return { url: envUrl, key: envKey };
  }

  const localUrl = localStorage.getItem(STORAGE_KEYS.URL) || "";
  const localKey = localStorage.getItem(STORAGE_KEYS.KEY) || "";

  return {
    url: localUrl || envUrl,
    key: localKey || envKey
  };
}

export function initSupabase() {
  const { url, key } = getSupabaseConfig();
  if (url && key && !url.includes("your-project") && url.startsWith("http")) {
    try {
      supabaseClient = createClient(url, key);
      isCloudConnected = true;
      return true;
    } catch (err) {
      console.error("[Supabase Init Error]:", err);
      supabaseClient = null;
      isCloudConnected = false;
      return false;
    }
  }
  supabaseClient = null;
  isCloudConnected = false;
  return false;
}

export function saveSupabaseCredentials(url, key) {
  if (typeof window === "undefined") return;
  if (url && key) {
    localStorage.setItem(STORAGE_KEYS.URL, url.trim());
    localStorage.setItem(STORAGE_KEYS.KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEYS.URL);
    localStorage.removeItem(STORAGE_KEYS.KEY);
  }
  initSupabase();
}

export function checkIsOnline() {
  if (!supabaseClient) initSupabase();
  return isCloudConnected && supabaseClient !== null;
}

// ---------------------------------------------------------------------------
// LOCAL STORAGE SEED & HELPERS
// ---------------------------------------------------------------------------
function getLocal(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setLocal(key, data) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("[LocalStorage Error]:", e);
  }
}

export function ensureSeedData() {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) {
    setLocal(STORAGE_KEYS.PROFILES, [
      {
        id: "usr-admin-1",
        email: "admin@temansehat.id",
        nama: "Dr. Hendra Wijaya (Admin Utama)",
        role: "admin",
        kelas: "Administrator",
        created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
        last_active: new Date().toISOString()
      },
      {
        id: "usr-admin-2",
        email: "auliaamaharanii260406@gmail.com",
        nama: "Aulia Maharani",
        role: "admin",
        kelas: "Administrator",
        created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
        last_active: new Date().toISOString()
      },
      {
        id: "usr-guru-1",
        email: "gurubk@temansehat.id",
        nama: "Ibu Rahmawati, S.Pd., Kons.",
        role: "guru",
        kelas: "Koordinator BK",
        created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
        last_active: new Date().toISOString()
      },
      {
        id: "usr-siswa-1",
        email: "dimas@sekolah.id",
        nama: "Dimas Prasetyo",
        role: "siswa",
        kelas: "Kelas XI MIPA 2",
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        last_active: new Date().toISOString()
      },
      {
        id: "usr-siswa-2",
        email: "salsa@sekolah.id",
        nama: "Salsa Nabila Putri",
        role: "siswa",
        kelas: "Kelas XII IPS 1",
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        last_active: new Date().toISOString()
      },
      {
        id: "usr-siswa-3",
        email: "nara@sekolah.id",
        nama: "Nara Aditya",
        role: "siswa",
        kelas: "Kelas X Merdeka 3",
        created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        last_active: new Date().toISOString()
      }
    ]);
  }

  if (!localStorage.getItem(STORAGE_KEYS.PENDAMPINGAN)) {
    setLocal(STORAGE_KEYS.PENDAMPINGAN, [
      {
        id: "pend-101",
        nama_siswa: "Dimas Prasetyo",
        kelas: "Kelas XI MIPA 2",
        topik: "Menegaskan Batasan Diri (Asertif)",
        jadwal_preferensi: "Saat jam istirahat pertama (09.45 WIB)",
        kontak_siswa: "dimas@sekolah.id",
        status: "Menunggu",
        catatan_guru: "",
        created_at: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        id: "pend-102",
        nama_siswa: "Salsa Nabila Putri",
        kelas: "Kelas XII IPS 1",
        topik: "Konflik dengan Teman Sebaya",
        jadwal_preferensi: "Sepulang sekolah (15.00 WIB)",
        kontak_siswa: "salsa@sekolah.id",
        status: "Dijadwalkan",
        catatan_guru: "Halo Salsa, silakan temui Ibu Rahmawati di Ruang Konseling BK 2 pukul 15.00 WIB hari ini ya.",
        created_at: new Date(Date.now() - 3600000 * 22).toISOString()
      },
      {
        id: "pend-103",
        nama_siswa: "Nara Aditya",
        kelas: "Kelas X Merdeka 3",
        topik: "Adaptasi Lingkungan & Pertemanan Baru",
        jadwal_preferensi: "Jam istirahat kedua (12.15 WIB)",
        kontak_siswa: "nara@sekolah.id",
        status: "Selesai",
        catatan_guru: "Sesi konseling berjalan lancar. Nara telah menyusun rencana aksi komunikasi asertif di kelas.",
        created_at: new Date(Date.now() - 3600000 * 48).toISOString()
      }
    ]);
  }

  if (!localStorage.getItem(STORAGE_KEYS.PENGADUAN)) {
    setLocal(STORAGE_KEYS.PENGADUAN, [
      {
        id: "adu-201",
        jenis: "Saran isi",
        isi: "Mohon ditambahkan modul atau simulasi khusus tentang etika pertemanan di grup WhatsApp dan media sosial sekolah.",
        status: "Diproses",
        tanggapan_admin: "Terima kasih atas masukannya! Tim Guru BK dan Admin sedang menyusun skenario ke-7 tentang Etika Digital.",
        created_at: new Date(Date.now() - 3600000 * 14).toISOString()
      },
      {
        id: "adu-202",
        jenis: "Kendala teknis",
        isi: "Fitur cetak Kartu SEHAT sangat membantu untuk ditempel di mading kelas kami.",
        status: "Selesai",
        tanggapan_admin: "Terima kasih atas apresiasinya! Silakan bagikan Kartu SEHAT ke rekan-rekan kelas.",
        created_at: new Date(Date.now() - 3600000 * 50).toISOString()
      }
    ]);
  }

  if (!localStorage.getItem(STORAGE_KEYS.CHAT)) {
    setLocal(STORAGE_KEYS.CHAT, [
      {
        id: "msg-init-1",
        pendampingan_id: "pend-102",
        sender_email: "gurubk@temansehat.id",
        sender_name: "Ibu Rahmawati, S.Pd., Kons.",
        sender_role: "guru",
        pesan: "Halo Salsa, selamat siang! Sesi konseling pertemananmu sudah Ibu jadwalkan pukul 15.00 WIB hari ini di Ruang BK 2 ya. Apakah ada hal yang ingin kamu ceritakan terlebih dahulu di chat ini?",
        created_at: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: "msg-init-2",
        pendampingan_id: "pend-102",
        sender_email: "salsa@sekolah.id",
        sender_name: "Salsa Nabila Putri",
        sender_role: "siswa",
        pesan: "Baik Bu, terima kasih banyak. Nanti jam 3 sore setelah pulang sekolah saya langsung ke ruangan Ibu ya.",
        created_at: new Date(Date.now() - 3600000 * 1.5).toISOString()
      }
    ]);
  }
}

// ---------------------------------------------------------------------------
// 1. MANAJEMEN PROFIL & PENGGUNA (3 ROLE: SISWA, GURU, ADMIN)
// ---------------------------------------------------------------------------
export async function fetchProfiles() {
  ensureSeedData();
  if (checkIsOnline()) {
    try {
      const { data, error } = await supabaseClient
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) return data;
    } catch (err) {
      console.warn("[Supabase fetchProfiles fallback]:", err);
    }
  }
  return getLocal(STORAGE_KEYS.PROFILES, []);
}

export async function upsertProfile(userObj) {
  if (!userObj?.email || !userObj?.nama) {
    throw new Error("Nama dan email wajib diisi.");
  }

  ensureSeedData();
  const cleanEmail = userObj.email.trim().toLowerCase();
  const payload = {
    email: cleanEmail,
    nama: userObj.nama.trim(),
    role: userObj.role || "siswa",
    kelas: userObj.kelas || "Kelas XI",
    last_active: new Date().toISOString()
  };

  if (checkIsOnline()) {
    try {
      const { data, error } = await supabaseClient
        .from("profiles")
        .upsert(payload, { onConflict: "email" })
        .select();
      if (!error && data?.length) return data[0];
    } catch (err) {
      console.warn("[Supabase upsertProfile fallback]:", err);
    }
  }

  const list = getLocal(STORAGE_KEYS.PROFILES, []);
  const idx = list.findIndex((p) => p.email === cleanEmail);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...payload };
    setLocal(STORAGE_KEYS.PROFILES, list);
    return list[idx];
  } else {
    const newUser = {
      id: "usr-" + Date.now(),
      created_at: new Date().toISOString(),
      ...payload
    };
    list.unshift(newUser);
    setLocal(STORAGE_KEYS.PROFILES, list);
    return newUser;
  }
}

export async function changeUserRole(email, newRole) {
  if (!email || !["siswa", "guru", "admin"].includes(newRole)) {
    throw new Error("Parameter role tidak valid.");
  }

  if (checkIsOnline()) {
    try {
      await supabaseClient.from("profiles").update({ role: newRole }).eq("email", email);
    } catch (err) {
      console.warn("[Supabase changeUserRole fallback]:", err);
    }
  }

  const list = getLocal(STORAGE_KEYS.PROFILES, []);
  const updated = list.map((u) => (u.email === email ? { ...u, role: newRole } : u));
  setLocal(STORAGE_KEYS.PROFILES, updated);
  return true;
}

export async function removeUserProfile(email) {
  if (!email) throw new Error("Email wajib diisi.");

  if (checkIsOnline()) {
    try {
      await supabaseClient.from("profiles").delete().eq("email", email);
    } catch (err) {
      console.warn("[Supabase removeUserProfile fallback]:", err);
    }
  }

  const list = getLocal(STORAGE_KEYS.PROFILES, []).filter((u) => u.email !== email);
  setLocal(STORAGE_KEYS.PROFILES, list);
  return true;
}

// ---------------------------------------------------------------------------
// 2. MANAJEMEN PENDAMPINGAN KONSELING GURU BK
// ---------------------------------------------------------------------------
export async function fetchPendampingan() {
  ensureSeedData();
  if (checkIsOnline()) {
    try {
      const { data, error } = await supabaseClient
        .from("pendampingan")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) return data;
    } catch (err) {
      console.warn("[Supabase fetchPendampingan fallback]:", err);
    }
  }
  return getLocal(STORAGE_KEYS.PENDAMPINGAN, []);
}

export async function createPendampinganRequest(form) {
  if (!form?.nama_siswa || !form?.topik) {
    throw new Error("Nama siswa dan topik wajib diisi.");
  }

  const payload = {
    nama_siswa: form.nama_siswa.trim(),
    kelas: form.kelas || "Kelas XI",
    topik: form.topik,
    jadwal_preferensi: form.jadwal_preferensi || "Saat jam istirahat",
    kontak_siswa: form.kontak_siswa || "",
    status: "Menunggu",
    catatan_guru: "",
    created_at: new Date().toISOString()
  };

  if (checkIsOnline()) {
    try {
      const { data, error } = await supabaseClient
        .from("pendampingan")
        .insert([payload])
        .select();
      if (!error && data?.length) return data[0];
    } catch (err) {
      console.warn("[Supabase createPendampingan fallback]:", err);
    }
  }

  const newItem = { id: "pend-" + Date.now(), ...payload };
  const list = getLocal(STORAGE_KEYS.PENDAMPINGAN, []);
  list.unshift(newItem);
  setLocal(STORAGE_KEYS.PENDAMPINGAN, list);
  return newItem;
}

export async function updatePendampinganItem(id, changes) {
  if (!id) throw new Error("ID pendampingan tidak ditemukan.");

  if (checkIsOnline()) {
    try {
      await supabaseClient.from("pendampingan").update(changes).eq("id", id);
    } catch (err) {
      console.warn("[Supabase updatePendampingan fallback]:", err);
    }
  }

  const list = getLocal(STORAGE_KEYS.PENDAMPINGAN, []).map((item) =>
    item.id === id ? { ...item, ...changes } : item
  );
  setLocal(STORAGE_KEYS.PENDAMPINGAN, list);
  return true;
}

export async function deletePendampinganItem(id) {
  if (!id) throw new Error("ID wajib diisi.");

  if (checkIsOnline()) {
    try {
      await supabaseClient.from("pendampingan").delete().eq("id", id);
    } catch (err) {
      console.warn("[Supabase deletePendampingan fallback]:", err);
    }
  }

  const list = getLocal(STORAGE_KEYS.PENDAMPINGAN, []).filter((item) => item.id !== id);
  setLocal(STORAGE_KEYS.PENDAMPINGAN, list);
  return true;
}

// ---------------------------------------------------------------------------
// 3. MANAJEMEN PENGADUAN & ASPIRASI ADMIN
// ---------------------------------------------------------------------------
export async function fetchPengaduan() {
  ensureSeedData();
  if (checkIsOnline()) {
    try {
      const { data, error } = await supabaseClient
        .from("pengaduan")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) return data;
    } catch (err) {
      console.warn("[Supabase fetchPengaduan fallback]:", err);
    }
  }
  return getLocal(STORAGE_KEYS.PENGADUAN, []);
}

export async function createPengaduanItem(form) {
  if (!form?.jenis || !form?.isi) {
    throw new Error("Kategori dan isi pesan wajib diisi.");
  }

  const payload = {
    jenis: form.jenis,
    isi: form.isi.trim(),
    status: "Baru",
    tanggapan_admin: "",
    pengirim_anonim: true,
    created_at: new Date().toISOString()
  };

  if (checkIsOnline()) {
    try {
      const { data, error } = await supabaseClient
        .from("pengaduan")
        .insert([payload])
        .select();
      if (!error && data?.length) return data[0];
    } catch (err) {
      console.warn("[Supabase createPengaduan fallback]:", err);
    }
  }

  const newItem = { id: "adu-" + Date.now(), ...payload };
  const list = getLocal(STORAGE_KEYS.PENGADUAN, []);
  list.unshift(newItem);
  setLocal(STORAGE_KEYS.PENGADUAN, list);
  return newItem;
}

export async function updatePengaduanItem(id, changes) {
  if (!id) throw new Error("ID pengaduan wajib diisi.");

  if (checkIsOnline()) {
    try {
      await supabaseClient.from("pengaduan").update(changes).eq("id", id);
    } catch (err) {
      console.warn("[Supabase updatePengaduan fallback]:", err);
    }
  }

  const list = getLocal(STORAGE_KEYS.PENGADUAN, []).map((item) =>
    item.id === id ? { ...item, ...changes } : item
  );
  setLocal(STORAGE_KEYS.PENGADUAN, list);
  return true;
}

export async function deletePengaduanItem(id) {
  if (!id) throw new Error("ID wajib diisi.");

  if (checkIsOnline()) {
    try {
      await supabaseClient.from("pengaduan").delete().eq("id", id);
    } catch (err) {
      console.warn("[Supabase deletePengaduan fallback]:", err);
    }
  }

  const list = getLocal(STORAGE_KEYS.PENGADUAN, []).filter((item) => item.id !== id);
  setLocal(STORAGE_KEYS.PENGADUAN, list);
  return true;
}

// ---------------------------------------------------------------------------
// 4. JURNAL REFLEKSI & PROGRES BELAJAR SISWA
// ---------------------------------------------------------------------------
export async function fetchJurnalSiswa(email) {
  if (!email) return { q1_perasaan: "", q2_hal_dijaga: "", q3_pesan_aku: "" };

  if (checkIsOnline()) {
    try {
      const { data, error } = await supabaseClient
        .from("jurnal")
        .select("*")
        .eq("email_siswa", email)
        .limit(1);
      if (!error && data?.length) return data[0];
    } catch (err) {
      console.warn("[Supabase fetchJurnal fallback]:", err);
    }
  }

  const all = getLocal(STORAGE_KEYS.JURNAL, {});
  return all[email] || { q1_perasaan: "", q2_hal_dijaga: "", q3_pesan_aku: "" };
}

export async function saveJurnalSiswa(email, payload) {
  if (!email) throw new Error("Email siswa diperlukan.");

  const record = {
    email_siswa: email,
    q1_perasaan: payload.q1_perasaan || "",
    q2_hal_dijaga: payload.q2_hal_dijaga || "",
    q3_pesan_aku: payload.q3_pesan_aku || "",
    updated_at: new Date().toISOString()
  };

  if (checkIsOnline()) {
    try {
      await supabaseClient.from("jurnal").upsert(record, { onConflict: "email_siswa" });
    } catch (err) {
      console.warn("[Supabase saveJurnal fallback]:", err);
    }
  }

  const all = getLocal(STORAGE_KEYS.JURNAL, {});
  all[email] = record;
  setLocal(STORAGE_KEYS.JURNAL, all);
  return record;
}

export async function fetchStudentProgress(email) {
  const defaultProg = {
    modul_selesai: [],
    skenario_selesai: [],
    kartu_dibuka: false,
    jurnal_disimpan: false
  };
  if (!email) return defaultProg;

  if (checkIsOnline()) {
    try {
      const { data, error } = await supabaseClient
        .from("modul_progress")
        .select("*")
        .eq("email_siswa", email)
        .limit(1);
      if (!error && data?.length) return data[0];
    } catch (err) {
      console.warn("[Supabase fetchStudentProgress fallback]:", err);
    }
  }

  const all = getLocal(STORAGE_KEYS.PROGRESS, {});
  return all[email] || defaultProg;
}

export async function saveStudentProgress(email, prog) {
  if (!email) return;

  const record = {
    email_siswa: email,
    modul_selesai: prog.modul_selesai || [],
    skenario_selesai: prog.skenario_selesai || [],
    kartu_dibuka: Boolean(prog.kartu_dibuka),
    jurnal_disimpan: Boolean(prog.jurnal_disimpan),
    updated_at: new Date().toISOString()
  };

  if (checkIsOnline()) {
    try {
      await supabaseClient
        .from("modul_progress")
        .upsert(record, { onConflict: "email_siswa" });
    } catch (err) {
      console.warn("[Supabase saveStudentProgress fallback]:", err);
    }
  }

  const all = getLocal(STORAGE_KEYS.PROGRESS, {});
  all[email] = record;
  setLocal(STORAGE_KEYS.PROGRESS, all);
  return record;
}

// ---------------------------------------------------------------------------
// 5. CMS KONTEN MODUL & SKENARIO (KONTROL PENUH ADMIN)
// ---------------------------------------------------------------------------
export function getCustomModuls() {
  const custom = getLocal(STORAGE_KEYS.MODUL, null);
  return custom && custom.length > 0 ? custom : INITIAL_MODUL;
}

export function saveCustomModuls(list) {
  setLocal(STORAGE_KEYS.MODUL, list);
  return list;
}

export function getCustomSkenarios() {
  const custom = getLocal(STORAGE_KEYS.SKENARIO, null);
  return custom && custom.length > 0 ? custom : INITIAL_SKENARIO;
}

export function saveCustomSkenarios(list) {
  setLocal(STORAGE_KEYS.SKENARIO, list);
  return list;
}

// ---------------------------------------------------------------------------
// 6. LIVE CHAT KONSELING SISWA & GURU BK
// ---------------------------------------------------------------------------
export async function fetchChatMessages(pendampinganId) {
  if (!pendampinganId) return [];
  ensureSeedData();

  if (checkIsOnline()) {
    try {
      const { data, error } = await supabaseClient
        .from("konseling_pesan")
        .select("*")
        .eq("pendampingan_id", String(pendampinganId))
        .order("created_at", { ascending: true });
      if (!error && data) return data;
    } catch (err) {
      console.warn("[Supabase fetchChatMessages fallback]:", err);
    }
  }

  const all = getLocal(STORAGE_KEYS.CHAT, []);
  return all
    .filter((m) => String(m.pendampingan_id) === String(pendampinganId))
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
}

export async function sendChatMessage(msgObj) {
  if (!msgObj?.pendampingan_id || !msgObj?.pesan?.trim()) {
    throw new Error("Pesan tidak boleh kosong.");
  }
  ensureSeedData();

  const payload = {
    id: "msg-" + Date.now(),
    pendampingan_id: String(msgObj.pendampingan_id),
    sender_email: msgObj.sender_email || "",
    sender_name: msgObj.sender_name || "Pengguna",
    sender_role: msgObj.sender_role || "siswa",
    pesan: msgObj.pesan.trim(),
    created_at: new Date().toISOString()
  };

  if (checkIsOnline()) {
    try {
      const { data, error } = await supabaseClient
        .from("konseling_pesan")
        .insert([payload])
        .select();
      if (!error && data?.length) return data[0];
    } catch (err) {
      console.warn("[Supabase sendChatMessage fallback]:", err);
    }
  }

  const all = getLocal(STORAGE_KEYS.CHAT, []);
  all.push(payload);
  setLocal(STORAGE_KEYS.CHAT, all);
  return payload;
}

