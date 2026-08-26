/* AgriBiz and Social CBC — site interactions */
(function(){
  "use strict";

  var header = document.querySelector('.site-header');
  var body = document.body;
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelectorAll('.main-nav a');

  /* ---------- header scroll state + mobile nav ---------- */
  function onScroll(){
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    var topBtn = document.querySelector('.fab-top');
    if (topBtn){
      if (window.scrollY > 700) topBtn.classList.add('show');
      else topBtn.classList.remove('show');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navToggle){
    navToggle.addEventListener('click', function(){
      body.classList.toggle('menu-open');
    });
  }
  navLinks.forEach(function(a){
    a.addEventListener('click', function(){ body.classList.remove('menu-open'); });
  });

  /* ---------- active nav link on scroll ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navMap = {};
  navLinks.forEach(function(a){
    var href = a.getAttribute('href');
    if (href && href.charAt(0) === '#') navMap[href.slice(1)] = a;
  });
  if ('IntersectionObserver' in window){
    var navObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var link = navMap[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting){
          navLinks.forEach(function(l){ l.classList.remove('active'); });
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function(s){ navObserver.observe(s); });
  }

  /* ---------- scroll reveal (with fallbacks so content is never stuck invisible) ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window){
    var revealObserver = new IntersectionObserver(function(entries, obs){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function(el){ revealObserver.observe(el); });

    setTimeout(function(){
      revealEls.forEach(function(el){ el.classList.add('in'); });
    }, 2500);
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------- animated counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window){
    var countObserver = new IntersectionObserver(function(entries, obs){
      entries.forEach(function(entry){
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1100;
        var startTime = null;
        function step(ts){
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function(el){ countObserver.observe(el); });
  } else {
    counters.forEach(function(el){ el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix')||''); });
  }

  /* ---------- What We Grow: tab switcher ---------- */
  var growTabs = document.querySelectorAll('.grow-tab');
  var growPanels = document.querySelectorAll('.grow-panel');
  growTabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      var target = tab.getAttribute('data-panel');
      growTabs.forEach(function(t){ t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      growPanels.forEach(function(p){ p.classList.toggle('active', p.id === 'panel-' + target); });
    });
  });

  /* ---------- contact form -> mailto ---------- */
  var form = document.getElementById('contactForm');
  if (form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var name = form.querySelector('#cf-name').value.trim();
      var email = form.querySelector('#cf-email').value.trim();
      var subjectSel = form.querySelector('#cf-subject').value;
      var message = form.querySelector('#cf-message').value.trim();

      var subject = encodeURIComponent('Website enquiry — ' + subjectSel);
      var bodyLines = [
        'Name: ' + name,
        'Email: ' + email,
        'Interested in: ' + subjectSel,
        '',
        message
      ];
      var mailBody = encodeURIComponent(bodyLines.join('\n'));
      window.location.href = 'mailto:gasanaleslie@gmail.com?subject=' + subject + '&body=' + mailBody;
    });
  }

  /* ---------- back to top ---------- */
  var topBtn = document.querySelector('.fab-top');
  if (topBtn){
    topBtn.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
