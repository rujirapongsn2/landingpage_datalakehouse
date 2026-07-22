/* ============================================================
   Softnix Data Lakehouse Platform — main.js
   Language switching (TH/EN), feature showcase tabs,
   scroll-reveal animations, navbar & mobile menu.
   ============================================================ */

(function () {
  "use strict";

  /* ----------------------------------------------------------
     1. i18n — capture Thai from the DOM (source of truth),
        English comes from I18N_EN (i18n.js).
     ---------------------------------------------------------- */
  const thDict = {};
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!(key in thDict)) thDict[key] = el.innerHTML;
  });

  let currentLang = localStorage.getItem("sdp-lang") || "th";
  let currentTab = "ai-query";

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("sdp-lang", lang);
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key.startsWith("fp.")) return; // feature panel handled separately
      const text = lang === "en" ? I18N_EN[key] : thDict[key];
      if (text !== undefined) el.innerHTML = text;
    });

    // Toggle button states
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    // Re-render the active feature panel in the new language
    renderFeature(currentTab, false);

    // Update <title> and meta description per language
    if (lang === "en") {
      document.title = "Softnix Data Lakehouse Platform — Enterprise-Grade Data Analytics Infrastructure";
      setMeta("Softnix Data Lakehouse Platform (SDP) — On-Premise, Privacy-First, AI Agent Ready. Enterprise data lakehouse with built-in data governance and AI Agent. Perpetual license, no recurring cost.");
    } else {
      document.title = "Softnix Data Lakehouse Platform — แพลตฟอร์ม Data Lakehouse ระดับองค์กร";
      setMeta("Softnix Data Lakehouse Platform (SDP) — On-Premise, Privacy-First, AI Agent Ready. แพลตฟอร์ม Data Lakehouse ระดับองค์กร พร้อม Data Governance และ AI Agent ในตัว Perpetual License ไม่มีค่าใช้จ่ายต่อเนื่อง");
    }
  }

  function setMeta(content) {
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", content);
  }

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.lang !== currentLang) applyLanguage(btn.dataset.lang);
    });
  });

  /* ----------------------------------------------------------
     2. Feature showcase tabs
     ---------------------------------------------------------- */
  const panelTitle = document.getElementById("panelTitle");
  const panelDesc = document.getElementById("panelDesc");
  const panelPoints = document.getElementById("panelPoints");
  const panelImg = document.getElementById("panelImg");
  const panelUrl = document.getElementById("panelUrl");

  function renderFeature(tabKey, animate = true) {
    const feature = SDP_FEATURES[tabKey];
    if (!feature) return;
    currentTab = tabKey;
    const content = feature[currentLang] || feature.th;

    const swap = () => {
      panelTitle.innerHTML = content.title;
      panelDesc.innerHTML = content.desc;
      panelPoints.innerHTML = content.points.map((p) => `<li>${p}</li>`).join("");
      // อัปเดต width/height attribute ให้ตรงสัดส่วนจริงของภาพแต่ละภาพ
      // ป้องกันภาพถูกบีบ/ยืดเมื่อสลับ screenshot ที่อัตราส่วนต่างกัน
      if (feature.w && feature.h) {
        panelImg.setAttribute("width", feature.w);
        panelImg.setAttribute("height", feature.h);
      }
      panelImg.src = feature.img;
      panelImg.alt = content.title.replace(/&amp;/g, "&");
      panelUrl.textContent = feature.url;
      panelImg.classList.remove("fading");
    };

    if (animate) {
      panelImg.classList.add("fading");
      setTimeout(swap, 180);
    } else {
      swap();
    }
  }

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.tab === currentTab) return;
      document.querySelectorAll(".tab-btn").forEach((b) => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-selected", String(b === btn));
      });
      renderFeature(btn.dataset.tab);
    });
  });

  /* ----------------------------------------------------------
     3. Scroll reveal
     ---------------------------------------------------------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ----------------------------------------------------------
     4. Navbar — scrolled state & mobile menu
     ---------------------------------------------------------- */
  const navbar = document.getElementById("navbar");
  const navLinks = document.getElementById("navLinks");
  const navToggle = document.getElementById("navToggle");

  const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    })
  );

  /* ----------------------------------------------------------
     5. Init
     ---------------------------------------------------------- */
  applyLanguage(currentLang);
})();
