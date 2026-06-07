(function () {
  var sections = document.querySelectorAll('[data-reassurance]');
  if (!sections.length) return;

  sections.forEach(function (root) {
    var track = root.querySelector('[data-reassurance-track]');
    var dotsWrap = root.querySelector('[data-reassurance-dots]');
    if (!track || !dotsWrap) return;
    var dots = Array.prototype.slice.call(dotsWrap.children);
    if (dots.length < 2) return;

    // Le tiret actif suit la colonne visible (une colonne = une vue)
    var raf = 0;
    function render() {
      raf = 0;
      var w = track.clientWidth;
      if (w <= 0) return;
      var idx = Math.round(track.scrollLeft / w);
      if (idx < 0) idx = 0;
      if (idx > dots.length - 1) idx = dots.length - 1;
      dots.forEach(function (d, j) { d.classList.toggle('is-active', j === idx); });
    }
    function schedule() { if (!raf) raf = requestAnimationFrame(render); }

    track.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
  });
})();
