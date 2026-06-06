(function () {
  var sections = document.querySelectorAll('[data-reviews]');
  if (!sections.length) return;

  sections.forEach(function (root) {
    var btn = root.querySelector('[data-reviews-more]');
    var list = root.querySelector('[data-reviews-list]');
    if (!btn || !list) return;

    btn.addEventListener('click', function () {
      var hidden = list.querySelectorAll('.knr-reviews__item.is-hidden');
      hidden.forEach(function (item) { item.classList.remove('is-hidden'); });
      btn.hidden = true;
    });
  });
})();
