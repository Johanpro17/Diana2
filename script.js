/* ---------- Particles / hearts background ---------- */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const COLORS = ['#ff4d6d', '#ff8fa3', '#ffd166', '#ffffff'];

function spawnParticle() {
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 2.2 + 0.6,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4 - 0.15,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: Math.random() * 0.5 + 0.2,
    life: Math.random() * 200 + 100,
    age: 0,
    heart: Math.random() < 0.18,
  };
}

function initParticles() {
  const count = Math.min(90, Math.floor((W * H) / 14000));
  particles = Array.from({ length: count }, spawnParticle);
}
initParticles();

function drawHeart(x, y, size, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  const s = size;
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
  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.age++;
    if (p.x < -10) p.x = W + 10;
    if (p.x > W + 10) p.x = -10;
    if (p.y < -10) p.y = H + 10;
    if (p.y > H + 10) p.y = -10;
    const fade = p.age < 40 ? p.age / 40 : (p.life - p.age) / (p.life - 40);
    const a = p.alpha * Math.max(0, Math.min(1, fade));
    if (p.heart) drawHeart(p.x, p.y, p.r * 4, p.color, a);
    else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = a;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (p.age > p.life) particles[i] = spawnParticle();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ---------- Intro typing messages ---------- */
const messages = [
  'Diana, eres la melodía más hermosa que la vida puso en mi camino.',
  'Cada vez que te veo sonreír, mi motor se acelera sin control.',
  'No hay ruta larga cuando el destino eres tú.',
  'Pronto serás mi esposa, y cada amanecer será nuestro.',
  'Te amo más que a la libertad sobre dos ruedas. ❤',
];

const msgBox = document.getElementById('introMessages');
let msgIndex = 0;
let charIndex = 0;
let deleting = false;
let typedSpan = null;

function createTyped() {
  msgBox.innerHTML = '';
  typedSpan = document.createElement('span');
  typedSpan.className = 'typed';
  msgBox.appendChild(typedSpan);
}
createTyped();

function typeLoop() {
  const current = messages[msgIndex];
  if (!deleting) {
    typedSpan.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 2200);
      return;
    }
    setTimeout(typeLoop, 45);
  } else {
    typedSpan.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      msgIndex = (msgIndex + 1) % messages.length;
      setTimeout(typeLoop, 400);
      return;
    }
    setTimeout(typeLoop, 22);
  }
}
typeLoop();

/* ---------- Enter button ---------- */
const enterBtn = document.getElementById('enterBtn');
const intro = document.getElementById('intro');
enterBtn.addEventListener('click', () => {
  intro.classList.add('hidden');
  document.body.classList.add('entered');
  setTimeout(() => { intro.style.display = 'none'; }, 650);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- Nav ---------- */
const nav = document.querySelector('.nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav__links');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

/* ---------- Reveal on scroll ---------- */
const revealEls = document.querySelectorAll('[data-reveal]');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

/* ---------- Lightbox ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.gallery__item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const cap = item.querySelector('figcaption');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = cap ? cap.textContent : '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});
function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

/* ---------- Year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Parallax subtle on hero visual ---------- */
const heroVisual = document.querySelector('.hero__visual');
window.addEventListener('mousemove', (e) => {
  if (!heroVisual) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 12;
  const y = (e.clientY / window.innerHeight - 0.5) * 12;
  heroVisual.style.transform = `translate(${x}px, ${y}px)`;
});