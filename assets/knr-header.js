(function () {
  const group = document.querySelector('[data-header-group]');
  if (!group) return;

  const onScroll = () => {
    group.classList.toggle('is-scrolled', window.scrollY > 8);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
