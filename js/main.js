(function () {
  var CONSENT_KEY = 'yogahome_cookie_consent';

  function initScrollAnimations() {
    var items = document.querySelectorAll('[data-animate]');
    if (!items.length) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    items.forEach(function (el) {
      var duration = parseFloat(el.getAttribute('data-animate-duration'));
      if (!isNaN(duration) && duration > 0) {
        el.style.animationDuration = duration + 'ms';
      }
    });

    function reveal(el) {
      if (el.classList.contains('anim--revealed')) return;
      el.classList.add('anim--revealed');

      if (reduceMotion) {
        el.classList.remove('anim--pending');
        el.style.visibility = 'visible';
        return;
      }

      var delay = parseFloat(el.getAttribute('data-animate-delay')) || 0;

      function run() {
        requestAnimationFrame(function () {
          el.classList.remove('anim--pending');
          el.style.visibility = 'visible';
        });
      }

      if (delay > 0) {
        setTimeout(run, delay);
      } else {
        run();
      }
    }

    if (!('IntersectionObserver' in window)) {
      items.forEach(reveal);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -8% 0px'
    });

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initNav() {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;
  
    var toggle = nav.querySelector('.site-nav__toggle');
    var closeBtn = nav.querySelector('.site-nav__close');
    var overlay = nav.querySelector('.site-nav__overlay');
    var header = document.querySelector('.site-header');
  
    function open() { nav.classList.add('site-nav--open'); }
    function close() { nav.classList.remove('site-nav--open'); }
  
    if (toggle) toggle.addEventListener('click', function (e) {
      e.preventDefault();
      nav.classList.contains('site-nav--open') ? close() : open();
    });
  
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (overlay) overlay.addEventListener('click', close);
  
    nav.querySelectorAll('.site-nav__link').forEach(function (link) {
      link.addEventListener('click', close);
    });
  
    if (header) {
      function onScroll() {
        header.classList.toggle('site-header--scrolled', window.scrollY > 16);
      }  
      window.requestAnimationFrame(onScroll);       
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }

  function initAccordion() {
    document.querySelectorAll('.accordion__trigger').forEach(function (btn) {https://github.com/Ludmika84/home-yoga/blob/main/js/main.js
      btn.addEventListener('click', function () {
        var item = btn.closest('.accordion__item');
        var open = item.classList.contains('accordion__item--open');
        item.parentElement.querySelectorAll('.accordion__item').forEach(function (el) {
          el.classList.remove('accordion__item--open');
        });
        if (!open) item.classList.add('accordion__item--open');
      });
    });
  }

  function initFormSubmitLinks() {
    document.querySelectorAll('.js-form-submit').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var formId = link.getAttribute('data-form');
        var form = formId ? document.getElementById(formId) : link.closest('form');
        if (!form) return;
        if (form.reportValidity()) {
          var target = form.getAttribute('action') || 'success.html';
          window.location.href = target.split('?')[0];
        }
      });
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href');
        if (!id || id === '#') return;

        var target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', id);
      });
    });
  }

  function initStickyCta() {
    var bar = document.getElementById('sticky-cta');
    if (!bar) return;
  
    var hero = document.querySelector('.hero');
    var threshold = 400; 
    function onScroll() {
      bar.classList.toggle('sticky-cta--visible', window.scrollY > threshold);
    }
  
  window.requestAnimationFrame(function() {
    if (hero) {
      threshold = hero.offsetHeight * 0.6;  
    }
    onScroll();  
  });
  window.addEventListener('scroll', onScroll, { passive: true });
}
function initImageZoom() {
    var triggers = document.querySelectorAll('[data-zoom-src]');
    if (!triggers.length) return;

    var lightbox = document.getElementById('img-lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'img-lightbox';
      lightbox.className = 'img-lightbox';
      lightbox.setAttribute('role', 'dialog');
      lightbox.setAttribute('aria-modal', 'true');
      lightbox.setAttribute('aria-label', 'Enlarged image');
      lightbox.innerHTML =
        '<button type="button" class="img-lightbox__close" aria-label="Close">&times;</button>' +
        '<img class="img-lightbox__img" loading="lazy" src="" alt="">';
      document.body.appendChild(lightbox);
    }

    var img = lightbox.querySelector('.img-lightbox__img');
    var closeBtn = lightbox.querySelector('.img-lightbox__close');
    var lastFocus = null;

    function open(src, alt) {
      lastFocus = document.activeElement;
      img.src = src;
      img.alt = alt || '';
      lightbox.classList.add('img-lightbox--open');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function close() {
      lightbox.classList.remove('img-lightbox--open');
      document.body.style.overflow = '';
      img.removeAttribute('src');
      img.alt = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    triggers.forEach(function (btn) {
      btn.addEventListener('click', function () {
        open(btn.getAttribute('data-zoom-src'), btn.getAttribute('data-zoom-alt') || '');
      });
    });

    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('img-lightbox--open')) close();
    });
  }

  function initFooterYear() {
    var year = String(new Date().getFullYear());
    document.querySelectorAll('[data-site-year]').forEach(function (el) {
      el.textContent = year;
    });
  }

  function saveConsent(consent) {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    } catch (err) { /* storage unavailable */ }
  }

  function loadConsent() {
    try {
      var raw = localStorage.getItem(CONSENT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }

  function applyConsent(consent) {
    document.documentElement.setAttribute('data-consent-analytics', consent.analytics ? 'granted' : 'denied');
    document.documentElement.setAttribute('data-consent-marketing', consent.marketing ? 'granted' : 'denied');
  }

  var cookieSettingsEl = null;

  function createCookieSettingsPanel() {
    var settings = document.createElement('div');
    settings.className = 'cookie-settings';
    settings.id = 'cookie-settings';
    settings.setAttribute('role', 'dialog');
    settings.setAttribute('aria-modal', 'true');
    settings.setAttribute('aria-label', 'Cookie settings');
    settings.innerHTML =
      '<div class="cookie-settings__panel">' +
        '<h2 class="cookie-settings__title">Cookie Settings</h2>' +
        '<p class="cookie-settings__lead">Choose which optional cookies we may use. Strictly necessary cookies are always active because the site cannot function without them.</p>' +
        '<div class="cookie-settings__row">' +
          '<div class="cookie-settings__label"><strong>Strictly Necessary</strong><span>Required for security, form submission, and basic navigation. Always enabled.</span></div>' +
          '<label class="cookie-settings__toggle"><input type="checkbox" checked disabled><span class="cookie-settings__slider"></span></label>' +
        '</div>' +
        '<div class="cookie-settings__row">' +
          '<div class="cookie-settings__label"><strong>Analytics</strong><span>Helps us understand how visitors use pages so we can improve content.</span></div>' +
          '<label class="cookie-settings__toggle"><input type="checkbox" id="cookie-analytics"><span class="cookie-settings__slider"></span></label>' +
        '</div>' +
        '<div class="cookie-settings__row">' +
          '<div class="cookie-settings__label"><strong>Marketing</strong><span>May be used to measure affiliate links and relevant promotions.</span></div>' +
          '<label class="cookie-settings__toggle"><input type="checkbox" id="cookie-marketing"><span class="cookie-settings__slider"></span></label>' +
        '</div>' +
        '<div class="cookie-settings__actions">' +
          '<button type="button" class="btn cookie-settings__save">Save Preferences</button>' +
          '<button type="button" class="btn btn--outline cookie-settings__close">Close</button>' +
        '</div>' +
      '</div>';
    return settings;
  }

  function wireCookieSettings(settings, onSave) {
    function closeSettings() {
      settings.classList.remove('cookie-settings--open');
    }

    settings.querySelector('.cookie-settings__save').addEventListener('click', function () {
      onSave(
        settings.querySelector('#cookie-analytics').checked,
        settings.querySelector('#cookie-marketing').checked
      );
      closeSettings();
    });

    settings.querySelector('.cookie-settings__close').addEventListener('click', closeSettings);

    settings.addEventListener('click', function (e) {
      if (e.target === settings) closeSettings();
    });
  }

  function syncCookieSettingsUI() {
    if (!cookieSettingsEl) return;
    var consent = loadConsent() || { analytics: false, marketing: false };
    cookieSettingsEl.querySelector('#cookie-analytics').checked = !!consent.analytics;
    cookieSettingsEl.querySelector('#cookie-marketing').checked = !!consent.marketing;
  }

  function openCookieSettings() {
    if (!cookieSettingsEl) {
      cookieSettingsEl = createCookieSettingsPanel();
      document.body.appendChild(cookieSettingsEl);
      wireCookieSettings(cookieSettingsEl, function (analytics, marketing) {
        var consent = {
          necessary: true,
          analytics: !!analytics,
          marketing: !!marketing,
          updated: new Date().toISOString(),
          source: 'settings'
        };
        saveConsent(consent);
        applyConsent(consent);
      });
    }
    syncCookieSettingsUI();
    cookieSettingsEl.classList.add('cookie-settings--open');
  }

  function initCookieSettingsLinks() {
    document.querySelectorAll('.js-cookie-settings').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        openCookieSettings();
      });
    });
  }

  function initCookieConsent() {
    var existing = loadConsent();

    function applyDefaultReject(reason) {
      var consent = {
        necessary: true,
        analytics: false,
        marketing: false,
        updated: new Date().toISOString(),
        source: reason || 'user'
      };
      saveConsent(consent);
      applyConsent(consent);
    }

    if (existing) {
      applyConsent(existing);
      return;
    }

    // Honor Global Privacy Control (CCPA / state opt-out signals) when supported
    if (navigator.globalPrivacyControl === true) {
      applyDefaultReject('gpc');
      return;
    }

    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.setAttribute('aria-live', 'polite');
    banner.innerHTML =
      '<div class="cookie-banner__inner">' +
        '<p class="cookie-banner__text">We use cookies and similar technologies to run this website, remember your preferences, and (with your consent) measure traffic and show relevant content. Under U.S. state privacy laws and GDPR where applicable, you may accept, reject, or customize non-essential cookies. See our <a href="cookie-policy.html">Cookie Policy</a> and <a href="privacy-policy.html">Privacy Policy</a>.</p>' +
        '<div class="cookie-banner__actions">' +
          '<button type="button" class="btn cookie-banner__accept">Accept All</button>' +
          '<button type="button" class="btn btn--outline cookie-banner__reject">Reject</button>' +
          '<button type="button" class="btn btn--outline cookie-banner__settings-btn">Cookie Settings</button>' +
        '</div>' +
      '</div>';

    var settings = createCookieSettingsPanel();
    cookieSettingsEl = settings;
    document.body.appendChild(banner);
    document.body.appendChild(settings);

    requestAnimationFrame(function () {
      banner.classList.add('cookie-banner--visible');
    });

    function closeBanner() {
      banner.classList.remove('cookie-banner--visible');
      setTimeout(function () {
        if (banner.parentNode) banner.parentNode.removeChild(banner);
      }, 400);
    }

    function setConsent(analytics, marketing) {
      var consent = {
        necessary: true,
        analytics: !!analytics,
        marketing: !!marketing,
        updated: new Date().toISOString()
      };
      saveConsent(consent);
      applyConsent(consent);
      closeBanner();
    }

    wireCookieSettings(settings, setConsent);

    banner.querySelector('.cookie-banner__accept').addEventListener('click', function () {
      setConsent(true, true);
    });

    banner.querySelector('.cookie-banner__reject').addEventListener('click', function () {
      setConsent(false, false);
    });

    banner.querySelector('.cookie-banner__settings-btn').addEventListener('click', function () {
      syncCookieSettingsUI();
      settings.classList.add('cookie-settings--open');
    });
  }

  function boot() {
    initScrollAnimations();
    initNav();
    initAccordion();
    initFormSubmitLinks();
    initSmoothScroll();
    initStickyCta();
    initImageZoom();
    initFooterYear();
    initCookieConsent();
    initCookieSettingsLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
