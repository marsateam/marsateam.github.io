/* Marsa Team site: renders every page from assets/content/content.{ar,en}.json (fetch),
   falling back to the same JSON inlined in the page (works from file://). No cookies, no tracking. */
(function () {
  var d = document.documentElement, page = document.body.dataset.page, C = {}, L = 'ar', root;
  function S(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} }
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    for (var k in (attrs || {})) { if (k === 'text') n.textContent = attrs[k]; else if (attrs[k] !== undefined && attrs[k] !== null) n.setAttribute(k, attrs[k]); }
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function t(s) { return document.createTextNode(s); }
  function href(p) { return L === 'en' ? p + '?lang=en' : p; }
  var T, X, U;
  var NAV = [['home', 'index.html'], ['story', 'story.html'], ['work', 'work.html'], ['videos', 'videos.html'], ['support', 'support.html'], ['faq', 'faq.html'], ['contact', 'contact.html']];
  var PAGEFILE = { index: 'index.html', story: 'story.html', work: 'work.html', videos: 'videos.html', support: 'support.html', faq: 'faq.html', contact: 'contact.html' };

  function header() {
    var cur = PAGEFILE[page];
    var nav = el('nav', { 'aria-label': X.main_nav }, NAV.map(function (n) {
      var a = el('a', { href: href(n[1]), text: T.nav[n[0]] });
      if (n[1] === cur) a.setAttribute('aria-current', 'page');
      return a;
    }));
    var lb = el('button', { 'class': 'tbtn', id: 'langBtn', type: 'button', lang: L === 'ar' ? 'en' : 'ar', text: U.language });
    var tb = el('button', { 'class': 'tbtn', id: 'themeBtn', type: 'button', text: X.theme, 'aria-pressed': isDark() ? 'true' : 'false' });
    return el('header', { 'class': 'top' }, [el('div', { 'class': 'wrap' }, [
      el('a', { 'class': 'brand', href: href('index.html') }, [
        el('span', { 'class': 'tile' }, [el('img', { src: 'assets/img/icon-256.png', alt: '', width: 40, height: 40 })]),
        el('span', {}, [el('span', { text: T.site.name }), el('small', { text: T.site.tagline.split(/[.،]/)[0] })])]),
      nav, el('div', { 'class': 'tools' }, [tb, lb])])]);
  }
  function footer() {
    var links = ['videos', 'support', 'faq', 'contact'].map(function (k) { return el('a', { href: href(k + '.html'), text: T.nav[k] }); });
    return el('footer', {}, [el('div', { 'class': 'wrap' }, [
      el('div', { 'class': 'lockup' }, [el('span', { 'class': 'logo-tile' }, [el('img', { src: 'assets/img/logo_lockup_' + L + '.svg', alt: T.site.name + ' | ' + T.site.name_en })])]),
      el('div', {}, [el('p', { text: T.footer.line }), el('p', { text: T.site.tagline }), el('p', { text: T.footer.disclaimer + ' · ' + T.footer.since })]),
      el('div', { 'class': 'links' }, links)])]);
  }
  function hero(kicker, title, lead) {
    return el('section', { 'class': 'hero' }, [el('div', { 'class': 'wrap' }, [
      kicker ? el('p', { 'class': 'kicker', text: kicker }) : null, el('h1', { text: title }), lead ? el('p', { 'class': 'lead', text: lead }) : null])]);
  }
  function sec(kids, plain) { return el('section', plain ? { style: 'padding-top:0;border-top:0' } : {}, [el('div', { 'class': 'wrap' }, kids)]); }
  function rows(items) {
    return el('ol', { 'class': 'rows' }, items.map(function (i) {
      return el('li', {}, [el('div', {}, [el('h3', { text: i.title }), el('p', { text: i.text })])]);
    }));
  }
  function poster(i, eager, ratio) {
    var v = X.videos[i], it = T.pages.videos.items[i];
    return el('div', { 'class': 'poster', style: ratio ? 'aspect-ratio:' + ratio : (v.w / v.h > 0.6 ? 'aspect-ratio:' + v.w + '/' + v.h : null) }, [el('img', { src: 'assets/img/' + v.cover, alt: it.alt, width: v.w, height: v.h, loading: eager ? 'eager' : 'lazy' })]);
  }

  function published(n) { return X.videos.map(function (v, i) { return i; }).filter(function (i) { return X.videos[i].platforms.length; }).reverse().slice(0, n); }
  var R = {};
  R.index = function () {
    var p = T.pages.home, v = T.pages.videos, S_ = T.site.social;
    var strip = el('div', { 'class': 'strip' }, published(3).map(function (i) {
      return el('a', { href: href('videos.html'), style: 'text-decoration:none;color:inherit' }, [poster(i, false, '3/4'), el('h3', { text: v.items[i].title }), el('div', { 'class': 'meta', text: v.items[i].date })]);
    }));
    return [
      el('section', { 'class': 'hero' }, [el('div', { 'class': 'wrap' }, [el('div', { 'class': 'grid' }, [
        el('div', {}, [el('h1', { text: p.hero.title }), el('p', { 'class': 'lead', text: p.hero.sub }),
          el('div', { 'class': 'row' }, [el('a', { 'class': 'btn', href: href('videos.html'), text: p.cta.primary }), el('a', { 'class': 'btn ghost', href: S_.instagram, rel: 'noopener', text: p.cta.secondary + ' · Instagram' }), el('a', { 'class': 'btn ghost', href: S_.tiktok, rel: 'noopener', text: p.cta.secondary + ' · TikTok' })])]),
        el('div', { style: 'max-width:300px' }, [poster(4, true)])])])]),
      sec([el('p', { 'class': 'kicker', text: X.latest }), strip, el('p', { style: 'margin-top:var(--s4)' }, [el('a', { href: href('videos.html'), text: X.all_videos })])]),
      sec([el('ol', { 'class': 'rows' }, p.blocks.map(function (b) { return el('li', {}, [el('div', {}, [el('h3', { text: b.title }), el('p', { text: b.text })])]); }))]),
      sec([el('div', { 'class': 'notice' }, [el('h3', { text: T.pages.support.status.title }), el('p', { text: T.pages.support.status.text }), el('p', {}, [el('a', { href: href('support.html'), text: T.nav.support })])])])
    ];
  };
  R.story = function () {
    var p = T.pages.story;
    return [hero(null, p.title, p.intro),
      sec([el('div', { 'class': 'two' }, [el('div', {}, [el('h2', { text: p.why.title }), el('p', { text: p.why.text })]), el('div', {}, [el('h2', { text: p.document.title }), el('p', { text: p.document.text })])])], 1),
      sec([el('div', { 'class': 'notice' }, [el('h3', { text: p.honest.title }), el('p', { text: p.honest.text })])]),
      sec([el('h2', { text: p.principles_title }), rows(p.principles)])];
  };
  R.work = function () { var p = T.pages.work; return [hero(null, p.title, p.intro), sec([rows(p.areas)], 1)]; };
  R.videos = function () {
    var p = T.pages.videos, S_ = T.site.social;
    var list = el('ul', { 'class': 'vlist' }, p.items.map(function (_, k) { return k; }).reverse().map(function (i) {
      var it = p.items[i], badges = X.videos[i].platforms.map(function (n) {
        var u = S_[n.toLowerCase()];
        return el('li', {}, [u ? el('a', { 'class': 'badge', href: u, rel: 'noopener', text: n }) : el('span', { 'class': 'badge', text: n })]);
      });
      return el('li', { 'class': 'vitem' }, [poster(i), el('div', {}, [
        el('h2', { text: it.title }), el('div', { 'class': 'meta', text: it.date }),
        badges.length ? el('ul', { 'class': 'badges' }, badges) : el('p', { 'class': 'src', text: X.unpublished })])]);
    }));
    return [hero(null, p.title, p.intro), sec([list, el('p', { 'class': 'src', text: X.badge_note })], 1)];
  };
  function waRow() {
    var n = document.body.dataset.wa || '';
    if (!n) return [];
    return [el('dt', { text: X.whatsapp }), el('dd', {}, [el('a', { href: 'https://wa.me/' + n.replace(/\D/g, ''), rel: 'noopener', dir: 'ltr', text: n })])];
  }
  function mailRow() {
    var em = T.site.email;
    return [el('dt', { text: X.email }), el('dd', {}, [el('a', { href: 'mailto:' + em, dir: 'ltr', text: em })])];
  }
  function reachRows() { return mailRow().concat(waRow()); }
  R.support = function () {
    var p = T.pages.support;
    return [hero(null, p.title, null),
      sec([el('p', { 'class': 'soon', text: U.coming_soon }), el('div', { 'class': 'notice' }, [el('h3', { text: p.status.title }), el('p', { text: p.status.text })])], 1),
      sec([el('h2', { text: p.reach.title }), el('p', { text: p.reach.text }), el('dl', { 'class': 'facts' }, reachRows())]),
      sec([el('h2', { text: p.soon.title }), el('p', { text: p.soon.text })]),
      sec([el('h2', { text: p.help_title }), rows(p.help)])];
  };
  R.contact = function () {
    var p = T.pages.contact, S_ = T.site.social, em = T.site.email;
    var dl = [el('dt', { text: X.email }), el('dd', {}, [el('a', { href: 'mailto:' + em, dir: 'ltr', text: em }), (function () {
      var b = el('button', { 'class': 'copy', type: 'button', text: U.copy_email });
      b.onclick = function () { var done = function () { b.textContent = X.copied; setTimeout(function () { b.textContent = U.copy_email; }, 1800); };
        try { navigator.clipboard.writeText(em).then(done, function () {}); } catch (e) {} };
      return b; })()])];
    var soc = [['Instagram', S_.instagram, T.site.handle], ['TikTok', S_.tiktok, T.site.handle], ['Facebook', S_.facebook, T.site.name]]
      .filter(function (s) { return s[1]; })
      .map(function (s) { return [el('dt', { text: s[0] }), el('dd', {}, [el('a', { href: s[1], rel: 'noopener', dir: 'ltr', text: s[2] })])]; });
    dl = dl.concat(waRow()); var flat = []; soc.forEach(function (x) { flat = flat.concat(x); });
    return [hero(null, p.title, p.intro),
      sec([el('div', { 'class': 'two' }, [
        el('div', {}, [el('h2', { text: X.email }), el('dl', { 'class': 'facts' }, dl), el('h2', { style: 'margin-top:var(--s5)', text: X.social }), el('dl', { 'class': 'facts' }, flat)]),
        el('div', { 'class': 'notice' }, [el('h3', { text: p.expect_title }), el('ul', { 'class': 'plain' }, p.expect.map(function (e) { return el('li', { text: e }); })), el('p', { text: p.what_to_send })])])], 1),
      sec([el('h2', { text: p.response.title }), el('p', { text: p.response.text })])];
  };
  R.faq = function () {
    var p = T.pages.faq;
    return [hero(null, p.title, null), sec([el('ol', { 'class': 'rows' }, p.items.map(function (i) {
      return el('li', {}, [el('div', {}, [el('h2', { 'class': 'q', text: i.q }), el('p', { text: i.a })])]); }))], 1)];
  };
  R['404'] = function () {
    return [el('section', { 'class': 'nf' }, [el('div', { 'class': 'wrap' }, [el('h1', { text: X.nf_title }), el('p', { 'class': 'lead', text: X.nf_text }), el('a', { 'class': 'btn', href: href('index.html'), text: T.nav.home })])])];
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
    root.appendChild(el('a', { 'class': 'skip', href: '#main', text: X.skip }));
    root.appendChild(header());
    var main = el('main', { id: 'main', tabindex: '-1' }, R[page]());
    root.appendChild(main); root.appendChild(footer());
    document.getElementById('langBtn').onclick = function () { setLang(L === 'ar' ? 'en' : 'ar'); };
    document.getElementById('themeBtn').onclick = function () {
      var n = isDark() ? 'light' : 'dark'; d.dataset.theme = n; S('mtheme', n); this.setAttribute('aria-pressed', n === 'dark' ? 'true' : 'false'); };
  }
  function setLang(l) {
    L = l; S('mlang', l);
    try { var u = new URL(location.href); u.searchParams.set('lang', l); history.replaceState(null, '', u); } catch (e) {}
    render();
    var b = document.getElementById('langBtn'); if (b) b.focus();
  }

  function load() {
    var inline = JSON.parse(document.getElementById('content-inline').textContent);
    return Promise.all(['ar', 'en'].map(function (l) {
      return fetch('assets/content/content.' + l + '.json').then(function (r) { if (!r.ok) throw 0; return r.json(); }).catch(function () { return inline[l]; });
    })).then(function (a) { C.ar = a[0]; C.en = a[1]; });
  }
  var th = S('mtheme'); if (th) d.dataset.theme = th;
  document.addEventListener('DOMContentLoaded', function () {
    root = document.getElementById('app');
    var q = location.search.match(/[?&]lang=(ar|en)/), tq = location.search.match(/[?&]theme=(light|dark)/);
    if (tq) d.dataset.theme = tq[1];
    L = q ? q[1] : (S('mlang') || 'ar');
    load().then(render);
  });
})();
