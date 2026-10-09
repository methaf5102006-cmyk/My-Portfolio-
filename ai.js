/* Fiza Liaqat portfolio — local AI assistant (no backend, no external API) */
(function () {
  /* ---------- styles ---------- */
  const css = `
  .ai-fab{position:fixed;right:20px;bottom:calc(20px + env(safe-area-inset-bottom,0px));z-index:450;width:56px;height:56px;border-radius:50%;border:0;cursor:pointer;color:#fff;font-size:22px;background:linear-gradient(135deg,var(--accent),var(--accent-2));box-shadow:0 10px 30px rgba(79,70,229,.45);transition:transform .25s}
  .ai-fab:hover{transform:scale(1.08)}
  .ai-box{position:fixed;right:20px;bottom:calc(88px + env(safe-area-inset-bottom,0px));z-index:450;width:min(360px,calc(100vw - 24px));height:min(520px,70vh);display:none;flex-direction:column;background:var(--surface);border:1px solid var(--border-strong);border-radius:16px;box-shadow:0 30px 60px -15px rgba(0,0,0,.6);overflow:hidden;color:var(--text)}
  .ai-box.open{display:flex}
  .ai-head{padding:14px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;font-family:'Space Grotesk',sans-serif;font-weight:600}
  .ai-head i{width:8px;height:8px;border-radius:50%;background:#4ADE80;box-shadow:0 0 8px #4ADE80}
  .ai-head small{margin-left:auto;font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--dimmer)}
  .ai-x{background:none;border:1px solid var(--border-strong);color:var(--text);width:30px;height:30px;border-radius:8px;cursor:pointer;font-size:14px;line-height:1;transition:all .2s}
  .ai-x:hover{border-color:var(--accent-2);color:var(--accent-2)}
  .ai-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}
  .ai-m{max-width:86%;padding:10px 13px;border-radius:14px;font-size:13.5px;line-height:1.55;word-wrap:break-word}
  .ai-m a{color:var(--accent-2);text-decoration:underline}
  .ai-m.bot{background:var(--surface-2);border:1px solid var(--border);align-self:flex-start;border-bottom-left-radius:4px}
  .ai-m.me{background:var(--accent);color:#fff;align-self:flex-end;border-bottom-right-radius:4px}
  .ai-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px}
  .ai-chips button{font-family:'JetBrains Mono',monospace;font-size:10.5px;padding:6px 10px;border-radius:99px;border:1px solid var(--border-strong);background:none;color:var(--dim);cursor:pointer}
  .ai-chips button:hover{border-color:var(--accent-2);color:var(--accent-2)}
  .ai-in{display:flex;gap:8px;padding:10px;border-top:1px solid var(--border)}
  .ai-in input{flex:1;min-width:0;background:var(--surface-2);border:1px solid var(--border);border-radius:10px;padding:10px 12px;color:var(--text);font:inherit;font-size:16px;outline:none}
  .ai-in input:focus{border-color:var(--accent-bright)}
  .ai-in button{border:0;border-radius:10px;padding:0 16px;background:var(--accent);color:#fff;font-weight:600;cursor:pointer}
  .ai-dots span{display:inline-block;width:6px;height:6px;margin:0 2px;border-radius:50%;background:var(--dimmer);animation:aid 1s infinite}
  .ai-dots span:nth-child(2){animation-delay:.15s}.ai-dots span:nth-child(3){animation-delay:.3s}
  @keyframes aid{0%,80%,100%{opacity:.3}40%{opacity:1}}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- knowledge base ---------- */
  const L = {
    mail: '<a href="mailto:liaqatfiza9@gmail.com">liaqatfiza9@gmail.com</a>',
    wa: '<a href="https://wa.me/923211963000" target="_blank" rel="noopener">WhatsApp (+92 321 1963000)</a>',
    li: '<a href="https://www.linkedin.com/in/fiza-liaqat-6259563a3/" target="_blank" rel="noopener">LinkedIn</a>',
    gh: '<a href="https://github.com/methaf5102006-cmyk" target="_blank" rel="noopener">GitHub</a>'
  };
  const KB = [
    { k: ['hi', 'hello', 'hey', 'salam', 'assalam', 'hola', 'greetings'],
      a: 'Hello! 👋 I\'m Fiza\'s portfolio assistant. Ask me about her skills, projects, services or how to get in touch.' },
    { k: ['who', 'about', 'fiza', 'yourself', 'introduce', 'intro', 'bio', 'background'],
      a: 'Fiza Liaqat is a BS Information Technology student and MERN Stack Developer. She builds AI-integrated full-stack apps and writes professional software documentation (SRS, UML, ERD, DFD and FYP reports).' },
    { k: ['skill', 'skills', 'tech', 'stack', 'technology', 'technologies', 'tools', 'know', 'language', 'languages'],
      a: '<b>Frontend:</b> HTML5, CSS3, JavaScript, React.js, Tailwind CSS<br><b>Backend:</b> Node.js, Express.js, MongoDB, REST APIs, JWT Auth<br><b>AI:</b> smart search, recommendations, chat features<br><b>Docs:</b> SRS, UML, ERD, DFD, PowerPoint, WordPress' },
    { k: ['mern', 'react', 'node', 'mongodb', 'express', 'frontend', 'backend', 'fullstack', 'full-stack'],
      a: 'Fiza works with the MERN stack: MongoDB, Express.js, React.js and Node.js. On the frontend she uses React and Tailwind; on the backend she builds secure REST APIs with JWT authentication.' },
    { k: ['ai', 'artificial', 'intelligence', 'smart', 'chatbot', 'chat', 'recommendation', 'recommendations'],
      a: 'AI integration is one of Fiza\'s specialties: adding smart search, recommendations and chat features to apps. The <b>LMS + AI</b> project is a good example.' },
    { k: ['doc', 'docs', 'documentation', 'srs', 'uml', 'erd', 'dfd', 'fyp', 'report', 'reports', 'presentation', 'presentations'],
      a: 'Documentation services include SRS, UML diagrams, ERD, DFD, FYP reports and PowerPoint presentations, so your project is easy to understand, maintain and hand over.' },
    { k: ['service', 'services', 'offer', 'offers', 'build', 'help', 'do', 'provide'],
      a: 'Fiza offers:<br>• MERN Development<br>• Frontend (React + Tailwind)<br>• Backend / REST APIs<br>• AI Integration<br>• Documentation (SRS, UML, ERD, DFD, FYP)<br>• WordPress, CVs and presentations' },
    { k: ['project', 'projects', 'work', 'portfolio', 'built', 'made', 'examples'],
      a: 'There are three main projects:<br>1. <b>College Website</b> (Elite College, completed and live)<br>2. <b>SkillLink</b> (hyperlocal skill marketplace, MERN)<br>3. <b>LMS + AI</b> (learning management system with AI features)<br>See the Projects section for details and links.' },
    { k: ['college', 'elite', 'institution', 'institutional', 'admission', 'admissions', 'website'],
      a: '<b>College Website</b> is a complete institutional website for Elite College, covering departments, admissions and announcements. It\'s live on Vercel and Netlify, and there\'s a Watch Demo video too.' },
    { k: ['skilllink', 'skill-link', 'marketplace', 'hyperlocal', 'booking', 'bookings'],
      a: '<b>SkillLink</b> is a hyperlocal skill marketplace that connects people with skilled providers nearby, with secure authentication, listings, bookings and profiles. Built with React, Node.js, MongoDB and JWT.' },
    { k: ['lms', 'learning', 'course', 'courses', 'learner', 'learners'],
      a: '<b>LMS + AI</b> is a Learning Management System with course and progress tracking, enhanced with AI-driven features for learners. Both the frontend and backend repositories are on GitHub.' },
    { k: ['contact', 'email', 'mail', 'reach', 'message', 'hire', 'talk', 'connect'],
      a: `You can reach Fiza here:<br>✉ ${L.mail}<br>💬 ${L.wa}<br>🔗 ${L.li}` },
    { k: ['whatsapp', 'phone', 'number', 'call', 'mobile'],
      a: `Message Fiza on ${L.wa}.` },
    { k: ['linkedin'], a: `Here's Fiza's ${L.li} profile.` },
    { k: ['github', 'git', 'repo', 'repos', 'repository', 'code', 'source'],
      a: `All of Fiza's repositories are on ${L.gh}.` },
    { k: ['cv', 'resume', 'download', 'pdf'],
      a: 'To download Fiza\'s CV, click <b>CV ↓</b> in the navbar or <b>Resume →</b> in the hero section.' },
    { k: ['education', 'study', 'degree', 'university', 'gcuf', 'student', 'bs', 'college'],
      a: 'Fiza is pursuing a <b>BS in Information Technology</b> at Elite College (GCUF), 2024 – 2028.' },
    { k: ['experience', 'intern', 'internship', 'freelance', 'job'],
      a: 'Experience: MERN Stack Developer (Freelance & Academic, 2023 – Present) and Web Development Intern at Elite College of Management Sciences.' },
    { k: ['certificate', 'certificates', 'certification', 'wordpress', 'office'],
      a: 'Fiza holds 3 certificates: MS Office (Soft Solution), Graphic Designing and WordPress (Elite College of Management Sciences).' },
    { k: ['available', 'availability', 'hiring', 'open', 'junior', 'free'],
      a: 'Yes! Fiza is available for freelance projects, junior developer roles and documentation work. Reach out by email or WhatsApp.' },
    { k: ['thanks', 'thank', 'thx', 'appreciate'],
      a: 'You\'re welcome! 😊 Let me know if you\'d like to know anything else.' },
    { k: ['bye', 'goodbye', 'later'],
      a: 'Goodbye! Thanks for visiting the portfolio 👋' }
  ];
  const FALLBACK = 'I\'m not sure about that one 🙂 Try asking about <b>skills</b>, <b>projects</b>, <b>services</b>, <b>AI</b>, <b>contact</b> or the <b>CV</b>. Or email Fiza directly at ' + L.mail;

  /* ---------- matching engine ---------- */
  const lev = (a, b) => {
    if (Math.abs(a.length - b.length) > 1) return 9;
    const m = []; for (let i = 0; i <= a.length; i++) { m[i] = [i]; }
    for (let j = 1; j <= b.length; j++) m[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
      m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return m[a.length][b.length];
  };
  function answer(q) {
    const words = q.toLowerCase().replace(/[^a-z0-9+\-\s]/g, ' ').split(/\s+/).filter(Boolean);
    if (!words.length) return FALLBACK;
    let best = null, bestScore = 0;
    KB.forEach(item => {
      let s = 0;
      item.k.forEach(k => words.forEach(w => {
        if (w === k) s += 2;
        else if (w.length > 4 && k.length > 4 && lev(w, k) <= 1) s += 1.5;   // typo tolerance
      }));
      if (s > bestScore) { bestScore = s; best = item; }
    });
    return best ? best.a : FALLBACK;
  }

  /* ---------- UI ---------- */
  const fab = document.createElement('button');
  fab.className = 'ai-fab'; fab.setAttribute('aria-label', 'Open AI assistant'); fab.textContent = '✦';
  const box = document.createElement('div');
  box.className = 'ai-box';
  box.innerHTML = '<div class="ai-head"><i></i>Ask Fiza\'s Assistant<small>local AI</small><button class="ai-x" id="aiClose" aria-label="Close assistant">✕</button></div>' +
    '<div class="ai-msgs" id="aiMsgs"></div><div class="ai-chips" id="aiChips"></div>' +
    '<div class="ai-in"><input id="aiInput" placeholder="Ask me anything…" autocomplete="off"><button id="aiSend">Send</button></div>';
  document.body.append(fab, box);

  const msgs = box.querySelector('#aiMsgs'), input = box.querySelector('#aiInput');
  const add = (html, who) => {
    const d = document.createElement('div'); d.className = 'ai-m ' + who; d.innerHTML = html;
    msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; return d;
  };
  const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function ask(text) {
    text = text.trim(); if (!text) return;
    add(esc(text), 'me'); input.value = '';
    const t = add('<span class="ai-dots"><span></span><span></span><span></span></span>', 'bot');
    setTimeout(() => { t.innerHTML = answer(text); msgs.scrollTop = msgs.scrollHeight; }, 450 + Math.random() * 350);
  }

  ['Skills', 'Projects', 'Services', 'AI Integration', 'Contact', 'CV'].forEach(c => {
    const b = document.createElement('button'); b.textContent = c; b.onclick = () => ask(c);
    box.querySelector('#aiChips').appendChild(b);
  });
  box.querySelector('#aiSend').onclick = () => ask(input.value);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') ask(input.value); });

  let greeted = false;
  function setOpen(open) {
    box.classList.toggle('open', open);
    fab.textContent = open ? '✕' : '✦';
    fab.setAttribute('aria-label', open ? 'Close AI assistant' : 'Open AI assistant');
    if (open) {
      if (!greeted) { greeted = true; add('Hi there! 👋 I\'m Fiza\'s AI assistant. Ask me about her skills, projects, services or how to contact her.', 'bot'); }
      if (innerWidth > 760) input.focus();
    }
  }
  fab.onclick = () => setOpen(!box.classList.contains('open'));
  box.querySelector('#aiClose').onclick = () => setOpen(false);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
})();