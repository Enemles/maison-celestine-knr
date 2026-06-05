(function () {
  const root = document.querySelector('[data-product]');
  if (!root) return;

  /* ----- Variant selection: live price / CTA / stock ----- */
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
      if (els.add) { els.add.disabled = !v.available; els.add.textContent = v.available ? 'Ajouter au panier' : 'Rupture de stock'; }
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

  /* ----- Reassurance text slider ----- */
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

  /* ----- Accordions: smooth height animation, one open at a time ----- */
  const animate = function (body, from, to, done) {
    const a = body.animate(
      [{ height: from + 'px', opacity: from === 0 ? 0 : 1 }, { height: to + 'px', opacity: to === 0 ? 0 : 1 }],
      { duration: 300, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
    );
    a.onfinish = done;
    a.oncancel = done;
  };
  const collapse = function (d, body) {
    d.dataset.animating = '1';
    animate(body, body.scrollHeight, 0, function () { d.open = false; delete d.dataset.animating; });
  };
  const expand = function (d, body) {
    d.dataset.animating = '1';
    d.open = true;
    animate(body, 0, body.scrollHeight, function () { delete d.dataset.animating; });
  };

  root.querySelectorAll('[data-accordions]').forEach(function (group) {
    const items = Array.from(group.querySelectorAll('.knr-product__acc'));
    items.forEach(function (d) {
      const summary = d.querySelector('summary');
      const body = d.querySelector('.knr-product__acc-body');
      if (!summary || !body) return;
      summary.addEventListener('click', function (e) {
        e.preventDefault();
        if (d.dataset.animating) return;
        if (d.open) {
          collapse(d, body);
        } else {
          items.forEach(function (o) {
            if (o !== d && o.open && !o.dataset.animating) collapse(o, o.querySelector('.knr-product__acc-body'));
          });
          expand(d, body);
        }
      });
    });
  });

  /* ----- Gallery lightbox (whole image clickable) ----- */
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
})();
