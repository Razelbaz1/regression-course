/* ============================================================
   Lesson HTML interactivity
   - Top scroll-progress bar
   - Floating button stack: TOC, mode (scroll/slides), cursor halo, back-to-top
   - Cursor halo with smooth follow
   - Slides mode (keyboard nav + indicator dots)
   - Q&A toggle, TOC smooth-scroll, code-switch clipboard copy
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Common SVG icons ----------
  const ICONS = {
    arrowUp:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    list:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>',
    slides:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><line x1="7" y1="9" x2="17" y2="9"/><line x1="7" y1="13" x2="13" y2="13"/></svg>',
    cursor:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>',
    chevronL:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
    chevronR:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  };

  function makeBtn(cls, label, html) {
    const b = document.createElement('button');
    b.className = `float-btn ${cls}`;
    b.setAttribute('aria-label', label);
    b.title = label;
    b.innerHTML = html;
    document.body.appendChild(b);
    return b;
  }

  // ---------- Top scroll-progress bar ----------
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  // ---------- Back-to-top (existing behavior) ----------
  const backBtn = makeBtn('back-to-top', 'חזרה לראש העמוד', ICONS.arrowUp);
  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function updateScrollUI() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const pct = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
    backBtn.classList.toggle('visible', scrolled > 400);
  }
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  window.addEventListener('resize', updateScrollUI);
  updateScrollUI();

  // ---------- Cursor halo + toggle ----------
  const halo = document.createElement('div');
  halo.className = 'cursor-halo';
  document.body.appendChild(halo);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let haloX = mouseX;
  let haloY = mouseY;
  let haloRunning = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateHalo() {
    if (!haloRunning) return;
    haloX += (mouseX - haloX) * 0.18;
    haloY += (mouseY - haloY) * 0.18;
    halo.style.left = haloX + 'px';
    halo.style.top = haloY + 'px';
    requestAnimationFrame(animateHalo);
  }

  const cursorBtn = makeBtn('float-cursor', 'אפקט עכבר זוהר (לחץ להפעיל/לכבות)', ICONS.cursor);
  cursorBtn.addEventListener('click', () => {
    const on = document.body.classList.toggle('cursor-halo-on');
    cursorBtn.classList.toggle('active', on);
    if (on && !haloRunning) {
      haloRunning = true;
      haloX = mouseX;
      haloY = mouseY;
      animateHalo();
    } else if (!on) {
      haloRunning = false;
    }
  });

  // ---------- TOC: build floating panel from sections ----------
  // KaTeX renders $...$ inside headings into HTML that includes BOTH the visible
  // math AND a hidden MathML annotation carrying the original LaTeX source.
  // Calling textContent on a KaTeX-rendered h2 returns all of them concatenated
  // (e.g. "β₃\beta_3β₃"). Clone the heading and strip the MathML duplicates
  // before reading the text so the floating-TOC label matches what the user sees.
  function tocTextFromH2(h2) {
    const clone = h2.cloneNode(true);
    clone.querySelectorAll('.katex-mathml').forEach(el => el.remove());
    return clone.textContent.trim();
  }

  const sections = Array.from(document.querySelectorAll('main > section'));
  const tocPanel = document.createElement('div');
  tocPanel.className = 'float-toc-panel';
  tocPanel.dir = 'rtl';
  const tocHeading = document.createElement('h4');
  tocHeading.textContent = 'תוכן עניינים';
  tocPanel.appendChild(tocHeading);
  const tocList = document.createElement('ol');
  sections.forEach((s, i) => {
    const id = s.id;
    const h2 = s.querySelector('h2');
    if (!h2 || !id) return;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + id;
    a.textContent = tocTextFromH2(h2);
    a.addEventListener('click', (e) => {
      e.preventDefault();
      if (document.body.dataset.mode === 'slides') {
        slidesGo(i);
      } else {
        s.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      tocPanel.classList.remove('open');
      tocBtn.classList.remove('active');
    });
    li.appendChild(a);
    tocList.appendChild(li);
    s.dataset.tocIndex = i;
  });
  tocPanel.appendChild(tocList);
  document.body.appendChild(tocPanel);

  const tocBtn = makeBtn('float-toc-btn', 'תוכן עניינים', ICONS.list);
  tocBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = tocPanel.classList.toggle('open');
    tocBtn.classList.toggle('active', open);
  });
  document.addEventListener('click', (e) => {
    if (!tocPanel.contains(e.target) && !tocBtn.contains(e.target)) {
      tocPanel.classList.remove('open');
      tocBtn.classList.remove('active');
    }
  });

  function setActiveTocIdx(idx) {
    tocList.querySelectorAll('li').forEach((li, i) => {
      li.classList.toggle('active', i === idx);
    });
  }

  // In scroll mode: highlight current section in TOC via IntersectionObserver.
  // In slides mode: skip — slidesGo() updates the TOC directly.
  if ('IntersectionObserver' in window) {
    let activeIndex = -1;
    const visible = new Set();
    const obs = new IntersectionObserver((entries) => {
      if (document.body.dataset.mode === 'slides') return;
      entries.forEach(en => {
        const idx = parseInt(en.target.dataset.tocIndex);
        if (isNaN(idx)) return;
        if (en.isIntersecting) visible.add(idx);
        else visible.delete(idx);
      });
      const top = visible.size ? Math.min(...visible) : -1;
      if (top !== activeIndex) {
        activeIndex = top;
        setActiveTocIdx(activeIndex);
      }
    }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
    sections.forEach(s => obs.observe(s));
  }

  // ---------- Slides mode ----------
  let currentSlide = 0;
  const slideIndicator = document.createElement('div');
  slideIndicator.className = 'slide-indicator';
  document.body.appendChild(slideIndicator);

  function buildIndicator() {
    slideIndicator.innerHTML = '';
    sections.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === currentSlide ? ' active' : '');
      dot.setAttribute('aria-label', `שקף ${i + 1}`);
      dot.addEventListener('click', () => slidesGo(i));
      slideIndicator.appendChild(dot);
    });
    const counter = document.createElement('span');
    counter.className = 'counter';
    slideIndicator.appendChild(counter);
    updateCounter();
  }
  function updateCounter() {
    const c = slideIndicator.querySelector('.counter');
    if (c) c.textContent = `${currentSlide + 1} / ${sections.length}`;
  }
  function slidesGo(idx) {
    if (idx < 0 || idx >= sections.length) return;
    sections.forEach(s => s.classList.remove('slide-active'));
    sections[idx].classList.add('slide-active');
    sections[idx].scrollTop = 0;
    currentSlide = idx;
    slideIndicator.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentSlide);
    });
    updateCounter();
    setActiveTocIdx(currentSlide);
    prevSideBtn.disabled = currentSlide === 0;
    nextSideBtn.disabled = currentSlide === sections.length - 1;
  }

  // ---------- Side-nav arrows (visible only in slides mode) ----------
  // RTL convention (matches lesson-nav header): prev=right, next=left.
  const prevSideBtn = document.createElement('button');
  prevSideBtn.className = 'slide-side-nav prev';
  prevSideBtn.innerHTML = ICONS.chevronR;
  prevSideBtn.setAttribute('aria-label', 'השקף הקודם');
  prevSideBtn.title = 'השקף הקודם';
  prevSideBtn.addEventListener('click', () => slidesGo(currentSlide - 1));
  document.body.appendChild(prevSideBtn);

  const nextSideBtn = document.createElement('button');
  nextSideBtn.className = 'slide-side-nav next';
  nextSideBtn.innerHTML = ICONS.chevronL;
  nextSideBtn.setAttribute('aria-label', 'השקף הבא');
  nextSideBtn.title = 'השקף הבא';
  nextSideBtn.addEventListener('click', () => slidesGo(currentSlide + 1));
  document.body.appendChild(nextSideBtn);

  const modeBtn = makeBtn('float-mode', 'מצב שקפים (Esc לחזרה)', ICONS.slides);
  modeBtn.addEventListener('click', () => {
    const inSlides = document.body.dataset.mode === 'slides';
    if (inSlides) {
      // exit slides → restore scroll position to the slide we were on
      delete document.body.dataset.mode;
      modeBtn.classList.remove('active');
      sections.forEach(s => s.classList.remove('slide-active'));
      if (sections[currentSlide]) {
        // Wait for layout reflow before scrolling (sections going fixed→normal)
        requestAnimationFrame(() => {
          sections[currentSlide].scrollIntoView({ block: 'start' });
        });
      }
    } else {
      // enter slides → if a section is in view, start there; else start at 0
      let startIdx = currentSlide;
      if (!startIdx) {
        const scrollMid = window.scrollY + window.innerHeight / 3;
        for (let i = 0; i < sections.length; i++) {
          const s = sections[i];
          const top = s.offsetTop;
          const bot = top + s.offsetHeight;
          if (scrollMid >= top && scrollMid < bot) { startIdx = i; break; }
        }
      }
      document.body.dataset.mode = 'slides';
      modeBtn.classList.add('active');
      buildIndicator();
      slidesGo(startIdx || 0);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (document.body.dataset.mode !== 'slides') return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault(); slidesGo(currentSlide + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault(); slidesGo(currentSlide - 1);
    } else if (e.key === 'Home') {
      e.preventDefault(); slidesGo(0);
    } else if (e.key === 'End') {
      e.preventDefault(); slidesGo(sections.length - 1);
    } else if (e.key === 'Escape') {
      modeBtn.click();
    }
  });

  // ---------- Q&A toggle ----------
  document.querySelectorAll('.qa').forEach(el => {
    const btn = el.querySelector('.toggle-btn');
    if (btn) {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        el.classList.toggle('revealed');
        btn.textContent = el.classList.contains('revealed') ? 'הסתר' : 'גלה תשובה';
      });
    }
  });

  // ---------- Inline TOC smooth scroll (the in-page <nav class="toc">) ----------
  document.querySelectorAll('nav.toc a').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- Code-switch: click → copy cell number to clipboard ----------
  document.querySelectorAll('.code-switch').forEach(el => {
    const ref = el.querySelector('.cell-ref');
    if (ref) {
      el.style.cursor = 'pointer';
      el.title = 'לחץ להעתיק מספר תא';
      el.addEventListener('click', () => {
        navigator.clipboard?.writeText(ref.textContent.trim());
        const orig = ref.textContent;
        ref.textContent = '✓ הועתק';
        setTimeout(() => { ref.textContent = orig; }, 1200);
      });
    }
  });

});
