/**
 * js/data.js - Data Modul Pembelajaran SEHAT & Skenario Kasus Interaktif
 */

window.TEMAN_DATA = {
  // 6 Modul Utama Pembelajaran Pertemanan Sehat
  MODUL: [
    {
      kode: "S",
      judul: "Sapa dan Komunikasi",
      deskripsi: "Mulai dengan sapaan sederhana, beri ruang teman menjawab, lalu dengarkan dengan tulus. Perhatikan ekspresi dan nada bicara; bila ragu, tanyakan dengan lembut dan jangan langsung berasumsi.",
      dialog: "Raka: “Hai Tari, boleh cerita tentang harimu?”\nTari: “Boleh banget. Makasih ya sudah mau mendengarkan.”",
      aksi: "Hari ini, sapa minimal satu teman dengan menyebut namanya dan tanyakan kabarnya secara tulus."
    },
    {
      kode: "E",
      judul: "Empati",
      deskripsi: "Coba bayangkan perasaan dan sudut pandang temanmu sebelum menanggapi. Menyebutkan perasaan yang tampak dapat membantu teman merasa dipahami, tanpa perlu terburu-buru memberikan ceramah atau nasihat.",
      dialog: "“Kayaknya kamu sedang kecewa dan capek banget ya. Mau cerita atau butuh waktu sendiri dulu?”",
      aksi: "Saat temanmu bercerita, sebutkan satu perasaan yang kamu tangkap (misal: 'pasti berat ya') sebelum memberikan saran."
    },
    {
      kode: "H",
      judul: "Hati Terbuka & Batas Pribadi",
      deskripsi: "Terbuka itu secukupnya dan sehat. Pilih hal yang nyaman untuk dibagi dan hal yang perlu tetap dijaga. Kamu berhak menjaga privasimu, dan temanmu pun berhak atas privasinya.",
      dialog: "“Aku senang bisa ngobrol sama kamu, tapi untuk masalah ini tolong cukup kita berdua saja ya.”",
      aksi: "Tuliskan dua hal yang boleh kamu bagikan dengan teman dan satu hal penting yang ingin kamu jaga untuk dirimu sendiri."
    },
    {
      kode: "A",
      judul: "Andal dan Saling Percaya",
      deskripsi: "Tepati janji-janji kecil dan jaga rahasia atau cerita pribadi temanmu. Kepercayaan tumbuh dari konsistensi perilaku sehari-hari, bukan dari janji-janji besar sesaat.",
      dialog: "“Aku belum bisa gabung jam 4 ini, tapi aku pastikan kabari kamu tepat jam 5 ya.”",
      aksi: "Pilih satu komitmen atau janji kecil minggu ini, lalu tepati dengan tepat waktu."
    },
    {
      kode: "T",
      judul: "Topang & Saling Mendukung",
      deskripsi: "Dukungan emosional berarti hadir dan saling menguatkan. Jika temanmu menghadapi krisis emosional, bahaya, atau keinginan menyakiti diri, libatkan orang dewasa tepercaya atau guru BK.",
      dialog: "“Aku ada di sini untuk mendampingi kamu. Mau kita temui guru BK bareng-bareng?”",
      aksi: "Tuliskan satu kalimat dukungan suportif yang nyaman kamu ucapkan, dan catat kontak guru BK sekolahmu."
    },
    {
      kode: "SEHAT",
      judul: "Waspada dan Batas Diri",
      deskripsi: "Perhatikan tanda relasi yang merugikan (toxic): sering diremehkan di depan umum, rahasia dibocorkan, hanya dimanfaatkan saat butuh contekan, atau ditekan melanggar nilai pribadi. Tegaskan batasanmu dengan tenang menggunakan kalimat 'Aku'.",
      dialog: "“Aku kurang nyaman kalau dijadikan bahan bercandaan di depan umum. Tolong hargai batasanku ya.”",
      aksi: "Latihlah satu kalimat 'Pesan Aku' untuk menyatakan batasanmu dengan sopan namun tegas."
    }
  ],

  // 6 Skenario Kasus Nyata
  SKENARIO: [
    {
      judul: "Teman yang Datang Hanya Saat Butuh",
      cerita: "Dani sering mengirim pesan WhatsApp ke Rafi, tetapi hanya ketika ia butuh contekan tugas atau tumpangan motor. Saat Rafi ingin bercerita tentang masalahnya, Dani sering mengabaikan dan tidak membalas.",
      pertanyaan: "Apa tindakan terbaik yang sebaiknya dilakukan Rafi?",
      opsi: [
        {
          label: "A",
          teks: "Terus membantu tanpa bicara apa-apa agar Dani tidak menjauh atau marah.",
          jenis: "Menuruti / Pasif",
          isi: "Hubungan tetap satu arah dan Rafi akan terus merasa dimanfaatkan tanpa dihargai.",
          pelajaran: "Pertemanan yang sehat dibangun atas dasar saling memberi dan menerima secara seimbang, bukan pemanfaatan sepihak.",
          tipe: "mid"
        },
        {
          label: "B",
          teks: "Langsung memblokir nomor Dani dan menceritakan kejelekan Dani ke teman satu kelas.",
          jenis: "Membalas / Agresif",
          isi: "Masalah menjadi semakin panas, memicu drama baru, dan Dani tidak pernah paham letak kesalahannya.",
          pelajaran: "Membicarakan kekurangan teman di belakang tidak menyelesaikan akar masalah dan justru merusak lingkungan pertemanan.",
          tipe: "mid"
        },
        {
          label: "C",
          teks: "Bicara berdua dengan tenang menggunakan kalimat 'Aku', menyampaikan perasaannya, serta menentukan bantuan apa yang masih wajar ia berikan.",
          jenis: "Menegaskan Batas (Asertif)",
          isi: "Dani mendapatkan kesempatan untuk introspeksi, sementara Rafi berhasil menjaga kesehatan mentalnya.",
          pelajaran: "Menyampaikan batasan dengan tenang dan asertif membuka ruang bagi hubungan yang lebih sehat dan saling menghormati.",
          tipe: "ok"
        }
      ]
    },
    {
      judul: "Dikritik & Diremehkan di Depan Teman-Teman",
      cerita: "Mira sering dikomentari sinis soal gaya pakaian dan nilai ulangannya oleh Tia di depan teman-teman satu kelompok. Hal ini membuat Mira merasa malu dan minder.",
      pertanyaan: "Apa yang sebaiknya Mira lakukan?",
      opsi: [
        {
          label: "A",
          teks: "Ajak Tia bicara berdua, sampaikan perasaan secara asertif ('Aku kurang nyaman saat penampilanku dikomentari di depan umum'), dan minta bantuan guru BK bila berulang.",
          jenis: "Menegaskan Batas (Asertif)",
          isi: "Tia diberi teguran langsung secara beradab, dan Mira melindungi harga dirinya tanpa harus menciptakan kegaduhan.",
          pelajaran: "Kritik yang menjatuhkan bukan tanda kelemahanmu. Kamu berhak meminta perlakuan yang santun.",
          tipe: "ok"
        },
        {
          label: "B",
          teks: "Membalas mengejek fisik Tia sekencang-kencangnya di depan semua orang.",
          jenis: "Membalas (Agresif)",
          isi: "Konflik membesar menjadi pertengkaran terbuka dan suasana kelas menjadi tidak sehat bagi semua pihak.",
          pelajaran: "Membalas ejekan dengan ejekan hanya menurunkan martabat diri dan tidak menyelesaikan perundungan.",
          tipe: "mid"
        },
        {
          label: "C",
          teks: "Menyalahkan diri sendiri, menangis di toilet, dan mulai membolos sekolah.",
          jenis: "Menarik Diri (Pasif)",
          isi: "Kondisi emosional Mira akan semakin memburuk dan kehilangan kesempatan belajar serta dukungan positif.",
          pelajaran: "Menarik diri membiarkan pelaku merasa tindakannya wajar. Carilah bantuan segera.",
          tipe: "mid"
        }
      ]
    },
    {
      judul: "Rahasia Pribadi Bocor ke Grup Chat",
      cerita: "Alya menceritakan masalah keluarganya kepada Nisa secara pribadi dan rahasia. Keesokan harinya, Alya kaget melihat cerita tersebut dijadikan bahan obrolan di grup WhatsApp kelas.",
      pertanyaan: "Bagaimana sikap terbaik Alya?",
      opsi: [
        {
          label: "A",
          teks: "Mengamuk di grup chat dan membongkar aib Nisa yang lebih parah.",
          jenis: "Membalas Dendam",
          isi: "Kepercayaan publik hancur, semua orang merasa terancam, dan aib semakin tersebar luas.",
          pelajaran: "Tarik napas sejenak sebelum merespons dalam kondisi marah besar.",
          tipe: "mid"
        },
        {
          label: "B",
          teks: "Diam seribu bahasa, tidak mau berteman dengan siapapun lagi selamanya.",
          jenis: "Isolasi Total",
          isi: "Masalah tetap menggantung dan Alya kehilangan jaringan teman-teman baik lainnya yang tidak bersalah.",
          pelajaran: "Satu teman yang mengecewakan bukan berarti semua orang di sekitarmu tidak bisa dipercaya.",
          tipe: "mid"
        },
        {
          label: "C",
          teks: "Tenangkan diri, bicara berdua dengan Nisa untuk meminta klarifikasi & menegaskan batas, serta meminta bimbingan guru BK bila perlu.",
          jenis: "Komunikasi Asertif & Mediasi",
          isi: "Alya menunjukkan kedewasaan, membatasi kerusakan, dan mendapatkan perlindungan resmi dari pihak sekolah.",
          pelajaran: "Batas privasi harus ditegaskan dengan jelas, dan melibatkan pihak BK sangat tepat untuk mediasi.",
          tipe: "ok"
        }
      ]
    },
    {
      judul: "Tekanan Ajakan yang Melanggar Norma",
      cerita: "Beni diajak oleh teman-teman tongkrongannya untuk membolos dan mencoba rokok elektrik di tempat sepi. Mereka mengejek: 'Kalau nggak ikut, kamu bukan cowok sejati dan bukan geng kita!'",
      pertanyaan: "Apa yang harus dilakukan Beni?",
      opsi: [
        {
          label: "A",
          teks: "Ikut saja demi menjaga gengsi dan solidaritas pertemanan.",
          jenis: "Menuruti Tekanan (Peer Pressure)",
          isi: "Beni melanggar prinsip dirinya sendiri dan risiko bahaya fisik/disiplin sekolah menanti.",
          pelajaran: "Teman sejati menghargai prinsip hidupmu, bukan memaksamu melakukan hal berbahaya.",
          tipe: "mid"
        },
        {
          label: "B",
          teks: "Menolak tegas dengan sopan ('Sorry, aku ada tugas dan nggak tertarik. Aku cabut duluan ya'), lalu laporkan jika ada intimidasi.",
          jenis: "Tegas & Berprinsip (Asertif)",
          isi: "Beni menyelamatkan masa depannya dan menunjukkan karakter kuat yang pantas dihormati.",
          pelajaran: "Menolak ajakan buruk adalah tanda kedewasaan dan keberanian, bukan kelemahan.",
          tipe: "ok"
        },
        {
          label: "C",
          teks: "Kabur diam-diam tanpa pamit dan memblokir nomor semua orang.",
          jenis: "Menghindar Sementara",
          isi: "Meskipun aman sesaat, Beni belum melatih mental keberanian untuk menolak secara langsung.",
          pelajaran: "Berlatih mengatakan 'TIDAK' secara lantang dan sopan adalah keterampilan hidup yang penting.",
          tipe: "mid"
        }
      ]
    },
    {
      judul: "Melihat Teman Mulai Menyendiri & Terlihat Sedih",
      cerita: "Sinta yang biasanya ceria, beberapa hari belakangan terlihat sangat murung, duduk menyendiri di pojok kelas, dan tidak mau makan saat jam istirahat. Kamu adalah teman dekatnya.",
      pertanyaan: "Bagaimana tindakan empati yang tepat?",
      opsi: [
        {
          label: "A",
          teks: "Menyapa lembut, menawarkan telinga untuk mendengarkan tanpa memaksa, dan mengajaknya berkonsultasi ke Guru BK bila ia butuh teman bicara ahli.",
          jenis: "Hadir Mendukung (Supportif)",
          isi: "Sinta merasa diperhatikan, tidak sendirian, dan mengetahui jalur aman bila ia butuh bantuan lebih lanjut.",
          pelajaran: "Dukungan terbaik dimulai dari kehadiran tulus dan kepekaan terhadap kondisi sahabat.",
          tipe: "ok"
        },
        {
          label: "B",
          teks: "Memaksa Sinta menceritakan masalahnya saat itu juga di hadapan teman-teman lain.",
          jenis: "Memaksa & Melanggar Privasi",
          isi: "Sinta akan merasa terpojok, semakin stres, dan menutup diri lebih rapat.",
          pelajaran: "Hormati kesiapan orang lain untuk bercerita. Jangan jadikan kesedihan orang sebagai tontonan.",
          tipe: "mid"
        },
        {
          label: "C",
          teks: "Mengabaikannya karena menganggap itu bukan urusan kita.",
          jenis: "Apatis / Acuh",
          isi: "Sinta merasa semakin terisolasi dan tidak berharga di lingkungan sekolah.",
          pelajaran: "Kepedulian kecil kita bisa menjadi penyelamat bagi seseorang yang sedang berada di titik terendah.",
          tipe: "mid"
        }
      ]
    },
    {
      judul: "Perbedaan Minat Baru dengan Sahabat Lama",
      cerita: "Nadia dan Putri adalah sahabat sejak kecil. Di SMA, Nadia bergabung dengan ekskul robotik dan memiliki banyak teman baru, sehingga waktu bersama Putri berkurang. Putri merasa ditinggalkan.",
      pertanyaan: "Apa yang sebaiknya dilakukan Putri?",
      opsi: [
        {
          label: "A",
          teks: "Membuat status sindiran di Instagram Story agar Nadia merasa bersalah.",
          jenis: "Pasif-Agresif",
          isi: "Nadia akan tersinggung dan persahabatan yang telah lama terjalin bisa rusak seketika.",
          pelajaran: "Sindiran di media sosial adalah cara terburuk dalam mengekspresikan kekecewaan.",
          tipe: "mid"
        },
        {
          label: "B",
          teks: "Ajak Nadia ngobrol santai, ungkapkan rasa rindu dengan jujur, serta sepakati waktu berkualitas bersama sambil tetap mendukung hobi barunya.",
          jenis: "Komunikasi Terbuka & Dewasa",
          isi: "Keduanya saling memahami: Nadia mengerti perasaan Putri, dan Putri menghargai ruang berkembang sahabatnya.",
          pelajaran: "Persahabatan sejati tidak mengekang, melainkan tumbuh bersama melewati perubahan minat.",
          tipe: "ok"
        },
        {
          label: "C",
          teks: "Memutuskan hubungan persahabatan secara sepihak dan menganggap Nadia pengkhianat.",
          jenis: "Reaksi Berlebihan",
          isi: "Putri kehilangan sahabat terbaiknya hanya karena kesalahpahaman yang sebenarnya bisa dibicarakan.",
          pelajaran: "Perubahan ritme pertemanan adalah hal yang wajar seiring bertambahnya usia.",
          tipe: "mid"
        }
      ]
    }
  ]
};
