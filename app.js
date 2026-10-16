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
  let n = 0, skor = 0;
  const mulai = () => { n = 0; skor = 0; soal(); };
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
        if (idx === q.benar) { skor++; umpan.textContent = "Benar! 🎉"; }
        else { b.classList.add("salah"); umpan.textContent = "Kurang tepat."; }
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
    box.append(el("h2", {}, "Hasil Kuis"), el("p", { className: "skor" }, `${skor} / ${DATA.kuis.length} benar (nilai ${nilai})`), ulang);
  };
  mulai();
})();
