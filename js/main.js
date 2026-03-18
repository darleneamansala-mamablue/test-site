/* ============================================================
   CHI*KA TULUM — Main JavaScript
   ============================================================ */

'use strict';

/* ── DOM Ready ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  initHeroParallax();
  initBookingModal();
  initPageTransition();
  setActiveNav();
});

/* ============================================================
   NAVIGATION
   ============================================================ */
function initNav() {
  const nav        = document.querySelector('.site-nav');
  const hamburger  = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  const overlay    = document.querySelector('.nav__overlay');
  const mobileLinks= document.querySelectorAll('.nav__mobile-links a');

  if (!nav) return;

  // Scroll behaviour
  const onScroll = () => {
    if (window.scrollY > 60) {
      nav.classList.add('site-nav--scrolled');
    } else {
      nav.classList.remove('site-nav--scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  const openMenu  = () => {
    hamburger?.classList.add('is-open');
    mobileMenu?.classList.add('is-open');
    overlay?.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    hamburger?.classList.remove('is-open');
    mobileMenu?.classList.remove('is-open');
    overlay?.classList.remove('is-visible');
    document.body.style.overflow = '';
  };

  hamburger?.addEventListener('click', () => {
    hamburger.classList.contains('is-open') ? closeMenu() : openMenu();
  });
  overlay?.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
}

/* ── Set active nav link based on current page ── */
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ============================================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================================ */
function initScrollReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  items.forEach(item => observer.observe(item));
}

/* ============================================================
   HERO PARALLAX
   ============================================================ */
function initHeroParallax() {
  const bg = document.querySelector('.hero__bg');
  if (!bg) return;

  // Trigger initial scale animation
  requestAnimationFrame(() => {
    setTimeout(() => bg.classList.add('is-loaded'), 100);
  });

  // Subtle parallax on scroll
  const onScroll = () => {
    const scrollY = window.scrollY;
    const heroH   = document.querySelector('.hero')?.offsetHeight || 0;
    if (scrollY < heroH) {
      const shift = scrollY * 0.25;
      bg.style.transform = `scale(1) translateY(${shift}px)`;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ============================================================
   BOOKING MODAL
   ============================================================ */
function initBookingModal() {
  const backdrop  = document.querySelector('.modal-backdrop');
  const modal     = document.querySelector('.modal');
  const openBtns  = document.querySelectorAll('[data-modal="booking"]');
  const closeBtn  = document.querySelector('.modal__close');
  const form      = document.querySelector('.modal-form');

  if (!modal) return;

  const open  = () => {
    backdrop.classList.add('is-open');
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    backdrop.classList.remove('is-open');
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  openBtns.forEach(btn => btn.addEventListener('click', open));
  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  // Form submission (demo)
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Request Received ✓';
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        close();
        form.reset();
      }, 2200);
    }, 1400);
  });
}

/* ============================================================
   PAGE TRANSITION
   ============================================================ */
function initPageTransition() {
  document.body.classList.add('page-enter');

  // Intercept internal links for smooth transition
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (
      href &&
      !href.startsWith('#') &&
      !href.startsWith('http') &&
      !href.startsWith('mailto') &&
      !href.startsWith('tel')
    ) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        setTimeout(() => window.location.href = href, 300);
      });
    }
  });
}

/* ============================================================
   SMOOTH SCROLL for anchor links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h')) || 78;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ============================================================
   HERO SCROLL INDICATOR
   ============================================================ */
document.querySelector('.hero__scroll')?.addEventListener('click', () => {
  const hero = document.querySelector('.hero');
  if (hero) {
    window.scrollTo({ top: hero.offsetHeight, behavior: 'smooth' });
  }
});
