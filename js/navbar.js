/* ============================================================
   Mind Cafe — Navbar: sticky scroll, hamburger, scroll-spy
   ============================================================ */

(function () {
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('nav-hamburger');
  const navLinks   = document.querySelectorAll('.navbar__link[data-section]');
  const allNavLinks = document.querySelectorAll('.navbar__link');
  const inPageLinks = document.querySelectorAll('a[href^="#"]');

  if (!navbar) return;

  /* ---- Scroll: add/remove .navbar--scrolled ---- */
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 80) {
          navbar.classList.add('navbar--scrolled');
        } else {
          navbar.classList.remove('navbar--scrolled');
        }
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Hamburger toggle ---- */
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navbar.classList.toggle('navbar--open');
      const isOpen = navbar.classList.contains('navbar--open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });
  }

  /* ---- Close mobile menu on link click ---- */
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('navbar--open');
      if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---- Smooth scroll for in-page anchors ---- */
  inPageLinks.forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Active link scroll-spy (index page only) ---- */
  function updateActiveLink() {
    if (navLinks.length === 0) return;

    const sections = Array.from(navLinks)
      .map(link => {
        const id = link.dataset.section;
        const el = document.getElementById(id);
        return { link, el };
      })
      .filter(item => item.el);

    const scrollMid = window.scrollY + window.innerHeight / 3;

    let activeSet = false;
    for (let i = sections.length - 1; i >= 0; i--) {
      const { link, el } = sections[i];
      if (el.offsetTop <= scrollMid) {
        allNavLinks.forEach(l => l.classList.remove('navbar__link--active'));
        link.classList.add('navbar__link--active');
        activeSet = true;
        break;
      }
    }

    if (!activeSet && sections.length) {
      allNavLinks.forEach(l => l.classList.remove('navbar__link--active'));
    }
  }

  /* ---- Highlight active page link on multi-page nav ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && href === currentPage) {
      link.classList.add('navbar__link--active');
    }
  });

})();
