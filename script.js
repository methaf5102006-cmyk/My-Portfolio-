/* mobile menu */
const menu = document.getElementById('menu');
document.getElementById('burger').onclick = () => menu.classList.toggle('open');
menu.querySelectorAll('a').forEach(a => a.onclick = () => menu.classList.remove('open'));

/* scroll reveal */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.card, .sec h2').forEach(el => { el.classList.add('rv'); io.observe(el); });

/* ---------------- cursor-tracking hero ---------------- */
(function () {
  const hero = document.getElementById('home');
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');

  const COUNT = 64;                              // frames: images/frames/frame_00.webp ... frame_63.webp
  const FACE_X = 0.5, FACE_Y = 0.40;             // chehre ka center (canvas ka %)
  const DEADZONE = 0.12, LERP = 0.26, TAU = Math.PI * 2;

  const frames = [];
  for (let i = 0; i < COUNT; i++) {
    const im = new Image();
    im.src = 'images/frames/frame_' + String(i).padStart(2, '0') + '.webp';
    frames.push(im);
  }
  const center = new Image();
  center.onerror = () => { center.onerror = null; center.src = 'images/character.png'; }; // agar frames nahi, to ek single image
  center.src = 'images/frames/center.webp';
  const ok = im => im.complete && im.naturalWidth > 0;

  /* canvas ka shape frame ke shape se khud set hota hai, taake koi zoom ya khinchav na ho */
  let ratioSet = false;
  function applyRatio(img) {
    if (ratioSet || !img.naturalWidth) return;
    ratioSet = true;
    canvas.style.aspectRatio = img.naturalWidth + ' / ' + img.naturalHeight;
    resize();
  }
  frames[0].addEventListener('load', () => applyRatio(frames[0]));
  center.addEventListener('load', () => applyRatio(center));

  let W = 0, H = 0, last = -9;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;      // hero ki nahi, canvas ki apni size
    if (!W || !H) return;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    last = -9;
  }
  resize();
  window.addEventListener('resize', resize);
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  if (ok(frames[0])) applyRatio(frames[0]); else if (ok(center)) applyRatio(center);

  let px = null, py = null;
  window.addEventListener('pointermove', e => { px = e.clientX; py = e.clientY; }, { passive: true });
  window.addEventListener('pointerleave', () => px = null);

  let ang = -Math.PI / 2, target = ang;
  const lerpAngle = (a, b, t) => { let d = (b - a) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; return a + d * t; };

  /* contain: poori frame dikhe, crop ya zoom nahi */
  function fit(img) {
    const s = Math.min(W / img.naturalWidth, H / img.naturalHeight);
    const w = img.naturalWidth * s, h = img.naturalHeight * s;
    ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
  }

  (function loop() {
    const hr = hero.getBoundingClientRect();
    if (hr.bottom > 0 && hr.top < innerHeight && W && H) {
      const cr = canvas.getBoundingClientRect();           // chehra canvas ke andar hai
      let useCenter = true;
      if (px !== null) {
        const dx = px - (cr.left + cr.width * FACE_X), dy = py - (cr.top + cr.height * FACE_Y);
        useCenter = Math.hypot(dx, dy) < innerWidth * DEADZONE;
        if (!useCenter) target = Math.atan2(dy, dx);
      }
      ang = lerpAngle(ang, target, LERP);
      let t = ((ang + Math.PI / 2) / TAU) % 1; if (t < 0) t += 1;
      const idx = Math.round(t * COUNT) % COUNT;     // frame 0 = UP, clockwise
      const key = useCenter ? -2 : idx;
      const img = useCenter ? center : frames[idx];
      if (key !== last && ok(img)) {                 // sirf EK frame, 100% opacity, no ghosting
        ctx.clearRect(0, 0, W, H); fit(img); last = key;
      }
    }
    requestAnimationFrame(loop);
  })();

  /* custom cursor: desktop only, hero ke andar */
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    const dot = document.getElementById('cdot'), ring = document.getElementById('cring');
    let mx = 0, my = 0, rx = 0, ry = 0;
    hero.classList.add('live');
    hero.addEventListener('mouseenter', () => { dot.classList.add('on'); ring.classList.add('on'); });
    hero.addEventListener('mouseleave', () => { dot.classList.remove('on'); ring.classList.remove('on'); });
    hero.querySelectorAll('a').forEach(a => {
      a.addEventListener('mouseenter', () => ring.classList.add('big'));
      a.addEventListener('mouseleave', () => ring.classList.remove('big'));
    });
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; });
    (function follow() { rx += (mx - rx) * .16; ry += (my - ry) * .16; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(follow); })();
  }
})();

/* theme toggle (saved) */
(function () {
  const b = document.body;
  try { if (localStorage.getItem('portfolio_theme') === 'light') b.classList.add('light-mode'); } catch (e) {}
  document.getElementById('theme').onclick = () => {
    b.classList.toggle('light-mode');
    try { localStorage.setItem('portfolio_theme', b.classList.contains('light-mode') ? 'light' : 'dark'); } catch (e) {}
  };
})();

/* scroll progress */
addEventListener('scroll', () => {
  const h = document.documentElement;
  document.getElementById('progress').style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
}, { passive: true });

/* particle network background */
(function () {
  const c = document.getElementById('bgCanvas'), x = c.getContext('2d');
  let W, H; const rs = () => { W = c.width = innerWidth; H = c.height = innerHeight; }; rs(); addEventListener('resize', rs);
  const labels = ['React', 'Node.js', 'Express', 'MongoDB', 'AI Integration', 'REST API', 'JavaScript', 'Tailwind', 'WordPress'];
  const cols = ['#6C5CE7', '#8B7CF6', '#22D3EE'];
  const n = innerWidth < 720 ? 16 : 30, nodes = [];
  for (let i = 0; i < n; i++) nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, r: Math.random() * 1.6 + 1, l: labels[i] || null, c: cols[i % 3] });
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  (function f() {
    x.clearRect(0, 0, W, H);
    nodes.forEach(a => { a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1; });
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const a = nodes[i], b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 170) { x.strokeStyle = `rgba(139,124,246,${(1 - d / 170) * .16})`; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke(); }
    }
    const light = document.body.classList.contains('light-mode');
    nodes.forEach(a => {
      x.globalAlpha = .85; x.fillStyle = a.c; x.beginPath(); x.arc(a.x, a.y, a.r, 0, 6.283); x.fill(); x.globalAlpha = 1;
      if (a.l) { x.font = "9.5px 'JetBrains Mono',monospace"; x.fillStyle = light ? 'rgba(79,70,229,.45)' : 'rgba(242,243,245,.25)'; x.fillText(a.l, a.x + 7, a.y + 3); }
    });
    if (!reduce) requestAnimationFrame(f);
  })();
})();