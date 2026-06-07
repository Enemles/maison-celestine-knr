(function () {
  document.querySelectorAll('[data-ingredients]').forEach(function (root) {
    var form = root.querySelector('.knr-ingredients__form');
    if (!form) return;

    var priceEl = root.querySelector('[data-ing-price]');
    var btn = root.querySelector('[data-ing-add]');
    var label = root.querySelector('[data-ing-label]');
    var dataEl = root.querySelector('[data-ing-variants]');
    var variants = [];
    try { variants = JSON.parse(dataEl.textContent); } catch (e) { variants = []; }

    /* Live variant: selected state + price */
    form.addEventListener('change', function (e) {
      if (e.target.name !== 'id') return;
      root.querySelectorAll('.knr-ingredients__variant').forEach(function (l) {
        l.classList.toggle('is-selected', l.contains(e.target));
      });
      var v = variants.find(function (x) { return String(x.id) === e.target.value; });
      if (v && priceEl) priceEl.textContent = v.price;
    });

    /* AJAX add to cart, with graceful fallback to native POST */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var checked = form.querySelector('input[name="id"]:checked') || form.querySelector('input[name="id"]');
      if (!checked) return;
      if (btn) btn.disabled = true;

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ id: checked.value, quantity: 1 })
      })
        .then(function (r) {
          if (!r.ok) throw new Error('add failed');
          return r.json();
        })
        .then(function () {
          if (label) {
            var orig = label.getAttribute('data-orig') || label.textContent;
            label.setAttribute('data-orig', orig);
            label.textContent = 'Ajouté ✓';
            setTimeout(function () { label.textContent = orig; }, 2200);
          }
          if (btn) btn.disabled = false;
          return fetch('/cart.js');
        })
        .then(function (r) { return r ? r.json() : null; })
        .then(function (cart) {
          if (!cart) return;
          document.querySelectorAll('.knr-header__cart-count, [data-cart-count]').forEach(function (el) {
            el.textContent = cart.item_count;
            if ('hidden' in el) el.hidden = cart.item_count === 0;
          });
        })
        .catch(function () {
          if (btn) btn.disabled = false;
          form.submit();
        });
    });
  });
})();
