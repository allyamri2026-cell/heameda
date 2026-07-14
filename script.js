/* ============================================================
   Heameda Hospital — interactivity
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Data ---------- */
  const departments = [
    { name: "Gynecology & Obstetrics", desc: "Pregnancy care, safe delivery and women's health.", icon: '<path d="M12 3a5 5 0 0 0-1 9.9V16H9v2h2v3h2v-3h2v-2h-2v-3.1A5 5 0 0 0 12 3z"/>' },
    { name: "Dialysis & Nephrology", desc: "Hemodialysis and comprehensive kidney care.", icon: '<path d="M12 3s7 6.5 7 11a7 7 0 0 1-14 0c0-4.5 7-11 7-11z"/>' },
    { name: "General Surgery", desc: "General and specialist surgical procedures.", icon: '<path d="M14 3l7 7-9 9-4 1 1-4z"/><path d="M4 20l4-4"/>' },
    { name: "General Medicine", desc: "Primary care, checkups and chronic-condition care.", icon: '<path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z"/>' },
    { name: "Physiotherapy", desc: "Rehabilitation and pain management.", icon: '<circle cx="12" cy="5" r="2"/><path d="M12 8v5m0 0-3 6m3-6 3 6m-6-9h6"/>' },
    { name: "Oncology", desc: "Cancer diagnosis and treatment with dignity.", icon: '<path d="M12 2v20M2 12h20" /><circle cx="12" cy="12" r="4"/>' },
    { name: "Radiology & Diagnostics", desc: "Laboratory and imaging services on-site.", icon: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 3v18M16 3v18M4 9h16M4 15h16"/>' },
    { name: "Emergency Care", desc: "24/7 emergency and critical care.", icon: '<path d="M12 3v18M3 12h18"/>' },
  ];

  /* NOTE: The source website lists only the CEO by name. The other entries are
     department teams (not invented individuals) — replace with real consultants. */
  const doctors = [
    { name: "Dr. Hery Mwandolela", spec: "General Medicine", exp: "Chief Executive Officer", color: "#075E68" },
    { name: "Cardiology Team", spec: "Cardiology", exp: "ECG, Echo, angiography & cath lab", color: "#0d8a8a" },
    { name: "Dialysis Team", spec: "Dialysis & Nephrology", exp: "Hemodialysis & kidney care", color: "#3a6ea5" },
    { name: "Maternity Team", spec: "Gynecology & Obstetrics", exp: "Pregnancy & delivery services", color: "#c26a2b" },
    { name: "Surgical Team", spec: "General Surgery", exp: "General & specialist surgery", color: "#7a3fa0" },
    { name: "Physiotherapy Team", spec: "Physiotherapy", exp: "Rehabilitation & pain management", color: "#2b8a7a" },
  ];

  const stories = [
    { text: "“The cardiac team was calm and thorough. From ECG to treatment, I felt genuinely cared for.”", meta: "Cardiology patient" },
    { text: "“My dialysis sessions are smooth and the nurses always greet me with a smile. Truly reassuring.”", meta: "Dialysis patient" },
    { text: "“Safe delivery and wonderful maternity care. The staff supported us every step of the way.”", meta: "Maternity patient" },
  ];

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const initials = (name) => name.replace("Dr. ", "").split(" ").map((w) => w[0]).join("").slice(0, 2);

  /* ---------- Render department tiles ---------- */
  const deptsGrid = $("#deptsGrid");
  if (deptsGrid) {
    deptsGrid.innerHTML = departments.map((d) => `
      <a class="dept-tile" href="#appointment">
        <span class="dept-tile__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${d.icon}</svg></span>
        <h3>${d.name}</h3>
        <p>${d.desc}</p>
        <span class="dept-tile__go">Book now →</span>
      </a>`).join("");
  }

  /* ---------- Team: render + filter ---------- */
  const doctorsGrid = $("#doctorsGrid");
  const doctorSearch = $("#doctorSearch");
  const doctorFilter = $("#doctorFilter");
  const doctorsEmpty = $("#doctorsEmpty");

  function renderDoctors() {
    if (!doctorsGrid) return;
    const q = (doctorSearch.value || "").trim().toLowerCase();
    const spec = doctorFilter.value;
    const list = doctors.filter((d) => (!q || d.name.toLowerCase().includes(q)) && (!spec || d.spec === spec));
    doctorsEmpty.hidden = list.length > 0;
    doctorsGrid.hidden = list.length === 0;
    doctorsGrid.innerHTML = list.map((d) => `
      <article class="doctor">
        <div class="doctor__avatar" style="background:${d.color}" aria-hidden="true">${initials(d.name)}</div>
        <h3>${d.name}</h3>
        <div class="doctor__spec">${d.spec}</div>
        <div class="doctor__meta">${d.exp}</div>
        <a class="btn btn--soft" href="#appointment" data-spec="${d.spec}">Book Appointment</a>
      </article>`).join("");
  }
  if (doctorsGrid) {
    renderDoctors();
    doctorSearch.addEventListener("input", renderDoctors);
    doctorFilter.addEventListener("change", renderDoctors);
    doctorsGrid.addEventListener("click", (e) => {
      const link = e.target.closest("a[data-spec]");
      if (link) { const dept = $("#department"); if (dept) dept.value = link.dataset.spec; }
    });
  }

  /* ---------- Mobile navigation ---------- */
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");
  const navScrim = $("#navScrim");
  if (navToggle && navLinks) {
    const openNav = () => {
      navLinks.classList.add("is-open");
      navToggle.setAttribute("aria-expanded", "true");
      navScrim.hidden = false;
      document.documentElement.classList.add("nav-open");
    };
    const closeNav = () => {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navScrim.hidden = true;
      document.documentElement.classList.remove("nav-open");
    };
    navToggle.addEventListener("click", () =>
      navLinks.classList.contains("is-open") ? closeNav() : openNav()
    );
    navScrim.addEventListener("click", closeNav);
    navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNav(); });
  }

  /* ---------- Sticky nav elevation ---------- */
  const nav = $("[data-nav]");
  if (nav) {
    const onScroll = () => nav.classList.toggle("is-stuck", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Scrollspy (active nav link) ---------- */
  const spyLinks = Array.from(document.querySelectorAll('.nav__links > a[href^="#"]'));
  const spyTargets = spyLinks
    .map((a) => { const id = a.getAttribute("href").slice(1); return id ? document.getElementById(id) : null; })
    .filter(Boolean);
  if (spyTargets.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        spyLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    spyTargets.forEach((t) => spy.observe(t));
  }

  /* ---------- Plan Your Visit → prefill booking form ---------- */
  const planForm = $("#planForm");
  if (planForm) {
    const today = new Date().toISOString().split("T")[0];
    const planDate = $("#planDate"); if (planDate) planDate.min = today;
    planForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const map = { "#planDept": "#department", "#planDate": "#date", "#planTime": "#time" };
      Object.entries(map).forEach(([from, to]) => {
        const src = $(from), dst = $(to);
        if (src && dst && src.value) dst.value = src.value;
      });
      const dept = $("#department");
      document.getElementById("appointment").scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => { const f = $("#fullName"); if (f) f.focus(); }, 500);
    });
  }

  /* ---------- Appointment form ---------- */
  const form = $("#appointmentForm");
  const success = $("#formSuccess");
  const submitBtn = $("#bookSubmit");

  const setError = (name, msg) => {
    const input = form.elements[name];
    const slot = form.querySelector(`.field__error[data-for="${name}"]`);
    if (slot) slot.textContent = msg || "";
    if (input) {
      input.classList.toggle("is-invalid", Boolean(msg));
      input.setAttribute("aria-invalid", msg ? "true" : "false");
    }
  };

  const validators = {
    fullName: (v) => (v.trim().length < 2 ? "Please enter your full name." : ""),
    phone: (v) => (!/[0-9]{7,}/.test(v.replace(/\D/g, "")) ? "Enter a valid phone number." : ""),
    email: (v) => (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email address." : ""),
    department: (v) => (!v ? "Please choose a department." : ""),
    date: (v) => {
      if (!v) return "Please pick a date.";
      const picked = new Date(v + "T00:00:00");
      const today = new Date(); today.setHours(0, 0, 0, 0);
      return picked < today ? "Please pick a future date." : "";
    },
    consent: (v, el) => (!el.checked ? "Consent is required to proceed." : ""),
  };

  if (form) {
    const dateEl = form.elements.date;
    if (dateEl) dateEl.min = new Date().toISOString().split("T")[0];

    Object.keys(validators).forEach((name) => {
      const el = form.elements[name];
      if (!el) return;
      const ev = el.type === "checkbox" ? "change" : "input";
      el.addEventListener(ev, () => { const msg = validators[name](el.value, el); if (!msg) setError(name, ""); });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let firstInvalid = null;
      Object.keys(validators).forEach((name) => {
        const el = form.elements[name];
        const msg = validators[name](el.value, el);
        setError(name, msg);
        if (msg && !firstInvalid) firstInvalid = el;
      });
      if (firstInvalid) { firstInvalid.focus(); success.hidden = true; return; }

      /* Honest submission: no backend is configured, so we open the patient's
         email client with the request pre-filled to the hospital. */
      submitBtn.classList.add("is-loading");
      const g = (n) => (form.elements[n] ? form.elements[n].value.trim() : "");
      const firstName = g("fullName").split(" ")[0];
      const body = [
        `Name: ${g("fullName")}`,
        `Phone: ${g("phone")}`,
        `Email: ${g("email")}`,
        `Department: ${g("department")}`,
        `Preferred date: ${g("date")}`,
        `Preferred time: ${g("time") || "No preference"}`,
        `Reason: ${g("reason") || "—"}`,
      ].join("\n");
      const mailto =
        "mailto:info@heameda-hospital.co.tz" +
        "?subject=" + encodeURIComponent(`Appointment request — ${g("department")}`) +
        "&body=" + encodeURIComponent(body);

      setTimeout(() => {
        submitBtn.classList.remove("is-loading");
        success.hidden = false;
        success.textContent = `Thank you, ${firstName}. Your email app is opening with your ${g("department")} request addressed to info@heameda-hospital.co.tz — press send and our team will contact you to confirm.`;
        success.scrollIntoView({ behavior: "smooth", block: "center" });
        window.location.href = mailto;
      }, 650);
    });
  }

  /* ---------- Patient stories (manual) ---------- */
  const storyText = $("#storyText");
  const storyMeta = $("#storyMeta");
  const storyDots = Array.from(document.querySelectorAll(".stories__dot"));
  if (storyText && storyDots.length) {
    storyDots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const i = +dot.dataset.story;
        storyText.textContent = stories[i].text;
        storyMeta.textContent = stories[i].meta;
        storyDots.forEach((d) => d.classList.toggle("is-active", d === dot));
      });
    });
  }

  /* ---------- FAQ accordion (single open) ---------- */
  const faqBtns = Array.from(document.querySelectorAll(".faq__q"));
  faqBtns.forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      faqBtns.forEach((b) => {
        const p = document.getElementById(b.getAttribute("aria-controls"));
        b.setAttribute("aria-expanded", "false");
        if (p) p.style.maxHeight = null;
      });
      if (!isOpen) {
        btn.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const reveals = Array.from(document.querySelectorAll(".reveal"));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); obs.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Footer year ---------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
