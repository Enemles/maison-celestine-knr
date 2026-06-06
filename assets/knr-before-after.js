(function () {
  /* ----- Before/after compare slider ----- */
  document.querySelectorAll('[data-ba-compare]').forEach(function (compare) {
    var range = compare.querySelector('[data-ba-range]');
    if (!range) return;
    var apply = function () {
      compare.style.setProperty('--ba-pos', range.value + '%');
    };
    range.addEventListener('input', apply);
    apply();
  });

  /* ----- Testimonials carousel ----- */
  document.querySelectorAll('[data-ba-carousel]').forEach(function (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-ba-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-ba-dot]'));
    if (slides.length < 2) return;

    var idx = 0;
    var timer;
    var show = function (i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach(function (s, j) { s.classList.toggle('is-active', j === idx); });
      dots.forEach(function (d, j) { d.classList.toggle('is-active', j === idx); });
    };
    var start = function () { timer = setInterval(function () { show(idx + 1); }, 5000); };
    var stop = function () { clearInterval(timer); };

    dots.forEach(function (d, j) {
      d.addEventListener('click', function () { show(j); stop(); start(); });
    });
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);

    show(0);
    start();
  });
})();
