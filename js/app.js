/**
 * js/app.js - Kontroler Utama TemanSehat
 * Mengelola 3 Role: Siswa, Guru BK, Admin (Full Control)
 * Mengatur Navigasi, Interaktivitas Modul, Skenario, Konseling, Pengaduan, & Sinkronisasi DB
 */

(function() {
  'use strict';

  // State Aplikasi
  var state = {
    user: null,          // { email, nama, role, kelas }
    activeTab: 'masuk',
    modulIndex: 0,
    skenarioIndex: 0,
    progress: { modul: {}, skenario: {}, kartu: false, jurnal: false },
    filterPendampingan: 'Semua',
    filterPengaduan: 'Semua'
  };

  // Helper DOM
  var $ = function(id) { return document.getElementById(id); };

  function showToast(message) {
    var toast = $('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function() {
      toast.classList.remove('show');
    }, 2800);
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function(c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // -------------------------------------------------------------
  // AUTENTIKASI & PERAN (3 ROLE: SISWA, GURU BK, ADMIN)
  // -------------------------------------------------------------
  var authTab = 'siswa';

  function setAuthTab(tab) {
    authTab = tab;
    document.querySelectorAll('.tab-auth-btn').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    $('formSiswa').hidden = (tab !== 'siswa');
    $('formStaff').hidden = (tab === 'siswa');
    $('authError').textContent = '';

    if (tab === 'guru') {
      $('staffRoleLabel').textContent = 'Guru Bimbingan Konseling (BK)';
      $('staffHint').innerHTML = 'Gunakan akun Guru BK terdaftar.<br><small style="color:var(--ink-500)">Demo: gurubk@temansehat.id / gurubk123</small>';
    } else if (tab === 'admin') {
      $('staffRoleLabel').textContent = 'Administrator (Full Control)';
      $('staffHint').innerHTML = 'Gunakan akun Admin dengan kontrol penuh.<br><small style="color:var(--ink-500)">Demo: admin@temansehat.id / admin123</small>';
    }
  }

  async function handleLoginSiswa() {
    var nama = $('sNama').value.trim();
    var email = $('sEmail').value.trim().toLowerCase();
    var kelas = $('sKelas').value;
    var setuju = $('sSetuju').checked;
    var errBox = $('authError');

    if (nama.length < 2) {
      errBox.textContent = 'Silakan tulis nama lengkap atau nama panggilanmu.';
      return;
    }
    if (!email || !email.includes('@')) {
      errBox.textContent = 'Masukkan alamat email yang valid (contoh: siswa@sekolah.id).';
      return;
    }
    if (!setuju) {
      errBox.textContent = 'Harap centang persetujuan privasi terlebih dahulu.';
      return;
    }

    errBox.textContent = '';
    var userProfile = await window.TS_DB.saveProfile({
      email: email,
      nama: nama,
      role: 'siswa',
      kelas: kelas
    });

    loginSuccess(userProfile);
  }

  async function handleLoginStaff() {
    var email = $('staffEmail').value.trim().toLowerCase();
    var pw = $('staffPw').value.trim();
    var errBox = $('authError');

    if (!email || !pw) {
      errBox.textContent = 'Email dan kata sandi wajib diisi.';
      return;
    }

    var accounts = window.TEMAN_CONFIG.DEFAULT_ACCOUNTS;
    var role = null;
    var nama = 'Pengguna';

    // Cek akun default atau database
    if (authTab === 'guru') {
      if ((email === accounts.guru.email && pw === accounts.guru.pw) ||
          (email === accounts.legacy_guru.email && pw === accounts.legacy_guru.pw)) {
        role = 'guru';
        nama = accounts.guru.nama;
      }
    } else if (authTab === 'admin') {
      if ((email === accounts.admin.email && pw === accounts.admin.pw) ||
          (email === accounts.legacy_admin.email && pw === accounts.legacy_admin.pw)) {
        role = 'admin';
        nama = accounts.admin.nama;
      }
    }

    // Jika belum cocok, cari di DB profiles
    if (!role) {
      var profiles = await window.TS_DB.getProfiles();
      var found = profiles.find(function(p) { return p.email === email; });
      if (found && (found.role === authTab || found.role === 'admin')) {
        role = found.role;
        nama = found.nama;
      }
    }

    if (!role) {
      errBox.textContent = 'Email atau kata sandi ' + (authTab === 'guru' ? 'Guru BK' : 'Admin') + ' tidak sesuai.';
      return;
    }

    errBox.textContent = '';
    var userProfile = await window.TS_DB.saveProfile({
      email: email,
      nama: nama,
      role: role,
      kelas: '-'
    });

    loginSuccess(userProfile);
  }

  async function loginSuccess(user) {
    state.user = user;
    sessionStorage.setItem('TS_ACTIVE_USER', JSON.stringify(user));

    // Update UI Header
    $('headerUserRole').textContent = (user.role === 'admin' ? '👑 Admin' : user.role === 'guru' ? '🎓 Guru BK' : '🎒 Siswa');
    $('headerUserRole').className = 'badge-role ' + user.role;
    $('headerUserRole').hidden = false;
    $('btnLogout').hidden = false;
    $('btnDBSettings').hidden = false;

    // Load Progres Siswa
    if (user.role === 'siswa') {
      state.progress = await window.TS_DB.getProgress(user.email);
    }

    buildNavigation();

    // Arahkan ke tab awal sesuai role
    if (user.role === 'admin') navigateTo('admin');
    else if (user.role === 'guru') navigateTo('guru');
    else navigateTo('beranda');

    showToast('Selamat datang, ' + user.nama + '!');
  }

  function handleLogout() {
    state.user = null;
    sessionStorage.removeItem('TS_ACTIVE_USER');
    $('headerUserRole').hidden = true;
    $('btnLogout').hidden = true;
    $('navBar').innerHTML = '';
    $('bottomHelpBar').hidden = true;
    setAuthTab('siswa');
    navigateTo('masuk');
    showToast('Kamu telah berhasil keluar.');
  }

  // -------------------------------------------------------------
  // NAVIGASI
  // -------------------------------------------------------------
  var NAV_DEFINITIONS = [
    // Tab Siswa
    { id: 'beranda', label: '🏠 Beranda', roles: ['siswa'] },
    { id: 'modul', label: '📖 Modul Belajar', roles: ['siswa', 'guru', 'admin'] },
    { id: 'latihan', label: '💡 Latihan Kasus', roles: ['siswa', 'guru', 'admin'] },
    { id: 'kartu', label: '📇 Kartu SEHAT', roles: ['siswa', 'guru', 'admin'] },
    { id: 'jurnal', label: '✍️ Jurnal Refleksi', roles: ['siswa'] },
    { id: 'bantuan', label: '🤝 Bantuan Konseling', roles: ['siswa'] },
    { id: 'pengaduan', label: '📮 Pengaduan', roles: ['siswa', 'guru'] },

    // Tab Guru BK
    { id: 'guru', label: '🎓 Dasbor Guru BK', roles: ['guru', 'admin'] },

    // Tab Admin
    { id: 'admin', label: '👑 Pusat Kontrol Admin', roles: ['admin'] }
  ];

  function buildNavigation() {
    var navContainer = $('navBar');
    if (!navContainer || !state.user) {
      navContainer.innerHTML = '';
      return;
    }

    var allowed = NAV_DEFINITIONS.filter(function(item) {
      return item.roles.includes(state.user.role);
    });

    navContainer.innerHTML = allowed.map(function(item) {
      return '<button class="nav-btn" data-target="' + item.id + '">' + item.label + '</button>';
    }).join('');

    navContainer.querySelectorAll('.nav-btn').forEach(function(btn) {
      btn.onclick = function() {
        navigateTo(btn.dataset.target);
      };
    });
  }

  function navigateTo(tabId) {
    if (!state.user && tabId !== 'masuk') {
      tabId = 'masuk';
    }

    state.activeTab = tabId;

    // Toggle sections
    document.querySelectorAll('main > section').forEach(function(sec) {
      sec.classList.toggle('active', sec.id === tabId);
    });

    // Update active nav button
    document.querySelectorAll('.nav-btn').forEach(function(btn) {
      btn.setAttribute('aria-current', btn.dataset.target === tabId ? 'page' : 'false');
    });

    // Bottom Help Bar hanya untuk siswa
    var showHelpBar = state.user && state.user.role === 'siswa' && tabId !== 'bantuan' && tabId !== 'masuk';
    $('bottomHelpBar').hidden = !showHelpBar;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Render tab spesifik
    if (tabId === 'beranda') renderBeranda();
    if (tabId === 'modul') renderModul();
    if (tabId === 'latihan') openSkenario(state.skenarioIndex);
    if (tabId === 'kartu') {
      state.progress.kartu = true;
      saveProgressState();
    }
    if (tabId === 'jurnal') renderJurnal();
    if (tabId === 'guru') renderGuruDasbor();
    if (tabId === 'admin') renderAdminCenter();
  }

  // -------------------------------------------------------------
  // TAB SISWA: BERANDA & PROGRES
  // -------------------------------------------------------------
  function renderBeranda() {
    if (!state.user) return;
    $('berandaNama').textContent = state.user.nama;

    var modCount = Object.keys(state.progress.modul || {}).length;
    var skCount = Object.keys(state.progress.skenario || {}).length;

    var items = [
      { label: 'Modul Dibaca', val: modCount + ' dari 6', done: modCount === 6 },
      { label: 'Skenario Kasus Diselesaikan', val: skCount + ' dari 6', done: skCount === 6 },
      { label: 'Kartu SEHAT Dibuka', val: state.progress.kartu ? 'Sudah' : 'Belum', done: state.progress.kartu },
      { label: 'Jurnal Refleksi Disimpan', val: state.progress.jurnal ? 'Tersimpan' : 'Belum', done: state.progress.jurnal }
    ];

    $('berandaProgList').innerHTML = items.map(function(it) {
      return '<div class="progress-item">' +
        '<span>' + (it.done ? '✅ ' : '⏳ ') + it.label + '</span>' +
        '<span class="progress-tag ' + (it.done ? 'done' : 'pending') + '">' + it.val + '</span>' +
      '</div>';
    }).join('');
  }

  function saveProgressState() {
    if (state.user && state.user.role === 'siswa') {
      window.TS_DB.saveProgress(state.user.email, state.progress);
    }
  }

  // -------------------------------------------------------------
  // TAB MODUL SEHAT (INTERAKTIF & CERAH)
  // -------------------------------------------------------------
  function renderModul() {
    var list = window.TEMAN_DATA.MODUL;
    var m = list[state.modulIndex];
    var currentNum = state.modulIndex + 1;
    var total = list.length;
    var isLast = state.modulIndex === total - 1;

    // Catat progress
    state.progress.modul[state.modulIndex] = 1;
    saveProgressState();

    $('modulCounter').textContent = 'Modul 0' + currentNum + ' / 0' + total;
    $('modulTitle').textContent = m.kode + ' — ' + m.judul;
    $('modulDesc').textContent = m.deskripsi;
    $('modulDialog').innerHTML = '💬 <b>Contoh Percakapan:</b><br>' + escapeHtml(m.dialog).replace(/\n/g, '<br>');
    $('modulAksi').innerHTML = '🎯 <b>Aksi Nyata Hari Ini:</b><br>' + escapeHtml(m.aksi);

    $('btnModulPrev').hidden = (state.modulIndex === 0);
    $('btnModulNext').textContent = isLast ? 'Buka Kartu SEHAT →' : 'Lanjut Modul Berikutnya →';
  }

  // -------------------------------------------------------------
  // TAB LATIHAN SKENARIO KASUS INTERAKTIF
  // -------------------------------------------------------------
  function renderSkenarioList() {
    var list = window.TEMAN_DATA.SKENARIO;
    var container = $('skenarioPilihanList');
    container.innerHTML = list.map(function(s, idx) {
      var done = state.progress.skenario && state.progress.skenario[idx];
      return '<button class="opt-card" data-idx="' + idx + '" style="display:flex;align-items:center;justify-content:space-between;">' +
        '<div><b>Skenario ' + (idx + 1) + ':</b> ' + escapeHtml(s.judul) + '</div>' +
        '<span class="progress-tag ' + (done ? 'done' : 'pending') + '">' + (done ? '✓ Dicoba' : 'Belum') + '</span>' +
      '</button>';
    }).join('');

    container.querySelectorAll('.opt-card').forEach(function(btn) {
      btn.onclick = function() {
        openSkenario(parseInt(btn.dataset.idx, 10));
      };
    });
  }

  function openSkenario(idx) {
    state.skenarioIndex = idx;
    var list = window.TEMAN_DATA.SKENARIO;
    var s = list[idx];

    $('skenarioViewPlay').hidden = false;
    $('skenarioViewFeedback').hidden = true;
    $('skenarioViewList').hidden = true;

    $('skenarioSub').textContent = 'Skenario ' + (idx + 1) + ' dari ' + list.length;
    $('skenarioJudul').textContent = s.judul;
    $('skenarioCerita').textContent = s.cerita;
    $('skenarioTanya').textContent = s.pertanyaan;

    var opsiHtml = s.opsi.map(function(op, opIdx) {
      return '<button class="opt-card" data-op="' + opIdx + '">' +
        '<b>' + op.label + '.</b> ' + escapeHtml(op.teks) +
      '</button>';
    }).join('');

    var opsContainer = $('skenarioOpsiContainer');
    opsContainer.innerHTML = opsiHtml;
    opsContainer.querySelectorAll('.opt-card').forEach(function(btn) {
      btn.onclick = function() {
        pilihOpsiSkenario(parseInt(btn.dataset.op, 10));
      };
    });
  }

  function pilihOpsiSkenario(opIdx) {
    var s = window.TEMAN_DATA.SKENARIO[state.skenarioIndex];
    var opt = s.opsi[opIdx];

    // Simpan progres
    state.progress.skenario[state.skenarioIndex] = 1;
    saveProgressState();

    $('fbSub').textContent = 'Ulasan Pilihan ' + opt.label + ' (Skenario ' + (state.skenarioIndex + 1) + ')';
    $('fbJenis').textContent = 'Gaya Respons: ' + opt.jenis;
    $('fbIsi').textContent = opt.isi;
    $('fbPel').textContent = opt.pelajaran;

    var fbBox = $('fbBox');
    fbBox.className = 'fb-card ' + (opt.tipe === 'ok' ? 'ok' : 'mid');

    $('skenarioViewPlay').hidden = true;
    $('skenarioViewFeedback').hidden = false;
    $('skenarioViewList').hidden = true;
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  // -------------------------------------------------------------
  // TAB JURNAL REFLEKSI
  // -------------------------------------------------------------
  async function renderJurnal() {
    if (!state.user) return;
    var data = await window.TS_DB.getJurnal(state.user.email);
    $('j1').value = data.q1_perasaan || '';
    $('j2').value = data.q2_hal_dijaga || '';
    $('j3').value = data.q3_pesan_aku || '';
  }

  async function handleSimpanJurnal() {
    if (!state.user) return;
    var answers = {
      q1: $('j1').value.trim(),
      q2: $('j2').value.trim(),
      q3: $('j3').value.trim()
    };

    await window.TS_DB.saveJurnal(state.user.email, answers);
    state.progress.jurnal = true;
    saveProgressState();
    showToast('Jurnal refleksi berhasil disimpan!');
  }

  async function handleHapusJurnal() {
    if (!state.user) return;
    if (confirm('Apakah kamu yakin ingin mengosongkan jurnal refleksi ini?')) {
      $('j1').value = '';
      $('j2').value = '';
      $('j3').value = '';
      await window.TS_DB.clearJurnal(state.user.email);
      state.progress.jurnal = false;
      saveProgressState();
      showToast('Jurnal refleksi telah dibersihkan.');
    }
  }

  // -------------------------------------------------------------
  // TAB PENDAMPINGAN (SISWA AJUKAN KONSELING BK)
  // -------------------------------------------------------------
  async function handleKirimPendampingan() {
    var nama = $('fNama').value.trim() || (state.user ? state.user.nama : 'Anonim');
    var kelas = $('fKelas').value;
    var topik = $('fTopik').value;
    var jadwal = $('fJadwal').value;
    var kontak = $('fKontak').value.trim() || (state.user ? state.user.email : '');

    await window.TS_DB.createPendampingan({
      nama_siswa: nama,
      kelas: kelas,
      topik: topik,
      jadwal_preferensi: jadwal,
      kontak_siswa: kontak
    });

    $('fNama').value = '';
    $('fKontak').value = '';
    showToast('Permintaan pendampingan telah terkirim ke Guru BK!');
    $('fStatusAlert').innerHTML = '<div class="alert alert-success">✅ Permintaan pendampingan berhasil dikirim. Guru BK akan segera menjadwalkan pertemuan.</div>';
  }

  // -------------------------------------------------------------
  // TAB PENGADUAN & MASUKAN
  // -------------------------------------------------------------
  async function handleKirimPengaduan() {
    var jenis = $('pJenis').value;
    var isi = $('pIsi').value.trim();

    if (isi.length < 5) {
      showToast('Harap tuliskan pesan/pengaduan lebih lengkap.');
      return;
    }

    await window.TS_DB.createPengaduan({
      jenis: jenis,
      isi: isi,
      pengirim_anonim: true
    });

    $('pIsi').value = '';
    showToast('Pengaduan/masukan kamu telah terkirim ke Admin!');
    navigateTo('beranda');
  }

  // -------------------------------------------------------------
  // DASBOR GURU BK
  // -------------------------------------------------------------
  async function renderGuruDasbor() {
    var list = await window.TS_DB.getPendampingan();

    // Hitung statistik
    var total = list.length;
    var menunggu = list.filter(function(x) { return x.status === 'Menunggu'; }).length;
    var dijadwalkan = list.filter(function(x) { return x.status === 'Dijadwalkan'; }).length;
    var selesai = list.filter(function(x) { return x.status === 'Selesai'; }).length;

    $('bkStatTotal').textContent = total;
    $('bkStatMenunggu').textContent = menunggu;
    $('bkStatJadwal').textContent = dijadwalkan;
    $('bkStatSelesai').textContent = selesai;

    // Filter
    var filtered = list;
    if (state.filterPendampingan !== 'Semua') {
      filtered = list.filter(function(x) { return x.status === state.filterPendampingan; });
    }

    var container = $('bkListPendampingan');
    if (!filtered.length) {
      container.innerHTML = '<p class="desc-sm" style="text-align:center;padding:20px;">Tidak ada permintaan pendampingan pada kategori ini.</p>';
      return;
    }

    container.innerHTML = filtered.map(function(it) {
      var statusClass = 'status-' + it.status.toLowerCase();
      return '<div class="list-card-item">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">' +
          '<div>' +
            '<h4 style="font-size:1.05rem;color:var(--ink-900);">' + escapeHtml(it.nama_siswa) + ' <span class="desc-sm">(' + escapeHtml(it.kelas) + ')</span></h4>' +
            '<p class="desc-sm">Topik: <b>' + escapeHtml(it.topik) + '</b> · Waktu Harapan: ' + escapeHtml(it.jadwal_preferensi) + '</p>' +
          '</div>' +
          '<span class="item-badge-status ' + statusClass + '">' + it.status + '</span>' +
        '</div>' +
        (it.catatan_guru ? '<div class="alert alert-info" style="padding:8px 12px;margin:8px 0;font-size:0.85rem;"><b>Catatan Respon:</b> ' + escapeHtml(it.catatan_guru) + '</div>' : '') +
        '<div class="btn-row" style="margin-top:10px;">' +
          (it.status !== 'Dijadwalkan' ? '<button class="btn btn-primary btn-sm" data-act="jadwal" data-id="' + it.id + '">📅 Jadwalkan Pertemuan</button>' : '') +
          (it.status !== 'Selesai' ? '<button class="btn btn-success btn-sm" data-act="selesai" data-id="' + it.id + '">✓ Tandai Selesai</button>' : '') +
          '<button class="btn btn-danger btn-sm" data-act="hapus_pend" data-id="' + it.id + '">Hapus</button>' +
        '</div>' +
      '</div>';
    }).join('');

    // Listener Aksi Guru BK
    container.querySelectorAll('[data-act]').forEach(function(btn) {
      btn.onclick = async function() {
        var act = btn.dataset.act;
        var id = btn.dataset.id;

        if (act === 'jadwal') {
          var catatan = prompt('Tuliskan pesan / lokasi / waktu pasti untuk siswa:', 'Silakan datang ke ruang BK pada jam istirahat ya.');
          if (catatan !== null) {
            await window.TS_DB.updatePendampingan(id, { status: 'Dijadwalkan', catatan_guru: catatan });
            showToast('Pertemuan dijadwalkan!');
            renderGuruDasbor();
          }
        } else if (act === 'selesai') {
          await window.TS_DB.updatePendampingan(id, { status: 'Selesai' });
          showToast('Pendampingan ditandai selesai.');
          renderGuruDasbor();
        } else if (act === 'hapus_pend') {
          if (confirm('Yakin ingin menghapus catatan pendampingan ini?')) {
            await window.TS_DB.deletePendampingan(id);
            showToast('Catatan dihapus.');
            renderGuruDasbor();
          }
        }
      };
    });
  }

  // -------------------------------------------------------------
  // PUSAT KONTROL ADMIN (FULL CONTROL)
  // -------------------------------------------------------------
  async function renderAdminCenter() {
    var profiles = await window.TS_DB.getProfiles();
    var pengaduan = await window.TS_DB.getPengaduan();
    var pendampingan = await window.TS_DB.getPendampingan();

    // Stats
    $('adminStatUser').textContent = profiles.length;
    $('adminStatSiswa').textContent = profiles.filter(function(p) { return p.role === 'siswa'; }).length;
    $('adminStatGuru').textContent = profiles.filter(function(p) { return p.role === 'guru'; }).length;
    $('adminStatAduan').textContent = pengaduan.length;

    // Render User Management Table
    var userContainer = $('adminUserList');
    userContainer.innerHTML = profiles.map(function(u) {
      var isCurrent = state.user && state.user.email === u.email;
      return '<div class="list-card-item">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;">' +
          '<div>' +
            '<b>' + escapeHtml(u.nama) + '</b> ' + (isCurrent ? '<small style="color:var(--primary);font-weight:700;">(Anda)</small>' : '') + '<br>' +
            '<span class="desc-sm">' + escapeHtml(u.email) + ' · ' + escapeHtml(u.kelas || '-') + '</span>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:8px;">' +
            '<select class="select-field" style="width:auto;padding:5px 8px;font-size:0.85rem;" data-role-user="' + u.email + '" ' + (isCurrent ? 'disabled' : '') + '>' +
              '<option value="siswa" ' + (u.role === 'siswa' ? 'selected' : '') + '>🎒 Siswa</option>' +
              '<option value="guru" ' + (u.role === 'guru' ? 'selected' : '') + '>🎓 Guru BK</option>' +
              '<option value="admin" ' + (u.role === 'admin' ? 'selected' : '') + '>👑 Admin</option>' +
            '</select>' +
            (!isCurrent ? '<button class="btn btn-danger btn-sm" data-del-user="' + u.email + '">Hapus</button>' : '') +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    userContainer.querySelectorAll('[data-role-user]').forEach(function(sel) {
      sel.onchange = async function() {
        var email = sel.dataset.roleUser;
        var newRole = sel.value;
        await window.TS_DB.updateUserRole(email, newRole);
        showToast('Role untuk ' + email + ' diubah menjadi ' + newRole);
        renderAdminCenter();
      };
    });

    userContainer.querySelectorAll('[data-del-user]').forEach(function(btn) {
      btn.onclick = async function() {
        var email = btn.dataset.delUser;
        if (confirm('Yakin ingin menghapus pengguna ' + email + '?')) {
          await window.TS_DB.deleteUser(email);
          showToast('Pengguna dihapus.');
          renderAdminCenter();
        }
      };
    });

    // Render Pengaduan List
    var aduContainer = $('adminPengaduanList');
    if (!pengaduan.length) {
      aduContainer.innerHTML = '<p class="desc-sm" style="text-align:center;padding:20px;">Kotak pengaduan dan masukan masih kosong.</p>';
    } else {
      aduContainer.innerHTML = pengaduan.map(function(ad) {
        var statusClass = 'status-' + ad.status.toLowerCase();
        return '<div class="list-card-item">' +
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">' +
            '<div>' +
              '<h4 style="font-size:1rem;color:var(--ink-900);">Kategori: ' + escapeHtml(ad.jenis) + '</h4>' +
              '<p style="margin:4px 0 8px;font-size:0.95rem;">' + escapeHtml(ad.isi) + '</p>' +
            '</div>' +
            '<span class="item-badge-status ' + statusClass + '">' + ad.status + '</span>' +
          '</div>' +
          (ad.tanggapan_admin ? '<div class="alert alert-info" style="padding:8px 12px;margin:8px 0;font-size:0.85rem;"><b>Tanggapan Admin:</b> ' + escapeHtml(ad.tanggapan_admin) + '</div>' : '') +
          '<div class="btn-row" style="margin-top:10px;">' +
            '<button class="btn btn-primary btn-sm" data-act="balas_aduan" data-id="' + ad.id + '">💬 Beri Tanggapan</button>' +
            (ad.status !== 'Selesai' ? '<button class="btn btn-success btn-sm" data-act="selesai_aduan" data-id="' + ad.id + '">✓ Selesai</button>' : '') +
            '<button class="btn btn-danger btn-sm" data-act="hapus_aduan" data-id="' + ad.id + '">Hapus</button>' +
          '</div>' +
        '</div>';
      }).join('');

      aduContainer.querySelectorAll('[data-act]').forEach(function(btn) {
        btn.onclick = async function() {
          var act = btn.dataset.act;
          var id = btn.dataset.id;

          if (act === 'balas_aduan') {
            var respon = prompt('Tuliskan tanggapan admin untuk pengaduan ini:');
            if (respon !== null) {
              await window.TS_DB.updatePengaduan(id, { status: 'Diproses', tanggapan_admin: respon });
              showToast('Tanggapan disimpan.');
              renderAdminCenter();
            }
          } else if (act === 'selesai_aduan') {
            await window.TS_DB.updatePengaduan(id, { status: 'Selesai' });
            showToast('Pengaduan ditandai selesai.');
            renderAdminCenter();
          } else if (act === 'hapus_aduan') {
            if (confirm('Yakin ingin menghapus pengaduan ini?')) {
              await window.TS_DB.deletePengaduan(id);
              showToast('Pengaduan dihapus.');
              renderAdminCenter();
            }
          }
        };
      });
    }
  }

  // -------------------------------------------------------------
  // MODAL KONEKSI SUPABASE
  // -------------------------------------------------------------
  function updateDBBadge() {
    var badge = $('dbStatusBadge');
    var isOnline = window.TS_DB.isOnline();
    badge.className = 'badge-db ' + (isOnline ? 'online' : 'offline');
    badge.innerHTML = '<span class="dot"></span>' + (isOnline ? 'Supabase Online' : 'Mode Demo / Lokal');
  }

  function openDBSettingsModal() {
    var modal = $('dbSettingsModal');
    var config = window.TEMAN_CONFIG;
    $('cfgSupabaseUrl').value = (config.SUPABASE_URL.indexOf('your-project') === -1) ? config.SUPABASE_URL : '';
    $('cfgSupabaseKey').value = config.SUPABASE_ANON_KEY || '';
    modal.classList.add('open');
  }

  function closeDBSettingsModal() {
    $('dbSettingsModal').classList.remove('open');
  }

  // -------------------------------------------------------------
  // EVENT LISTENERS & INITIALIZATION
  // -------------------------------------------------------------
  window.addEventListener('DOMContentLoaded', function() {
    // Auth Tabs
    document.querySelectorAll('.tab-auth-btn').forEach(function(btn) {
      btn.onclick = function() { setAuthTab(btn.dataset.tab); };
    });

    $('btnLoginSiswa').onclick = handleLoginSiswa;
    $('btnLoginStaff').onclick = handleLoginStaff;
    $('btnLogout').onclick = handleLogout;

    // Modul Nav
    $('btnModulPrev').onclick = function() {
      if (state.modulIndex > 0) {
        state.modulIndex--;
        renderModul();
      }
    };
    $('btnModulNext').onclick = function() {
      if (state.modulIndex < window.TEMAN_DATA.MODUL.length - 1) {
        state.modulIndex++;
        renderModul();
      } else {
        navigateTo('kartu');
      }
    };

    // Skenario Nav
    $('btnSkenarioDaftar').onclick = function() {
      renderSkenarioList();
      $('skenarioViewPlay').hidden = true;
      $('skenarioViewFeedback').hidden = true;
      $('skenarioViewList').hidden = false;
    };
    $('btnSkenarioDaftar2').onclick = function() {
      renderSkenarioList();
      $('skenarioViewPlay').hidden = true;
      $('skenarioViewFeedback').hidden = true;
      $('skenarioViewList').hidden = false;
    };
    $('btnSkenarioNext').onclick = function() {
      var nextIdx = (state.skenarioIndex + 1) % window.TEMAN_DATA.SKENARIO.length;
      openSkenario(nextIdx);
    };
    $('btnSkenarioUlang').onclick = function() {
      openSkenario(state.skenarioIndex);
    };

    // Kartu SEHAT Cetak & Unduh
    $('btnCetakKartu').onclick = function() {
      window.print();
    };
    $('btnUnduhKartu').onclick = function() {
      window.print();
    };

    // Jurnal
    $('btnSimpanJurnal').onclick = handleSimpanJurnal;
    $('btnHapusJurnal').onclick = handleHapusJurnal;

    // Bantuan & Pengaduan
    $('btnKirimBantuan').onclick = handleKirimPendampingan;
    $('btnKirimPengaduan').onclick = handleKirimPengaduan;

    // Filter Guru BK
    document.querySelectorAll('[data-filter-bk]').forEach(function(btn) {
      btn.onclick = function() {
        document.querySelectorAll('[data-filter-bk]').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.filterPendampingan = btn.dataset.filterBk;
        renderGuruDasbor();
      };
    });

    // Tambah User Baru di Admin
    $('btnAdminTambahUser').onclick = async function() {
      var nama = prompt('Masukkan nama pengguna baru:');
      if (!nama) return;
      var email = prompt('Masukkan alamat email:');
      if (!email || !email.includes('@')) {
        alert('Email tidak valid.');
        return;
      }
      var role = prompt('Pilih Role (siswa / guru / admin):', 'siswa');
      if (!['siswa', 'guru', 'admin'].includes(role)) role = 'siswa';

      await window.TS_DB.saveProfile({ nama: nama, email: email, role: role, kelas: 'Kelas X' });
      showToast('Pengguna baru berhasil ditambahkan!');
      renderAdminCenter();
    };

    // Database Settings
    $('dbStatusBadge').onclick = openDBSettingsModal;
    $('btnDBSettings').onclick = openDBSettingsModal;
    $('btnCloseDBModal').onclick = closeDBSettingsModal;
    $('btnSimpanDBCfg').onclick = function() {
      var url = $('cfgSupabaseUrl').value.trim();
      var key = $('cfgSupabaseKey').value.trim();
      window.TEMAN_CONFIG.saveSupabaseConfig(url, key);
    };

    // Quick Navigation Triggers from Cards
    document.addEventListener('click', function(e) {
      var goBtn = e.target.closest('[data-go]');
      if (goBtn) {
        navigateTo(goBtn.dataset.go);
      }
    });

    updateDBBadge();

    // Pulihkan sesi jika ada
    try {
      var saved = sessionStorage.getItem('TS_ACTIVE_USER');
      if (saved) {
        loginSuccess(JSON.parse(saved));
        return;
      }
    } catch (e) {}

    setAuthTab('siswa');
    navigateTo('masuk');
  });

})();
