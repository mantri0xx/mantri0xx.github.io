# mantri0xx_ — Terminal Hacker Portfolio 🔥

Single-page portfolio website dengan tema **terminal hacker**:
neon green di atas hitam pekat, boot animation, matrix rain, glitch effects.

## ▶️ Cara Menjalankan

Langsung double-click `index.html`, atau via server lokal:

```bash
cd ~/portfolio
python3 -m http.server 8080
```

Buka `http://localhost:8080` di browser.

## 🎨 Fitur

- **Boot sequence** — animasi booting terminal ala BIOS (`SUMANTRI BIOS login:`), bisa di-skip dengan klik
- **Matrix rain** — background canvas animasi, pause saat tab tidak aktif
- **Floating particles** — 40 particles + connecting lines
- **Typewriter** — rotating roles di hero (`whoami`)
- **Terminal windows** — semua section dibungkus window bergaya terminal dengan traffic-light dots
- **Scroll reveal + scrollspy** — animasi masuk per-section & navigasi tab aktif
- **Scroll progress bar** — gradient hijau-cyan-ungu di atas layar
- **Holographic badge** — rainbow gradient + shine effect
- **Copy-to-clipboard** — tombol ⧉ di section contact
- **Responsive** — mobile friendly
- **`prefers-reduced-motion`** — animasi dinonaktifkan untuk pengguna yang membutuhkan

## 📂 Struktur

```
portfolio/
├── index.html      # semua section
├── css/style.css   # tema + animasi
├── js/main.js      # boot, matrix, typewriter, interaksi
├── foto_suman.jpg  # profil foto
└── README.md
```

## 🚀 Deploy ke GitHub Pages

1. Buat repo publik, misal `mantri0xx.github.io`
2. Copy isi folder `portfolio/` ke repo
3. Push:
   ```bash
   git init
   git add .
   git commit -m "init portfolio"
   git branch -M main
   git remote add origin https://github.com/mantri0xx/mantri0xx.github.io.git
   git push -u origin main
   ```
4. Selesai — live di `https://mantri0xx.github.io`

## 🛠 Tech

HTML + CSS + JS murni. **Zero dependencies, no build step** — biar gampang di-hosting di mana aja.

---

© 2026 mantri0xx_ · built with ♥ + ☕ in Palembang
