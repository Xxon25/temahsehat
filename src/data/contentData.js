/**
 * src/data/contentData.js
 * Data Kurikulum Psikoedukasi Pertemanan SEHAT & Simulasi Kasus Interaktif
 */

export const INITIAL_MODUL = [
  {
    id: "mod-1",
    kode: "S",
    judul: "Sapa & Komunikasi Asertif",
    kategori: "Komunikasi Interpersonal",
    durasi: "4 Menit",
    warna: "sky",
    ringkasan: "Membangun jembatan pertemanan melalui sapaan tulus, mendengarkan aktif, dan komunikasi terbuka.",
    deskripsi:
      "Komunikasi yang sehat dimulai dari keberanian menyapa dengan tulus, memberikan ruang bagi teman untuk bercerita, dan mendengarkan tanpa menyela. Perhatikan bahasa tubuh dan nada bicara; bila ada hal yang membingungkan, tanyakan secara langsung dengan lembut tanpa berasumsi buruk.",
    poinUtama: [
      "Gunakan kontak mata yang ramah dan sebut nama teman saat menyapa.",
      "Dengarkan untuk memahami, bukan sekadar menunggu giliran berbicara.",
      "Konfirmasi maksud teman sebelum menarik kesimpulan sendiri."
    ],
    dialog: {
      situasi: "Di koridor kelas saat jam istirahat pagi",
      percakapan: [
        { pelaku: "Raka", teks: "Hai Tari! Selamat pagi. Kemarin tugas presentasimu keren banget, gimana persiapanmu?" },
        { pelaku: "Tari", teks: "Eh hai Raka! Wah, makasih banyak ya sudah perhatiin. Jujur kemarin sempat gugup banget." },
        { pelaku: "Raka", teks: "Wajar kok gugup, tapi kamu berhasil bawain dengan tenang. Kalau nanti butuh teman diskusi buat proyek berikutnya, kabari aja ya!" }
      ]
    },
    tantangan: "Hari ini, sapa minimal satu teman di kelasmu dengan menyebut namanya dan tanyakan kabarnya secara tulus."
  },
  {
    id: "mod-2",
    kode: "E",
    judul: "Empati & Validasi Emosi",
    kategori: "Kecerdasan Emosional",
    durasi: "5 Menit",
    warna: "emerald",
    ringkasan: "Memahami sudut pandang sahabat dan memvalidasi perasaannya sebelum memberikan saran.",
    deskripsi:
      "Empati adalah kemampuan menempatkan diri pada posisi teman. Ketika teman sedang sedih atau kecewa, mereka sering kali tidak langsung membutuhkan ceramah atau solusi instan, melainkan pengakuan bahwa perasaan mereka valid dan dipahami.",
    poinUtama: [
      "Kenali dan sebutkan emosi yang tampak pada teman (validasi emosi).",
      "Hindari kalimat yang meremehkan seperti 'Ah, gitu aja baper'.",
      "Tanyakan apakah teman butuh didengarkan saja atau butuh saran."
    ],
    dialog: {
      situasi: "Teman tampak murung setelah hasil seleksi lomba keluar",
      percakapan: [
        { pelaku: "Kamu", teks: "Kayaknya kamu lagi kecewa dan lelah banget ya setelah pengumuman tadi. Aku ikut sedih melihatnya." },
        { pelaku: "Teman", teks: "Iya nih, padahal aku sudah latihan tiap sore selama sebulan penuh." },
        { pelaku: "Kamu", teks: "Pasti rasanya berat banget ya karena usahamu sudah maksimal. Kamu mau cerita-cerita dulu, atau mau ditemani makan siang?" }
      ]
    },
    tantangan: "Saat temanmu mengeluh atau bercerita hari ini, ucapkan satu kalimat validasi perasaan sebelum memberi nasihat."
  },
  {
    id: "mod-3",
    kode: "H",
    judul: "Hati Terbuka & Privasi Sehat",
    kategori: "Manajemen Privasi",
    durasi: "4 Menit",
    warna: "amber",
    ringkasan: "Menyeimbangkan keterbukaan diri dengan perlindungan privasi pribadi maupun rahasia sahabat.",
    deskripsi:
      "Menjadi teman yang hangat bukan berarti harus menceritakan seluruh rahasia pribadi tanpa filter. Keterbukaan yang sehat memiliki batasan. Kamu berhak memilih hal apa yang nyaman dibagikan dan hal apa yang menjadi ruang pribadimu.",
    poinUtama: [
      "Kenali lingkaran kepercayaan: teman biasa, sahabat dekat, dan keluarga/konselor.",
      "Hormati ketika teman belum siap menceritakan masalah pribadinya.",
      "Jangan membagikan tangkapan layar (screenshot) obrolan pribadi ke grup."
    ],
    dialog: {
      situasi: "Berbagi cerita sensitif dengan sahabat dekat",
      percakapan: [
        { pelaku: "Nadia", teks: "Aku pengen cerita sesuatu tentang kondisiku di rumah, tapi tolong ini cukup di antara kita berdua saja ya." },
        { pelaku: "Putri", teks: "Tentu Nadia, terima kasih sudah percaya sama aku. Ceritamu aman di aku, nggak akan aku sampaikan ke siapa pun." }
      ]
    },
    tantangan: "Identifikasi 2 topik yang nyaman kamu bagikan ke teman umum, dan 1 hal privasi yang hanya untuk dirimu/keluarga."
  },
  {
    id: "mod-4",
    kode: "A",
    judul: "Andal & Saling Percaya",
    kategori: "Integritas Relasi",
    durasi: "5 Menit",
    warna: "indigo",
    ringkasan: "Membangun kepercayaan jangka panjang lewat konsistensi menepati janji-janji kecil.",
    deskripsi:
      "Kepercayaan dalam pertemanan tidak dibangun dalam semalam, melainkan dari kumpulan komitmen kecil yang ditepati setiap hari. Jika berhalangan menepati janji, sampaikan lebih awal dengan jujur tanpa mencari-cari alasan palsu.",
    poinUtama: [
      "Tepati waktu saat berjanji mengerjakan tugas kelompok atau bertemu.",
      "Beritahu lebih awal jika ada kendala mendadak, jangan menghilang (ghosting).",
      "Jaga konsistensi antara ucapan di depan dan di belakang teman."
    ],
    dialog: {
      situasi: "Memberi kabar saat terlambat kerja kelompok",
      percakapan: [
        { pelaku: "Beni", teks: "Teman-teman, maaf banget aku belum bisa berangkat jam 3 sore ini karena harus antar adikku ke klinik. Jam 4 sore aku pastikan sudah sampai dan bagian tugasku sudah kukerjakan di Google Docs." },
        { pelaku: "Rafi", teks: "Oke Beni, makasih sudah ngabarin dari awal ya! Hati-hati di jalan." }
      ]
    },
    tantangan: "Pilih satu janji kecil minggu ini kepada temanmu dan pastikan kamu menepatinya tepat waktu."
  },
  {
    id: "mod-5",
    kode: "T",
    judul: "Topang & Rujukan Bantuan",
    kategori: "Sistem Dukungan",
    durasi: "5 Menit",
    warna: "teal",
    ringkasan: "Menjadi pendukung emosional yang sehat dan tahu kapan harus melibatkan Guru BK.",
    deskripsi:
      "Saling menopang berarti hadir di masa sulit. Namun ingat: kamu adalah teman sebaya, bukan konselor profesional. Jika temanmu menghadapi kekerasan, perundungan berat, atau keinginan menyakiti diri, tindakan paling peduli adalah mendampinginya menemui Guru BK.",
    poinUtama: [
      "Tawarkan kehadiran yang menenangkan tanpa memikul beban sendirian.",
      "Jangan berjanji menyimpan rahasia apabila menyangkut keselamatan nyawa teman.",
      "Ajak dan temani sahabatmu berkonsultasi ke ruang Guru BK."
    ],
    dialog: {
      situasi: "Mendampingi teman yang sedang mengalami tekanan berat",
      percakapan: [
        { pelaku: "Kamu", teks: "Aku peduli banget sama kamu dan nggak mau kamu nanggung beban seberat ini sendirian. Kita ngobrol sama Ibu Guru BK yuk? Aku temani sampai depan ruangan." },
        { pelaku: "Sinta", teks: "Aku takut kalau datang sendiri... Makasih ya mau nemenin aku." }
      ]
    },
    tantangan: "Simpan jadwal atau informasi layanan Guru BK di sekolahmu agar siap digunakan kapan saja."
  },
  {
    id: "mod-6",
    kode: "SEHAT",
    judul: "Waspada Relasi Merugikan & Batas Diri",
    kategori: "Perlindungan Diri",
    durasi: "6 Menit",
    warna: "rose",
    ringkasan: "Mengenali ciri pertemanan tidak sehat (toxic) dan menggunakan 'Pesan Aku' untuk menetapkan batas.",
    deskripsi:
      "Pertemanan yang sehat membuatmu bertumbuh, bukan merasa takut atau kehilangan jati diri. Waspadai tanda relasi merugikan: sering direndahkan di depan umum, dimanfaatkan sepihak, atau ditekan melakukan hal buruk. Gunakan teknik 'Pesan Aku' (I-Message) untuk menegaskan batas diri.",
    poinUtama: [
      "Fokus pada perilaku yang membuat tidak nyaman, bukan menyerang karakter orangnya.",
      "Formula Pesan Aku: 'Aku merasa [emosi] ketika [perilaku], aku harap [harapan batas].'",
      "Berani berkata TIDAK pada tekanan teman sebaya (peer pressure) yang negatif."
    ],
    dialog: {
      situasi: "Menegur teman yang suka mengejek di depan kelas",
      percakapan: [
        { pelaku: "Mira", teks: "Tia, bisa bicara sebentar berdua? Aku merasa kurang nyaman kalau nilai ulanganku dijadikan bahan candaan di depan teman-teman. Aku harap ke depannya kita bisa saling menghargai ya." },
        { pelaku: "Tia", teks: "Oh, maaf ya Mira, aku kira cuma bercanda biasa. Aku nggak bakal ulangi lagi." }
      ]
    },
    tantangan: "Susun satu kalimat 'Pesan Aku' untuk situasi yang selama ini membuatmu kurang nyaman, lalu catat di Jurnal Refleksi."
  }
];

export const INITIAL_SKENARIO = [
  {
    id: "sk-1",
    judul: "Teman yang Datang Hanya Saat Butuh",
    kategori: "Batas Diri & Keseimbangan Relasi",
    tingkat: "Dasar",
    cerita:
      "Dani sering mengirim pesan WhatsApp kepada Rafi, tetapi hampir selalu ketika ia meminta contekan tugas rumah atau meminjam barang. Sebaliknya, saat Rafi sedang butuh teman diskusi atau bantuan kecil, Dani selalu menghilang dan tidak membalas pesan.",
    pertanyaan: "Langkah paling sehat apa yang sebaiknya diambil oleh Rafi?",
    opsi: [
      {
        label: "A",
        teks: "Tetap memberikan contekan terus-menerus agar Dani tidak marah atau menjauh.",
        jenis: "Respons Pasif (Menuruti)",
        dampak: "Hubungan tetap timpang satu arah, Rafi merasa terkuras dan dimanfaatkan, sementara Dani tidak belajar bertanggung jawab.",
        pelajaran: "Kebaikan tanpa batas diri bukanlah pertemanan yang sehat, melainkan pembiaran yang merugikan kedua pihak.",
        skor: "mid"
      },
      {
        label: "B",
        teks: "Membuat status sindiran keras di media sosial dan menyebarkan keburukan Dani ke grup kelas.",
        jenis: "Respons Agresif (Membalas)",
        dampak: "Memicu pertengkaran terbuka di kelas, mempermalukan kedua pihak, dan masalah inti tidak terselesaikan secara dewasa.",
        pelajaran: "Menyerang balik di ruang publik hanya memperkeruh suasana dan merusak reputasi diri sendiri.",
        skor: "mid"
      },
      {
        label: "C",
        teks: "Berbicara secara pribadi dengan tenang menggunakan 'Pesan Aku', menolak memberi contekan, namun menawarkan belajar bersama jika Dani mau berusaha.",
        jenis: "Respons Asertif (Menegaskan Batas)",
        dampak: "Rafi menjaga integritas dirinya, memberikan batasan yang jelas, dan memberi Dani kesempatan memperbaiki sikap.",
        pelajaran: "Menyampaikan batasan secara jujur dan tenang adalah kunci membangun rasa hormat dalam pertemanan.",
        skor: "ok"
      }
    ]
  },
  {
    id: "sk-2",
    judul: "Direndahkan dengan Dalih 'Bercanda' di Depan Umum",
    kategori: "Komunikasi Asertif",
    tingkat: "Menengah",
    cerita:
      "Saat kumpul istirahat, Tia sering melontarkan komentar tentang fisik dan gaya bicara Mira hingga teman-teman lain tertawa. Ketika Mira tampak sedih, Tia berkata, 'Gitu aja baper, kan cuma bercanda!'",
    pertanyaan: "Bagaimana cara Mira merespons situasi ini secara sehat?",
    opsi: [
      {
        label: "A",
        teks: "Mengajak Tia bicara empat mata, menyampaikan bahwa candaan fisik tersebut menyakitkan, dan meminta Guru BK memediasi jika terus berulang.",
        jenis: "Respons Asertif & Terstruktur",
        dampak: "Tia menyadari bahwa ucapannya melewati batas, dan Mira terlindungi oleh jalur bimbingan sekolah apabila perundungan berlanjut.",
        pelajaran: "Bercanda yang sehat membuat semua orang tertawa bersama, bukan menertawakan satu orang yang terluka.",
        skor: "ok"
      },
      {
        label: "B",
        teks: "Membalas menghina kelemahan fisik Tia lebih keras di depan kantin sekolah.",
        jenis: "Respons Agresif",
        dampak: "Terjadi adu mulut yang berpotensi menjadi perkelahian dan keduanya mendapat sanksi sekolah.",
        pelajaran: "Membalas perundungan dengan perundungan tidak menghentikan siklus kekerasan verbal.",
        skor: "mid"
      },
      {
        label: "C",
        teks: "Diam saja, menyalahkan diri sendiri, dan tidak mau keluar kelas lagi setiap jam istirahat.",
        jenis: "Respons Menarik Diri",
        dampak: "Kepercayaan diri Mira semakin runtuh dan pelaku merasa tindakannya sah-sah saja.",
        pelajaran: "Kamu berhak mendapatkan ruang belajar yang aman dan dihormati.",
        skor: "mid"
      }
    ]
  },
  {
    id: "sk-3",
    judul: "Cerita Rahasia Keluarga Bocor ke Grup Chat",
    kategori: "Kepercayaan & Privasi",
    tingkat: "Menengah",
    cerita:
      "Alya mempercayakan cerita masalah keluarganya kepada Nisa secara pribadi. Esok paginya, Alya terkejut mengetahui topik tersebut menjadi bahan gunjingan di grup chat teman-teman seangkatan.",
    pertanyaan: "Tindakan apa yang paling bijak dilakukan Alya?",
    opsi: [
      {
        label: "A",
        teks: "Langsung mengamuk di grup angkatan dan membongkar semua rahasia Nisa sebagai balasan.",
        jenis: "Respons Reaktif / Dendam",
        dampak: "Konflik meluas ke seluruh angkatan dan privasi kedua belah pihak semakin hancur.",
        pelajaran: "Amarah sesaat di ruang digital meninggalkan jejak permanen yang merugikan.",
        skor: "mid"
      },
      {
        label: "B",
        teks: "Menenangkan diri, meminta penjelasan Nisa secara langsung, mengevaluasi batas kepercayaan, dan berkonsultasi dengan Guru BK untuk meredam gosip kelas.",
        jenis: "Respons Asertif & Solutif",
        dampak: "Masalah tertangani pada sumbernya, Nisa mendapat teguran tegas, dan Guru BK dapat membantu mengondisikan etika kelas.",
        pelajaran: "Ketika batas privasi dilanggar, tegaskan konsekuensinya dan libatkan pendidik untuk menghentikan peredaran rumor.",
        skor: "ok"
      },
      {
        label: "C",
        teks: "Keluar dari semua grup sekolah dan memutuskan tidak akan pernah berbicara dengan siapa pun lagi.",
        jenis: "Respons Isolasi Diri",
        dampak: "Alya kehilangan informasi akademik sekolah dan kehilangan dukungan dari teman-teman lain yang sebenarnya peduli.",
        pelajaran: "Kesalahan satu orang tidak berarti seluruh lingkunganmu buruk. Tetaplah terhubung dengan lingkaran yang sehat.",
        skor: "mid"
      }
    ]
  },
  {
    id: "sk-4",
    judul: "Tekanan Kelompok untuk Melanggar Aturan (Peer Pressure)",
    kategori: "Keberanian Berprinsip",
    tingkat: "Lanjutan",
    cerita:
      "Sekelompok teman mengajak Beni membolos jam pelajaran terakhir dan merokok di luar sekolah. Mereka berkata, 'Kalau kamu nggak ikut, kamu pengecut dan nggak usah gabung sama kami lagi!'",
    pertanyaan: "Apa keputusan paling tepat untuk masa depan dan keselamatan Beni?",
    opsi: [
      {
        label: "A",
        teks: "Terpaksa ikut membolos agar tetap dianggap kompak dan tidak dikucilkan.",
        jenis: "Respons Konformitas Negatif",
        dampak: "Beni melanggar nilai dirinya, berisiko terkena sanksi pelanggaran sekolah, dan makin sulit keluar dari tekanan berikutnya.",
        pelajaran: "Pertemanan yang mengharuskanmu merusak diri sendiri bukanlah pertemanan yang layak dipertahankan.",
        skor: "mid"
      },
      {
        label: "B",
        teks: "Menolak dengan tegas dan lugas ('Maaf, aku pilih masuk kelas karena mau fokus ujian'), lalu mencari lingkaran pertemanan yang lebih positif.",
        jenis: "Respons Asertif Berprinsip",
        dampak: "Beni terlindung dari masalah disiplin dan menunjukkan keteguhan prinsip yang tegas.",
        pelajaran: "Berani berkata 'TIDAK' pada hal buruk adalah bukti kekuatan mental yang sesungguhnya.",
        skor: "ok"
      },
      {
        label: "C",
        teks: "Berbohong pura-pura sakit perut setiap kali bertemu mereka tanpa berani menyatakan sikap.",
        jenis: "Respons Menghindar",
        dampak: "Mereka akan terus mendesak Beni di hari-hari berikutnya karena belum ada penolakan yang tegas.",
        pelajaran: "Ketegasan yang jelas jauh lebih efektif daripada alasan yang dibuat-buat.",
        skor: "mid"
      }
    ]
  },
  {
    id: "sk-5",
    judul: "Sahabat Tampak Murung & Menunjukkan Tanda Krisis Emosional",
    kategori: "Empati & Rujukan BK",
    tingkat: "Lanjutan",
    cerita:
      "Selama seminggu terakhir, Sinta yang biasanya aktif mendadak sering menangis diam-diam, nilainya turun drastis, dan sempat menulis kalimat putus asa di buku catatannya.",
    pertanyaan: "Sebagai sahabat yang menerapkan prinsip TOPANG, apa yang harus kamu lakukan?",
    opsi: [
      {
        label: "A",
        teks: "Hadir mendengarkan dengan penuh empati tanpa menghakimi, lalu membujuk dan menemaninya berkonsultasi ke Guru BK hari itu juga.",
        jenis: "Respons Supportif & Tanggap Darurat",
        dampak: "Sinta merasa tidak sendirian dan segera mendapatkan penanganan profesional yang tepat dari Guru BK.",
        pelajaran: "Menghubungkan teman yang sedang krisis ke Guru BK atau orang dewasa tepercaya adalah bentuk kepedulian tertinggi.",
        skor: "ok"
      },
      {
        label: "B",
        teks: "Berjanji merahasiakan kondisi kritis tersebut dari siapa pun termasuk guru dan orang tua.",
        jenis: "Respons Berisiko Tinggi",
        dampak: "Bebannya terlalu berat untuk ditangani siswa sendirian dan keselamatan Sinta bisa terancam.",
        pelajaran: "Keselamatan jiwa sahabat lebih utama daripada janji tutup mulut.",
        skor: "mid"
      },
      {
        label: "C",
        teks: "Menceritakan kondisi Sinta ke teman-teman lain di kantin agar semua orang tahu.",
        jenis: "Respons Melanggar Privasi",
        dampak: "Sinta merasa malu, tertekan, dan kehilangan kepercayaan untuk meminta bantuan.",
        pelajaran: "Bantuan harus diberikan lewat jalur yang menjaga kehormatan teman, bukan menjadikannya bahan obrolan.",
        skor: "mid"
      }
    ]
  },
  {
    id: "sk-6",
    judul: "Merasa Tersisih Saat Sahabat Punya Kegiatan Baru",
    kategori: "Komunikasi Terbuka",
    tingkat: "Dasar",
    cerita:
      "Nadia dan Putri bersahabat sejak kelas X. Tahun ini Nadia terpilih menjadi pengurus OSIS sehingga jadwalnya padat dan memiliki banyak rekan baru. Putri merasa mulai dilupakan.",
    pertanyaan: "Bagaimana cara Putri mengelola perasaannya secara dewasa?",
    opsi: [
      {
        label: "A",
        teks: "Mengajak Nadia mengobrol santai, mengungkapkan rasa rindunya secara jujur, mendukung kegiatan Nadia, dan menyepakati jadwal ngobrol mingguan.",
        jenis: "Respons Terbuka & Konstruktif",
        dampak: "Nadia merasa didukung, memahami perasaan Putri, dan persahabatan mereka tetap hangat di tengah kesibukan baru.",
        pelajaran: "Pertemanan yang dewasa memberi ruang bagi masing-masing untuk berkembang sambil tetap menjaga komunikasi.",
        skor: "ok"
      },
      {
        label: "B",
        teks: "Mendiamkan Nadia (silent treatment) setiap kali berpapasan agar Nadia merasa bersalah.",
        jenis: "Respons Pasif-Agresif",
        dampak: "Timbul kebingungan dan jarak emosional yang justru merenggangkan persahabatan mereka.",
        pelajaran: "Temanmu bukan pembaca pikiran; sampaikan perasaanmu dengan kata-kata yang baik.",
        skor: "mid"
      },
      {
        label: "C",
        teks: "Menuntut Nadia keluar dari OSIS demi membuktikan kesetiaan persahabatan.",
        jenis: "Respons Posesif / Mengekang",
        dampak: "Nadia merasa terkekang dan hubungan menjadi penuh tekanan.",
        pelajaran: "Sahabat sejati saling mendukung pertumbuhan potensi, bukan saling membatasi.",
        skor: "mid"
      }
    ]
  }
];
