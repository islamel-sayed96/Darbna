(function () {
  "use strict";

  const S = window.SITE;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const icon = (name, cls = "icon") =>
    `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${window.ICONS[name] || ""}</svg>`;
  const waLink = (text = "") =>
    `https://wa.me/${S.whatsapp}${text ? "?text=" + encodeURIComponent(text) : ""}`;
  const WA_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41"/></svg>';

  const page = document.body.dataset.page || "home";

  /* ---------------- Header ---------------- */
  const navItems = [
    { id: "home", href: "index.html", label: "الرئيسية" },
    { id: "services", href: "services.html", label: "خدماتنا" },
    { id: "work", href: "index.html#work", label: "أعمالنا" },
    { id: "about", href: "about.html", label: "من نحن" },
    { id: "contact", href: "contact.html", label: "تواصل معنا" },
  ];

  const header = $("#site-header");
  if (header) {
    header.outerHTML = `
      <header class="header" id="header">
        <div class="container header__inner">
          <a href="index.html" class="logo" aria-label="${S.name}">
            <span class="logo__mark">${S.nameEn.charAt(0)}</span>
            <span>${S.nameEn}</span>
          </a>
          <nav class="nav" id="nav" aria-label="القائمة الرئيسية">
            ${navItems.map((n) => `<a href="${n.href}" class="${n.id === page ? "is-active" : ""}">${n.label}</a>`).join("")}
            <a href="contact.html" class="btn btn--primary">اطلب عرض سعر</a>
          </nav>
          <div class="header__cta">
            <a href="contact.html" class="btn btn--primary">اطلب عرض سعر</a>
            <button class="burger" id="burger" aria-label="فتح القائمة" aria-expanded="false" aria-controls="nav">
              <svg class="icon" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>
      </header>`;

    const hdr = $("#header");
    const onScroll = () => hdr.classList.toggle("is-scrolled", window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const burger = $("#burger");
    const nav = $("#nav");
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open);
    });
    $$("a", nav).forEach((a) => a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    }));
  }

  /* ---------------- Footer ---------------- */
  const footer = $("#site-footer");
  if (footer) {
    const socialLabels = { facebook: "Fb", instagram: "Ig", tiktok: "Tk", linkedin: "In", behance: "Be" };
    const topServices = window.SERVICES.slice(0, 6);
    footer.outerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer__grid">
            <div>
              <a href="index.html" class="logo"><span class="logo__mark">${S.nameEn.charAt(0)}</span><span>${S.nameEn}</span></a>
              <p style="margin-top:18px">${S.name} — ${S.tagline}. كل اللي محتاجه علامتك عشان تكبر، تحت سقف واحد.</p>
              <div class="socials">
                ${Object.entries(S.social).filter(([, url]) => url).map(([k, url]) =>
                  `<a href="${url}" target="_blank" rel="noopener" aria-label="${k}">${socialLabels[k] || k}</a>`).join("")}
              </div>
            </div>
            <div>
              <h4>خدماتنا</h4>
              <ul>${topServices.map((s) => `<li><a href="services.html#${s.id}">${s.title}</a></li>`).join("")}</ul>
            </div>
            <div>
              <h4>روابط</h4>
              <ul>${navItems.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join("")}</ul>
            </div>
            <div>
              <h4>تواصل</h4>
              <ul>
                <li><a href="${waLink()}" target="_blank" rel="noopener">واتساب: <span dir="ltr">${S.phone}</span></a></li>
                <li><a href="mailto:${S.email}">${S.email}</a></li>
                <li>${S.address}</li>
                <li>${S.hours}</li>
              </ul>
            </div>
          </div>
          <div class="footer__bottom">
            <span>© ${new Date().getFullYear()} ${S.name}. جميع الحقوق محفوظة.</span>
            <span>صُنع بشغف ✦</span>
          </div>
        </div>
      </footer>
      <a class="wa-float" href="${waLink("مرحبا، عايز أستفسر عن خدماتكم")}" target="_blank" rel="noopener" aria-label="تواصل عبر واتساب">${WA_SVG}</a>`;
  }

  /* ---------------- Generic fillers ---------------- */
  $$("[data-site]").forEach((el) => { el.textContent = S[el.dataset.site]; });
  $$("[data-wa]").forEach((el) => {
    el.href = waLink(el.dataset.wa || "مرحبا، عايز أستفسر عن خدماتكم");
    el.target = "_blank"; el.rel = "noopener";
  });
  $$("[data-mail]").forEach((el) => { el.href = `mailto:${S.email}`; });
  $$("[data-icon]").forEach((el) => {
    if (el.tagName.toLowerCase() === "svg") el.outerHTML = icon(el.dataset.icon);
    else el.innerHTML = icon(el.dataset.icon);
  });

  /* ---------------- Services ---------------- */
  const serviceCard = (s, detailed) => `
    <article class="card reveal" id="${detailed ? s.id : ""}" data-cat="${s.cat}">
      <div class="card__icon">${icon(s.icon)}</div>
      <h3>${s.title}</h3>
      <p>${s.short}</p>
      ${detailed ? `<ul class="card__list">${s.features.map((f) => `<li>${icon("check")}<span>${f}</span></li>`).join("")}</ul>` : ""}
      <a class="card__link" href="${detailed ? `contact.html?service=${s.id}` : `services.html#${s.id}`}">
        ${detailed ? "اطلب الخدمة" : "اعرف أكتر"} ${icon("arrow")}
      </a>
    </article>`;

  const grid = $("#services-grid");
  if (grid) {
    const detailed = grid.dataset.detailed === "true";
    const limit = parseInt(grid.dataset.limit || "0", 10);
    const list = limit ? window.SERVICES.slice(0, limit) : window.SERVICES;
    grid.innerHTML = list.map((s) => serviceCard(s, detailed)).join("");

    const filters = $("#filters");
    if (filters) {
      filters.innerHTML = window.CATEGORIES.map((c, i) =>
        `<button class="filter ${i === 0 ? "is-active" : ""}" data-filter="${c.id}">${c.label}</button>`).join("");
      filters.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter");
        if (!btn) return;
        $$(".filter", filters).forEach((b) => b.classList.toggle("is-active", b === btn));
        const f = btn.dataset.filter;
        $$(".card", grid).forEach((c) => {
          c.classList.toggle("is-hidden", f !== "all" && c.dataset.cat !== f);
          c.classList.add("is-visible");
        });
      });
    }
  }

  /* ---------------- Marquee ---------------- */
  const marquee = $("#marquee");
  if (marquee) {
    const items = window.SERVICES.map((s) => `<span class="marquee__item">${s.title}</span>`).join("");
    marquee.innerHTML = items + items;
  }

  /* ---------------- Process / Stats / Work / Testimonials / FAQ ---------------- */
  const fill = (id, html) => { const el = $(id); if (el) el.innerHTML = html; };

  fill("#process", window.PROCESS.map((p) => `
    <div class="step reveal"><div class="step__n text-grad">${p.n}</div><h3>${p.title}</h3><p>${p.text}</p></div>`).join(""));

  fill("#stats", window.STATS.map((s) => `
    <div class="stat reveal"><div class="stat__value text-grad" data-count="${s.value}" data-suffix="${s.suffix}">0${s.suffix}</div><div class="stat__label">${s.label}</div></div>`).join(""));

  fill("#work-grid", window.WORK.map((w) => `
    <a class="work reveal" href="contact.html">
      <div class="work__art" style="background:linear-gradient(135deg,hsl(${w.hue} 80% 55%),hsl(${(w.hue + 60) % 360} 85% 45%))"></div>
      <div class="work__info"><h3>${w.title}</h3><span>${w.cat}</span></div>
    </a>`).join(""));

  fill("#testimonials", window.TESTIMONIALS.map((t) => `
    <figure class="quote reveal" style="margin:0">
      <div class="quote__stars">★★★★★</div>
      <p>“${t.text}”</p>
      <figcaption class="quote__who"><div class="avatar">${t.name.charAt(0)}</div><div><strong>${t.name}</strong><small>${t.role}</small></div></figcaption>
    </figure>`).join(""));

  fill("#faq", window.FAQ.map((f, i) => `
    <details class="reveal" ${i === 0 ? "open" : ""}><summary>${f.q}</summary><p>${f.a}</p></details>`).join(""));

  /* ---------------- Counters ---------------- */
  const animateCount = (el) => {
    const target = +el.dataset.count, suffix = el.dataset.suffix || "";
    const dur = 1600, start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* ---------------- Reveal on scroll ---------------- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-visible");
        $$("[data-count]", e.target).forEach(animateCount);
        if (e.target.dataset.count) animateCount(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 80}ms`;
      io.observe(el);
    });
  } else {
    $$(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  // Jump to a service anchor after rendering (services.html#seo)
  if (location.hash && $(location.hash)) {
    setTimeout(() => $(location.hash).scrollIntoView({ behavior: "smooth", block: "center" }), 150);
  }

  /* ---------------- Contact form ---------------- */
  const form = $("#contact-form");
  if (form) {
    const box = $("#service-checks");
    const preselected = new URLSearchParams(location.search).get("service");
    box.innerHTML = window.SERVICES.map((s) => `
      <label><input type="checkbox" name="services" value="${s.title}" ${s.id === preselected ? "checked" : ""}><span>${s.title}</span></label>`).join("");

    const validate = () => {
      let ok = true;
      $$("[required]", form).forEach((input) => {
        const field = input.closest(".field");
        const bad = !input.value.trim() || (input.type === "tel" && !/^[+\d\s()-]{7,}$/.test(input.value.trim()));
        field.classList.toggle("has-error", bad);
        if (bad) ok = false;
      });
      const services = $$('input[name="services"]:checked', form);
      box.closest(".field").classList.toggle("has-error", services.length === 0);
      if (!services.length) ok = false;
      if (!ok) { const first = $(".has-error", form); first && first.scrollIntoView({ behavior: "smooth", block: "center" }); }
      return ok;
    };

    const buildMessage = () => {
      const d = new FormData(form);
      const lines = [
        `مرحبا ${S.name} 👋`,
        `الاسم: ${d.get("name")}`,
        `الهاتف: ${d.get("phone")}`,
        d.get("company") ? `الشركة / النشاط: ${d.get("company")}` : null,
        `الخدمات المطلوبة: ${d.getAll("services").join("، ")}`,
        d.get("budget") ? `الميزانية التقريبية: ${d.get("budget")}` : null,
        "",
        `التفاصيل:`,
        d.get("message"),
      ];
      return lines.filter((l) => l !== null).join("\n");
    };

    $("#send-wa").addEventListener("click", () => {
      if (!validate()) return;
      window.open(waLink(buildMessage()), "_blank", "noopener");
    });

    $("#send-email").addEventListener("click", () => {
      if (!validate()) return;
      const subject = `طلب خدمة من ${new FormData(form).get("name")}`;
      location.href = `mailto:${S.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildMessage())}`;
    });

    form.addEventListener("submit", (e) => { e.preventDefault(); $("#send-wa").click(); });
    form.addEventListener("input", (e) => {
      const field = e.target.closest(".field");
      if (field) field.classList.remove("has-error");
    });
  }
})();
