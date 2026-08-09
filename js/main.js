/* ==========================================================================
   farrel0xx_ — boot, matrix rain, typewriter, scroll effects
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

  const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ01<>/\\$#_=+-*";
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
    // static grid instead of animation
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
     BOOT SEQUENCE
     ============================================================ */
  const bootEl = document.getElementById("boot");
  const logEl = document.getElementById("boot-log");
  const skipEl = document.getElementById("boot-skip");
  const siteEl = document.getElementById("site");

  const bootLines = [
    "SUMANTRI BIOS v2.06.11 — secure boot",
    "CPU: sumantri @ 8+ thn pengalaman · MEMORY: 16384MB OK",
    "Memeriksa pipeline data layanan kesehatan ........ [ OK ]",
    "Memuat python3.11 ................................. [ OK ]",
    "Memuat microsoft-excel ............................ [ OK ]",
    "Memuat sirs-online (Kemkes) ....................... [ OK ]",
    "Memuat klaim-bpjs (INA-CBGs) ...................... [ OK ]",
    "Memulai asisten suara AI .......................... [ OK ]",
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
      // dump remaining lines instantly, then login line typed fast
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
        setTimeout(nextLine, reduceMotion ? 0 : 90);
      } else {
        // login prompt — type the username
        typeInto(logEl, "sumantri", 70, () => {
          setTimeout(() => logEl.textContent += "\nPassword: ********\n", 300);
          setTimeout(() => {
            logEl.textContent += "\nLogin terakhir: " + new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) + "\n";
            logEl.textContent += "$ whoami\n> sumantri\n$ ./portfolio --run\n";
            setTimeout(finishBoot, 650);
          }, 850);
        });
      }
    })();

    // click / keypress anywhere skips to end of boot
    const skipHandler = () => skip();
    if (!reduceMotion) {
      setTimeout(() => {
        bootEl.addEventListener("click", skipHandler, { once: true });
        document.addEventListener("keydown", skipHandler, { once: true });
      }, 600);
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
    "> learn → build → break → fix → repeat .............."
  ];
  let roleIdx = 0, started = false;

  function startHeroTyping() {
    if (started || reduceMotion) {
      if (reduceMotion) {
        typedEl.textContent = roles[0].replace(/>/g, "$").replace(/\.+$/,"");
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
      if (i < full.length) setTimeout(t, 34);
      else setTimeout(erase, 1900);
    })();
    function erase() {
      (function e() {
        typedEl.textContent = full.slice(0, --i);
        if (i > 0) setTimeout(e, 16);
        else { roleIdx = (roleIdx + 1) % roles.length; setTimeout(typeRole, 350); }
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
  }, { threshold: 0.12 });
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
        // fallback
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
})();
