// Ganti isi file ini untuk membuat topik pelajaran lain.
const DATA = {
  judul: "Fotosintesis",
  materi: [
    { judul: "Apa itu fotosintesis?", isi: "Fotosintesis adalah proses tumbuhan hijau membuat makanannya sendiri dengan bantuan cahaya matahari. Karena itu tumbuhan disebut produsen: ia menghasilkan makanan bagi makhluk hidup lain." },
    { judul: "Bahan dan hasilnya", isi: "Bahan: karbon dioksida (CO₂) dari udara dan air (H₂O) dari tanah. Hasil: glukosa (gula) sebagai makanan dan oksigen (O₂) yang dilepas ke udara. Persamaannya: 6CO₂ + 6H₂O + cahaya → C₆H₁₂O₆ + 6O₂." },
    { judul: "Di mana terjadinya?", isi: "Fotosintesis terjadi di kloroplas, bagian sel daun yang mengandung klorofil (zat hijau daun). Klorofil menyerap cahaya matahari. Daun berwarna hijau karena klorofil memantulkan cahaya hijau." },
    { judul: "Perjalanan bahan baku", isi: "Air diserap akar lalu naik lewat pembuluh kayu (xilem) ke daun. CO₂ masuk lewat stomata, lubang-lubang kecil di permukaan daun. Glukosa yang dihasilkan diangkut ke seluruh tubuh lewat pembuluh tapis (floem)." },
    { judul: "Nasib glukosa", isi: "Sebagian glukosa dipakai untuk tumbuh dan menghasilkan energi. Sisanya diubah menjadi amilum (pati) dan disimpan di akar, batang, buah, atau biji. Singkong, kentang, dan padi menyimpan banyak amilum." },
    { judul: "Faktor yang memengaruhi", isi: "Cahaya, air, dan karbon dioksida memengaruhi laju fotosintesis. Suhu juga berpengaruh. Jika salah satu bahan sangat sedikit, laju fotosintesis ikut rendah meskipun yang lain melimpah. Coba di tab Simulasi." }
  ],
  kartu: [
    { depan: "Zat hijau daun", belakang: "Klorofil" },
    { depan: "Organel tempat fotosintesis", belakang: "Kloroplas" },
    { depan: "Lubang kecil di daun untuk keluar masuk gas", belakang: "Stomata" },
    { depan: "Gas yang diserap tumbuhan untuk fotosintesis", belakang: "Karbon dioksida (CO₂)" },
    { depan: "Gas yang dilepas saat fotosintesis", belakang: "Oksigen (O₂)" },
    { depan: "Makanan hasil fotosintesis", belakang: "Glukosa" },
    { depan: "Cadangan makanan di akar dan biji", belakang: "Amilum (pati)" },
    { depan: "Pembuluh yang mengangkut air ke daun", belakang: "Xilem (pembuluh kayu)" }
  ],
  kuis: [
    { tanya: "Zat hijau daun yang menyerap cahaya matahari disebut...", opsi: ["Stomata", "Klorofil", "Xilem", "Amilum"], benar: 1, alasan: "Klorofil menyerap cahaya sehingga energinya bisa dipakai membuat glukosa." },
    { tanya: "Gas yang dilepaskan tumbuhan sebagai hasil fotosintesis adalah...", opsi: ["Karbon dioksida", "Nitrogen", "Oksigen", "Hidrogen"], benar: 2, alasan: "Oksigen adalah hasil sampingan fotosintesis, dan kita menghirupnya." },
    { tanya: "Bahan baku fotosintesis adalah...", opsi: ["Glukosa dan oksigen", "Air dan karbon dioksida", "Air dan oksigen", "Amilum dan air"], benar: 1, alasan: "Air dari akar dan CO₂ dari udara diolah menjadi glukosa dan oksigen." },
    { tanya: "Bagian daun tempat masuknya karbon dioksida adalah...", opsi: ["Akar", "Floem", "Stomata", "Kutikula"], benar: 2, alasan: "Stomata adalah lubang kecil yang membuka dan menutup untuk pertukaran gas." },
    { tanya: "Fotosintesis berlangsung di bagian sel yang disebut...", opsi: ["Inti sel", "Mitokondria", "Kloroplas", "Vakuola"], benar: 2, alasan: "Kloroplas berisi klorofil. Mitokondria adalah tempat respirasi sel." },
    { tanya: "Tumbuhan disebut produsen karena...", opsi: ["Memakan hewan kecil", "Membuat makanan sendiri", "Menghasilkan telur", "Hidup di air"], benar: 1, alasan: "Produsen membuat makanan sendiri dari zat anorganik, sehingga menjadi awal rantai makanan." },
    { tanya: "Tumbuhan diletakkan di ruangan gelap selama beberapa hari. Yang paling mungkin terjadi adalah...", opsi: ["Tumbuh lebih cepat", "Fotosintesis terhenti dan daun menguning", "Menghasilkan lebih banyak oksigen", "Tidak ada perubahan"], benar: 1, alasan: "Tanpa cahaya tidak ada fotosintesis, klorofil berkurang, dan daun menguning." },
    { tanya: "Glukosa hasil fotosintesis disimpan tumbuhan dalam bentuk...", opsi: ["Protein", "Lemak", "Amilum", "Vitamin"], benar: 2, alasan: "Glukosa diubah menjadi amilum, misalnya di umbi singkong dan kentang." }
  ]
};
