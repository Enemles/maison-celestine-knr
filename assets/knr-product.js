(function () {
  const root = document.querySelector('[data-product]');
  if (!root) return;

  const form = root.querySelector('.knr-product__form');
  const dataEl = root.querySelector('[data-variants]');
  if (form && dataEl) {
    let variants = [];
    try { variants = JSON.parse(dataEl.textContent); } catch (e) { variants = []; }

    const els = {
      price: root.querySelector('[data-price]'),
      compare: root.querySelector('[data-compare]'),
      unit: root.querySelector('[data-unit]'),
      add: root.querySelector('[data-add]'),
      stock: root.querySelector('[data-stock]'),
    };

    const render = function (v) {
      if (!v) return;
      if (els.price) els.price.textContent = v.price;
      if (els.compare) { els.compare.textContent = v.compareAt || ''; els.compare.hidden = !v.compareAt; }
      if (els.unit) { els.unit.textContent = v.unit || ''; els.unit.hidden = !v.unit; }
      if (els.add) { els.add.disabled = !v.available; els.add.textContent = v.available ? (els.add.dataset.addLabel || 'Ajouter au panier') : (els.add.dataset.soldLabel || 'Rupture de stock'); }
      if (els.stock && !v.available) els.stock.textContent = 'Actuellement indisponible.';
    };

    form.addEventListener('change', function (e) {
      if (e.target.name !== 'id') return;
      root.querySelectorAll('.knr-product__size').forEach(function (label) {
        label.classList.toggle('is-selected', label.contains(e.target));
      });
      render(variants.find(function (v) { return String(v.id) === e.target.value; }));
    });
  }

  const slider = root.querySelector('[data-slider]');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('[data-slide]'));
    const dots = Array.from(slider.querySelectorAll('[data-dot]'));
    if (slides.length > 1) {
      let idx = 0;
      let timer;
      const show = function (i) {
        idx = (i + slides.length) % slides.length;
        slides.forEach(function (s, j) { s.classList.toggle('is-active', j === idx); });
        dots.forEach(function (d, j) { d.classList.toggle('is-active', j === idx); });
      };
      const start = function () { timer = setInterval(function () { show(idx + 1); }, 3800); };
      const stop = function () { clearInterval(timer); };
      dots.forEach(function (d, j) { d.addEventListener('click', function () { show(j); stop(); start(); }); });
      slider.addEventListener('mouseenter', stop);
      slider.addEventListener('mouseleave', start);
      show(0);
      start();
    }
  }

  root.querySelectorAll('[data-accordions]').forEach(function (group) {
    const items = Array.from(group.querySelectorAll('.knr-product__acc'));
    items.forEach(function (item) {
      const head = item.querySelector('.knr-product__acc-head');
      if (!head) return;
      head.addEventListener('click', function () {
        const open = !item.classList.contains('is-open');
        items.forEach(function (other) {
          const active = other === item && open;
          other.classList.toggle('is-open', active);
          const h = other.querySelector('.knr-product__acc-head');
          if (h) h.setAttribute('aria-expanded', active ? 'true' : 'false');
        });
      });
    });
  });

  const figures = Array.from(root.querySelectorAll('[data-zoom]'));
  if (figures.length) {
    const sources = figures.map(function (f) { return f.dataset.zoom; });
    let current = 0;

    const box = document.createElement('div');
    box.className = 'knr-lightbox';
    box.hidden = true;
    box.innerHTML =
      '<button class="knr-lightbox__btn knr-lightbox__btn--close" aria-label="Fermer">×</button>' +
      '<button class="knr-lightbox__btn knr-lightbox__btn--prev" aria-label="Image précédente">‹</button>' +
      '<img class="knr-lightbox__img" alt="">' +
      '<button class="knr-lightbox__btn knr-lightbox__btn--next" aria-label="Image suivante">›</button>';
    document.body.appendChild(box);

    const img = box.querySelector('.knr-lightbox__img');

    const showAt = function (i) {
      current = (i + sources.length) % sources.length;
      img.src = sources[current];
    };
    const open = function (i) { showAt(i); box.hidden = false; document.body.style.overflow = 'hidden'; };
    const close = function () { box.hidden = true; img.removeAttribute('src'); document.body.style.overflow = ''; };

    figures.forEach(function (f, i) {
      f.addEventListener('click', function (e) { e.preventDefault(); open(i); });
    });
    box.querySelector('.knr-lightbox__btn--close').addEventListener('click', close);
    box.querySelector('.knr-lightbox__btn--prev').addEventListener('click', function () { showAt(current - 1); });
    box.querySelector('.knr-lightbox__btn--next').addEventListener('click', function () { showAt(current + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') showAt(current - 1);
      else if (e.key === 'ArrowRight') showAt(current + 1);
    });
  }

  root.querySelectorAll('.knr-product__related-grid').forEach(function (track) {
    let down = false, moved = false, startX = 0, startScroll = 0;
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
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      track.scrollLeft = startScroll - dx;
    });
    const release = function (e) {
      if (!down) return;
      down = false;
      try { track.releasePointerCapture(e.pointerId); } catch (err) {}
    };
    track.addEventListener('pointerup', release);
    track.addEventListener('pointercancel', release);
    track.addEventListener('dragstart', function (e) { e.preventDefault(); });
    track.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  });

  root.querySelectorAll('.knr-product__gallery-wrap').forEach(function (wrap) {
    const gallery = wrap.querySelector('.knr-product__gallery');
    const prev = wrap.querySelector('[data-gallery-prev]');
    const next = wrap.querySelector('[data-gallery-next]');
    if (!gallery || !prev || !next) return;
    const update = function () {
      const max = gallery.scrollWidth - gallery.clientWidth;
      prev.disabled = gallery.scrollLeft <= 1;
      next.disabled = gallery.scrollLeft >= max - 1;
    };
    prev.addEventListener('click', function () { gallery.scrollBy({ left: -gallery.clientWidth, behavior: 'smooth' }); });
    next.addEventListener('click', function () { gallery.scrollBy({ left: gallery.clientWidth, behavior: 'smooth' }); });
    gallery.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
})();

/* ----- Mobile gallery progress bar ----- */
(function () {
  document.querySelectorAll('[data-product]').forEach(function (root) {
    var gallery = root.querySelector('.knr-product__gallery');
    var fill = root.querySelector('.knr-product__progress-fill');
    if (!gallery || !fill) return;
    var count = gallery.querySelectorAll('.knr-product__slide').length;
    if (count < 2) { fill.style.width = '100%'; return; }
    var thumb = 100 / count;
    fill.style.width = thumb + '%';
    var update = function () {
      var max = gallery.scrollWidth - gallery.clientWidth;
      var p = max > 0 ? gallery.scrollLeft / max : 0;
      fill.style.transform = 'translateX(' + (p * (100 - thumb) / thumb * 100) + '%)';
    };
    gallery.addEventListener('scroll', update, { passive: true });
    update();
  });
})();
