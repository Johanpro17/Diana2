/* =========================================================
   Página romántica de Diana — interacciones y animaciones
   ========================================================= */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Año ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Bloqueo de scroll en la portada ---------- */
  document.body.classList.add('intro-open');

  /* ---------- Canvas: partículas y corazones ---------- */
  const canvas = $('#particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W = 0, H = 0, DPR = 1;

  const COLORS = ['#ff4d6d', '#ff8fa3', '#ffd166', '#ffffff', '#9b5de5'];

  function resizeCanvas() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35 - 0.12,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      alpha: Math.random() * 0.5 + 0.15,
      life: Math.random() * 240 + 120,
      age: 0,
      heart: Math.random() < 0.2,
    };
  }

  function initParticles() {
    const density = isTouch ? 26000 : 15000;
    const count = Math.min(isTouch ? 45 : 95, Math.floor((W * H) / density));
    particles = Array.from({ length: count }, makeParticle);
  }

  function drawHeart(x, y, size, color, alpha) {
    const s = size;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y + s / 4);
    ctx.bezierCurveTo(x, y, x - s / 2, y, x - s / 2, y + s / 4);
    ctx.bezierCurveTo(x - s / 2, y + s / 2, x, y + s * 0.7, x, y + s);
    ctx.bezierCurveTo(x, y + s * 0.7, x + s / 2, y + s / 2, x + s / 2, y + s / 4);
    ctx.bezierCurveTo(x + s / 2, y, x, y, x, y + s / 4);
    ctx.fill();
    ctx.restore();
  }

  function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.age++;

      if (p.x < -12) p.x = W + 12;
      if (p.x > W + 12) p.x = -12;
      if (p.y < -12) p.y = H + 12;
      if (p.y > H + 12) p.y = -12;

      const fadeIn = p.age < 40 ? p.age / 40 : 1;
      const fadeOut = (p.life - p.age) / 60;
      const a = p.alpha * Math.max(0, Math.min(fadeIn, fadeOut, 1));

      if (p.heart) {
        drawHeart(p.x, p.y, p.r * 4.5, p.color, a);
      } else {
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      if (p.age > p.life) particles[i] = makeParticle();
    }
    requestAnimationFrame(animateParticles);
  }

  if (!reduceMotion) {
    resizeCanvas();
    initParticles();
    animateParticles();
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeCanvas();
        initParticles();
      }, 180);
    });
  } else {
    canvas.style.display = 'none';
  }

  /* ---------- Portada: corazones flotantes ---------- */
  const introFloating = $('#introFloating');
  if (introFloating && !reduceMotion) {
    const total = isTouch ? 10 : 18;
    for (let i = 0; i < total; i++) {
      const h = document.createElement('span');
      h.className = 'fh';
      h.textContent = '❤';
      h.style.left = Math.random() * 100 + '%';
      h.style.fontSize = (Math.random() * 0.9 + 0.6) + 'rem';
      h.style.animationDuration = (Math.random() * 8 + 8) + 's';
      h.style.animationDelay = (-Math.random() * 14) + 's';
      h.style.opacity = '0';
      introFloating.appendChild(h);
    }
  }

  /* ---------- Portada: mensajes con efecto typing ---------- */
  const messages = [
    'Diana, eres la melodía más hermosa que la vida puso en mi camino.',
    'Cada vez que te veo sonreír, mi motor se acelera sin control.',
    'No hay ruta larga cuando el destino eres tú.',
    'Pronto serás mi esposa, y cada amanecer será nuestro.',
    'Te amo más que a la libertad sobre dos ruedas. ❤',
  ];
  const msgBox = $('#introMessages');
  let msgIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let typedSpan = null;

  function createTypedSpan() {
    msgBox.innerHTML = '';
    typedSpan = document.createElement('span');
    typedSpan.className = 'typed';
    msgBox.appendChild(typedSpan);
  }

  function typeLoop() {
    if (!typedSpan) return;
    const current = messages[msgIndex];

    if (!deleting) {
      typedSpan.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 2300);
        return;
      }
      setTimeout(typeLoop, 42);
    } else {
      typedSpan.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex <= 0) {
        deleting = false;
        msgIndex = (msgIndex + 1) % messages.length;
        setTimeout(typeLoop, 420);
        return;
      }
      setTimeout(typeLoop, 20);
    }
  }

  if (msgBox) {
    createTypedSpan();
    typeLoop();
  }

  /* ---------- Portada: entrar / saltar ---------- */
  const intro = $('#intro');
  const enterBtn = $('#enterBtn');
  const skipBtn = $('#skipBtn');

  function enterSite() {
    if (!intro) return;
    intro.classList.add('is-hidden');
    document.body.classList.remove('intro-open');
    setTimeout(() => {
      intro.style.display = 'none';
    }, 750);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    startMusicOnce();
  }

  if (enterBtn) enterBtn.addEventListener('click', enterSite);
  if (skipBtn) skipBtn.addEventListener('click', enterSite);

  /* ---------- Música: El mímico básico → La chica interesada ---------- */
  const tracks = [
    { src: 'audio/mimico-basico.m4a', title: 'El mímico básico' },
    { src: 'audio/chica-interesada.m4a', title: 'La chica interesada' },
  ];
  const audio = $('#bgMusic');
  const musicPlayer = $('#musicPlayer');
  const musicToggle = $('#musicToggle');
  const musicNext = $('#musicNext');
  const musicTrack = $('#musicTrack');
  let trackIndex = 0;
  let musicLoaded = false;
  let musicStarted = false;

  function setPlayingUI(playing) {
    if (musicPlayer) musicPlayer.classList.toggle('playing', playing);
    if (musicToggle) {
      musicToggle.setAttribute('aria-pressed', String(playing));
      musicToggle.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
    }
  }

  function playMusic() {
    if (!audio) return;
    const attempt = audio.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(() => {
        musicStarted = false;
        setPlayingUI(false);
      });
    }
  }

  function loadTrack(index, autoplay) {
    if (!audio || !tracks.length) return;
    trackIndex = (index + tracks.length) % tracks.length;
    audio.src = tracks[trackIndex].src;
    audio.volume = 0.65;
    musicLoaded = true;
    if (musicTrack) musicTrack.textContent = tracks[trackIndex].title;
    if (autoplay) playMusic();
  }

  function startMusicOnce() {
    if (musicStarted) return;
    musicStarted = true;
    loadTrack(0, true);
  }

  if (audio) {
    audio.addEventListener('play', () => setPlayingUI(true));
    audio.addEventListener('pause', () => setPlayingUI(false));
    audio.addEventListener('ended', () => loadTrack(trackIndex + 1, true));
    audio.addEventListener('error', () => {
      setPlayingUI(false);
      if (musicTrack && musicLoaded) musicTrack.textContent = 'No se pudo cargar el audio';
    });
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      if (!musicLoaded) {
        musicStarted = true;
        loadTrack(0, true);
        return;
      }
      if (audio.paused) {
        musicStarted = true;
        playMusic();
      } else {
        audio.pause();
      }
    });
  }

  if (musicNext) {
    musicNext.addEventListener('click', () => {
      musicStarted = true;
      loadTrack(trackIndex + 1, true);
    });
  }

  /* ---------- Navegación ---------- */
  const nav = $('#mainNav');
  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');
  const navAnchors = $$('.nav__link');

  function closeMenu() {
    if (!navLinks) return;
    navLinks.classList.remove('open');
    if (navToggle) {
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  navAnchors.forEach((a) =>
    a.addEventListener('click', () => {
      closeMenu();
      // Si la portada sigue abierta, cerrarla y dejar que el ancla navegue.
      if (intro && !intro.classList.contains('is-hidden')) {
        intro.classList.add('is-hidden');
        document.body.classList.remove('intro-open');
        setTimeout(() => { intro.style.display = 'none'; }, 750);
        startMusicOnce();
      }
    })
  );
  document.addEventListener('click', (e) => {
    if (!navLinks || !navToggle) return;
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  let lastScroll = -1;
  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 30);

    const toTop = $('#toTop');
    if (toTop) toTop.classList.toggle('show', y > 600);

    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const bar = $('#progressBar');
    if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

    lastScroll = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Sección activa en la navegación ---------- */
  const sections = $$('main section[id], header[id]');
  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navAnchors.forEach((a) => {
            a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => navObserver.observe(s));
  }

  /* ---------- Revelado al hacer scroll con retraso escalonado ---------- */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const siblings = Array.from(el.parentElement.children).filter((c) => c.hasAttribute('data-reveal'));
          const idx = siblings.indexOf(el);
          el.style.setProperty('--delay', Math.max(0, idx) * 0.09 + 's');
          el.classList.add('revealed');
          obs.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('revealed'));
  }

  /* ---------- Efecto tilt 3D ---------- */
  if (!isTouch && !reduceMotion) {
    $$('.tilt').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ---------- Resplandor del cursor ---------- */
  const glow = $('#cursorGlow');
  if (glow && !isTouch && !reduceMotion) {
    let gx = window.innerWidth / 2;
    let gy = window.innerHeight / 2;
    let tx = gx, ty = gy;
    window.addEventListener('pointermove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
    }, { passive: true });
    (function follow() {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.left = gx + 'px';
      glow.style.top = gy + 'px';
      requestAnimationFrame(follow);
    })();
  }

  /* ---------- Galería: lightbox con navegación ---------- */
  const galleryItems = $$('.gallery__item');
  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightboxImg');
  const lightboxCaption = $('#lightboxCaption');
  const lightboxClose = $('#lightboxClose');
  const lightboxPrev = $('#lightboxPrev');
  const lightboxNext = $('#lightboxNext');
  let currentIndex = 0;

  function openLightbox(index) {
    if (!galleryItems.length || !lightbox) return;
    currentIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    const img = $('img', item);
    const cap = $('figcaption', item);
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = cap ? cap.textContent.trim() : '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function stepLightbox(dir) {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    openLightbox(currentIndex + dir);
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(i);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); stepLightbox(-1); });
  if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); stepLightbox(1); });
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  });

  // Deslizar en móvil
  let touchStartX = 0;
  if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) stepLightbox(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* ---------- Razones: voltear tarjetas ---------- */
  $$('.reason').forEach((card) => {
    card.addEventListener('click', () => card.classList.toggle('is-flipped'));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('is-flipped');
      }
    });
  });

  /* ---------- Botón del corazón: lluvia de corazones ---------- */
  const heartBtn = $('#heartBtn');
  const burstLayer = $('#burstLayer');
  if (heartBtn && burstLayer) {
    heartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = heartBtn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const total = isTouch ? 12 : 20;
      for (let i = 0; i < total; i++) {
        const h = document.createElement('span');
        h.className = 'burst-heart';
        h.textContent = Math.random() < 0.25 ? '💖' : '❤';
        h.style.left = cx + 'px';
        h.style.top = cy + 'px';
        h.style.setProperty('--dx', (Math.random() - 0.5) * 340 + 'px');
        h.style.setProperty('--dy', (-Math.random() * 320 - 60) + 'px');
        h.style.setProperty('--rot', (Math.random() - 0.5) * 220 + 'deg');
        h.style.fontSize = (Math.random() * 0.9 + 0.9) + 'rem';
        h.style.animationDelay = (Math.random() * 0.2) + 's';
        burstLayer.appendChild(h);
        setTimeout(() => h.remove(), 1900);
      }
    });
  }

  /* ---------- Volver arriba ---------- */
  const toTop = $('#toTop');
  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Parallax suave del hero ---------- */
  const heroVisual = $('.hero__visual');
  if (heroVisual && !isTouch && !reduceMotion) {
    let hx = 0, hy = 0, htx = 0, hty = 0;
    window.addEventListener('pointermove', (e) => {
      htx = (e.clientX / window.innerWidth - 0.5) * 16;
      hty = (e.clientY / window.innerHeight - 0.5) * 16;
    }, { passive: true });
    (function heroFollow() {
      hx += (htx - hx) * 0.06;
      hy += (hty - hy) * 0.06;
      heroVisual.style.transform = `translate(${hx.toFixed(2)}px, ${hy.toFixed(2)}px)`;
      requestAnimationFrame(heroFollow);
    })();
  }

  /* ---------- Pausa animaciones al ocultar pestaña ---------- */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.documentElement.style.setProperty('--paused', '1');
    } else {
      document.documentElement.style.removeProperty('--paused');
    }
  });
})();
