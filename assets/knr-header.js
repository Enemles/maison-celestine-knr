(function () {
  const group = document.querySelector('[data-header-group]');

  // Header opaque au scroll
  if (group) {
    const onScroll = () => {
      group.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Menu burger (mobile)
  const header = document.querySelector('[data-header]');
  const toggle = header && header.querySelector('[data-menu-toggle]');
  const menu = header && header.querySelector('[data-menu]');

  if (header && toggle && menu) {
    const setOpen = (open) => {
      header.classList.toggle('is-menu-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      document.body.classList.toggle('knr-menu-open', open);
    };

    toggle.addEventListener('click', () => {
      setOpen(!header.classList.contains('is-menu-open'));
    });

    // Fermer après un clic sur un lien
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) setOpen(false);
    });

    // Fermer avec Échap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && header.classList.contains('is-menu-open')) setOpen(false);
    });

    // Fermer en repassant au format desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 750 && header.classList.contains('is-menu-open')) setOpen(false);
    });
  }
})();
