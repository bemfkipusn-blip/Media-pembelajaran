const $ = (s) => document.querySelector(s);
const el = (tag, attrs = {}, text = "") => {
  const e = document.createElement(tag);
  Object.assign(e, attrs);
  if (text) e.textContent = text;
  return e;
};

document.title = "Media Pembelajaran: " + DATA.judul;
$("#judul").textContent = DATA.judul;

// Navigasi tab
document.querySelectorAll("nav button").forEach((b) => {
  b.onclick = () => {
    document.querySelectorAll("nav button").forEach((x) => x.classList.toggle("aktif", x === b));
    document.querySelectorAll("main section").forEach((s) => (s.hidden = s.id !== b.dataset.tab));
  };
});

// Materi
DATA.materi.forEach((m) => {
  const d = el("details");
  d.append(el("summary", {}, m.judul), el("p", {}, m.isi));
  $("#materi").append(d);
});

// Kartu hafalan
(function () {
  let i = 0, balik = false;
  const box = $("#kartu");
  const kartu = el("div", { className: "kartu" });
  const info = el("p", { className: "info" });
  const prev = el("button", {}, "‹ Sebelumnya");
  const next = el("button", {}, "Berikutnya ›");
  const tampil = () => {
    const k = DATA.kartu[i];
    kartu.textContent = balik ? k.belakang : k.depan;
    kartu.classList.toggle("balik", balik);
    info.textContent = `Kartu ${i + 1} dari ${DATA.kartu.length} (klik kartu untuk membalik)`;
  };
  kartu.onclick = () => { balik = !balik; tampil(); };
  prev.onclick = () => { i = (i - 1 + DATA.kartu.length) % DATA.kartu.length; balik = false; tampil(); };
  next.onclick = () => { i = (i + 1) % DATA.kartu.length; balik = false; tampil(); };
  const ctrl = el("div", { className: "ctrl" });
  ctrl.append(prev, next);
  box.append(kartu, info, ctrl);
  tampil();
})();

// Kuis
(function () {
  const box = $("#kuis");
  let n = 0, skor = 0, salahList = [];
  const mulai = () => { n = 0; skor = 0; salahList = []; soal(); };
  const soal = () => {
    box.replaceChildren();
    if (n >= DATA.kuis.length) return selesai();
    const q = DATA.kuis[n];
    box.append(el("p", { className: "info" }, `Soal ${n + 1} dari ${DATA.kuis.length}`), el("h2", {}, q.tanya));
    const umpan = el("p", { className: "umpan" });
    const lanjut = el("button", { hidden: true }, n + 1 < DATA.kuis.length ? "Soal berikutnya" : "Lihat hasil");
    lanjut.onclick = () => { n++; soal(); };
    const tombol = q.opsi.map((o, idx) => {
      const b = el("button", { className: "opsi" }, o);
      b.onclick = () => {
        tombol.forEach((t, k) => {
          t.disabled = true;
          if (k === q.benar) t.classList.add("benar");
        });
        if (idx === q.benar) { skor++; umpan.textContent = "Benar! " + q.alasan; }
        else { b.classList.add("salah"); salahList.push(q); umpan.textContent = "Kurang tepat. " + q.alasan; }
        lanjut.hidden = false;
      };
      return b;
    });
    box.append(...tombol, umpan, lanjut);
  };
  const selesai = () => {
    const nilai = Math.round((skor / DATA.kuis.length) * 100);
    const ulang = el("button", {}, "Ulangi kuis");
    ulang.onclick = mulai;
    const pesan = nilai >= 80 ? "Hebat! Kamu sudah paham materinya." : nilai >= 60 ? "Bagus, sedikit lagi!" : "Ayo baca materinya sekali lagi, lalu coba lagi.";
    box.append(el("h2", {}, "Hasil Kuis"), el("p", { className: "skor" }, `${skor} / ${DATA.kuis.length} benar (nilai ${nilai})`), el("p", {}, pesan));
    if (salahList.length) {
      box.append(el("h3", {}, "Yang perlu diulang"));
      const ul = el("ul");
      salahList.forEach((q) => ul.append(el("li", {}, `${q.tanya} Jawaban: ${q.opsi[q.benar]}.`)));
      box.append(ul);
    }
    box.append(ulang);
  };
  mulai();
})();

// Simulasi: faktor pembatas fotosintesis
(function () {
  const box = $("#simulasi");
  const faktor = [
    { id: "cahaya", nama: "Cahaya", nilai: 70 },
    { id: "air", nama: "Air", nilai: 70 },
    { id: "co2", nama: "Karbon dioksida", nilai: 70 }
  ];
  box.append(el("p", { className: "info" }, "Geser pengaturan dan lihat laju fotosintesis. Laju ditentukan oleh faktor yang paling sedikit."));
  const baris = faktor.map((f) => {
    const lab = el("label", { htmlFor: "sim-" + f.id });
    const out = el("output", {}, f.nilai + "%");
    lab.append(f.nama + ": ", out);
    const r = el("input", { type: "range", id: "sim-" + f.id, min: 0, max: 100, value: f.nilai });
    r.oninput = () => { f.nilai = +r.value; out.textContent = f.nilai + "%"; hitung(); };
    box.append(el("div", { className: "slider" }));
    box.lastChild.append(lab, r);
    return r;
  });
  const meter = el("div", { className: "meter" });
  const isi = el("div", { className: "isi" });
  meter.append(isi);
  const hasil = el("p", { className: "skor" });
  const catatan = el("p", { className: "info" });
  const gelembung = el("p", { className: "gelembung", "aria-hidden": "true" });
  box.append(el("h3", {}, "Laju fotosintesis"), meter, hasil, gelembung, catatan);
  function hitung() {
    const min = Math.min(...faktor.map((f) => f.nilai));
    const pembatas = faktor.filter((f) => f.nilai === min).map((f) => f.nama.toLowerCase());
    isi.style.width = min + "%";
    hasil.textContent = min + "%";
    gelembung.textContent = "O₂ ".repeat(Math.round(min / 10)) || "—";
    catatan.textContent = min === 0
      ? "Fotosintesis berhenti: " + pembatas.join(", ") + " habis."
      : min >= 90 ? "Semua faktor cukup. Laju hampir maksimal."
      : "Faktor pembatas: " + pembatas.join(" dan ") + ". Menambah faktor lain tidak akan menaikkan laju.";
  }
  hitung();
})();
