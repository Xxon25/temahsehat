/**
 * js/supabaseClient.js - Data Layer Supabase dengan Fail-Fast & Local Storage Fallback
 * Memastikan aplikasi dapat berjalan offline/demo mode jika Supabase belum diset,
 * dan langsung terhubung secara otomatis begitu URL & Anon Key dimasukkan.
 */

window.TS_DB = (function() {
  var client = null;
  var isOnline = false;

  // Cek apakah Supabase library tersedia di browser
  function initClient() {
    var config = window.TEMAN_CONFIG || {};
    var url = config.SUPABASE_URL || '';
    var key = config.SUPABASE_ANON_KEY || '';

    if (window.supabase && url && key && url.indexOf('your-project') === -1) {
      try {
        client = window.supabase.createClient(url, key);
        isOnline = true;
        console.log('[Supabase] Berhasil terhubung ke Supabase Cloud.');
      } catch (err) {
        console.warn('[Supabase] Gagal inisialisasi Supabase client:', err);
        client = null;
        isOnline = false;
      }
    } else {
      client = null;
      isOnline = false;
      console.log('[Supabase] Menggunakan Mode Data Lokal (Offline/Demo Mode).');
    }
  }

  // Initial call
  initClient();

  // Helper fail-fast validasi
  function requireParam(val, name) {
    if (!val || (typeof val === 'string' && val.trim() === '')) {
      throw new Error('Validasi gagal: Parameter "' + name + '" tidak boleh kosong.');
    }
  }

  // -------------------------------------------------------------
  // LOCAL STORAGE FALLBACK HELPERS
  // -------------------------------------------------------------
  var STORAGE_KEYS = {
    PROFILES: 'ts_local_profiles',
    PENDAMPINGAN: 'ts_local_pendampingan',
    PENGADUAN: 'ts_local_pengaduan',
    JURNAL: 'ts_local_jurnal',
    PROGRESS: 'ts_local_progress'
  };

  function getLocal(key, defaultVal) {
    try {
      var d = localStorage.getItem(key);
      return d ? JSON.parse(d) : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  }

  function setLocal(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error('[Storage Error]', e);
    }
  }

  // Inisialisasi data awal lokal jika kosong
  function initLocalData() {
    if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) {
      setLocal(STORAGE_KEYS.PROFILES, [
        { id: '1', email: 'admin@temansehat.id', nama: 'Administrator TemanSehat', role: 'admin', kelas: '-', created_at: new Date().toISOString() },
        { id: '2', email: 'gurubk@temansehat.id', nama: 'Ibu Rahmawati, S.Pd', role: 'guru', kelas: '-', created_at: new Date().toISOString() },
        { id: '3', email: 'auliaamaharanii260406@gmail.com', nama: 'Aulia Maharani', role: 'admin', kelas: '-', created_at: new Date().toISOString() },
        { id: '4', email: 'dimas@sekolah.id', nama: 'Dimas Prasetyo', role: 'siswa', kelas: 'Kelas XI', created_at: new Date().toISOString() },
        { id: '5', email: 'salsa@sekolah.id', nama: 'Salsa Nabila', role: 'siswa', kelas: 'Kelas XII', created_at: new Date().toISOString() }
      ]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PENDAMPINGAN)) {
      setLocal(STORAGE_KEYS.PENDAMPINGAN, [
        {
          id: 'p1',
          nama_siswa: 'Dimas Prasetyo',
          kelas: 'Kelas XI',
          topik: 'Pertemanan',
          jadwal_preferensi: 'Saat jam istirahat',
          status: 'Menunggu',
          catatan_guru: '',
          kontak_siswa: 'dimas@sekolah.id',
          created_at: new Date().toISOString()
        },
        {
          id: 'p2',
          nama_siswa: 'Salsa Nabila',
          kelas: 'Kelas XII',
          topik: 'Konflik dengan teman',
          jadwal_preferensi: 'Pulang sekolah',
          status: 'Dijadwalkan',
          catatan_guru: 'Silakan temui Ibu di Ruang BK Lantai 2 pukul 14.30 WIB ya Salsa.',
          kontak_siswa: 'salsa@sekolah.id',
          created_at: new Date(Date.now() - 3600000).toISOString()
        }
      ]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PENGADUAN)) {
      setLocal(STORAGE_KEYS.PENGADUAN, [
        {
          id: 'a1',
          jenis: 'Saran isi',
          isi: 'Mohon tambahkan lebih banyak contoh latihan skenario tentang menghadapi teman yang gemar menyindir di media sosial.',
          status: 'Diproses',
          tanggapan_admin: 'Terima kasih atas sarannya! Tim BK dan pengembang sedang menyusun materi tersebut.',
          created_at: new Date().toISOString()
        },
        {
          id: 'a2',
          jenis: 'Kendala teknis',
          isi: 'Tampilan di ponsel sangat nyaman dan mudah dibaca.',
          status: 'Selesai',
          tanggapan_admin: 'Senang mendengarnya, terima kasih atas masukannya!',
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    }
  }

  initLocalData();

  // -------------------------------------------------------------
  // PUBLIC DATABASE METHODS (PROFILES, PENDAMPINGAN, PENGADUAN, JURNAL)
  // -------------------------------------------------------------
  return {
    isOnline: function() {
      return isOnline && client !== null;
    },

    reconnect: function() {
      initClient();
      return this.isOnline();
    },

    // ── PROFILES (USERS) ─────────────────────────────────────────
    getProfiles: async function() {
      if (client) {
        try {
          var res = await client.from('profiles').select('*').order('created_at', { ascending: false });
          if (!res.error && res.data) return res.data;
        } catch (err) {
          console.warn('[Supabase] getProfiles fallback ke lokal:', err);
        }
      }
      return getLocal(STORAGE_KEYS.PROFILES, []);
    },

    saveProfile: async function(user) {
      requireParam(user.email, 'email');
      requireParam(user.nama, 'nama');

      var profileData = {
        email: user.email.trim().toLowerCase(),
        nama: user.nama.trim(),
        role: user.role || 'siswa',
        kelas: user.kelas || 'Kelas X',
        last_active: new Date().toISOString()
      };

      if (client) {
        try {
          var res = await client.from('profiles').upsert(profileData, { onConflict: 'email' }).select();
          if (!res.error && res.data && res.data.length > 0) return res.data[0];
        } catch (err) {
          console.warn('[Supabase] saveProfile fallback ke lokal:', err);
        }
      }

      // Local fallback
      var list = getLocal(STORAGE_KEYS.PROFILES, []);
      var idx = list.findIndex(function(x) { return x.email === profileData.email; });
      if (idx >= 0) {
        list[idx] = Object.assign(list[idx], profileData);
      } else {
        profileData.id = 'usr_' + Date.now();
        profileData.created_at = new Date().toISOString();
        list.unshift(profileData);
      }
      setLocal(STORAGE_KEYS.PROFILES, list);
      return profileData;
    },

    updateUserRole: async function(email, newRole) {
      requireParam(email, 'email');
      requireParam(newRole, 'newRole');

      if (client) {
        try {
          var res = await client.from('profiles').update({ role: newRole }).eq('email', email);
          if (!res.error) console.log('[Supabase] Role updated');
        } catch (err) {
          console.warn('[Supabase] updateUserRole fallback ke lokal:', err);
        }
      }

      var list = getLocal(STORAGE_KEYS.PROFILES, []);
      list.forEach(function(u) {
        if (u.email === email) u.role = newRole;
      });
      setLocal(STORAGE_KEYS.PROFILES, list);
      return true;
    },

    deleteUser: async function(email) {
      requireParam(email, 'email');

      if (client) {
        try {
          await client.from('profiles').delete().eq('email', email);
        } catch (err) {
          console.warn('[Supabase] deleteUser fallback:', err);
        }
      }

      var list = getLocal(STORAGE_KEYS.PROFILES, []).filter(function(u) { return u.email !== email; });
      setLocal(STORAGE_KEYS.PROFILES, list);
      return true;
    },

    // ── PENDAMPINGAN BK ──────────────────────────────────────────
    getPendampingan: async function() {
      if (client) {
        try {
          var res = await client.from('pendampingan').select('*').order('created_at', { ascending: false });
          if (!res.error && res.data) return res.data;
        } catch (err) {
          console.warn('[Supabase] getPendampingan fallback ke lokal:', err);
        }
      }
      return getLocal(STORAGE_KEYS.PENDAMPINGAN, []);
    },

    createPendampingan: async function(data) {
      requireParam(data.nama_siswa, 'nama_siswa');
      requireParam(data.topik, 'topik');

      var item = {
        nama_siswa: data.nama_siswa,
        kelas: data.kelas || 'Kelas XI',
        topik: data.topik,
        jadwal_preferensi: data.jadwal_preferensi || 'Saat jam istirahat',
        status: 'Menunggu',
        catatan_guru: '',
        kontak_siswa: data.kontak_siswa || '',
        created_at: new Date().toISOString()
      };

      if (client) {
        try {
          var res = await client.from('pendampingan').insert([item]).select();
          if (!res.error && res.data && res.data.length > 0) return res.data[0];
        } catch (err) {
          console.warn('[Supabase] createPendampingan fallback ke lokal:', err);
        }
      }

      item.id = 'p_' + Date.now();
      var list = getLocal(STORAGE_KEYS.PENDAMPINGAN, []);
      list.unshift(item);
      setLocal(STORAGE_KEYS.PENDAMPINGAN, list);
      return item;
    },

    updatePendampingan: async function(id, updateData) {
      requireParam(id, 'id');

      if (client) {
        try {
          await client.from('pendampingan').update(updateData).eq('id', id);
        } catch (err) {
          console.warn('[Supabase] updatePendampingan fallback:', err);
        }
      }

      var list = getLocal(STORAGE_KEYS.PENDAMPINGAN, []);
      list.forEach(function(it) {
        if (it.id === id) Object.assign(it, updateData);
      });
      setLocal(STORAGE_KEYS.PENDAMPINGAN, list);
      return true;
    },

    deletePendampingan: async function(id) {
      requireParam(id, 'id');

      if (client) {
        try {
          await client.from('pendampingan').delete().eq('id', id);
        } catch (err) {
          console.warn('[Supabase] deletePendampingan fallback:', err);
        }
      }

      var list = getLocal(STORAGE_KEYS.PENDAMPINGAN, []).filter(function(it) { return it.id !== id; });
      setLocal(STORAGE_KEYS.PENDAMPINGAN, list);
      return true;
    },

    // ── PENGADUAN & MASUKAN ──────────────────────────────────────
    getPengaduan: async function() {
      if (client) {
        try {
          var res = await client.from('pengaduan').select('*').order('created_at', { ascending: false });
          if (!res.error && res.data) return res.data;
        } catch (err) {
          console.warn('[Supabase] getPengaduan fallback ke lokal:', err);
        }
      }
      return getLocal(STORAGE_KEYS.PENGADUAN, []);
    },

    createPengaduan: async function(data) {
      requireParam(data.jenis, 'jenis');
      requireParam(data.isi, 'isi');

      var item = {
        jenis: data.jenis,
        isi: data.isi,
        status: 'Baru',
        tanggapan_admin: '',
        pengirim_anonim: data.pengirim_anonim !== false,
        created_at: new Date().toISOString()
      };

      if (client) {
        try {
          var res = await client.from('pengaduan').insert([item]).select();
          if (!res.error && res.data && res.data.length > 0) return res.data[0];
        } catch (err) {
          console.warn('[Supabase] createPengaduan fallback ke lokal:', err);
        }
      }

      item.id = 'a_' + Date.now();
      var list = getLocal(STORAGE_KEYS.PENGADUAN, []);
      list.unshift(item);
      setLocal(STORAGE_KEYS.PENGADUAN, list);
      return item;
    },

    updatePengaduan: async function(id, updateData) {
      requireParam(id, 'id');

      if (client) {
        try {
          await client.from('pengaduan').update(updateData).eq('id', id);
        } catch (err) {
          console.warn('[Supabase] updatePengaduan fallback:', err);
        }
      }

      var list = getLocal(STORAGE_KEYS.PENGADUAN, []);
      list.forEach(function(it) {
        if (it.id === id) Object.assign(it, updateData);
      });
      setLocal(STORAGE_KEYS.PENGADUAN, list);
      return true;
    },

    deletePengaduan: async function(id) {
      requireParam(id, 'id');

      if (client) {
        try {
          await client.from('pengaduan').delete().eq('id', id);
        } catch (err) {
          console.warn('[Supabase] deletePengaduan fallback:', err);
        }
      }

      var list = getLocal(STORAGE_KEYS.PENGADUAN, []).filter(function(it) { return it.id !== id; });
      setLocal(STORAGE_KEYS.PENGADUAN, list);
      return true;
    },

    // ── JURNAL REFLEKSI ──────────────────────────────────────────
    getJurnal: async function(email) {
      if (!email) return { q1_perasaan: '', q2_hal_dijaga: '', q3_pesan_aku: '' };

      if (client) {
        try {
          var res = await client.from('jurnal').select('*').eq('email_siswa', email).limit(1);
          if (!res.error && res.data && res.data.length > 0) return res.data[0];
        } catch (err) {
          console.warn('[Supabase] getJurnal fallback ke lokal:', err);
        }
      }

      var list = getLocal(STORAGE_KEYS.JURNAL, {});
      return list[email] || { q1_perasaan: '', q2_hal_dijaga: '', q3_pesan_aku: '' };
    },

    saveJurnal: async function(email, answers) {
      requireParam(email, 'email');

      var item = {
        email_siswa: email,
        q1_perasaan: answers.q1 || '',
        q2_hal_dijaga: answers.q2 || '',
        q3_pesan_aku: answers.q3 || '',
        updated_at: new Date().toISOString()
      };

      if (client) {
        try {
          await client.from('jurnal').upsert(item, { onConflict: 'email_siswa' });
        } catch (err) {
          console.warn('[Supabase] saveJurnal fallback ke lokal:', err);
        }
      }

      var list = getLocal(STORAGE_KEYS.JURNAL, {});
      list[email] = item;
      setLocal(STORAGE_KEYS.JURNAL, list);
      return true;
    },

    clearJurnal: async function(email) {
      if (!email) return;

      if (client) {
        try {
          await client.from('jurnal').delete().eq('email_siswa', email);
        } catch (err) {}
      }

      var list = getLocal(STORAGE_KEYS.JURNAL, {});
      delete list[email];
      setLocal(STORAGE_KEYS.JURNAL, list);
      return true;
    },

    // ── PROGRES BELAJAR ──────────────────────────────────────────
    getProgress: async function(email) {
      if (!email) return { modul: {}, skenario: {}, kartu: false, jurnal: false };

      if (client) {
        try {
          var res = await client.from('modul_progress').select('*').eq('email_siswa', email).limit(1);
          if (!res.error && res.data && res.data.length > 0) {
            var row = res.data[0];
            var modObj = {}, skObj = {};
            (row.modul_selesai || []).forEach(function(i) { modObj[i] = 1; });
            (row.skenario_selesai || []).forEach(function(i) { skObj[i] = 1; });
            return {
              modul: modObj,
              skenario: skObj,
              kartu: !!row.kartu_dibuka,
              jurnal: !!row.jurnal_disimpan
            };
          }
        } catch (err) {
          console.warn('[Supabase] getProgress fallback:', err);
        }
      }

      var list = getLocal(STORAGE_KEYS.PROGRESS, {});
      return list[email] || { modul: {}, skenario: {}, kartu: false, jurnal: false };
    },

    saveProgress: async function(email, prog) {
      if (!email) return;

      var modArr = Object.keys(prog.modul || {}).map(Number);
      var skArr = Object.keys(prog.skenario || {}).map(Number);

      if (client) {
        try {
          await client.from('modul_progress').upsert({
            email_siswa: email,
            modul_selesai: modArr,
            skenario_selesai: skArr,
            kartu_dibuka: !!prog.kartu,
            jurnal_disimpan: !!prog.jurnal,
            updated_at: new Date().toISOString()
          }, { onConflict: 'email_siswa' });
        } catch (err) {
          console.warn('[Supabase] saveProgress fallback:', err);
        }
      }

      var list = getLocal(STORAGE_KEYS.PROGRESS, {});
      list[email] = prog;
      setLocal(STORAGE_KEYS.PROGRESS, list);
    }
  };
})();
