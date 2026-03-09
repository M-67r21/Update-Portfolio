/* ─────────────────────────────────────────────────────────
   PORTFOLIO — main.js
───────────────────────────────────────────────────────── */

/* ── Sticky Nav ─────────────────────────────────────── */
const header = document.getElementById('nav-header');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  header.classList.toggle('scrolled', scrollY > 40);
  backToTop.classList.toggle('visible', scrollY > 400);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Mobile burger ──────────────────────────────────── */
const burger = document.getElementById('nav-burger');
const navLinks = document.getElementById('nav-links');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Close when clicking outside the nav
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !burger.contains(e.target)) {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

/* ── Active Nav on scroll ───────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav__link:not(.cta-link)');

function updateActiveNav() {
  const scrollMid = window.scrollY + window.innerHeight / 2;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    if (scrollMid >= top && scrollMid < bottom) {
      navItems.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav__link[href="#${sec.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}
window.addEventListener('scroll', updateActiveNav);

/* ── Reveal on scroll ───────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
        const delay = Math.max(0, siblings.indexOf(entry.target)) * 90;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
);

// Trigger elements already in viewport immediately on load
function revealAll() {
  revealEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    } else {
      revealObserver.observe(el);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', revealAll);
} else {
  revealAll();
}

/* ── Animated counters ──────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll('.stat__num');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
counterEls.forEach(el => counterObserver.observe(el));

/* ── Skill bar animation ────────────────────────────── */
const skillFills = document.querySelectorAll('.skill__fill');
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const targetWidth = fill.dataset.width;
        setTimeout(() => {
          fill.style.width = targetWidth + '%';
        }, 300);
        skillObserver.unobserve(fill);
      }
    });
  },
  { threshold: 0.5 }
);
skillFills.forEach(el => skillObserver.observe(el));

/* ── Project filtering ──────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const cats = card.dataset.category || '';
      if (filter === 'all' || cats.includes(filter)) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeInCard .4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ── Contact form ───────────────────────────────────── */
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const successMsg = document.getElementById('form-success');

function validateField(id, errorId, validator, message) {
  const field = document.getElementById(id);
  const error = document.getElementById(errorId);
  if (!field) return true;
  if (!validator(field.value.trim())) {
    field.classList.add('error');
    if (error) error.textContent = message;
    return false;
  }
  field.classList.remove('error');
  if (error) error.textContent = '';
  return true;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const validName  = validateField('name',    'name-error',    v => v.length >= 2,                  'Please enter your name.');
  const validEmail = validateField('email',   'email-error',   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Please enter a valid email.');
  const validMsg   = validateField('message', 'message-error', v => v.length >= 10,                 'Message must be at least 10 characters.');

  if (!validName || !validEmail || !validMsg) return;

  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').textContent = 'Sending…';

  try {
    const data = new FormData(form);
    const response = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      submitBtn.style.display = 'none';
      successMsg.classList.add('show');
      form.reset();
    } else {
      const json = await response.json();
      const msg = (json.errors || []).map(e => e.message).join(', ') || 'Something went wrong. Please try again.';
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = 'Send Message';
      alert(msg);
    }
  } catch (err) {
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').textContent = 'Send Message';
    alert('Network error — please check your connection and try again.');
  }
});

// Clear errors on input
['name', 'email', 'message'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => {
    el.classList.remove('error');
    const errEl = document.getElementById(id + '-error');
    if (errEl) errEl.textContent = '';
  });
});

/* ── Smooth scroll for anchor links ────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Inject fadeInCard keyframe ─────────────────────── */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInCard {
    from { opacity: 0; transform: scale(.97) translateY(10px); }
    to   { opacity: 1; transform: none; }
  }
`;
document.head.appendChild(style);
