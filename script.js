(function () {
  'use strict';

  /* ---------- Smooth scroll ---------- */
  document.querySelectorAll('[data-scroll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = document.querySelector(btn.getAttribute('data-scroll'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  document.querySelectorAll('.indeks a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var t = document.querySelector(a.getAttribute('href'));
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------- Reveal saat scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var el = en.target;
          var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
          el.style.transitionDelay = Math.min(idx, 5) * 80 + 'ms';
          el.classList.add('tampil');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('tampil'); });
  }

  /* ---------- Indeks aktif ---------- */
  var links = document.querySelectorAll('.indeks a');
  var secs = Array.prototype.map.call(links, function (a) {
    return document.querySelector(a.getAttribute('href'));
  });
  function setAktif() {
    var pos = window.scrollY + window.innerHeight * 0.4;
    var cur = 0;
    secs.forEach(function (s, i) { if (s && s.offsetTop <= pos) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('on', i === cur); });
  }
  window.addEventListener('scroll', setAktif, { passive: true });
  setAktif();

  /* ---------- Kartu membalik ---------- */
  document.querySelectorAll('.flip').forEach(function (k) {
    function toggle() { k.classList.toggle('terbalik'); }
    k.addEventListener('click', toggle);
    k.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  /* ---------- Lightbox koleksi ---------- */
  var lb = document.getElementById('lightbox');
  var lbJ = document.getElementById('lbJudul');
  var lbI = document.getElementById('lbIsi');
  document.querySelectorAll('.tempel').forEach(function (t) {
    t.setAttribute('tabindex', '0');
    function buka() {
      lbJ.innerHTML = t.getAttribute('data-judul');
      lbI.textContent = t.getAttribute('data-isi');
      lb.hidden = false;
      document.getElementById('lbTutup').focus();
    }
    t.addEventListener('click', buka);
    t.addEventListener('keydown', function (e) { if (e.key === 'Enter') buka(); });
  });
  function tutupLb() { lb.hidden = true; }
  document.getElementById('lbTutup').addEventListener('click', tutupLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) tutupLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') tutupLb(); });

  /* ---------- Map (tab) ---------- */
  var tabs = document.querySelectorAll('.map-tab button');
  tabs.forEach(function (b) {
    b.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.remove('aktif'); });
      document.querySelectorAll('.map').forEach(function (m) { m.classList.remove('aktif'); });
      b.classList.add('aktif');
      document.getElementById('map-' + b.getAttribute('data-map')).classList.add('aktif');
    });
  });

  /* ---------- Mesin tik interaktif: catatan kenyataan ---------- */
  var catatanMesin = [
    {
      janji: '“Kemakmuran Bersama Asia Timur Raya”',
      fakta: 'Kenyataannya: Sumber daya dikuras untuk perang; beras, hasil bumi, dan logam diangkut, sementara rakyat dilanda kelaparan.'
    },
    {
      janji: '“Saudara Tua pembebas Asia”',
      fakta: 'Kenyataannya: Pemerintahan militer menggantikan pemerintahan kolonial. Kebebasan berserikat dan berpendapat tetap dikekang.'
    },
    {
      janji: '“Kerja bakti demi kemenangan bersama”',
      fakta: 'Kenyataannya: Romusha dipaksa bekerja tanpa makanan dan perawatan memadai. Banyak yang tidak pernah kembali.'
    },
    {
      janji: '“Indonesia dan Nippon saling membantu”',
      fakta: 'Kenyataannya: Perempuan dijadikan jugun ianfu, dan Kempeitai menangkap serta menyiksa mereka yang dicurigai melawan.'
    },
    {
      janji: '“Indonesia akan dimerdekakan”',
      fakta: 'Kenyataannya: Janji kemerdekaan baru disampaikan setelah Jepang terdesak perang (1944), dan dipakai untuk menjaga dukungan rakyat.'
    }
  ];
  var tombolMesin = document.getElementById('mesinTombol');
  var bukuMesin = document.getElementById('bukuMesin');
  var statusMesin = document.getElementById('statusMesin');
  var indeksCatatan = 0;
  var sedangMengetik = false;

  function ketik(teks, elemen, selesai) {
    var karakter = Array.from(teks);
    var posisi = 0;
    elemen.classList.add('sedang-mengetik');
    function langkah() {
      if (posisi < karakter.length) {
        elemen.textContent += karakter[posisi];
        posisi += 1;
        window.setTimeout(langkah, 32);
      } else {
        elemen.classList.remove('sedang-mengetik');
        selesai();
      }
    }
    langkah();
  }

  tombolMesin.addEventListener('click', function () {
    if (sedangMengetik || indeksCatatan >= catatanMesin.length) return;
    sedangMengetik = true;
    tombolMesin.disabled = true;
    tombolMesin.setAttribute('aria-label', 'Mesin tik sedang mengetik');
    var catatan = catatanMesin[indeksCatatan];
    var hasil = document.createElement('article');
    hasil.className = 'hasil-ketik';
    var labelJanji = document.createElement('p');
    labelJanji.className = 'label';
    labelJanji.textContent = 'Yang dikatakan';
    var janji = document.createElement('p');
    janji.className = 'janji';
    var fakta = document.createElement('p');
    fakta.className = 'fakta';
    var cap = document.createElement('span');
    cap.className = 'cap cap-mesin';
    cap.textContent = 'TIDAK TERBUKTI';
    cap.setAttribute('aria-hidden', 'true');
    hasil.appendChild(labelJanji);
    hasil.appendChild(janji);
    hasil.appendChild(fakta);
    hasil.appendChild(cap);
    bukuMesin.appendChild(hasil);
    statusMesin.textContent = 'Mengetik catatan ' + (indeksCatatan + 1) + ' dari ' + catatanMesin.length + '...';

    ketik(catatan.janji, janji, function () {
      ketik(catatan.fakta, fakta, function () {
        hasil.classList.add('dicap');
        indeksCatatan += 1;
        sedangMengetik = false;
        if (indeksCatatan < catatanMesin.length) {
          tombolMesin.disabled = false;
          tombolMesin.setAttribute('aria-label', 'Lanjutkan ke catatan ' + (indeksCatatan + 1));
          statusMesin.textContent = 'Catatan ' + indeksCatatan + ' selesai. Klik mesin tik untuk catatan berikutnya.';
        } else {
          tombolMesin.setAttribute('aria-label', 'Semua catatan telah dibuka');
          statusMesin.textContent = 'Semua catatan telah dibuka.';
        }
      });
    });
  });

  /* ---------- Gulungan ---------- */
  var gulung = document.getElementById('gulung');
  var tombolG = document.getElementById('gulungTombol');
  var dalam = document.getElementById('gulungDalam');
  function hitungLebar() {
    var w = Math.min(gulung.clientWidth, 960) - 2 * (window.innerWidth < 600 ? 24 : 34);
    gulung.style.setProperty('--lebar', Math.max(w, 200) + 'px');
  }
  hitungLebar();
  window.addEventListener('resize', hitungLebar);

  function toggleGulung() {
    var buka = !gulung.classList.contains('buka');
    gulung.classList.toggle('buka', buka);
    tombolG.textContent = buka ? 'Gulung kembali' : 'Buka gulungan';
    tombolG.setAttribute('aria-expanded', String(buka));
    if (buka) {
      setTimeout(function () {
        gulung.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  }
  gulung.addEventListener('click', function (e) {
    if (!gulung.classList.contains('buka') || e.target === tombolG) toggleGulung();
  });

  /* ---------- Kesimpulan interaktif ---------- */
  var isi = {
    ya: {
      judul: 'Ya — dalam batas tertentu.',
      cap: 'BERHASIL SEBAGIAN',
      p: [
        'Propaganda berhasil membuat sebagian orang percaya pada citra “Saudara Tua”, terutama di awal pendudukan ketika kebencian pada kolonialisme Belanda masih kuat. Jepang juga berhasil memobilisasi tenaga, hasil bumi, dan pemuda lewat organisasi massa, sekolah, dan pelatihan militer.',
        'Pengerahan romusha dan penguasaan media membuktikan bahwa propaganda efektif bila disertai pengawasan dan paksaan.'
      ]
    },
    tidak: {
      judul: 'Tidak — pada tujuan utamanya.',
      cap: 'GAGAL',
      p: [
        'Kenyataan pahit seperti kelaparan, romusha, dan kekerasan cepat membuka mata rakyat bahwa janji “kemakmuran bersama” tidak sesuai dengan yang dialami. Kepercayaan pun merosot dan perlawanan bermunculan.',
        'Lebih jauh lagi, pengalaman bersama selama pendudukan dan pelatihan yang diberikan Jepang justru dipakai bangsa Indonesia untuk memperkuat kesadaran nasional, dan pada 17 Agustus 1945 kemerdekaan diproklamasikan.'
      ]
    }
  };
  var jawab = document.getElementById('jawaban');
  var pilih = document.querySelectorAll('.pilih');
  pilih.forEach(function (b) {
    b.addEventListener('click', function () {
      var d = isi[b.getAttribute('data-j')];
      pilih.forEach(function (x) { x.classList.remove('dipilih'); });
      b.classList.add('dipilih');
      jawab.innerHTML =
        '<div class="kertas-jawab"><span class="cap2">' + d.cap + '</span>' +
        '<h3>' + d.judul + '</h3>' +
        d.p.map(function (t) { return '<p>' + t + '</p>'; }).join('') +
        '<p><b>Catatan penutup:</b> kedua jawaban memuat sebagian kebenaran. Propaganda berhasil memobilisasi, tetapi gagal merebut hati rakyat.</p></div>';
    });
  });
})();
