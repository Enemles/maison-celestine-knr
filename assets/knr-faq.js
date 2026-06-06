(function () {
  var groups = document.querySelectorAll('[data-faq]');
  if (!groups.length) return;

  var animate = function (body, from, to, done) {
    var a = body.animate(
      [{ height: from + 'px' }, { height: to + 'px' }],
      { duration: 300, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
    );
    a.onfinish = done;
    a.oncancel = done;
  };

  var collapse = function (d, body) {
    d.dataset.animating = '1';
    animate(body, body.scrollHeight, 0, function () {
      d.open = false;
      delete d.dataset.animating;
    });
  };

  var expand = function (d, body) {
    d.dataset.animating = '1';
    d.open = true;
    animate(body, 0, body.scrollHeight, function () {
      delete d.dataset.animating;
    });
  };

  groups.forEach(function (group) {
    var items = Array.prototype.slice.call(group.querySelectorAll('.knr-faq__item'));
    items.forEach(function (d) {
      var summary = d.querySelector('summary');
      var body = d.querySelector('.knr-faq__body');
      if (!summary || !body) return;

      summary.addEventListener('click', function (e) {
        e.preventDefault();
        if (d.dataset.animating) return;
        if (d.open) {
          collapse(d, body);
        } else {
          items.forEach(function (o) {
            if (o !== d && o.open && !o.dataset.animating) {
              collapse(o, o.querySelector('.knr-faq__body'));
            }
          });
          expand(d, body);
        }
      });
    });
  });
})();
