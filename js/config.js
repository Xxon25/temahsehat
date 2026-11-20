/**
 * js/config.js - Konfigurasi Aplikasi & Kredensial Supabase
 * Mendukung pembacaan dari localStorage (dapat diubah langsung via UI Admin/Koneksi)
 * atau fallback default.
 */

window.TEMAN_CONFIG = (function() {
  // Ambil dari localStorage jika sebelumnya pernah diset via UI
  var storedUrl = localStorage.getItem('TS_SUPABASE_URL') || '';
  var storedKey = localStorage.getItem('TS_SUPABASE_KEY') || '';

  return {
    // URL & Anon Key Supabase
    // Pengguna dapat mengisi langsung di sini atau lewat popup "Status Database" di website
    SUPABASE_URL: storedUrl || 'https://your-project.supabase.co',
    SUPABASE_ANON_KEY: storedKey || '',

    // Akun demo / default lokal untuk pengujian cepat
    DEFAULT_ACCOUNTS: {
      admin: {
        email: "admin@temansehat.id",
        pw: "admin123",
        nama: "Administrator TemanSehat",
        role: "admin"
      },
      guru: {
        email: "gurubk@temansehat.id",
        pw: "gurubk123",
        nama: "Ibu Rahmawati, S.Pd (Guru BK)",
        role: "guru"
      },
      // Kompatibilitas dengan akun dari prototipe sebelumnya
      legacy_guru: {
        email: "auliaamaharanii260406@gmail.com",
        pw: "gurubk111",
        nama: "Aulia Maharani (Guru BK)",
        role: "guru"
      },
      legacy_admin: {
        email: "auliaamaharanii260406@gmail.com",
        pw: "admin111",
        nama: "Aulia Maharani (Admin)",
        role: "admin"
      }
    },

    saveSupabaseConfig: function(url, key) {
      if (url) localStorage.setItem('TS_SUPABASE_URL', url.trim());
      else localStorage.removeItem('TS_SUPABASE_URL');

      if (key) localStorage.setItem('TS_SUPABASE_KEY', key.trim());
      else localStorage.removeItem('TS_SUPABASE_KEY');

      window.location.reload();
    }
  };
})();
