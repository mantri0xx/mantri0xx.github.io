/* ==========================================================================
   mantri0xx_ — boot, matrix rain, particles, typewriter, scroll effects v2
   ========================================================================== */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============================================================
     MATRIX RAIN
     ============================================================ */
  const canvas = document.getElementById("matrix");
  const ctx = canvas.getContext("2d");
  let cols = 0, drops = [];
  const FONT = 14;

  function sizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / FONT);
    drops = Array(cols).fill(0).map(() => Math.floor(Math.random() * -60));
  }
  sizeCanvas();
  window.addEventListener("resize", sizeCanvas);

  const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ01<>/\\$#_=+-*{}[]|;:";
  function drawMatrix() {
    ctx.fillStyle = "rgba(4, 6, 10, 0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = FONT + "px monospace";
    for (let i = 0; i < cols; i++) {
      const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
      ctx.fillStyle = Math.random() > 0.975 ? "#ccffdd" : (Math.random() > 0.5 ? "#33ff77" : "#18a355");
      ctx.fillText(ch, i * FONT, drops[i] * FONT);
      if (drops[i] * FONT > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    raf = requestAnimationFrame(drawMatrix);
  }
  let raf = null;
  function stopMatrix() { if (raf) cancelAnimationFrame(raf); }
  function startMatrix() { if (raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(drawMatrix); }
  if (reduceMotion) {
    for (let i = 0; i < cols; i++) {
      ctx.font = FONT + "px monospace";
      ctx.fillStyle = "rgba(51,255,119,.18)";
      ctx.fillText(CHARS[i % CHARS.length], i * FONT, (Math.abs((i * 37) % 40) + 1) * FONT);
    }
  } else {
    startMatrix();
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopMatrix(); else startMatrix();
    });
  }

  /* ============================================================
     FLOATING PARTICLES
     ============================================================ */
  const pCanvas = document.getElementById("particles");
  const pCtx = pCanvas.getContext("2d");
  let particles = [];
  const PARTICLE_COUNT = 40;

  function sizeParticles() {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
  }
  sizeParticles();
  window.addEventListener("resize", sizeParticles);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * pCanvas.width;
      this.y = Math.random() * pCanvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.color = Math.random() > 0.5 ? "51,255,119" : "0,229,255";
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulse += this.pulseSpeed;
      if (this.x < 0 || this.x > pCanvas.width || this.y < 0 || this.y > pCanvas.height) {
        this.reset();
      }
    }
    draw() {
      const currentOpacity = this.opacity * (0.6 + Math.sin(this.pulse) * 0.4);
      pCtx.beginPath();
      pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      pCtx.fillStyle = `rgba(${this.color},${currentOpacity})`;
      pCtx.fill();
      // glow
      pCtx.beginPath();
      pCtx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      pCtx.fillStyle = `rgba(${this.color},${currentOpacity * 0.15})`;
      pCtx.fill();
    }
  }

  if (!reduceMotion) {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
    let pRaf = null;
    function drawParticles() {
      pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
      particles.forEach(p => { p.update(); p.draw(); });

      // draw lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const opacity = (1 - dist / 150) * 0.12;
            pCtx.beginPath();
            pCtx.moveTo(particles[i].x, particles[i].y);
            pCtx.lineTo(particles[j].x, particles[j].y);
            pCtx.strokeStyle = `rgba(51,255,119,${opacity})`;
            pCtx.lineWidth = 0.5;
            pCtx.stroke();
          }
        }
      }
      pRaf = requestAnimationFrame(drawParticles);
    }
    drawParticles();
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { if (pRaf) cancelAnimationFrame(pRaf); }
      else { drawParticles(); }
    });
  }

  /* ============================================================
     BOOT SEQUENCE
     ============================================================ */
  const bootEl = document.getElementById("boot");
  const logEl = document.getElementById("boot-log");
  const skipEl = document.getElementById("boot-skip");
  const siteEl = document.getElementById("site");

  const bootLines = [
    "SUMANTRI BIOS v3.01.26 — secure boot",
    "CPU: sumantri @ 8+ thn pengalaman · MEMORY: 16384MB OK",
    "GPU: webdev-accelerator (three.js, next.js) ........ [ OK ]",
    "MEM: Universitas STIA SATYA NEGARA ................. [ OK ]",
    "Memeriksa pipeline data layanan kesehatan ........ [ OK ]",
    "Memuat python3.11 ................................. [ OK ]",
    "Memuat microsoft-excel ............................ [ OK ]",
    "Memuat sirs-online (Kemkes) ....................... [ OK ]",
    "Memuat klaim-bpjs (INA-CBGs) ...................... [ OK ]",
    "Memuat next.js-16 + prisma-7 ...................... [ OK ]",
    "Memuat three.js (3D renderer) ..................... [ OK ]",
    "Memulai asisten suara AI .......................... [ OK ]",
    "Memuat XSS scanner ................................ [ OK ]",
    "Menghubungkan HEALTHKATHON-2025 ................... [ OK ]",
    " ",
    "sumantri login: "
  ];

  let bootDone = false;

  function typeInto(el, text, speed, cb) {
    let i = 0;
    (function step() {
      el.textContent += text[i++];
      if (i < text.length) setTimeout(step, speed);
      else if (cb) cb();
    })();
  }

  function finishBoot() {
    if (bootDone) return;
    bootDone = true;
    bootEl.classList.add("hide");
    siteEl.hidden = false;
    requestAnimationFrame(() => siteEl.classList.add("on"));
    setTimeout(() => { bootEl.remove(); }, 700);
    startHeroTyping();
  }

  function runBoot() {
    logEl.textContent = "";
    let line = 0;
    const skip = () => {
      while (line < bootLines.length) logEl.textContent += bootLines[line++] + "\n";
      typeInto(logEl, "sumantri", 40, () => {
        setTimeout(() => logEl.textContent += "\n" + "Password: ********\n", 250);
        setTimeout(() => {
          logEl.textContent += "\nLogin terakhir: " + new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) + "\n";
          logEl.textContent += "$ whoami\n> sumantri\n$ ./portfolio --run\n";
          setTimeout(finishBoot, 600);
        }, 700);
      });
    };

    (function nextLine() {
      if (line < bootLines.length) {
        logEl.textContent += bootLines[line++] + "\n";
        setTimeout(nextLine, reduceMotion ? 0 : 80);
      } else {
        typeInto(logEl, "sumantri", 65, () => {
          setTimeout(() => logEl.textContent += "\nPassword: ********\n", 280);
          setTimeout(() => {
            logEl.textContent += "\nLogin terakhir: " + new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) + "\n";
            logEl.textContent += "$ whoami\n> sumantri\n$ ./portfolio --run\n";
            setTimeout(finishBoot, 600);
          }, 800);
        });
      }
    })();

    const skipHandler = () => skip();
    if (!reduceMotion) {
      setTimeout(() => {
        bootEl.addEventListener("click", skipHandler, { once: true });
        document.addEventListener("keydown", skipHandler, { once: true });
      }, 500);
    }
    skipEl.textContent = "[ click anywhere to skip ]";
  }

  /* ============================================================
     TYPEWRITER (hero rotating roles)
     ============================================================ */
  const typedEl = document.getElementById("typed-role");
  const roles = [
    "> Mengotomatisasi data rumah sakit dengan Python .....",
    "> 8+ tahun di administrasi & manajemen data .........",
    "> Mendorong efisiensi data naik 30–90% ..............",
    "> Menjaga kepatuhan laporan SIRS Online 100% .........",
    "> Klaim & koding BPJS (INA-CBGs) ....................",
    "> HEALTHKATHON 2025 · BPJS Kesehatan ................",
    "> Web Developer — Next.js, Three.js, Prisma .........",
    "> XSS researcher // mantri0xx_ ......................",
    "> learn → build → break → fix → repeat .............."
  ];
  let roleIdx = 0, started = false;

  function startHeroTyping() {
    if (started || reduceMotion) {
      if (reduceMotion) {
        typedEl.textContent = roles[0];
      }
      return;
    }
    started = true;
    typeRole();
  }

  function typeRole() {
    const full = roles[roleIdx];
    let i = 0;
    (function t() {
      typedEl.textContent = full.slice(0, ++i);
      if (i < full.length) setTimeout(t, 30);
      else setTimeout(erase, 1800);
    })();
    function erase() {
      (function e() {
        typedEl.textContent = full.slice(0, --i);
        if (i > 0) setTimeout(e, 14);
        else { roleIdx = (roleIdx + 1) % roles.length; setTimeout(typeRole, 300); }
      })();
    }
  }

  /* ============================================================
     SCROLL REVEAL + SCROLLSPY
     ============================================================ */
  const sections = Array.from(document.querySelectorAll(".section"));
  const tabs = Array.from(document.querySelectorAll(".tab"));

  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) en.target.classList.add("visible");
    });
  }, { threshold: 0.10 });
  sections.forEach((s) => reveal.observe(s));

  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const id = en.target.id;
      tabs.forEach((t) => t.classList.toggle("active", t.dataset.target === id));
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach((s) => spy.observe(s));

  /* ============================================================
     STAT COUNTER ANIMATION
     ============================================================ */
  if (!reduceMotion) {
    const stats = document.querySelectorAll(".stat-num");
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        if (el.dataset.counted) return;
        el.dataset.counted = "true";
        const text = el.textContent;
        // extract number
        const match = text.match(/(\d+)/);
        if (!match) return;
        const target = parseInt(match[1]);
        const suffix = text.replace(match[1], "").trim();
        const prefix = text.indexOf(match[1]) > 0 ? text.substring(0, text.indexOf(match[1])) : "";
        let current = 0;
        const step = Math.ceil(target / 30);
        const interval = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          el.textContent = prefix + current + suffix;
        }, 30);
      });
    }, { threshold: 0.5 });
    stats.forEach(s => statObserver.observe(s));
  }

  /* ============================================================
     COPY TO CLIPBOARD
     ============================================================ */
  document.querySelectorAll(".contact-row").forEach((row) => {
    const btn = row.querySelector(".copy-btn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const text = row.dataset.copy || "";
      const done = () => {
        const old = btn.textContent;
        btn.textContent = "✓";
        btn.classList.add("copied");
        setTimeout(() => { btn.textContent = old; btn.classList.remove("copied"); }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(done);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        ta.remove();
        done();
      }
    });
  });

  /* ============================================================
     BOOTSTRAP
     ============================================================ */
  runBoot();

  /* ============================================================
     SCROLL PROGRESS BAR
     ============================================================ */
  const progressBar = document.getElementById("scroll-progress");
  if (progressBar) {
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + "%";
    }, { passive: true });
  }
})();
