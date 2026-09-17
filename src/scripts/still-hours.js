/* @ds-bundle: {"format":4,"namespace":"StillHours","components":[{"name":"Slider"},{"name":"Marquee"},{"name":"IndexList"},{"name":"Motion"},{"name":"ThemeToggle"}]} */
/* Still Hours — motion runtime. One classic script, no dependencies.
   StillHours.init(root) wires every data- attribute below. Everything degrades
   to a static, fully readable page when JavaScript or motion is unavailable. */
(function () {
  var W = window;
  var REDUCED = W.matchMedia ? W.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  var COARSE = W.matchMedia ? W.matchMedia('(pointer: coarse)').matches : false;

  function all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  /* ---------- scroll reveal ---------- */
  function reveal(root) {
    var els = all('[data-reveal]', root).filter(function (el) { return !el.__shRevealed; });
    if (!W.IntersectionObserver || REDUCED) {
      els.forEach(function (el) { el.__shRevealed = 1; el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    els.forEach(function (el) {
      el.__shRevealed = 1;
      if (el.getAttribute('data-reveal-delay')) {
        el.style.setProperty('--sh-delay', el.getAttribute('data-reveal-delay') + 'ms');
      }
      io.observe(el);
    });
  }

  /* ---------- kinetic headline: words masked, staggered up ---------- */
  function split(root) {
    all('[data-split]', root).forEach(function (el) {
      if (el.__shSplit) return;
      el.__shSplit = 1;
      var words = (el.textContent || '').trim().split(/\s+/);
      el.textContent = '';
      words.forEach(function (word, i) {
        var outer = document.createElement('span');
        outer.className = 'sh-word';
        var inner = document.createElement('span');
        inner.className = 'sh-word__in';
        inner.style.setProperty('--i', i);
        inner.textContent = word;
        outer.appendChild(inner);
        el.appendChild(outer);
        el.appendChild(document.createTextNode(' '));
      });
      if (!el.getAttribute('data-reveal')) el.setAttribute('data-reveal', 'kinetic');
    });
  }

  /* ---------- marquee ---------- */
  function marquee(root) {
    all('[data-marquee]', root).forEach(function (el) {
      if (el.__shMarquee) return;
      el.__shMarquee = 1;
      var track = el.querySelector('.sh-marquee__track');
      if (!track) return;
      var clone = track.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      el.appendChild(clone);
      var s = el.getAttribute('data-marquee-speed');
      if (s) el.style.setProperty('--sh-marquee-dur', s + 's');
    });
  }

  /* ---------- slider ---------- */
  function Slider(el) {
    var track = el.querySelector('.sh-slider__track');
    var slides = all('.sh-slide', el);
    var bar = el.querySelector('[data-slider-bar]');
    var idxOut = el.querySelector('[data-slider-index]');
    var totalOut = el.querySelector('[data-slider-total]');
    var i = 0, n = slides.length, drag = null, autoTimer = null;
    var delay = parseInt(el.getAttribute('data-slider-autoplay') || '0', 10);

    function pad(x) { return (x + 1 < 10 ? '0' : '') + (x + 1); }
    function render(animate) {
      track.style.transition = animate === false ? 'none' : '';
      track.style.transform = 'translate3d(' + (-i * 100) + '%,0,0)';
      slides.forEach(function (s, k) {
        s.classList.toggle('is-current', k === i);
        s.setAttribute('aria-hidden', k === i ? 'false' : 'true');
        all('a,button', s).forEach(function (f) {
          if (k === i) { f.removeAttribute('tabindex'); } else { f.setAttribute('tabindex', '-1'); }
        });
      });
      if (bar) bar.style.width = ((i + 1) / n * 100) + '%';
      if (idxOut) idxOut.textContent = pad(i);
    }
    function go(next) { i = (next + n) % n; render(); restart(); }
    function restart() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
      if (delay && !REDUCED) autoTimer = setInterval(function () {
        // Stop once a client-side navigation has removed the slider.
        if (!el.isConnected) { clearInterval(autoTimer); autoTimer = null; return; }
        i = (i + 1) % n; render();
      }, delay);
    }

    if (totalOut) totalOut.textContent = (n < 10 ? '0' : '') + n;
    el.setAttribute('aria-roledescription', 'carousel');
    all('[data-slider-next]', el).forEach(function (b) { b.addEventListener('click', function () { go(i + 1); }); });
    all('[data-slider-prev]', el).forEach(function (b) { b.addEventListener('click', function () { go(i - 1); }); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { go(i + 1); } else if (e.key === 'ArrowLeft') { go(i - 1); }
    });
    el.addEventListener('pointerenter', function () { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } });
    el.addEventListener('pointerleave', function () { restart(); });

    var vp = el.querySelector('.sh-slider__viewport') || el;
    vp.addEventListener('pointerdown', function (e) {
      if (e.button) return;
      drag = { x: e.clientX, w: vp.offsetWidth || 1, moved: 0 };
      el.classList.add('is-dragging');
      try { vp.setPointerCapture(e.pointerId); } catch (err) {}
    });
    vp.addEventListener('pointermove', function (e) {
      if (!drag) return;
      drag.moved = e.clientX - drag.x;
      var pct = clamp(drag.moved / drag.w, -1, 1) * 100;
      track.style.transition = 'none';
      track.style.transform = 'translate3d(' + (-i * 100 + pct) + '%,0,0)';
    });
    function endDrag() {
      if (!drag) return;
      var moved = drag.moved, w = drag.w;
      drag = null;
      el.classList.remove('is-dragging');
      if (Math.abs(moved) > w * 0.12) { go(moved < 0 ? i + 1 : i - 1); } else { render(); restart(); }
    }
    vp.addEventListener('pointerup', endDrag);
    vp.addEventListener('pointercancel', endDrag);

    render(false);
    restart();
    return { go: go, next: function () { go(i + 1); }, prev: function () { go(i - 1); },
             get index() { return i; }, get length() { return n; } };
  }
  function sliders(root) {
    return all('[data-slider]', root).map(function (el) {
      if (el.__shSlider) return el.__shSlider;
      el.__shSlider = Slider(el);
      return el.__shSlider;
    });
  }

  /* ---------- magnetic buttons ---------- */
  function magnetic(root) {
    if (REDUCED || COARSE) return;
    all('[data-magnetic]', root).forEach(function (el) {
      if (el.__shMag) return;
      el.__shMag = 1;
      var pull = parseFloat(el.getAttribute('data-magnetic')) || 0.3;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) * pull;
        var dy = (e.clientY - (r.top + r.height / 2)) * pull;
        el.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- custom cursor ---------- */
  function cursor(root) {
    var doc = (root && root.ownerDocument) || document;
    if (REDUCED || COARSE) return;
    if (doc.__shCursor) {
      // A client-side navigation swaps <body>; carry the existing cursor over.
      if (!doc.__shCursor.isConnected) doc.body.appendChild(doc.__shCursor);
      return;
    }
    if (!all('[data-cursor-label]', root).length) return;
    var node = doc.createElement('div');
    node.className = 'sh-cursor';
    node.setAttribute('aria-hidden', 'true');
    node.innerHTML = '<span class="sh-cursor__label"></span>';
    doc.body.appendChild(node);
    doc.__shCursor = node;
    var label = node.firstChild;
    var x = 0, y = 0, cx = 0, cy = 0, on = false;
    doc.addEventListener('pointermove', function (e) {
      x = e.clientX; y = e.clientY;
      if (!on) { cx = x; cy = y; on = true; node.classList.add('is-on'); }
      var t = e.target.closest ? e.target.closest('[data-cursor-label]') : null;
      node.classList.toggle('is-active', !!t);
      label.textContent = t ? t.getAttribute('data-cursor-label') : '';
    });
    doc.addEventListener('pointerleave', function () { on = false; node.classList.remove('is-on'); });
    (function loop() {
      cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
      node.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0) translate(-50%,-50%)';
      W.requestAnimationFrame(loop);
    })();
  }

  /* ---------- index list: hovering a row shows its frame ---------- */
  function indexList(root) {
    all('[data-index-list]', root).forEach(function (list) {
      if (list.__shIndex) return;
      list.__shIndex = 1;
      var pv = list.querySelector('[data-index-preview]');
      if (!pv || COARSE) return;
      var img = pv.querySelector('img');
      var x = 0, y = 0, cx = 0, cy = 0, running = false;
      all('[data-index-item]', list).forEach(function (row) {
        row.addEventListener('pointerenter', function () {
          if (img) img.src = row.getAttribute('data-index-img') || img.src;
          pv.classList.add('is-on');
        });
        row.addEventListener('pointerleave', function () { pv.classList.remove('is-on'); });
      });
      list.addEventListener('pointermove', function (e) {
        var r = list.getBoundingClientRect();
        x = e.clientX - r.left; y = e.clientY - r.top;
        if (!running) { running = true; cx = x; cy = y; loop(); }
      });
      function loop() {
        if (!list.isConnected) { running = false; return; }
        cx += (x - cx) * 0.12; cy += (y - cy) * 0.12;
        pv.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0) translate(-50%,-50%)';
        W.requestAnimationFrame(loop);
      }
    });
  }

  /* ---------- theme ---------- */
  var theme = {
    get: function () { return document.documentElement.getAttribute('data-theme') || 'night'; },
    set: function (id) {
      document.documentElement.setAttribute('data-theme', id);
      try { localStorage.setItem('sh-theme', id); } catch (e) {}
      all('[data-theme-label]').forEach(function (l) { l.textContent = id === 'night' ? 'Day' : 'Night'; });
      all('[data-theme-toggle]').forEach(function (b) { b.setAttribute('aria-pressed', id === 'day' ? 'true' : 'false'); });
    },
    toggle: function () { theme.set(theme.get() === 'night' ? 'day' : 'night'); },
    restore: function () {
      var saved = null;
      try { saved = localStorage.getItem('sh-theme'); } catch (e) {}
      if (!saved && W.matchMedia && W.matchMedia('(prefers-color-scheme: light)').matches) saved = 'day';
      if (saved) theme.set(saved);
    }
  };
  function toggles(root) {
    all('[data-theme-toggle]', root).forEach(function (b) {
      if (b.__shTheme) return;
      b.__shTheme = 1;
      b.addEventListener('click', function () { theme.toggle(); });
    });
  }

  function init(root) {
    root = root || document;
    split(root); reveal(root); marquee(root); sliders(root);
    magnetic(root); cursor(root); indexList(root); toggles(root);
    document.documentElement.classList.add('sh-js');
    return W.StillHours;
  }

  W.StillHours = {
    version: '2.0.0',
    reducedMotion: REDUCED,
    init: init, reveal: reveal, split: split, marquee: marquee,
    sliders: sliders, magnetic: magnetic, cursor: cursor, indexList: indexList,
    theme: theme
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(document); });
  } else {
    init(document);
  }
})();
