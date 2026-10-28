/* Jayasai Gouthaman · portfolio
   Vanilla JS, no build step. Works from file:// and static hosting. */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  var navLinks = menu ? Array.prototype.slice.call(menu.querySelectorAll('a[href^="#"]')) : [];
  var backToTop = document.querySelector(".back-to-top");
  var hero = document.getElementById("hero");

  /* ---------- Footer year ---------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Light / dark theme (light by default) ---------- */
  var THEME_KEY = "jg-theme";
  var root = document.documentElement;
  var themeToggle = document.querySelector(".theme-toggle");
  var themeColor = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    var dark = theme === "dark";
    if (dark) root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    if (themeColor) themeColor.setAttribute("content", dark ? "#161312" : "#FAF7F4");
    if (themeToggle) themeToggle.setAttribute("aria-pressed", String(dark));
  }

  if (themeToggle) {
    applyTheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light");
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* private mode: ignore */ }
    });
  }

  /* ---------- Mobile menu ---------- */
  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (menu.classList.contains("is-open") && !header.contains(e.target)) setMenu(false);
    });
    // Reset the mobile menu when the layout switches to the desktop nav.
    window.matchMedia("(min-width: 1024px)").addEventListener("change", function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* ---------- Header border + back-to-top after the hero ---------- */
  if ("IntersectionObserver" in window && hero) {
    new IntersectionObserver(function (entries) {
      var pastHero = !entries[0].isIntersecting;
      if (backToTop) {
        backToTop.hidden = false;
        backToTop.classList.toggle("is-visible", pastHero);
        backToTop.tabIndex = pastHero ? 0 : -1;
        backToTop.setAttribute("aria-hidden", String(!pastHero));
      }
    }, { rootMargin: "-120px 0px 0px 0px" }).observe(hero);
  }

  window.addEventListener("scroll", function () {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }, { passive: true });

  /* ---------- Active section highlight ---------- */
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var visible = new Map();
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { visible.set(entry.target.id, entry.isIntersecting); });
      // The first section (in document order) that is in the viewport band wins.
      var current = sections.find(function (s) { return visible.get(s.id); });
      navLinks.forEach(function (link) {
        var active = current && link.getAttribute("href") === "#" + current.id;
        link.classList.toggle("is-active", !!active);
        if (active) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-35% 0px -60% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Technical / Leadership toggle ---------- */
  var LENS_KEY = "jg-lens";
  var lensToggle = document.querySelector(".lens-toggle");
  var lensTabs = lensToggle ? Array.prototype.slice.call(lensToggle.querySelectorAll('[role="tab"]')) : [];

  function readLens() {
    try { return localStorage.getItem(LENS_KEY); } catch (e) { return null; }
  }
  function saveLens(lens) {
    try { localStorage.setItem(LENS_KEY, lens); } catch (e) { /* private mode: ignore */ }
  }

  function setLens(lens, focus) {
    lensTabs.forEach(function (tab) {
      var on = tab.dataset.lens === lens;
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
      document.getElementById(tab.getAttribute("aria-controls")).hidden = !on;
      if (on && focus) tab.focus();
    });
    lensToggle.dataset.active = lens;
  }

  if (lensTabs.length) {
    var saved = readLens();
    setLens(saved === "leadership" ? "leadership" : "technical");

    lensTabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        setLens(tab.dataset.lens);
        saveLens(tab.dataset.lens);
      });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") next = lensTabs[(i + 1) % lensTabs.length];
        if (e.key === "Home") next = lensTabs[0];
        if (e.key === "End") next = lensTabs[lensTabs.length - 1];
        if (next) {
          e.preventDefault();
          setLens(next.dataset.lens, true);
          saveLens(next.dataset.lens);
        }
      });
    });
  }

  /* ---------- Photo carousel ---------- */
  Array.prototype.forEach.call(document.querySelectorAll(".carousel"), function (carousel) {
    var track = carousel.querySelector(".carousel-track");
    var slides = track.children;
    var status = carousel.querySelector(".carousel-status");
    var prev = carousel.querySelector('[data-dir="-1"]');
    var next = carousel.querySelector('[data-dir="1"]');

    function current() {
      return Math.round(track.scrollLeft / track.clientWidth);
    }
    function update() {
      var i = current();
      status.textContent = (i + 1) + " / " + slides.length;
      prev.disabled = i <= 0;
      next.disabled = i >= slides.length - 1;
    }
    function go(i) {
      var target = slides[Math.max(0, Math.min(slides.length - 1, i))];
      track.scrollTo({ left: target.offsetLeft - track.offsetLeft });
    }

    prev.addEventListener("click", function () { go(current() - 1); });
    next.addEventListener("click", function () { go(current() + 1); });
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); go(current() - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); go(current() + 1); }
    });
    var ticking = false;
    track.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  });

  /* ---------- Lightbox ---------- */
  var box = document.getElementById("lightbox");
  if (box && typeof box.showModal === "function") {
    var boxImg = box.querySelector(".lightbox-img");
    var boxCap = box.querySelector(".lightbox-caption");
    var boxCount = box.querySelector(".lightbox-count");
    var prevBtn = box.querySelector(".lightbox-prev");
    var nextBtn = box.querySelector(".lightbox-next");
    var items = [];
    var index = 0;
    var opener = null;

    function toItem(el) {
      var img = el.querySelector("img");
      return {
        src: el.dataset.src,
        alt: el.dataset.alt || (img ? img.alt : ""),
        caption: el.dataset.caption || ""
      };
    }

    function show(i) {
      index = (i + items.length) % items.length;
      var item = items[index];
      boxImg.src = item.src;
      boxImg.alt = item.alt;
      boxCap.textContent = item.caption;
      var many = items.length > 1;
      prevBtn.hidden = nextBtn.hidden = !many;
      boxCount.textContent = many ? (index + 1) + " / " + items.length : "";
    }

    document.addEventListener("click", function (e) {
      var trigger = e.target.closest(".lightbox-trigger");
      if (!trigger) return;
      var group = trigger.dataset.gallery;
      var els = group
        ? Array.prototype.slice.call(document.querySelectorAll('[data-gallery="' + group + '"]'))
        : [trigger];
      // De-duplicate by image so a photo and its text link don't appear twice.
      var seen = {};
      items = [];
      els.forEach(function (el) {
        if (!seen[el.dataset.src]) { seen[el.dataset.src] = true; items.push(toItem(el)); }
      });
      opener = trigger;
      show(items.findIndex(function (it) { return it.src === trigger.dataset.src; }));
      box.showModal();
      box.querySelector(".lightbox-close").focus();
    });

    prevBtn.addEventListener("click", function () { show(index - 1); });
    nextBtn.addEventListener("click", function () { show(index + 1); });
    box.querySelector(".lightbox-close").addEventListener("click", function () { box.close(); });

    box.addEventListener("keydown", function (e) {
      if (items.length < 2) return;
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
    // Click on the dark backdrop (not the photo or buttons) closes it.
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target.classList.contains("lightbox-figure")) box.close();
    });
    box.addEventListener("close", function () {
      boxImg.removeAttribute("src");
      if (opener) opener.focus();
    });
  }
})();
