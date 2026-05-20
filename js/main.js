// Rudra Electricals — main.js

// ── Mobile menu toggle ──────────────────────────────────────────────────
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
}

// ── Active nav link ─────────────────────────────────────────────────────
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ── FAQ accordion ───────────────────────────────────────────────────────
document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq-btn').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.style.maxHeight = null;
    });
    if (!expanded) {
      btn.setAttribute('aria-expanded', 'true');
      const panel = btn.nextElementSibling;
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  });
});

// ── Contact form validation ─────────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    const rules = [
      { id: 'name',    minLen: 2,  msg: 'Please enter your full name (min 2 characters).' },
      { id: 'mobile',  pattern: /^[6-9]\d{9}$/, msg: 'Please enter a valid 10-digit Indian mobile number.' },
      { id: 'message', minLen: 10, msg: 'Please enter a message (min 10 characters).' },
    ];

    rules.forEach(rule => {
      const field = document.getElementById(rule.id);
      const errEl = document.getElementById(rule.id + '-err');
      if (!field) return;
      const val = field.value.trim();
      let ok = true;
      if (rule.minLen && val.length < rule.minLen) ok = false;
      if (rule.pattern && !rule.pattern.test(val)) ok = false;
      if (!ok) {
        field.classList.add('field-error');
        if (errEl) { errEl.textContent = rule.msg; errEl.style.display = 'block'; }
        valid = false;
      } else {
        field.classList.remove('field-error');
        if (errEl) { errEl.style.display = 'none'; }
      }
    });

    if (!valid) return;

    // Submit via fetch to Netlify Forms
    const data = new FormData(contactForm);
    fetch('/', { method: 'POST', body: data })
      .then(() => {
        contactForm.reset();
        const success = document.getElementById('form-success');
        if (success) success.classList.add('show');
        setTimeout(() => success && success.classList.remove('show'), 6000);
      })
      .catch(() => {
        alert('Something went wrong. Please call us directly at 9340232490.');
      });
  });

  // Clear error on input
  contactForm.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('input', () => {
      el.classList.remove('field-error');
      const err = document.getElementById(el.id + '-err');
      if (err) err.style.display = 'none';
    });
  });
}

// ── Product category filter ─────────────────────────────────────────────
const filterTabs = document.querySelectorAll('.filter-tab');
const productCards = document.querySelectorAll('.product-card[data-category]');
filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.category;
    productCards.forEach(card => {
      card.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
    });
  });
});

// ── Scroll reveal ───────────────────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── Smooth anchor scroll ────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ── Back-to-top button ──────────────────────────────────────────────────
const btt = document.getElementById('back-to-top');
if (btt) {
  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 300);
  });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
