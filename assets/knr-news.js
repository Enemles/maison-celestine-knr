(function () {
  var sections = document.querySelectorAll('[data-news]');
  if (!sections.length) return;

  sections.forEach(function (root) {
    var track = root.querySelector('[data-news-track]');
    if (!track) return;
    var bar = root.querySelector('[data-news-progress]');
    var thumb = bar ? bar.querySelector('[data-news-thumb]') : null;

    // Scrollbar de progression : largeur + position du pouce reflètent le scroll
    var raf = 0;
    function render() {
      raf = 0;
      if (!bar || !thumb) return;
      var max = track.scrollWidth - track.clientWidth;
      if (max <= 1) { bar.style.opacity = '0'; return; }
      bar.style.opacity = '1';
      var barW = bar.clientWidth;
      var w = Math.max(16, barW * (track.clientWidth / track.scrollWidth));
      var pos = (track.scrollLeft / max) * (barW - w);
      thumb.style.width = w + 'px';
      thumb.style.transform = 'translateX(' + pos + 'px)';
    }
    function schedule() { if (!raf) raf = requestAnimationFrame(render); }

    track.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();

    // Glisser-déposer à la souris (le tactile scrolle nativement)
    var down = false, moved = false, startX = 0, startScroll = 0;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return;
      down = true;
      moved = false;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      track.scrollLeft = startScroll - dx;
    });
    var release = function (e) {
      if (!down) return;
      down = false;
      try { track.releasePointerCapture(e.pointerId); } catch (err) {}
    };
    track.addEventListener('pointerup', release);
    track.addEventListener('pointercancel', release);
    track.addEventListener('dragstart', function (e) { e.preventDefault(); });
    track.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); }
    }, true);
  });
})();
