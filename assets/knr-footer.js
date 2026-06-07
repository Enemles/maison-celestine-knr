(function () {
  var footer = document.querySelector('.knr-footer');
  if (!footer) return;
  var items = Array.prototype.slice.call(footer.querySelectorAll('[data-footer-acc]'));
  if (!items.length) return;

  var mq = window.matchMedia('(max-width: 749px)');

  var animate = function (body, from, to, done) {
    var a = body.animate(
      [{ height: from + 'px' }, { height: to + 'px' }],
      { duration: 300, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
    );
    a.onfinish = done;
    a.oncancel = done;
  };

  items.forEach(function (d) {
    var summary = d.querySelector('summary');
    var body = d.querySelector('[data-footer-acc-body]');
    if (!summary) return;

    summary.addEventListener('click', function (e) {
      e.preventDefault();              // jamais de toggle natif (desktop reste ouvert)
      if (!mq.matches || !body) return;
      if (d.dataset.animating) return;
      if (d.open) {
        d.dataset.animating = '1';
        animate(body, body.scrollHeight, 0, function () {
          d.open = false;
          delete d.dataset.animating;
        });
      } else {
        d.dataset.animating = '1';
        d.open = true;
        animate(body, 0, body.scrollHeight, function () {
          delete d.dataset.animating;
        });
      }
    });
  });

  // Ouvert sur desktop, replié sur mobile — resynchronisé au changement de palier
  var sync = function () {
    var collapsed = mq.matches;
    items.forEach(function (d) {
      delete d.dataset.animating;
      d.open = !collapsed;
    });
  };
  sync();
  if (mq.addEventListener) mq.addEventListener('change', sync);
  else if (mq.addListener) mq.addListener(sync);
})();
