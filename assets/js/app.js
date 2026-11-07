/* Marsa Team site: renders every page from the content JSON inlined in the page (#content-inline; the same text
   is also written to assets/content/content.{ar,en}.json by site_build.py for review). No cookies, no tracking.
   Each page has ONE fixed language (html lang): Arabic pages at /, English pages under /en/. */
(function () {
  if (window.top !== window.self) { try { window.top.location = window.self.location; } catch (e) { document.documentElement.hidden = true; } }  // anti-framing (meta CSP cannot set frame-ancestors)
  var d = document.documentElement, page = document.body.dataset.page, C = {}, L = d.lang === 'en' ? 'en' : 'ar', P = L === 'en' ? '../' : '', root;
  function S(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} }
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    for (var k in (attrs || {})) { if (k === 'text') n.textContent = attrs[k]; else if (attrs[k] !== undefined && attrs[k] !== null) n.setAttribute(k, attrs[k]); }
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function t(s) { return document.createTextNode(s); }
  function href(p) { return p; }
  function pf(p) { return p === 'index' || p === '404' ? 'index.html' : p + '.html'; }
  function sibling() { return (L === 'ar' ? 'en/' : '../') + pf(page); }
  var T, X, U;
  // internal linking: labels come from T.nav. Nav/footer lists come from the build (X.nav, X.foot).
  var REL = { story: ['trust', 'join'], work: ['join', 'videos'], videos: ['support', 'trust', 'press'], support: ['trust', 'join', 'faq'],
              join: ['press', 'trust', 'contact'], trust: ['faq', 'contact', 'support'], press: ['contact', 'videos', 'trust'],
              faq: ['trust', 'support', 'contact'], contact: ['join', 'press', 'trust'] };
  function flat(a) { return [].concat.apply([], a); }
  function li(s) { return el('li', { text: s }); }
  function slug(i) { return X.videos[i].cover.replace(/^poster_|\.jpg$/g, ''); }
  function mailto(subject) { return 'mailto:' + T.site.email + '?subject=' + encodeURIComponent(subject); }
  function related() {
    var k = REL[page];
    return k ? sec([el('p', { 'class': 'kicker', text: X.related }), el('ul', { 'class': 'plain' }, k.map(function (n) { return el('li', {}, [el('a', { href: href(pf(n)), text: T.nav[n] })]); }))]) : null;
  }
  function crumbs() {
    if (page === 'index' || page === '404') return null;
    return el('div', { 'class': 'wrap crumbs', role: 'navigation', 'aria-label': X.crumbs }, [el('a', { href: href('index.html'), text: T.nav.home }), t(' / '), el('span', { 'aria-current': 'page', text: T.nav[page] })]);
  }
  function both(cls, a, b) { return [el('img', { 'class': cls + ' lt', src: P + 'assets/img/' + a[0], alt: a[1], width: a[2], height: a[3] }), el('img', { 'class': cls + ' dk', src: P + 'assets/img/' + b, alt: a[1], width: a[2], height: a[3] })]; }

  function header() {
    var nav = el('nav', { 'aria-label': X.main_nav }, X.nav.map(function (k) {
      var f = pf(k === 'home' ? 'index' : k), a = el('a', { href: href(f), text: T.nav[k] });
      if (f === pf(page)) a.setAttribute('aria-current', 'page');
      return a;
    }));
    var other = L === 'ar' ? 'en' : 'ar';
    var lb = el('a', { 'class': 'tbtn', id: 'langBtn', href: sibling(), lang: other, hreflang: other, text: U.language });
    var tb = el('button', { 'class': 'tbtn', id: 'themeBtn', type: 'button', text: X.theme, 'aria-pressed': isDark() ? 'true' : 'false' });
    return el('header', { 'class': 'top' }, [el('div', { 'class': 'wrap' }, [
      el('a', { 'class': 'brand', href: href('index.html') }, [
        el('span', { 'class': 'tile' }, both('ic', ['icon-80.png', '', 40, 40], 'logo_icon_dark.svg')),
        el('span', {}, [el('span', { text: T.site.name }), el('small', { text: T.site.tagline.split(/[.،]/)[0] })])]),
      nav, el('div', { 'class': 'tools' }, [tb, lb])])]);
  }
  function footer() {
    var links = X.foot.map(function (k) { return el('a', { href: href(k + '.html'), text: T.nav[k] }); });
    var S_ = T.site.social, w = L === 'ar' ? 225 : 187, alt = T.site.name + ' | ' + T.site.name_en;
    return el('footer', {}, [el('div', { 'class': 'wrap' }, [
      el('div', { 'class': 'lockup' }, [el('span', { 'class': 'logo-tile' }, both('lk', ['logo_lockup_' + L + '.svg', alt, w, 56], 'logo_lockup_' + L + '_dark.svg'))]),
      el('div', {}, [el('p', { text: T.footer.line }), el('p', { text: T.site.tagline }),
        el('p', { 'class': 'follow' }, [['Instagram', S_.instagram], ['TikTok', S_.tiktok], ['Facebook', S_.facebook]].map(function (s) { return el('a', { href: s[1], rel: 'noopener noreferrer', dir: 'ltr', text: s[0] }); })),
        el('p', { text: T.footer.disclaimer + ' · ' + T.footer.since })]),
      el('div', { 'class': 'links' }, links)])]);
  }
  function hero(kicker, title, lead) {
    return el('section', { 'class': 'hero' }, [el('div', { 'class': 'wrap' }, [
      kicker ? el('p', { 'class': 'kicker', text: kicker }) : null, el('h1', { text: title }), lead ? el('p', { 'class': 'lead', text: lead }) : null])]);
  }
  function sec(kids, plain) { return el('section', plain ? { 'class': 'flush' } : {}, [el('div', { 'class': 'wrap' }, kids)]); }
  function rows(items, lvl) {
    return el('ol', { 'class': 'rows' }, items.map(function (i) {
      return el('li', {}, [el('div', {}, [el(lvl || 'h3', { text: i.title }), el('p', { text: i.text })])]);
    }));
  }
  // poster: WebP at 2 widths (srcset); the jpg stays only as the size source for the build
  function poster(i, eager, ratio, sizes) {
    var v = X.videos[i], it = T.pages.videos.items[i], b = P + 'assets/img/' + v.cover.replace('.jpg', '-');
    return el('div', { 'class': 'poster', style: ratio ? 'aspect-ratio:' + ratio : (v.w / v.h > 0.6 ? 'aspect-ratio:' + v.w + '/' + v.h : null) }, [
      el('img', { src: b + v.w + '.webp', srcset: b + '360.webp 360w, ' + b + v.w + '.webp ' + v.w + 'w', sizes: sizes || '300px', alt: it.alt, width: v.w, height: v.h,
        loading: eager ? 'eager' : 'lazy', fetchpriority: eager ? 'high' : null, decoding: 'async' })]);
  }

  // portrait covers only (the wide WFP cover and the logo tile would be cropped / meaningless in the strip)
  function published(n) { return X.videos.map(function (v, i) { return i; }).filter(function (i) { return X.videos[i].platforms.length && X.videos[i].w / X.videos[i].h < 0.95; }).reverse().slice(0, n); }
  var R = {};
  R.index = function () {
    var p = T.pages.home, v = T.pages.videos, S_ = T.site.social;
    var strip = el('div', { 'class': 'strip' }, published(3).map(function (i) {
      return el('a', { href: href('videos.html#v-' + slug(i)), 'class': 'card' }, [poster(i, false, '3/4', '(max-width:520px) 45vw,360px'), el('h2', { 'class': 'ct', text: v.items[i].title }), el('div', { 'class': 'meta', text: v.items[i].date })]);
    }));
    return [
      el('section', { 'class': 'hero' }, [el('div', { 'class': 'wrap' }, [el('div', { 'class': 'grid' }, [
        el('div', {}, [el('h1', { text: p.hero.title }), el('p', { 'class': 'lead', text: p.hero.sub }),
          el('div', { 'class': 'row' }, [el('a', { 'class': 'btn', href: href('videos.html'), text: p.cta.primary }), el('a', { 'class': 'btn ghost', href: S_.instagram, rel: 'noopener noreferrer', text: p.cta.secondary + ' · Instagram' }), el('a', { 'class': 'btn ghost', href: S_.tiktok, rel: 'noopener noreferrer', text: p.cta.secondary + ' · TikTok' })]),
          el('p', { 'class': 'trustline', text: p.trust_line })]),
        el('div', { 'class': 'heroimg' }, [poster(4, true)])])])]),
      sec([el('p', { 'class': 'kicker', text: X.latest }), strip, el('p', { style: 'margin-top:var(--s4)' }, [el('a', { href: href('videos.html'), text: X.all_videos })])]),
      sec([el('ol', { 'class': 'rows' }, p.blocks.map(function (b) { return el('li', {}, [el('div', {}, [el('h3', { text: b.title }), el('p', { text: b.text })])]); }))]),
      sec([el('div', { 'class': 'notice' }, [el('h2', { text: T.pages.support.status.title }), el('p', { text: T.pages.support.status.text }), el('p', {}, [el('a', { href: href('support.html'), text: T.nav.support })])])])
    ];
  };
  R.story = function () {
    var p = T.pages.story;
    return [hero(null, p.title, p.intro),
      sec([el('div', { 'class': 'two' }, [el('div', {}, [el('h2', { text: p.why.title }), el('p', { text: p.why.text })]), el('div', {}, [el('h2', { text: p.document.title }), el('p', { text: p.document.text })])])], 1),
      sec([el('div', { 'class': 'notice' }, [el('h2', { text: p.honest.title }), el('p', { text: p.honest.text })])]),
      sec([el('h2', { text: p.principles_title }), rows(p.principles)])];
  };
  R.work = function () { var p = T.pages.work; return [hero(null, p.title, p.intro), sec([rows(p.areas, 'h2')], 1)]; };
  R.videos = function () {
    var p = T.pages.videos, S_ = T.site.social;
    // thumbnails and titles only: the reels are not hosted here; the badges open our page on each platform
    var list = el('ul', { 'class': 'vlist' }, p.items.map(function (_, k) { return k; }).reverse().map(function (i) {
      var it = p.items[i], v = X.videos[i], badges = v.platforms.map(function (n) {
        var u = S_[n.toLowerCase()];
        return el('li', {}, [u ? el('a', { 'class': 'badge', href: u, rel: 'noopener noreferrer', text: n }) : el('span', { 'class': 'badge', text: n })]);
      });
      return el('li', { 'class': 'vitem', id: 'v-' + slug(i) }, [poster(i, false, null, '(min-width:700px) 200px,120px'), el('div', {}, [
        el('h2', { text: it.title }), el('div', { 'class': 'meta', text: it.date }), it.desc ? el('p', { text: it.desc }) : null,
        badges.length ? el('ul', { 'class': 'badges' }, badges) : el('p', { 'class': 'src', text: X.unpublished })])]);
    }));
    return [hero(null, p.title, p.intro), sec([list, el('p', { 'class': 'src', text: X.badge_note })], 1)];
  };
  function waRow() {
    var n = document.body.dataset.wa || '';
    if (!n) return [];
    return [el('dt', { text: X.whatsapp }), el('dd', {}, [el('a', { href: 'https://wa.me/' + n.replace(/\D/g, ''), rel: 'noopener noreferrer', dir: 'ltr', text: n })])];
  }
  function mailRow() {
    var em = T.site.email;
    return [el('dt', { text: X.email }), el('dd', {}, [el('a', { href: 'mailto:' + em, dir: 'ltr', text: em })])];
  }
  function reachRows() { return mailRow().concat(waRow()); }
  // click-to-load YouTube: nothing is requested from youtube until the button is pressed; the poster is our own file
  function appeal(a, A) {
    var btn = el('button', { 'class': 'facade', type: 'button', 'aria-label': a.play }, [
      el('img', { src: P + 'assets/img/' + A.poster, alt: '', width: A.w, height: A.h, loading: 'lazy', decoding: 'async' }), el('span', { 'class': 'playbtn', 'aria-hidden': 'true', text: '▶' })]);
    var box = el('div', { 'class': 'embed', style: 'aspect-ratio:' + A.w + '/' + A.h }, [btn]);
    btn.onclick = function () {
      var f = el('iframe', { src: 'https://www.youtube-nocookie.com/embed/' + A.id + '?autoplay=1&rel=0&hl=' + L, title: a.title,
        allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen', allowfullscreen: '', referrerpolicy: 'strict-origin-when-cross-origin',
        sandbox: 'allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox' });
      box.replaceChild(f, btn); f.focus();
    };
    return box;
  }
  R.support = function () {
    var p = T.pages.support, A = X.appeal;
    return [hero(null, p.title, p.lead),
      sec([el('div', { 'class': 'notice' }, [el('h2', { text: p.contact.title }), el('p', { text: p.contact.text }), el('dl', { 'class': 'facts' }, reachRows())])], 1),
      A ? sec([el('h2', { text: p.appeal.title }), el('p', { text: p.appeal.text }), appeal(p.appeal, A),
        el('p', { 'class': 'src', style: 'margin-top:var(--s3)' }, [t(p.appeal.consent + ' '), el('a', { href: 'https://www.youtube.com/watch?v=' + A.id, rel: 'noopener noreferrer', text: p.appeal.external }), t(' · '), el('a', { href: href('privacy.html'), text: T.nav.privacy })])]) : null,
      sec([el('div', { 'class': 'notice warn' }, [el('h2', { text: p.warn.title }), el('ul', { 'class': 'plain' }, p.warn.items.map(li)), el('p', { text: p.warn.report })])]),
      sec([el('h2', { text: p.help_title }), rows(p.help)])];
  };
  R.join = function () {
    var p = T.pages.join;
    return [hero(null, p.title, p.intro),
      sec([el('h2', { text: p.offer_title }), rows(p.offer)], 1),
      sec([el('div', { 'class': 'two' }, [
        el('div', { 'class': 'notice' }, [el('h2', { text: p.orgs.title }), el('p', { text: p.orgs.text }), el('p', {}, [el('a', { 'class': 'btn', href: mailto(p.orgs.subject), text: p.orgs.cta })])]),
        el('div', { 'class': 'notice' }, [el('h2', { text: p.vols.title }), el('p', { text: p.vols.text }), el('ul', { 'class': 'plain' }, p.vols.roles.map(li)), el('p', {}, [el('a', { 'class': 'btn', href: mailto(p.vols.subject), text: p.vols.cta })])])])]),
      sec([el('h2', { text: p.steps_title }), rows(p.steps)]),
      sec([el('div', { 'class': 'notice warn' }, [el('h2', { text: p.safety.title }), el('p', { text: p.safety.text })]), el('p', { style: 'margin-top:var(--s4)' }, [el('a', { href: href('contact.html'), text: p.other })])])];
  };
  R.press = function () {
    var p = T.pages.press;
    return [hero(null, p.title, p.intro),
      sec([el('div', { 'class': 'notice warn' }, [el('h2', { text: p.rules.title }), el('p', { text: p.rules.text }), el('ul', { 'class': 'plain' }, p.rules.items.map(li))])], 1),
      sec([el('div', { 'class': 'two' }, [
        el('div', {}, [el('h2', { text: p.about.title }), el('p', { text: p.about.short }), el('h3', { text: p.about.long_title }), el('p', { text: p.about.long })]),
        el('div', {}, [el('h2', { text: p.facts_title }), el('dl', { 'class': 'facts' }, flat(p.facts.map(function (f) { return [el('dt', { text: f.k }), el('dd', { text: f.v })]; })).concat(mailRow()))])])]),
      sec([el('h2', { text: p.assets_title }), el('ul', { 'class': 'plain' }, p.assets.map(function (a, i) {
        var f = X.press[i];
        return el('li', {}, [el('a', { href: P + 'assets/' + f.file, download: '', text: a.title }), el('span', { 'class': 'src', text: ' · ' + f.ext.toUpperCase() + ' · ' + f.kb + ' KB' }), el('br'), t(a.text)]);
      }))]),
      sec([el('h2', { text: p.contact.title }), el('p', { text: p.contact.text })])];
  };
  R.trust = function () {
    var p = T.pages.trust, lg = p.log, S_ = T.site.social;
    return [hero(null, p.title, p.intro),
      sec([el('div', { 'class': 'notice' }, [el('h2', { text: p.official_title }), el('p', { text: p.official_text }),
        el('p', { 'class': 'follow' }, [['Instagram', S_.instagram], ['TikTok', S_.tiktok], ['Facebook', S_.facebook]].map(function (s) { return el('a', { href: s[1], rel: 'noopener noreferrer', dir: 'ltr', text: s[0] }); }))])], 1),
      sec([el('h2', { text: p.verify_title }), rows(p.verify)]),
      sec([el('h2', { text: p.corr_title }), el('p', { text: p.corr_text }), rows(p.corr)]),
      sec([el('h2', { text: lg.title }), lg.items.length ? el('ul', { 'class': 'plain' }, lg.items.map(function (e) { return li(e.date + ': ' + e.text); })) : el('p', { text: lg.empty })]),
      sec([el('div', { 'class': 'notice' }, [el('h2', { text: p.faces.title }), el('p', { text: p.faces.text }), el('p', {}, [el('a', { href: href('privacy.html'), text: T.nav.privacy })])])])];
  };
  R.contact = function () {
    var p = T.pages.contact, S_ = T.site.social, em = T.site.email;
    var dl = [el('dt', { text: X.email }), el('dd', {}, [el('a', { href: 'mailto:' + em, dir: 'ltr', text: em }), (function () {
      var b = el('button', { 'class': 'copy', type: 'button', 'aria-live': 'polite', text: U.copy_email });
      b.onclick = function () { var done = function () { b.textContent = X.copied; setTimeout(function () { b.textContent = U.copy_email; }, 1800); };
        try { navigator.clipboard.writeText(em).then(done, function () {}); } catch (e) {} };
      return b; })()])];
    var soc = [['Instagram', S_.instagram, T.site.handle], ['TikTok', S_.tiktok, T.site.handle], ['Facebook', S_.facebook, T.site.name]]
      .filter(function (s) { return s[1]; })
      .map(function (s) { return [el('dt', { text: s[0] }), el('dd', {}, [el('a', { href: s[1], rel: 'noopener noreferrer', dir: 'ltr', text: s[2] })])]; });
    dl = dl.concat(waRow()); var fl = []; soc.forEach(function (x) { fl = fl.concat(x); });
    return [hero(null, p.title, p.intro),
      sec([el('div', { 'class': 'two' }, [
        el('div', {}, [el('h2', { text: X.email }), el('dl', { 'class': 'facts' }, dl), el('h2', { style: 'margin-top:var(--s5)', text: X.social }), el('dl', { 'class': 'facts' }, fl)]),
        el('div', { 'class': 'notice' }, [el('h2', { text: p.expect_title }), el('ul', { 'class': 'plain' }, p.expect.map(function (e) { return el('li', { text: e }); })), el('p', { text: p.what_to_send })])])], 1),
      sec([el('h2', { text: p.response.title }), el('p', { text: p.response.text })])];
  };
  R.faq = function () {
    var p = T.pages.faq;
    return [hero(null, p.title, null), sec([el('ol', { 'class': 'rows' }, p.items.map(function (i) {
      return el('li', {}, [el('div', {}, [el('h2', { 'class': 'q', text: i.q }), el('p', { text: i.a })])]); }))], 1)];
  };
  R.privacy = R.terms = function () {
    var p = T.pages[page];
    return [hero(null, p.title, p.intro), sec([el('ol', { 'class': 'rows' }, p.sections.map(function (i) {
      return el('li', {}, [el('div', {}, [el('h2', { 'class': 'q', text: i.title }), el('p', { text: i.text })])]); }))], 1)];
  };
  R['404'] = function () {
    var pages = X.nav.filter(function (k) { return k !== 'home'; });
    return [el('section', { 'class': 'nf' }, [el('div', { 'class': 'wrap' }, [el('h1', { text: X.nf_title }), el('p', { 'class': 'lead', text: X.nf_text }), el('a', { 'class': 'btn', href: href('index.html'), text: T.nav.home }),
      el('ul', { 'class': 'plain', style: 'margin-top:var(--s4)' }, pages.map(function (k) { return el('li', {}, [el('a', { href: href(k + '.html'), text: T.nav[k] })]); })),
      el('p', { lang: 'en', dir: 'ltr' }, [el('a', { href: 'en/index.html', text: X.nf_en })])])])];
  };

  function isDark() { return (d.dataset.theme || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light')) === 'dark'; }

  function render() {
    T = C[L]; X = T.x; U = T.ui;
    d.lang = L; d.dir = L === 'ar' ? 'rtl' : 'ltr';
    var m = page === '404' ? { title: X.nf_title + ' | ' + T.site.name, description: T.site.tagline } : T.pages[page === 'index' ? 'home' : page].meta;
    document.title = m.title;
    var md = document.querySelector('meta[name=description]'); if (md) md.content = m.description;
    [['og:title', m.title], ['og:description', m.description]].forEach(function (a) { var e = document.querySelector('meta[property="' + a[0] + '"]'); if (e) e.content = a[1]; });
    [['twitter:title', m.title], ['twitter:description', m.description]].forEach(function (a) { var e = document.querySelector('meta[name="' + a[0] + '"]'); if (e) e.content = a[1]; });
    var ol = document.querySelector('meta[property="og:locale"]'); if (ol) ol.content = L === 'ar' ? 'ar_AR' : 'en_US';
    root.textContent = '';
    // single leading slash: on the 404 page location.pathname can start with two slashes (which the browser reads as another site)
    root.appendChild(el('a', { 'class': 'skip', href: location.pathname.replace(/^\/+/, '/') + location.search + '#main', text: X.skip }));
    root.appendChild(header());
    var main = el('main', { id: 'main', tabindex: '-1' }, [crumbs()].concat(R[page](), [related()]));
    root.appendChild(main); root.appendChild(footer());
    document.getElementById('themeBtn').onclick = function () {
      var n = isDark() ? 'light' : 'dark'; d.dataset.theme = n; S('mtheme', n); this.setAttribute('aria-pressed', n === 'dark' ? 'true' : 'false'); };
  }
  var th = S('mtheme'); if (th) d.dataset.theme = th;
  document.addEventListener('DOMContentLoaded', function () {
    root = document.getElementById('app');
    var tq = location.search.match(/[?&]theme=(light|dark)/);
    if (tq) d.dataset.theme = tq[1];
    if (L === 'ar' && /[?&]lang=en/.test(location.search)) { location.replace(sibling()); return; }  // old ?lang=en links
    C[L] = JSON.parse(document.getElementById('content-inline').textContent)[L];   // same text as assets/content/*.json: no second request
    render();
  });
})();
