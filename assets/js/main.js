/* =====================================================================
   main.js — موتورِ رندرِ سایتِ نما نگاره دیبا (بدونِ وابستگی و بدونِ بیلد)
   محتوا از assets/js/data/*.js خوانده می‌شود؛ معمولاً این فایل نیاز به ویرایش ندارد.
   ===================================================================== */
(function () {
  "use strict";

  /* ---------------- داده و ابزارهای پایه ---------------- */
  const S = window.SITE || {};
  const WORKS = window.WORKS || [];
  const WORK_TYPES = window.WORK_TYPES || [];
  const POSTS = (window.POSTS || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const MEDIA = window.MEDIA || [];
  const MEDIA_TYPES = window.MEDIA_TYPES || [];
  const BRAND = (S.brand && S.brand.name) || "نما نگاره دیبا";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const LANG = document.documentElement.lang || "fa";
  const RTL = document.documentElement.dir !== "ltr";
  const PREV = RTL ? "right" : "left", NEXT = RTL ? "left" : "right"; // آیکنِ فلش‌ها
  const NEXT_KEY = RTL ? "ArrowLeft" : "ArrowRight", PREV_KEY = RTL ? "ArrowRight" : "ArrowLeft";
  const fa = (s) => (LANG === "fa" ? String(s == null ? "" : s).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]) : String(s == null ? "" : s)); // i18n-keep
  const q = (s) => (RTL ? `«${s}»` : s); // نامِ اثر در گیومه
  const tx = (s) => fa(esc(s)); // متنِ امن با اعدادِ فارسی
  const page = document.body.dataset.page || "";
  const params = new URLSearchParams(location.search);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const typeTitle = (slug) => (WORK_TYPES.find((t) => t.slug === slug) || {}).title || "";
  const mediaTitle = (slug) => (MEDIA_TYPES.find((t) => t.slug === slug) || {}).title || "";
  const KIND = { news: "خبر", event: "رویداد", program: "برنامهٔ فرهنگی" };

  /* ---------------- آیکن‌ها (SVGِ درون‌خطی) ---------------- */
  const P = {
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    left: '<path d="M15 5l-7 7 7 7"/>',
    right: '<path d="M9 5l7 7-7 7"/>',
    up: '<path d="M5 15l7-7 7 7"/>',
    play: '<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>',
    link: '<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/>',
    film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 8h4M3 12h4M3 16h4M17 8h4M17 12h4M17 16h4"/>',
    tv: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 21h8M9 2l3 4 3-4"/>',
    camera: '<rect x="2" y="7" width="14" height="10" rx="2"/><path d="M16 11l6-3v8l-6-3"/>',
    smile: '<circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r=".9" fill="currentColor"/><circle cx="15" cy="10" r=".9" fill="currentColor"/><path d="M8.5 14.5a4 4 0 0 0 7 0"/>',
    music: '<path d="M9 18V6l11-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
    spark: '<path d="M12 3l2.2 6.8H21l-5.5 4 2.1 6.7L12 16.4l-5.6 4.1 2.1-6.7L3 9.8h6.8z"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14a5 5 0 0 1 5.5 5"/>',
    copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".9" fill="currentColor"/>',
    telegram: '<path d="M21 4L3 11l6 2 2 6 3-4 5 4z"/><path d="M9 13l12-9"/>',
    eitaa: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8"/>',
    aparat: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="7.5" r="1.6"/><circle cx="12" cy="16.5" r="1.6"/><circle cx="7.5" cy="12" r="1.6"/><circle cx="16.5" cy="12" r="1.6"/>',
    youtube: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3z" fill="currentColor"/>',
    whatsapp: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9.5 9c0 3 2.5 5.5 5.5 5.5"/>',
    x: '<path d="M4 4l16 16M20 4L4 20"/>',
  };
  const icon = (n, cls = "") =>
    `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${P[n] || ""}</svg>`;

  const BRAND_MARK =
    '<svg class="brand-mark" viewBox="0 0 48 48" aria-hidden="true" focusable="false">' +
    '<rect x="3" y="3" width="42" height="42" rx="11" fill="none" stroke="#c23b4e" stroke-width="2.5"/>' +
    '<path d="M13 23a11 11 0 0 0 22 0" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/>' +
    '<circle cx="24" cy="14.5" r="2.6" fill="#2a9d8f"/></svg>';

  const ORNAMENT =
    '<svg class="ornament" viewBox="0 0 340 14" aria-hidden="true" focusable="false">' +
    '<path d="M0 7H140M200 7H340" stroke="currentColor" stroke-opacity=".35" stroke-width="1"/>' +
    '<rect x="148" y="2" width="44" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.4"/>' +
    '<rect x="153" y="5" width="4" height="4" rx="1" fill="currentColor"/><rect x="161" y="5" width="4" height="4" rx="1" fill="#2a9d8f"/>' +
    '<rect x="169" y="5" width="4" height="4" rx="1" fill="currentColor"/><rect x="177" y="5" width="4" height="4" rx="1" fill="#2a9d8f"/>' +
    '<rect x="185" y="5" width="2" height="4" rx="1" fill="currentColor"/></svg>';

  /* ---------------- تصویرِ موقت (SVGِ تولیدی؛ هیچ فایلی بیرونی نیست) ---------------- */
  function hash(s) {
    let h = 2166136261;
    for (const c of String(s)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function phSrc(colors, w, h, seed) {
    const [a, b] = colors && colors.length === 2 ? colors : ["#2a2d36", "#6b6e78"];
    const r = hash(seed || a + b);
    const id = "g" + (r % 99991);
    const m = r % 4, mn = Math.min(w, h);
    let shapes = "";
    if (m === 0) {
      shapes = `<circle cx="${w * 0.7}" cy="${h * 0.36}" r="${mn * 0.28}" fill="#fff" fill-opacity=".13"/><circle cx="${w * 0.7}" cy="${h * 0.36}" r="${mn * 0.17}" fill="#fff" fill-opacity=".12"/><path d="M0 ${h * 0.8} Q${w * 0.5} ${h * 0.62} ${w} ${h * 0.82} V${h} H0Z" fill="#000" fill-opacity=".28"/>`;
    } else if (m === 1) {
      shapes = `<path d="M0 ${h * 0.76} L${w * 0.24} ${h * 0.5} L${w * 0.42} ${h * 0.66} L${w * 0.63} ${h * 0.4} L${w} ${h * 0.72} V${h} H0Z" fill="#000" fill-opacity=".22"/><path d="M0 ${h * 0.88} L${w * 0.32} ${h * 0.68} L${w * 0.56} ${h * 0.82} L${w * 0.8} ${h * 0.64} L${w} ${h * 0.8} V${h} H0Z" fill="#000" fill-opacity=".26"/>`;
    } else if (m === 2) {
      for (let k = 1; k <= 4; k++) {
        const p = mn * 0.08 * k;
        shapes += `<rect x="${p}" y="${p}" width="${w - 2 * p}" height="${h - 2 * p}" rx="${mn * 0.03}" fill="none" stroke="#fff" stroke-opacity="${0.16 - k * 0.025}" stroke-width="${mn * 0.012}"/>`;
      }
    } else {
      for (let k = -h; k < w; k += mn * 0.16) {
        shapes += `<path d="M${k} ${h} L${k + h} 0" stroke="#fff" stroke-opacity=".07" stroke-width="${mn * 0.05}"/>`;
      }
    }
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">` +
      `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>` +
      `<radialGradient id="${id}v" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient></defs>` +
      `<rect width="100%" height="100%" fill="url(#${id})"/>${shapes}<rect width="100%" height="100%" fill="url(#${id}v)"/></svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  /* تصویرِ یک آیتم: فایلِ واقعی اگر داده شده، وگرنه تصویرِ موقت با برچسبِ «نمونه» */
  function thumb(o) {
    const { src, colors, seed, alt = "", w = 800, h = 500, title = "", eager = false, cls = "" } = o;
    const real = !!src;
    const url = real ? src : phSrc(colors, w, h, seed);
    return `<div class="thumb ${real ? "" : "is-sample"} ${cls}"><img src="${esc(url)}" alt="${esc(alt)}" width="${w}" height="${h}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">${!real && title ? `<span class="ph-title" aria-hidden="true">${tx(title)}</span>` : ""}</div>`;
  }
  const posterOf = (w, extra = {}) => thumb({ src: w.poster, colors: w.colors, seed: w.id + "p", alt: "پوسترِ " + w.title, w: 400, h: 600, title: w.title, ...extra });
  const postImg = (p, extra = {}) => thumb({ src: p.image, colors: p.colors, seed: p.id, alt: p.title, w: 800, h: 500, ...extra });

  /* ---------------- تاریخِ شمسی ---------------- */
  function j2g(jy, jm, jd) {
    jy += 1595;
    let days = -355668 + 365 * jy + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4) + jd + (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
    let gy = 400 * Math.floor(days / 146097);
    days %= 146097;
    if (days > 36524) { gy += 100 * Math.floor(--days / 36524); days %= 36524; if (days >= 365) days++; }
    gy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) { gy += Math.floor((days - 1) / 365); days = (days - 1) % 365; }
    let gd = days + 1;
    const leap = (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0;
    const ml = [0, 31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let gm = 0;
    for (gm = 0; gm < 13 && gd > ml[gm]; gm++) gd -= ml[gm]; // حداکثر ۱۳ دور
    return [gy, gm, gd];
  }
  const WD = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"]; // i18n-keep
  const MN = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"]; // i18n-keep
  function fdate(s, withDay = true) {
    const [y, m, d] = String(s || "").split("/").map(Number);
    if (!y || !m || !d || m > 12 || d > 31) return tx(s); // تاریخِ نامعتبر همان‌طور که هست نشان داده می‌شود
    const [gy, gm, gd] = j2g(y, m, d);
    const wd = new Date(gy, gm - 1, gd).getDay();
    if (LANG !== "fa") return new Intl.DateTimeFormat("en-GB", { ...(withDay ? { weekday: "short" } : {}), day: "numeric", month: "short", year: "numeric" }).format(new Date(gy, gm - 1, gd));
    return fa(`${withDay ? WD[wd] + " " : ""}${d} ${MN[m - 1]} ${y}`);
  }

  /* ---------------- جستجو: یکسان‌سازیِ متنِ فارسی ---------------- */
  const norm = (s) =>
    String(s || "")
      .replace(/[يى]/g, "ی").replace(/ك/g, "ک").replace(/[ۀة]/g, "ه").replace(/[أإآ]/g, "ا") // i18n-keep
      .replace(/[ً-ٰٟ]/g, "") // i18n-keep
      .replace(/[‌‍]/g, " ")
      .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)) // i18n-keep
      .replace(/\s+/g, " ").toLowerCase().trim();
  const hay = (o, keys) => norm(keys.map((k) => (Array.isArray(o[k]) ? o[k].map((x) => (typeof x === "object" ? Object.values(x).join(" ") : x)).join(" ") : o[k])).join(" "));
  const matches = (o, keys, q) => !q || norm(q).split(" ").every((word) => hay(o, keys).includes(word));

  /* ---------------- هدر، منو، کشوی موبایل ---------------- */
  const ACTIVE = { home: "home", works: "works", work: "works", media: "media", news: "news", programs: "programs", about: "about", contact: "contact" };
  function activeNav() {
    if (page === "post") {
      const p = POSTS.find((x) => x.id === params.get("id"));
      return p && p.kind === "program" ? "programs" : "news";
    }
    return ACTIVE[page] || "";
  }
  const brandHtml = () =>
    S.brand && S.brand.logo
      ? `<a class="brand" href="index.html"><img src="${esc(S.brand.logo)}" alt="${esc(BRAND)}"></a>`
      : `<a class="brand" href="index.html" aria-label="${esc(BRAND)} — صفحهٔ اصلی">${BRAND_MARK}<span class="brand-text"><b>${esc(BRAND)}</b><small>${esc(S.brand?.nameEn || "")}</small></span></a>`;
  const socialHtml = () => {
    const items = (S.social || []).filter((s) => s.href);
    return items.length
      ? `<ul class="social">${items.map((s) => `<li><a href="${esc(s.href)}" target="_blank" rel="noopener" aria-label="${esc(s.name)}" title="${esc(s.name)}">${icon(s.icon)}</a></li>`).join("")}</ul>`
      : "";
  };
  function navLinks(isHome, cur) {
    return (S.nav || [])
      .map((n) => {
        const href = isHome && n.anchor ? n.anchor : n.href;
        const ac = !isHome && n.id === cur ? ' aria-current="page"' : "";
        return `<li><a href="${esc(href)}" data-nav="${esc(n.id)}"${ac}>${esc(n.label)}</a></li>`;
      })
      .join("");
  }

  /* پیوندِ همان صفحه در نسخهٔ زبانِ دیگر (SITE.altLang.base خالی = پنهان) */
  function langLink(cls) {
    const L = S.altLang;
    if (!L || !L.base) return "";
    const file = location.pathname.split("/").pop() || "index.html";
    const href = L.base.replace(/\/?$/, "/") + file + location.search + location.hash;
    return `<a class="${cls}" href="${esc(href)}" hreflang="${esc(L.lang || "")}" lang="${esc(L.lang || "")}" title="${esc(L.title || "")}">${esc(L.label)}</a>`;
  }

  function renderHeader() {
    const el = $("#site-header");
    if (!el) return;
    const isHome = page === "home";
    const cur = activeNav();
    el.innerHTML = `
      <div class="wrap header-inner">
        ${brandHtml()}
        <nav class="main-nav" aria-label="منوی اصلی"><ul>${navLinks(isHome, cur)}</ul></nav>
        <div class="header-tools">
          ${S.cta ? `<a class="btn btn--light header-cta" href="${esc(S.cta.href)}">${esc(S.cta.label)}</a>` : ""}
          ${socialHtml()}
          <a class="hdr-icon" href="search.html" aria-label="جستجو" title="جستجو">${icon("search")}</a>
          ${langLink("lang-switch")}
        </div>
        <button class="burger" type="button" aria-label="باز کردنِ منو" aria-expanded="false" aria-controls="drawer">${icon("menu")}</button>
      </div>`;

    // کشوی موبایل
    const backdrop = document.createElement("div");
    backdrop.className = "drawer-backdrop";
    backdrop.hidden = true;
    const drawer = document.createElement("div");
    drawer.className = "drawer";
    drawer.id = "drawer";
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.setAttribute("aria-label", "منو");
    drawer.inert = true; // بسته: غیرقابلِ فوکوس و پنهان از صفحه‌خوان
    drawer.innerHTML = `
      <div class="drawer-head">${brandHtml()}<button class="drawer-close" type="button" aria-label="بستنِ منو">${icon("close")}</button></div>
      <nav aria-label="منوی موبایل"><ul>${navLinks(isHome, cur)}</ul></nav>
      ${S.cta ? `<a class="btn btn--accent" href="${esc(S.cta.href)}">${esc(S.cta.label)}</a>` : ""}
      ${langLink("btn btn--light drawer-lang")}
      ${socialHtml()}`;
    document.body.append(backdrop, drawer);

    const burger = $(".burger", el);
    let lastFocus = null;
    const isOpen = () => drawer.classList.contains("is-open");
    const onKey = (e) => {
      if (e.key === "Escape") close();
      else trapFocus(drawer, e);
    };
    const open = () => {
      lastFocus = document.activeElement;
      backdrop.hidden = false;
      void backdrop.offsetWidth; // تا ترنزیشن اجرا شود
      backdrop.classList.add("is-open");
      drawer.inert = false;
      drawer.classList.add("is-open");
      burger.setAttribute("aria-expanded", "true");
      document.body.classList.add("no-scroll");
      document.addEventListener("keydown", onKey);
      $(".drawer-close", drawer).focus();
    };
    const close = () => {
      if (!isOpen()) return;
      document.removeEventListener("keydown", onKey);
      backdrop.classList.remove("is-open");
      drawer.classList.remove("is-open");
      drawer.inert = true;
      burger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
      setTimeout(() => { backdrop.hidden = true; }, 300);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    burger.addEventListener("click", open);
    backdrop.addEventListener("click", close);
    $(".drawer-close", drawer).addEventListener("click", close);
    drawer.addEventListener("click", (e) => { if (e.target.closest("a")) close(); });
    window.addEventListener("resize", () => { if (isOpen() && window.innerWidth > 991) close(); });

    // حالتِ اسکرول
    const overHero = !!document.querySelector(".hero, .work-hero");
    el.classList.toggle("is-over-hero", overHero);
    const onScroll = () => {
      el.classList.toggle("is-scrolled", window.scrollY > 30);
      const tt = $(".to-top");
      if (tt) tt.classList.toggle("is-visible", window.scrollY > 700);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function trapFocus(container, e) {
    if (e.key !== "Tab") return;
    const f = $$('a[href], button:not([disabled]), input, select, textarea, iframe, [tabindex]:not([tabindex="-1"])', container).filter((x) => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* اسکرول‌اسپای در صفحهٔ اصلی: گزینهٔ منوی بخشِ قابلِ مشاهده فعال می‌شود */
  function scrollSpy() {
    const ids = (S.nav || []).filter((n) => n.anchor).map((n) => [n.id, n.anchor.slice(1)]);
    const targets = ids.map(([nid, aid]) => [nid, document.getElementById(aid)]).filter(([, t]) => t);
    if (!targets.length || !("IntersectionObserver" in window)) return;
    const set = (nid) => $$("[data-nav]").forEach((a) => (a.dataset.nav === nid ? a.setAttribute("aria-current", "location") : a.removeAttribute("aria-current")));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) set(targets.find(([, t]) => t === en.target)[0]); }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    targets.forEach(([, t]) => io.observe(t));
  }

  /* ---------------- فوتر ---------------- */
  const MAP_SVG =
    '<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
    '<rect width="400" height="240" fill="#e9e6df"/>' +
    '<g fill="#dcd8cf"><rect x="20" y="20" width="90" height="60" rx="4"/><rect x="130" y="20" width="110" height="60" rx="4"/><rect x="260" y="20" width="120" height="60" rx="4"/>' +
    '<rect x="20" y="100" width="90" height="120" rx="4"/><rect x="130" y="100" width="50" height="50" rx="4"/><rect x="190" y="100" width="50" height="50" rx="4"/>' +
    '<rect x="130" y="165" width="110" height="55" rx="4"/><rect x="260" y="100" width="120" height="120" rx="4"/></g>' +
    '<path d="M0 90H400M120 0V240M250 0V240M0 158H250" stroke="#fff" stroke-width="9"/>' +
    '<path d="M60 240L330 0" stroke="#f3d9a4" stroke-width="7" opacity=".8"/>' +
    '<path d="M200 66c-11 0-19 8-19 19 0 14 19 33 19 33s19-19 19-33c0-11-8-19-19-19z" fill="#c23b4e"/><circle cx="200" cy="85" r="7" fill="#fff"/></svg>';

  function contactList() {
    const c = S.contact || {};
    return `<ul class="f-contact">
      ${c.address ? `<li>${icon("pin")}<span>${tx(c.address)}</span></li>` : ""}
      ${(c.phones || []).map((p) => `<li>${icon("phone")}<a class="ltr" href="tel:${esc(p.replace(/[^\d+]/g, ""))}">${tx(p)}</a></li>`).join("")}
      ${c.email ? `<li>${icon("mail")}<a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>` : ""}
      ${(S.family || []).filter((f) => f.href).map((f) => `<li>${icon("link")}<span>از خانوادهٔ دیبا: <a href="${esc(f.href)}">${esc(f.name)}</a>${f.note ? ` — ${esc(f.note)}` : ""}</span></li>`).join("")}
    </ul>`;
  }
  function mapBox() {
    const link = S.contact && S.contact.mapLink;
    return `<div class="map-ph" role="img" aria-label="نقشهٔ موقعیت (جای‌نگهدار)">${MAP_SVG}
      <div class="map-note"><span>نقشهٔ نمونه — موقعیتِ دقیق به‌زودی</span>${link ? `<a href="${esc(link)}" target="_blank" rel="noopener">مسیریابی</a>` : ""}</div></div>`;
  }
  function messageForm(idp, compact) {
    return `<form class="form" novalidate data-msg-form>
      <label class="sr-only" for="${idp}-name">نام</label><input id="${idp}-name" name="name" required autocomplete="name" placeholder="نام">
      <label class="sr-only" for="${idp}-email">پست الکترونیک</label><input id="${idp}-email" name="email" type="email" required autocomplete="email" placeholder="پست الکترونیک" dir="auto">
      ${compact ? "" : `<label class="sr-only" for="${idp}-phone">تلفن</label><input id="${idp}-phone" name="phone" type="tel" autocomplete="tel" placeholder="تلفن (اختیاری)" dir="auto">`}
      <label class="sr-only" for="${idp}-subject">عنوان</label><input id="${idp}-subject" name="subject" required placeholder="عنوان">
      <label class="sr-only" for="${idp}-text">متن پیام</label><textarea id="${idp}-text" name="text" required placeholder="متن پیام"></textarea>
      <button class="btn btn--accent" type="submit">ارسال پیام</button>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>`;
  }

  function renderFooter() {
    const el = $("#contact.site-footer") || $(".site-footer");
    if (!el) return;
    const isContact = page === "contact";
    const quick = (S.nav || []).map((n) => `<a href="${esc(n.href)}">${esc(n.label)}</a>`).join("");
    el.innerHTML = `
      <div class="wrap footer-grid">
        <div>
          <h2>${esc(BRAND)}</h2>
          <form class="f-search" action="search.html" method="get" role="search">
            <label class="sr-only" for="f-q">جستجو در سایت</label>
            <input id="f-q" name="q" type="search" placeholder="جستجو در سایت…">
            <button type="submit" aria-label="جستجو">${icon("search")}</button>
          </form>
          ${contactList()}
        </div>
        <div><h2>موقعیت ما</h2>${mapBox()}</div>
        <div>${isContact ? `<h2>دسترسیِ سریع</h2><nav class="footer-links" aria-label="دسترسیِ سریع" style="display:grid;gap:.4rem">${quick}</nav>` : `<h2>ارسال پیام</h2>${messageForm("ff", true)}`}</div>
      </div>
      <div class="wrap footer-bottom"><span>${tx(S.copyright || "")}</span>${socialHtml()}</div>`;
    const tt = document.createElement("button");
    tt.className = "to-top";
    tt.type = "button";
    tt.setAttribute("aria-label", "بازگشت به بالا");
    tt.innerHTML = icon("up");
    tt.addEventListener("click", () => { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); $("#main")?.focus({ preventScroll: true }); });
    document.body.append(tt);
  }

  /* فرمِ پیام: اگر سرویسِ دریافت تعریف نشده باشد، صادقانه می‌گوید که ارسال نشد */
  function bindForms() {
    $$("form[data-msg-form]").forEach((form) => {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const status = $(".form-status", form);
        let ok = true;
        $$("[required]", form).forEach((f) => {
          const bad = !f.value.trim() || (f.type === "email" && !f.checkValidity());
          f.setAttribute("aria-invalid", bad ? "true" : "false");
          if (bad && ok) { ok = false; f.focus(); }
        });
        if (!ok) { status.className = "form-status is-err"; status.textContent = "لطفاً همهٔ فیلدهای لازم را درست پر کنید."; return; }
        const data = Object.fromEntries(new FormData(form).entries());
        const c = S.contact || {};
        if (!c.formEndpoint) {
          const body = `${data.text}\n\n— ${data.name} (${data.email}${data.phone ? "، " + data.phone : ""})`;
          const mailto = c.email ? `mailto:${c.email}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}` : "";
          status.className = "form-status is-warn";
          status.innerHTML = `این فرم هنوز به سرورِ دریافتِ پیام وصل نشده است و <b>پیامِ شما ارسال نشد</b>.${mailto ? ` می‌توانید آن را <a href="${esc(mailto)}">با ایمیل بفرستید</a>.` : ""}`;
          return;
        }
        const btn = $("button[type=submit]", form);
        btn.disabled = true;
        status.className = "form-status";
        status.textContent = "در حال ارسال…";
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 15000); // سقفِ ۱۵ ثانیه
        try {
          const res = await fetch(c.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), signal: ctrl.signal });
          if (!res.ok) throw new Error("HTTP " + res.status);
          status.className = "form-status is-ok";
          status.textContent = "پیامِ شما دریافت شد. سپاسگزاریم.";
          form.reset();
        } catch (err) {
          status.className = "form-status is-err";
          status.textContent = "ارسالِ پیام ناموفق بود (" + (err.name === "AbortError" ? "پایانِ مهلت" : err.message) + "). لطفاً دوباره تلاش کنید یا با ایمیل تماس بگیرید.";
        } finally {
          clearTimeout(timer);
          btn.disabled = false;
        }
      });
    });
  }

  /* ---------------- اجزای مشترک ---------------- */
  const secTitle = (title, sub = "", id = "") =>
    `<div class="sec-title"><h2${id ? ` id="${id}"` : ""}>${esc(title)}</h2>${ORNAMENT}${sub ? `<p>${esc(sub)}</p>` : ""}</div>`;
  const postHref = (p) => `post.html?id=${encodeURIComponent(p.id)}`;
  const workHref = (w) => `work.html?id=${encodeURIComponent(w.id)}`;
  const byline = (w) => (w.director ? "به کارگردانیِ " + w.director : "");

  function ncard(p) {
    return `<article class="ncard">
      ${postImg(p)}
      <div class="ncard-body"><h3><a href="${postHref(p)}">${tx(p.title)}</a></h3><p>${tx(p.lead)}</p></div>
      <div class="ncard-foot"><span>${fdate(p.date)}</span><span class="kind-tag kind-tag--${esc(p.kind)}">${KIND[p.kind] || ""}</span></div>
    </article>`;
  }
  function pcard(w) {
    return `<a class="pcard" href="${workHref(w)}">
      ${posterOf(w)}
      <span class="pcard-type">${esc(typeTitle(w.type))}</span>
      <div class="pcard-cap"><h3>${q(tx(w.title))}</h3><p>${tx(byline(w))}</p></div>
    </a>`;
  }
  function hcard(p) {
    return `<article class="hcard">
      ${postImg(p)}
      <div class="hcard-body">
        <h2><a href="${postHref(p)}">${tx(p.title)}</a></h2>
        <div class="meta"><span>${fdate(p.date)}</span><span class="kind-tag kind-tag--${esc(p.kind)}">${KIND[p.kind] || ""}</span>${p.place ? `<span>${icon("pin")} ${tx(p.place)}</span>` : ""}</div>
        <p>${tx(p.lead)}</p>
        <a class="btn btn--outline" href="${postHref(p)}" tabindex="-1" aria-hidden="true">بیشتر بخوانید</a>
      </div>
    </article>`;
  }
  const ratioOf = (r) => { const [a, b] = String(r || "16:9").split(":").map(Number); return a && b ? [a, b] : [16, 9]; };
  const mediaImg = (m, extra = {}) => { const [a, b] = ratioOf(m.ratio); return thumb({ src: m.image, colors: m.colors, seed: m.id, alt: m.title, w: Math.round(a * 60), h: Math.round(b * 60), ...extra }); };
  const lbItemFromMedia = (m) => { const [a, b] = ratioOf(m.ratio); return { src: m.image || phSrc(m.colors, a * 90, b * 90, m.id), sample: !m.image, title: m.title, sub: [mediaTitle(m.kind), fa(m.year), m.desc].filter(Boolean).join(" — "), embed: m.embed }; };

  function mini(href, imgHtml, title, sub) {
    return `<div class="mini">${imgHtml}<div><b><a href="${href}">${tx(title)}</a></b><small>${sub}</small></div></div>`;
  }
  function widget(title, items, emptyText) {
    return `<section class="widget"><h2>${esc(title)}</h2>${items.length ? items.join("") : `<p class="widget-empty">${esc(emptyText || "مطلبی وجود ندارد.")}</p>`}</section>`;
  }
  const latestWorks = (n) => WORKS.slice().sort((a, b) => String(b.year).localeCompare(String(a.year))).slice(0, n);
  const wMini = (w) => mini(workHref(w), thumb({ src: w.poster, colors: w.colors, seed: w.id + "p", alt: "", w: 120, h: 120 }), w.title, `${esc(typeTitle(w.type))} · ${fa(w.year)}`);
  const pMini = (p) => mini(postHref(p), thumb({ src: p.image, colors: p.colors, seed: p.id, alt: "", w: 120, h: 120 }), p.title, fdate(p.date, false));

  function pager(total, per, cur) {
    const pages = Math.ceil(total / per);
    if (pages <= 1) return "";
    let html = '<nav aria-label="صفحه‌بندی"><ul class="pagination">';
    for (let i = 1; i <= pages; i++) {
      html += i === cur ? `<li><span aria-current="page">${fa(i)}</span></li>` : `<li><a href="#" data-page="${i}" aria-label="صفحهٔ ${fa(i)}">${fa(i)}</a></li>`;
    }
    return html + "</ul></nav>";
  }

  /* وضعیتِ فهرست‌ها در آدرس نگه داشته می‌شود تا قابلِ اشتراک و بازگشت باشد */
  function urlState(defaults) {
    const st = { ...defaults };
    Object.keys(defaults).forEach((k) => { const v = params.get(k); if (v) st[k] = k === "page" ? Math.max(1, parseInt(v, 10) || 1) : v; });
    return st;
  }
  function pushState(st, defaults) {
    const p = new URLSearchParams();
    Object.keys(st).forEach((k) => { if (st[k] && String(st[k]) !== String(defaults[k])) p.set(k, st[k]); });
    const qs = p.toString();
    history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
  }
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  // heading = متنِ درشتِ سربرگ؛ اگر داده شود، عنوانِ صفحه h1 نمی‌شود (چون h1 در بدنهٔ مطلب است)
  function pageHead(title, sub, crumbs, heading) {
    const bc = [["صفحهٔ اصلی", "index.html"], ...(crumbs || [])];
    return `<section class="page-head"><div class="wrap">
      <nav class="breadcrumb" aria-label="مسیرِ صفحه"><ol>${bc.map(([t, h]) => `<li><a href="${h}">${tx(t)}</a></li>`).join("")}<li><span aria-current="page">${tx(title)}</span></li></ol></nav>
      ${heading ? `<p class="page-head-title">${tx(heading)}</p>` : `<h1>${tx(title)}</h1>`}${sub ? `<p>${tx(sub)}</p>` : ""}
    </div></section>`;
  }
  function notFound(what, backHref, backLabel) {
    document.title = `پیدا نشد — ${BRAND}`;
    return `<div class="wrap notfound"><b>${fa(404)}</b><h1>${esc(what)} پیدا نشد</h1><p>ممکن است نشانی اشتباه باشد یا این مطلب حذف شده باشد.</p>
      <p><a class="btn btn--accent" href="${backHref}">${esc(backLabel)}</a> <a class="btn btn--outline" href="index.html">صفحهٔ اصلی</a></p></div>`;
  }

  /* ---------------- اسلایدرها ---------------- */
  function initHero(root) {
    const slides = $$(".hero-slide", root);
    const dots = $$(".hero-dots button", root);
    if (slides.length < 2) return;
    let i = 0, timer = null;
    const go = (n) => {
      slides[i].classList.remove("is-active"); slides[i].inert = true; dots[i].setAttribute("aria-current", "false");
      i = (n + slides.length) % slides.length;
      slides[i].classList.add("is-active"); slides[i].inert = false; dots[i].setAttribute("aria-current", "true");
    };
    const stop = () => { clearInterval(timer); timer = null; };
    const play = () => { if (reduceMotion) return; stop(); timer = setInterval(() => go(i + 1), 6500); };
    $(".hero-arrow--next", root).addEventListener("click", () => { go(i + 1); play(); });
    $(".hero-arrow--prev", root).addEventListener("click", () => { go(i - 1); play(); });
    dots.forEach((d, k) => d.addEventListener("click", () => { go(k); play(); }));
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", play);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", (e) => { if (!root.contains(e.relatedTarget)) play(); });
    root.addEventListener("keydown", (e) => { if (e.key === NEXT_KEY) go(i + 1); if (e.key === PREV_KEY) go(i - 1); });
    let sx = null;
    root.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", (e) => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) { go((dx > 0) === RTL ? i + 1 : i - 1); play(); } sx = null; }, { passive: true });
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : play()));
    play();
  }

  function initCardSlider(root) {
    const track = $(".card-track", root);
    const prev = $("[data-dir=prev]", root), next = $("[data-dir=next]", root);
    const count = $(".slider-count", root);
    const cards = track.children;
    const cardStep = () => (cards.length > 1 ? Math.abs(cards[1].offsetLeft - cards[0].offsetLeft) : track.clientWidth);
    const perView = () => Math.max(1, Math.round((track.clientWidth + 1) / cardStep()));
    const step = () => cardStep() * perView();
    const dir = RTL ? -1 : 1; // در راست‌به‌چپ، «بعدی» به سمتِ چپ اسکرول می‌کند
    next.addEventListener("click", () => track.scrollBy({ left: dir * step() }));
    prev.addEventListener("click", () => track.scrollBy({ left: -dir * step() }));
    const update = () => {
      const max = track.scrollWidth - track.clientWidth, pos = Math.abs(track.scrollLeft);
      prev.disabled = pos <= 2;
      next.disabled = pos >= max - 2;
      if (count && cards.length) {
        const first = Math.min(cards.length, Math.round(pos / cardStep()) + 1), last = Math.min(cards.length, first + perView() - 1);
        count.textContent = fa(first === last ? `${first} / ${cards.length}` : `${first}–${last} / ${cards.length}`);
      }
    };
    track.addEventListener("scroll", debounce(update, 60), { passive: true });
    track.addEventListener("scrollend", update);
    [prev, next].forEach((b) => b.addEventListener("click", () => setTimeout(update, 500)));
    window.addEventListener("resize", debounce(update, 120));
    update();
  }

  /* ---------------- لایت‌باکس ---------------- */
  const LB = { el: null, items: [], i: 0, last: null };
  function lbBuild() {
    const el = document.createElement("div");
    el.className = "lightbox";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", "نمایشگرِ تصویر");
    el.innerHTML = `
      <div class="lb-bar"><span class="lb-count" aria-live="polite"></span><button class="lb-btn lb-close" type="button" aria-label="بستن">${icon("close")}</button></div>
      <div class="lb-stage"><div class="lb-media"></div></div>
      <div class="lb-cap"></div>
      <div class="lb-nav"><button class="lb-btn lb-prev" type="button" aria-label="قبلی">${icon(PREV)}</button>
        <button class="lb-btn lb-next" type="button" aria-label="بعدی">${icon(NEXT)}</button></div>`;
    document.body.append(el);
    $(".lb-close", el).addEventListener("click", lbClose);
    $(".lb-prev", el).addEventListener("click", () => lbShow(LB.i - 1));
    $(".lb-next", el).addEventListener("click", () => lbShow(LB.i + 1));
    el.addEventListener("click", (e) => { if (e.target === el || e.target.classList.contains("lb-stage")) lbClose(); });
    el.addEventListener("keydown", (e) => {
      if (e.key === "Escape") lbClose();
      else if (e.key === NEXT_KEY) lbShow(LB.i + 1);
      else if (e.key === PREV_KEY) lbShow(LB.i - 1);
      else trapFocus(el, e);
    });
    let sx = null;
    el.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
    el.addEventListener("touchend", (e) => {
      if (sx == null || LB.items.length < 2) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) lbShow((dx > 0) === RTL ? LB.i + 1 : LB.i - 1);
      sx = null;
    }, { passive: true });
    LB.el = el;
  }
  function lbShow(n) {
    const len = LB.items.length;
    LB.i = (n + len) % len;
    const it = LB.items[LB.i];
    const media = $(".lb-media", LB.el);
    if (it.embed) media.innerHTML = `<div class="lb-video"><iframe src="${esc(it.embed)}" title="${esc(it.title)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`;
    else if (it.sample) media.innerHTML = `<div class="lb-sample is-sample"><img src="${esc(it.src)}" alt="${esc(it.title)}"></div>`;
    else media.innerHTML = `<img src="${esc(it.src)}" alt="${esc(it.title)}">`;
    $(".lb-cap", LB.el).innerHTML = `<b>${tx(it.title)}</b>${it.sub ? `<small>${tx(it.sub)}</small>` : ""}`;
    $(".lb-count", LB.el).textContent = fa(`${LB.i + 1} از ${len}`);
    const multi = len > 1;
    $(".lb-prev", LB.el).hidden = !multi;
    $(".lb-next", LB.el).hidden = !multi;
  }
  function lbOpen(items, i) {
    if (!LB.el) lbBuild();
    LB.items = items;
    LB.last = document.activeElement;
    LB.el.classList.add("is-open");
    document.body.classList.add("no-scroll");
    lbShow(i);
    $(".lb-close", LB.el).focus();
  }
  function lbClose() {
    if (!LB.el) return;
    LB.el.classList.remove("is-open");
    $(".lb-media", LB.el).innerHTML = ""; // ویدیو متوقف می‌شود
    document.body.classList.remove("no-scroll");
    if (LB.last && LB.last.focus) LB.last.focus();
  }

  /* =====================================================================
     صفحه‌ها
     ===================================================================== */
  const main = $("#main");

  /* ---------- صفحهٔ اصلی ---------- */
  function renderHome() {
    const hero = S.hero || [];
    const news = POSTS.filter((p) => p.kind !== "program").slice(0, 8);
    const media = MEDIA.slice(0, 10);
    const featured = WORKS.filter((w) => w.featured).slice(0, 4);
    const progs = POSTS.filter((p) => p.kind === "program");
    const lead = progs[0];

    main.innerHTML = `
      <h1 class="sr-only">${esc(BRAND)} — ${esc(S.brand?.tagline || "")}</h1>
      <section class="hero" id="top" aria-roledescription="carousel" aria-label="مطالبِ ویژه">
        ${hero.map((h, k) => `
          <div class="hero-slide ${k === 0 ? "is-active" : ""}" role="group" aria-roledescription="اسلاید" aria-label="${fa(k + 1)} از ${fa(hero.length)}" ${k ? "inert" : ""}>
            ${thumb({ src: h.image, colors: h.colors, seed: "hero" + k, alt: "", w: 1600, h: 900, eager: k === 0 })}
            <div class="hero-caption">${h.sub ? `<small>${tx(h.sub)}</small>` : ""}<h2>${tx(h.title)}</h2>${h.href ? `<a class="btn btn--accent" href="${esc(h.href)}">بیشتر بخوانید</a>` : ""}</div>
          </div>`).join("")}
        ${hero.length > 1 ? `
        <button class="hero-arrow hero-arrow--prev" type="button" aria-label="اسلایدِ قبلی">${icon(PREV)}</button>
        <button class="hero-arrow hero-arrow--next" type="button" aria-label="اسلایدِ بعدی">${icon(NEXT)}</button>
        <div class="hero-dots">${hero.map((_, k) => `<button type="button" aria-label="اسلایدِ ${fa(k + 1)}" aria-current="${k === 0}"></button>`).join("")}</div>` : ""}
      </section>

      <section class="section section--light" id="news" aria-labelledby="news-t">
        <div class="wrap">
          ${secTitle("اخبار و رویدادها", "", "news-t")}
          <div class="card-slider">
            <div class="card-track" tabindex="0" aria-label="فهرستِ اخبار؛ برای دیدنِ بقیه به چپ بکشید">${news.map(ncard).join("")}</div>
            <div class="slider-nav"><button type="button" data-dir="prev" aria-label="قبلی">${icon(PREV)}</button><span class="slider-count" aria-live="polite"></span><button type="button" data-dir="next" aria-label="بعدی">${icon(NEXT)}</button></div>
          </div>
          <div class="section-more"><a class="btn btn--outline" href="news.html">مطالب بیشتر</a></div>
        </div>
      </section>

      <section class="section section--dark" id="media" aria-labelledby="media-t">
        <div class="wrap">
          ${secTitle("تولیدات", "نماهنگ، تیزر، موشن‌گرافیک و پوستر", "media-t")}
          <div class="jgrid">${media.map((m, k) => { const [a, b] = ratioOf(m.ratio); return `
            <a class="jitem" href="media.html#${esc(m.id)}" data-lb="${k}" style="--r:${(a / b).toFixed(3)};--ar:${a}/${b}">
              ${mediaImg(m)}${m.kind === "musicvideo" || m.kind === "teaser" || m.kind === "motion" ? `<span class="play-badge">${icon("play")}</span>` : ""}
              <span class="jitem-cap">${tx(m.title)}<small>${esc(mediaTitle(m.kind))}</small></span>
            </a>`; }).join("")}</div>
          <div class="section-more"><a class="btn btn--light" href="media.html">مطالب بیشتر</a></div>
        </div>
      </section>

      <section class="section" id="works" aria-labelledby="works-t">
        <div class="wrap">
          ${secTitle("تولیدات شاخص", "فیلم سینمایی، سریال، مستند و انیمیشن", "works-t")}
          <div class="poster-grid">${featured.map(pcard).join("")}</div>
          <div class="section-more"><a class="btn btn--outline" href="works.html">مطالب بیشتر</a></div>
        </div>
      </section>

      <section class="section section--light" id="programs" aria-labelledby="programs-t">
        <div class="wrap">
          ${secTitle("برنامه‌های فرهنگی", "", "programs-t")}
          ${lead ? `<div class="programs">
            <div class="programs-lead" aria-live="polite">${programLead(lead)}</div>
            <div class="programs-thumbs">${progs.slice(0, 4).map((p, k) => `
              <a class="prthumb" href="${postHref(p)}" data-prog="${k}" ${k === 0 ? 'aria-current="true"' : ""}>
                ${thumb({ src: p.image, colors: p.colors, seed: p.id + "v", alt: p.title, w: 300, h: 400, title: p.title })}
                <span class="hover-icon">${icon("link")}</span>
              </a>`).join("")}</div>
          </div>` : `<p class="empty">برنامه‌ای ثبت نشده است.</p>`}
          <div class="section-more"><a class="btn btn--outline" href="programs.html">مطالب بیشتر</a></div>
        </div>
      </section>`;

    initHero($(".hero", main));
    initCardSlider($(".card-slider", main));
    $$(".jitem", main).forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); lbOpen(media.map(lbItemFromMedia), +a.dataset.lb); }));
    // با بردنِ نشانگر/فوکوس روی پوسترها، کپشنِ کنار عوض می‌شود
    $$(".prthumb", main).forEach((a) => {
      const show = () => {
        $(".programs-lead", main).innerHTML = programLead(progs[+a.dataset.prog]);
        $$(".prthumb", main).forEach((x) => x.removeAttribute("aria-current"));
        a.setAttribute("aria-current", "true");
      };
      a.addEventListener("mouseenter", show);
      a.addEventListener("focus", show);
    });
    scrollSpy();
  }
  function programLead(p) {
    return `<h3>${tx(p.title)}</h3>
      <div class="meta"><span>${icon("calendar")} ${fdate(p.date)}</span>${p.when ? `<span>${icon("clock")} ${tx(p.when)}</span>` : ""}${p.place ? `<span>${icon("pin")} ${tx(p.place)}</span>` : ""}</div>
      <p>${tx(p.lead)}</p>
      <a class="btn btn--outline" href="${postHref(p)}">نمایش ${icon("eye")}</a>`;
  }

  /* ---------- فهرستِ تولیداتِ شاخص ---------- */
  function renderWorks() {
    const D = { type: "all", q: "", year: "", page: 1 };
    const st = urlState(D);
    const PER = 12;
    const years = [...new Set(WORKS.map((w) => w.year))].sort().reverse();
    main.innerHTML = `${pageHead("تولیدات شاخص", "فیلم سینمایی، سریال، مستند، انیمیشن و فیلم کوتاه")}
      <div class="wrap" style="padding:2.25rem 0 3.5rem">
        <div class="toolbar">
          <ul class="chips" aria-label="نوعِ اثر">
            ${[{ slug: "all", title: "همه" }, ...WORK_TYPES].map((t) => {
              const n = t.slug === "all" ? WORKS.length : WORKS.filter((w) => w.type === t.slug).length;
              return `<li><button class="chip" type="button" data-type="${t.slug}" aria-pressed="false">${esc(t.title)}<span class="count">${fa(n)}</span></button></li>`;
            }).join("")}
          </ul>
          <div style="display:flex;gap:.6rem;flex-wrap:wrap;flex:1;justify-content:flex-end">
            <label class="sr-only" for="w-year">سال</label>
            <select class="select" id="w-year"><option value="">همهٔ سال‌ها</option>${years.map((y) => `<option value="${esc(y)}">${fa(y)}</option>`).join("")}</select>
            <div class="searchbox">${icon("search")}<label class="sr-only" for="w-q">جستجو در آثار</label><input id="w-q" type="search" placeholder="جستجوی نام اثر، کارگردان…"></div>
          </div>
        </div>
        <p class="result-count" aria-live="polite"></p>
        <div class="poster-grid" id="w-list"></div>
        <div id="w-pager"></div>
      </div>`;
    const qEl = $("#w-q"), yEl = $("#w-year");
    qEl.value = st.q;
    yEl.value = st.year;
    const draw = () => {
      $$(".chip", main).forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.type === st.type)));
      const list = WORKS.filter((w) => (st.type === "all" || w.type === st.type) && (!st.year || w.year === st.year) && matches(w, ["title", "director", "producer", "genre", "summary", "crew"], st.q));
      const pages = Math.max(1, Math.ceil(list.length / PER));
      if (st.page > pages) st.page = pages;
      $(".result-count", main).textContent = fa(`${list.length} اثر`);
      $("#w-list").innerHTML = list.slice((st.page - 1) * PER, st.page * PER).map(pcard).join("");
      $("#w-pager").innerHTML = list.length ? pager(list.length, PER, st.page) : `<p class="empty">اثری با این مشخصات پیدا نشد.</p>`;
      pushState(st, D);
    };
    $$(".chip", main).forEach((c) => c.addEventListener("click", () => { st.type = c.dataset.type; st.page = 1; draw(); }));
    yEl.addEventListener("change", () => { st.year = yEl.value; st.page = 1; draw(); });
    qEl.addEventListener("input", debounce(() => { st.q = qEl.value.trim(); st.page = 1; draw(); }, 200));
    $("#w-pager").addEventListener("click", (e) => { const a = e.target.closest("[data-page]"); if (!a) return; e.preventDefault(); st.page = +a.dataset.page; draw(); $(".toolbar", main).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); });
    draw();
  }

  /* ---------- صفحهٔ یک اثر ---------- */
  function renderWork() {
    const w = WORKS.find((x) => x.id === params.get("id"));
    if (!w) { document.body.classList.add("inner"); main.innerHTML = notFound("اثر", "works.html", "همهٔ تولیداتِ شاخص"); return; }
    document.title = `${w.title} — ${BRAND}`;
    const people = [
      w.director && { name: w.director, role: w.type === "documentary" ? "کارگردان / مستندساز" : "کارگردان" },
      w.producer && { name: w.producer, role: "تهیه‌کننده" },
      w.writer && { name: w.writer, role: "نویسنده" },
      w.music && { name: w.music, role: "موسیقی" },
      ...(w.crew || []),
    ].filter(Boolean);
    const facts = [
      ["نوع", typeTitle(w.type)], ["ژانر", w.genre], ["سال تولید", w.year], ["مدت", w.duration], ["تعداد قسمت", w.episodes], ["وضعیت", w.status],
    ].filter(([, v]) => v);
    const stills = (w.stills && w.stills.length ? w.stills.map((src, k) => ({ src, sample: false, title: `${w.title} — قاب ${fa(k + 1)}` })) :
      Array.from({ length: 6 }, (_, k) => ({ src: phSrc(w.colors, 1280, 800, w.id + "s" + k), sample: true, title: `${w.title} — قابِ نمونهٔ ${fa(k + 1)}` })));
    const trailers = w.trailers || [];
    const related = WORKS.filter((x) => x.id !== w.id && x.type === w.type).concat(WORKS.filter((x) => x.id !== w.id && x.type !== w.type)).slice(0, 4);

    main.innerHTML = `
      <section class="work-hero" aria-label="${esc(w.title)}">
        ${thumb({ src: w.backdrop, colors: w.colors, seed: w.id + "b", alt: "", w: 1600, h: 900, eager: true })}
        <div class="work-hero-cap"><div class="work-hero-box"><h1>${q(tx(w.title))}</h1><p>${tx(byline(w))}</p></div></div>
      </section>
      <div class="wrap">
        <nav class="breadcrumb" aria-label="مسیرِ صفحه" style="color:var(--muted);padding-top:1.25rem"><ol>
          <li><a href="index.html" style="color:var(--text)">صفحهٔ اصلی</a></li><li><a href="works.html" style="color:var(--text)">تولیدات شاخص</a></li>
          <li><a href="works.html?type=${esc(w.type)}" style="color:var(--text)">${esc(typeTitle(w.type))}</a></li><li><span aria-current="page">${tx(w.title)}</span></li></ol></nav>
        <div class="work-info">
          <div class="work-poster">${posterOf(w, { eager: true })}</div>
          <div>
            <span class="eyebrow">${esc(typeTitle(w.type))}</span>
            <h2>${q(tx(w.title))}</h2><span class="by">${tx(byline(w))}</span>
            <dl class="facts">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${tx(v)}</dd></div>`).join("")}</dl>
            <div class="prose">${w.summary ? `<p><b>خلاصهٔ داستان:</b> ${tx(w.summary)}</p>` : ""}${(w.body || []).map((p) => `<p>${tx(p)}</p>`).join("")}</div>
            ${w.awards && w.awards.length ? `<h3 style="font-size:1rem;margin-top:1.25rem">افتخارات</h3><ul class="awards">${w.awards.map((a) => `<li>${icon("award")}<span>${tx(a)}</span></li>`).join("")}</ul>` : ""}
          </div>
        </div>
      </div>

      ${people.length ? `<section class="section" aria-labelledby="crew-t"><div class="wrap">${secTitle("عوامل تولید", "", "crew-t")}
        <div class="crew-grid">${people.map((p) => `<figure class="crew" style="margin:0">
          <div class="avatar" style="background:linear-gradient(135deg,${esc(w.colors?.[0] || "#2a2d36")},${esc(w.colors?.[1] || "#6b6e78")})">${p.photo ? `<img src="${esc(p.photo)}" alt="" loading="lazy">` : `<span aria-hidden="true">${esc((p.name || "?").trim().charAt(0))}</span>`}</div>
          <figcaption><h3>${tx(p.name)}</h3><p>${tx(p.role)}</p></figcaption></figure>`).join("")}</div></div></section>` : ""}

      <section class="section section--dark" aria-labelledby="stills-t"><div class="wrap">${secTitle("تصاویر برگزیدهٔ اثر", "", "stills-t")}
        <div class="stills">${stills.map((s, k) => `<button type="button" data-still="${k}" aria-label="نمایشِ ${esc(s.title)}"><div class="thumb ${s.sample ? "is-sample" : ""}"><img src="${esc(s.src)}" alt="" width="320" height="200" loading="lazy" decoding="async"></div></button>`).join("")}</div>

      ${trailers.length ? `<div style="margin-top:4rem">${secTitle("پیش‌نمایش", "", "tr-t")}
        <div class="trailers">${trailers.map((t, k) => `<figure class="trailer" style="margin:0"><div class="trailer-frame">
          ${t.embed ? `<button type="button" data-embed="${esc(t.embed)}" data-title="${esc(t.title)}" aria-label="پخشِ ${esc(t.title)}">${thumb({ src: t.cover, colors: w.colors, seed: w.id + "t" + k, alt: "", w: 1280, h: 720 })}<span class="play-badge">${icon("play")}</span></button>`
            : `<div class="trailer-ph">${thumb({ colors: w.colors, seed: w.id + "t" + k, alt: "", w: 1280, h: 720 })}<span class="play-badge" style="opacity:.6">${icon("play")}</span><span class="trailer-soon">ویدیو به‌زودی منتشر می‌شود</span></div>`}
        </div><figcaption>${tx(t.title)}</figcaption></figure>`).join("")}</div></div>` : ""}
      </div></section>

      ${related.length ? `<section class="section section--light" aria-labelledby="rel-t"><div class="wrap">${secTitle("آثارِ دیگر", "", "rel-t")}
        <div class="poster-grid">${related.map(pcard).join("")}</div></div></section>` : ""}`;

    $$("[data-still]", main).forEach((b) => b.addEventListener("click", () => lbOpen(stills, +b.dataset.still)));
    // ویدیو فقط با کلیک بارگذاری می‌شود (سبک ماندنِ صفحه)
    $$("[data-embed]", main).forEach((b) => b.addEventListener("click", () => {
      b.outerHTML = `<iframe src="${esc(b.dataset.embed)}" title="${esc(b.dataset.title)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    }));
  }

  /* ---------- فهرستِ «تولیدات» (چندرسانه‌ای) ---------- */
  function renderMedia() {
    const D = { kind: "all", page: 1 };
    const st = urlState(D);
    main.innerHTML = `${pageHead("تولیدات", "نماهنگ، تیزر، موشن‌گرافیک، پوستر و عکس")}
      <div class="wrap" style="padding:2.25rem 0 3.5rem">
        <div class="toolbar"><ul class="chips" aria-label="نوعِ تولید">
          ${[{ slug: "all", title: "همه" }, ...MEDIA_TYPES].map((t) => {
            const n = t.slug === "all" ? MEDIA.length : MEDIA.filter((m) => m.kind === t.slug).length;
            return `<li><button class="chip" type="button" data-kind="${t.slug}" aria-pressed="false">${esc(t.title)}<span class="count">${fa(n)}</span></button></li>`;
          }).join("")}</ul></div>
        <p class="result-count" aria-live="polite"></p>
        <div class="masonry" id="m-list"></div>
      </div>`;
    let list = [];
    const draw = () => {
      $$(".chip", main).forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.kind === st.kind)));
      list = MEDIA.filter((m) => st.kind === "all" || m.kind === st.kind);
      $(".result-count", main).textContent = fa(`${list.length} مورد`);
      $("#m-list").innerHTML = list.length ? list.map((m, k) => { const [a, b] = ratioOf(m.ratio); return `
        <button class="mitem" type="button" id="${esc(m.id)}" data-i="${k}" style="--ar:${a}/${b}" aria-label="نمایشِ ${esc(m.title)}">
          ${mediaImg(m)}${["musicvideo", "teaser", "motion"].includes(m.kind) ? `<span class="play-badge" style="top:calc(50% - 1.6rem)">${icon("play")}</span>` : ""}
          <span class="mitem-cap"><b>${tx(m.title)}</b><small>${esc(mediaTitle(m.kind))} · ${fa(m.year)}</small></span>
        </button>`; }).join("") : `<p class="empty">موردی پیدا نشد.</p>`;
      pushState(st, D);
    };
    $$(".chip", main).forEach((c) => c.addEventListener("click", () => { st.kind = c.dataset.kind; draw(); }));
    $("#m-list").addEventListener("click", (e) => { const b = e.target.closest(".mitem"); if (b) lbOpen(list.map(lbItemFromMedia), +b.dataset.i); });
    draw();
    // لینکِ مستقیم به یک مورد (media.html#id) آن را در نمایشگر باز می‌کند
    const hid = decodeURIComponent(location.hash.slice(1));
    const k = list.findIndex((m) => m.id === hid);
    if (k >= 0) lbOpen(list.map(lbItemFromMedia), k);
  }

  /* ---------- ستونِ کناری ---------- */
  function sidebar(opts) {
    const { current, kind } = opts || {};
    const picks = POSTS.filter((p) => p.pick && p !== current).slice(0, 4);
    const ws = [widget("آخرین تولیدات", latestWorks(4).map(wMini))];
    if (current) {
      const rel = POSTS.filter((p) => p !== current && (p.kind === current.kind || (p.tags || []).some((t) => (current.tags || []).includes(t)))).slice(0, 4);
      ws.push(widget("مطالب مرتبط", rel.map(pMini), "مطلبِ مرتبطی وجود ندارد."));
    } else if (kind === "program") {
      ws.push(widget("آخرین اخبار", POSTS.filter((p) => p.kind !== "program").slice(0, 4).map(pMini)));
    } else {
      ws.push(widget("برنامه‌های فرهنگی", POSTS.filter((p) => p.kind === "program").slice(0, 4).map(pMini)));
    }
    ws.push(widget("برگزیده‌ها", picks.map(pMini), "هنوز مطلبی برگزیده نشده است."));
    return `<aside class="sidebar" aria-label="ستونِ کناری">${ws.join("")}</aside>`;
  }

  /* ---------- فهرستِ اخبار / برنامه‌ها ---------- */
  function renderPostList(isPrograms) {
    const D = { kind: "all", q: "", page: 1 };
    const st = urlState(D);
    const PER = 6;
    const base = POSTS.filter((p) => (isPrograms ? p.kind === "program" : p.kind !== "program"));
    const title = isPrograms ? "برنامه‌های فرهنگی" : "اخبار و رویدادها";
    main.innerHTML = `${pageHead(title, isPrograms ? "شب فیلم، کارگاه، نمایشگاه و نشست‌های تخصصی" : "تازه‌ترین خبرها، اکران‌ها، فراخوان‌ها و رویدادها")}
      <div class="layout-wrap"><div class="wrap layout">
        <div>
          <div class="toolbar">
            ${isPrograms ? "<span></span>" : `<ul class="chips" aria-label="نوعِ مطلب">${[["all", "همه"], ["news", "خبر"], ["event", "رویداد"]].map(([k, t]) => `<li><button class="chip" type="button" data-kind="${k}" aria-pressed="false">${t}<span class="count">${fa(k === "all" ? base.length : base.filter((p) => p.kind === k).length)}</span></button></li>`).join("")}</ul>`}
            <div class="searchbox">${icon("search")}<label class="sr-only" for="p-q">جستجو در ${esc(title)}</label><input id="p-q" type="search" placeholder="جستجو…"></div>
          </div>
          <p class="result-count" aria-live="polite"></p>
          <div id="p-list"></div><div id="p-pager"></div>
        </div>
        ${sidebar({ kind: isPrograms ? "program" : "news" })}
      </div></div>`;
    const qEl = $("#p-q");
    qEl.value = st.q;
    const draw = () => {
      $$(".chip", main).forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.kind === st.kind)));
      const list = base.filter((p) => (st.kind === "all" || p.kind === st.kind) && matches(p, ["title", "lead", "body", "tags", "place"], st.q));
      const pages = Math.max(1, Math.ceil(list.length / PER));
      if (st.page > pages) st.page = pages;
      $(".result-count", main).textContent = fa(`${list.length} مطلب`);
      $("#p-list").innerHTML = list.length ? list.slice((st.page - 1) * PER, st.page * PER).map(hcard).join("") : `<p class="empty">مطلبی با این مشخصات پیدا نشد.</p>`;
      $("#p-pager").innerHTML = pager(list.length, PER, st.page);
      pushState(st, D);
    };
    $$(".chip", main).forEach((c) => c.addEventListener("click", () => { st.kind = c.dataset.kind; st.page = 1; draw(); }));
    qEl.addEventListener("input", debounce(() => { st.q = qEl.value.trim(); st.page = 1; draw(); }, 200));
    $("#p-pager").addEventListener("click", (e) => { const a = e.target.closest("[data-page]"); if (!a) return; e.preventDefault(); st.page = +a.dataset.page; draw(); $(".toolbar", main).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); });
    draw();
  }

  /* ---------- صفحهٔ خبر / برنامه ---------- */
  function renderPost() {
    const p = POSTS.find((x) => x.id === params.get("id"));
    if (!p) { main.innerHTML = notFound("مطلب", "news.html", "همهٔ اخبار"); return; }
    document.title = `${p.title} — ${BRAND}`;
    const isProg = p.kind === "program";
    const url = location.href;
    const share = [
      ["telegram", "تلگرام", `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(p.title)}`],
      ["whatsapp", "واتساپ", `https://wa.me/?text=${encodeURIComponent(p.title + " " + url)}`],
      ["x", "ایکس", `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(p.title)}`],
    ];
    const section = isProg ? "برنامه‌های فرهنگی" : "اخبار و رویدادها";
    main.innerHTML = `${pageHead(p.title, "", [[section, isProg ? "programs.html" : "news.html"]], section)}
      <div class="layout-wrap"><div class="wrap layout">
        <article class="article">
          <h1>${tx(p.title)}</h1>
          <div class="meta"><span>${icon("calendar")} ${fdate(p.date)}</span><span class="kind-tag kind-tag--${esc(p.kind)}">${KIND[p.kind] || ""}</span></div>
          <div class="lead">${postImg(p, { eager: true })}<p>${tx(p.lead)}</p></div>
          ${p.when || p.place ? `<div class="event-box">${p.when ? `<span>${icon("clock")} <b>زمان:</b> ${tx(p.when)}</span>` : ""}${p.place ? `<span>${icon("pin")} <b>مکان:</b> ${tx(p.place)}</span>` : ""}</div>` : ""}
          <div class="prose">${(p.body || []).map((x) => `<p>${tx(x)}</p>`).join("")}</div>
          <div class="article-foot">
            <div class="tags"><span>کلیدواژه‌ها:</span>${(p.tags || []).map((t) => `<a href="search.html?q=${encodeURIComponent(t)}">${tx(t)}</a>`).join("") || "—"}</div>
            <div class="share"><span>اشتراک:</span>${share.map(([i, n, h]) => `<a href="${esc(h)}" target="_blank" rel="noopener" aria-label="اشتراک در ${n}" title="${n}">${icon(i)}</a>`).join("")}
              <button type="button" data-copy aria-label="کپیِ لینک" title="کپیِ لینک">${icon("copy")}</button>${navigator.share ? `<button type="button" data-native-share aria-label="اشتراک‌گذاری" title="اشتراک‌گذاری">${icon("link")}</button>` : ""}<span class="share-status" role="status"></span></div>
          </div>
        </article>
        ${sidebar({ current: p })}
      </div></div>`;
    const ns = $("[data-native-share]", main);
    if (ns) ns.addEventListener("click", () => { navigator.share({ title: p.title, url }).catch(() => {}); }); // لغو توسطِ کاربر خطا نیست
    $("[data-copy]", main).addEventListener("click", async () => {
      const s = $(".share-status", main);
      try { await navigator.clipboard.writeText(url); s.textContent = "کپی شد"; }
      catch (err) { s.textContent = "کپی نشد"; s.style.color = "var(--accent-d)"; }
      setTimeout(() => { s.textContent = ""; s.style.color = ""; }, 2500);
    });
  }

  /* ---------- درباره ما ---------- */
  function renderAbout() {
    const count = (t) => WORKS.filter((w) => w.type === t).length;
    const areas = [
      ["film", "فیلم سینمایی", "از توسعهٔ فیلم‌نامه تا اکران؛ تولید و تهیهٔ فیلم‌های بلندِ داستانی."],
      ["tv", "سریال", "تولیدِ مجموعه‌های نمایشی برای تلویزیون و شبکهٔ نمایشِ خانگی."],
      ["camera", "مستند", "مستندهای اجتماعی، فرهنگی و پرتره، کوتاه و بلند."],
      ["smile", "انیمیشن", "انیمیشنِ کودک و نوجوان، دوبعدی و سه‌بعدی."],
      ["music", "نماهنگ و تیزر", "ساختِ نماهنگ، تیزرِ تبلیغاتی و آنونسِ آثار."],
      ["spark", "موشن‌گرافیک و پوستر", "طراحیِ گرافیکِ متحرک، پوستر و هویتِ بصریِ آثار."],
    ];
    main.innerHTML = `${pageHead("درباره ما", S.brand?.tagline || "")}
      <section class="section"><div class="wrap">
        <p class="note">متن‌های این صفحه نمونه‌اند و پس از دریافتِ معرفیِ رسمیِ مجموعه جایگزین می‌شوند.</p>
        <div class="about-intro">
          <div><span class="eyebrow">معرفی</span><h2 style="font-size:1.5rem">${esc(BRAND)}</h2>
            <div class="prose"><p>${tx(S.brand?.description || "")}</p>
            <p>این بخش برای معرفیِ تاریخچه، رویکرد و تیمِ مجموعه است: از کجا آغاز کردیم، چه آثاری ساخته‌ایم و به چه چیزی باور داریم. (متن نمونه)</p>
            <p>مأموریتِ ما روایتِ داستان‌هایی است که دیده شوند و ماندگار باشند؛ با کیفیتِ فنیِ بالا و احترام به مخاطب. (متن نمونه)</p></div>
            <p style="margin-top:1rem"><a class="btn btn--accent" href="works.html">دیدنِ آثار</a> <a class="btn btn--outline" href="contact.html#form">همکاری با ما</a></p></div>
          ${thumb({ colors: ["#1d1f26", "#c23b4e"], seed: "about-intro", alt: "تصویرِ نمونهٔ مجموعه", w: 800, h: 600, eager: true })}
        </div></div></section>

      <section class="section section--light" aria-labelledby="areas-t"><div class="wrap">${secTitle("حوزه‌های فعالیت", "", "areas-t")}
        <div class="cards-3">${areas.map(([i, t, d]) => `<div class="feature"><div class="ficon">${icon(i)}</div><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join("")}</div>
      </div></section>

      <section class="section section--dark" aria-labelledby="stats-t"><div class="wrap">${secTitle("آثار در یک نگاه", "شمارشِ خودکار از آثارِ ثبت‌شده در همین سایت", "stats-t")}
        <div class="stats">${WORK_TYPES.slice(0, 4).map((t) => `<div class="stat"><b>${fa(count(t.slug))}</b><span>${esc(t.title)}</span></div>`).join("")}</div>
      </div></section>

      <section class="section" aria-labelledby="steps-t"><div class="wrap">${secTitle("فرایندِ تولید", "", "steps-t")}
        <ol class="steps">
          <li><b>ایده و پژوهش</b><span>بررسیِ ایده، پژوهشِ میدانی و ارزیابیِ طرح</span></li>
          <li><b>نگارش</b><span>فیلم‌نامه، طرحِ مستند یا استوری‌بورد</span></li>
          <li><b>پیش‌تولید</b><span>بودجه، برنامه‌ریزی، انتخابِ عوامل و لوکیشن</span></li>
          <li><b>تولید</b><span>فیلمبرداری، انیمیشن یا ضبط</span></li>
          <li><b>پس‌تولید و پخش</b><span>تدوین، صدا، رنگ، جلوه‌ها و انتشار</span></li>
        </ol></div></section>`;
  }

  /* ---------- تماس ---------- */
  function renderContact() {
    const c = S.contact || {};
    main.innerHTML = `${pageHead("تماس با ما", "برای همکاری در تولید، ارسالِ طرح یا هماهنگیِ رسانه‌ای با ما در تماس باشید.")}
      <section class="section section--light"><div class="wrap contact-grid">
        <div class="info-cards">
          ${c.address ? `<div class="info-card"><div class="ficon">${icon("pin")}</div><div><b>نشانی</b><span>${tx(c.address)}</span></div></div>` : ""}
          ${(c.phones || []).length ? `<div class="info-card"><div class="ficon">${icon("phone")}</div><div><b>تلفن</b><span>${c.phones.map((p) => `<a class="ltr" href="tel:${esc(p.replace(/[^\d+]/g, ""))}">${tx(p)}</a>`).join("، ")}</span></div></div>` : ""}
          ${c.email ? `<div class="info-card"><div class="ficon">${icon("mail")}</div><div><b>پست الکترونیک</b><span><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></span></div></div>` : ""}
          ${c.hours ? `<div class="info-card"><div class="ficon">${icon("clock")}</div><div><b>ساعتِ پاسخ‌گویی</b><span>${tx(c.hours)}</span></div></div>` : ""}
          ${mapBox()}
        </div>
        <div class="panel" id="form"><h2>ارسالِ پیام یا طرح</h2>
          <form class="form" novalidate data-msg-form>
            <div class="form-row">
              <div><label for="c-name">نام و نام خانوادگی *</label><input id="c-name" name="name" required autocomplete="name"></div>
              <div><label for="c-email">پست الکترونیک *</label><input id="c-email" name="email" type="email" required autocomplete="email" dir="auto"></div>
            </div>
            <div class="form-row">
              <div><label for="c-phone">تلفن</label><input id="c-phone" name="phone" type="tel" autocomplete="tel" dir="auto"></div>
              <div><label for="c-topic">موضوع</label><select id="c-topic" name="topic"><option>همکاری در تولید</option><option>ارسالِ طرح یا فیلم‌نامه</option><option>رسانه و خبرنگاران</option><option>سایر</option></select></div>
            </div>
            <div><label for="c-subject">عنوان *</label><input id="c-subject" name="subject" required></div>
            <div><label for="c-text">متن پیام *</label><textarea id="c-text" name="text" required></textarea></div>
            <button class="btn btn--accent" type="submit">ارسال پیام</button>
            <p class="form-status" role="status" aria-live="polite"></p>
          </form>
        </div>
      </div></section>`;
  }

  /* ---------- جستجو ---------- */
  function renderSearch() {
    const q = (params.get("q") || "").trim();
    main.innerHTML = `${pageHead("جستجو", "")}`;
    $(".page-head .wrap", main).insertAdjacentHTML("beforeend", `<form class="search-hero" action="search.html" method="get" role="search" style="margin-top:1rem">
      <label class="sr-only" for="s-q">عبارتِ جستجو</label><input id="s-q" name="q" type="search" value="${esc(q)}" placeholder="نام اثر، خبر، کارگردان…">
      <button class="btn btn--accent" type="submit">${icon("search")} جستجو</button></form>`);
    const body = document.createElement("div");
    body.className = "wrap";
    body.style.padding = "2.25rem 0 3.5rem";
    main.append(body);
    if (!q) { body.innerHTML = `<p class="empty">عبارتی برای جستجو وارد کنید.</p>`; return; }
    document.title = `جستجو: ${q} — ${BRAND}`;
    const ws = WORKS.filter((w) => matches(w, ["title", "director", "producer", "writer", "genre", "summary", "body", "crew"], q));
    const ns = POSTS.filter((p) => p.kind !== "program" && matches(p, ["title", "lead", "body", "tags"], q));
    const ps = POSTS.filter((p) => p.kind === "program" && matches(p, ["title", "lead", "body", "tags", "place"], q));
    const ms = MEDIA.filter((m) => matches(m, ["title", "desc"], q));
    const total = ws.length + ns.length + ps.length + ms.length;
    const group = (title, n, html) => (n ? `<section class="search-group"><h2>${esc(title)} <small>${fa(n)} نتیجه</small></h2>${html}</section>` : "");
    body.innerHTML = `<p class="result-count" style="margin:0 0 1.5rem" aria-live="polite">${fa(total)} نتیجه برای «${esc(q)}»</p>
      ${total ? "" : `<p class="empty">نتیجه‌ای پیدا نشد. عبارتِ کوتاه‌تر یا دیگری را امتحان کنید.</p>`}
      ${group("تولیدات شاخص", ws.length, `<div class="poster-grid">${ws.map(pcard).join("")}</div>`)}
      ${group("اخبار و رویدادها", ns.length, ns.map(hcard).join(""))}
      ${group("برنامه‌های فرهنگی", ps.length, ps.map(hcard).join(""))}
      ${group("تولیدات", ms.length, `<div class="masonry">${ms.map((m) => { const [a, b] = ratioOf(m.ratio); return `<a class="mitem" href="media.html#${esc(m.id)}" style="--ar:${a}/${b}">${mediaImg(m)}<span class="mitem-cap"><b>${tx(m.title)}</b><small>${esc(mediaTitle(m.kind))}</small></span></a>`; }).join("")}</div>`)}`;
  }

  /* ---------- راه‌اندازی ---------- */
  const PAGES = {
    home: renderHome, works: renderWorks, work: renderWork, media: renderMedia,
    news: () => renderPostList(false), programs: () => renderPostList(true), post: renderPost,
    about: renderAbout, contact: renderContact, search: renderSearch, notfound: () => { main.innerHTML = notFound("صفحه", "index.html", "صفحهٔ اصلی"); },
  };
  if (main && PAGES[page]) PAGES[page]();
  renderHeader();
  renderFooter();
  bindForms();
  // اگر صفحه با #لنگر باز شد (مثلاً index.html#works)، پس از رندر به آن برود
  if (location.hash && page !== "media") {
    const t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (t) setTimeout(() => t.scrollIntoView(), 0);
  }
})();
