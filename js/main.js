/* ============================================================
   LUCIANO REA — interazioni e animazioni
   GSAP + ScrollTrigger + Lenis
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   TRADUZIONE IT / EN
   Il contenuto in pagina è in italiano (default).
   Qui sotto solo le versioni inglesi, per chiave.
   ============================================================ */
const EN = {
  /* --- condivisi --- */
  "brand.sub": "Architecture · Consulting · Design",
  "nav.home": "Home",
  "nav.works": "Works",
  "nav.about": "About",
  "nav.process": "Process",
  "nav.contact": "Contact",
  "expertise.label": "Expertise",
  "exp.arch": "Architecture",
  "exp.interior": "Interior Design",
  "exp.outdoor": "Outdoor",
  "exp.landscape": "Landscape",
  "exp.furniture": "Furniture Design",
  "exp.consulting": "Consulting",
  "closing.l1": "Let's build",
  "closing.l2": "something meaningful.",
  "cta.contact": "Contact",

  /* --- home --- */
  "hero.label": "Architecture studio · Como / Sora",
  "hero.sub.a": "Architecture",
  "hero.sub.b": "Consulting",
  "hero.sub.c": "Design",
  "home.mani.l1": "Architecture is not",
  "home.mani.l2": "the construction of buildings.",
  "home.mani.l3": "It is the construction of <em>relationships</em>",
  "home.mani.l4": "between space, light and people.",
  "works.label": "Selected Works",
  "home.work.title": "Villa Como",
  "home.work.cat": "Project 01 · Residential",

  /* --- works --- */
  "works.hero.l1": "An exhibition,",
  "works.hero.l2": "one project at a time.",
  "proj01.idx": "Project 01", "proj01.title": "Villa Como", "proj01.cat": "Residential",
  "proj02.idx": "Project 02", "proj02.title": "Living Interior", "proj02.cat": "Interior Design",
  "proj03.idx": "Project 03", "proj03.title": "Pool House", "proj03.cat": "Outdoor · Landscape",
  "proj04.idx": "Project 04", "proj04.title": "Kitchen Study", "proj04.cat": "Interior · Custom",
  "proj05.idx": "Project 05", "proj05.title": "Stone Bathroom", "proj05.cat": "Interior · Material",
  "objects.label": "Featured Objects",

  /* --- about --- */
  "about.label": "About · Philosophy",
  "about.hero.l1": "A sober language,",
  "about.hero.l2": "precise, silent.",
  "about.mani.l1": "The studio works on the balance",
  "about.mani.l2": "between architecture, design and landscape:",
  "about.mani.l3": "essential spaces, authentic materials,",
  "about.mani.l4": "natural light, controlled proportions.",
  "phil.l1": "Every project",
  "phil.l2": "starts from listening.",
  "phil.w1": "Landscape",
  "phil.w2": "Light",
  "phil.w3": "Matter",
  "phil.w4": "Details",

  /* --- process --- */
  "process.label": "Process",
  "process.hero.l1": "Four gestures,",
  "process.hero.l2": "one single method.",
  "step01.name": "Listen",
  "step01.desc": "Every project starts from listening: to the place, the client, the value the intervention must protect over time.",
  "step02.name": "Observe",
  "step02.desc": "Reading the landscape, the light and the existing context defines the silent rules the project has to respect.",
  "step03.name": "Design",
  "step03.desc": "Concept, proportions, matter and detail: the drawing turns the relationships between space, light and people into buildable form.",
  "step04.name": "Build",
  "step04.desc": "Aesthetic direction and control of the detail through to delivery: the built work must coincide with the idea.",

  /* --- contact --- */
  "contact.h.l1": "Designing",
  "contact.h.l2": "essential",
  "contact.h.l3": "places.",
  "contact.tag": "Consulting & Design",
};

const i18nEls = document.querySelectorAll("[data-i18n]");
const itCache = new Map();
i18nEls.forEach((el) => itCache.set(el, el.innerHTML));

function applyLang(lang) {
  i18nEls.forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.innerHTML = lang === "en" && EN[key] != null ? EN[key] : itCache.get(el);
  });
  document.documentElement.lang = lang;
  document.querySelectorAll(".lang-code").forEach((c) => (c.textContent = lang.toUpperCase()));
  document.querySelectorAll("[data-lang-set]").forEach((b) =>
    b.setAttribute("aria-selected", b.dataset.langSet === lang));
  try { localStorage.setItem("site-lang", lang); } catch (e) {}
  ScrollTrigger.refresh();
}

let savedLang = "it";
try { if (localStorage.getItem("site-lang") === "en") savedLang = "en"; } catch (e) {}
applyLang(savedLang);

/* menù a tendina */
document.querySelectorAll("[data-lang]").forEach((wrap) => {
  const toggle = wrap.querySelector(".lang-toggle");
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = wrap.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  wrap.querySelectorAll("[data-lang-set]").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyLang(btn.dataset.langSet);
      wrap.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
});
document.addEventListener("click", () => {
  document.querySelectorAll(".lang.open").forEach((w) => {
    w.classList.remove("open");
    w.querySelector(".lang-toggle").setAttribute("aria-expanded", "false");
  });
});

/* ============================================================
   SMOOTH SCROLL (Lenis)
   ============================================================ */
const lenis = new Lenis({
  duration: 1.25,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* header: barra chiara e leggibile appena si scorre */
const siteHeader = document.querySelector("header");
const updateHeader = () => siteHeader.classList.toggle("scrolled", window.scrollY > 60);
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

/* ---------- menù mobile (hamburger) ---------- */
const menuToggle = document.querySelector(".menu-toggle");
if (menuToggle) {
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = document.body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", open);
    open ? lenis.stop() : lenis.start();
  });
  /* chiudi il menù quando si sceglie una pagina */
  document.querySelectorAll(".header-right nav a").forEach((a) => {
    a.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      lenis.start();
    });
  });
}

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
const cursor = document.querySelector(".cursor");
if (cursor && matchMedia("(pointer:fine)").matches) {
  const cx = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
  const cy = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });
  window.addEventListener("mousemove", (e) => { cx(e.clientX); cy(e.clientY); });

  document.querySelectorAll("[data-cursor]").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.querySelector("span").textContent = el.dataset.cursor;
      cursor.classList.add("is-view");
    });
    el.addEventListener("mouseleave", () => cursor.classList.remove("is-view"));
  });
}

/* ============================================================
   PAGE TRANSITION (sipario che scivola verso l'alto)
   Entrata: gestita in CSS (nessun flash).
   Uscita: il sipario risale da sotto e copre, poi si naviga.
   ============================================================ */
const pt = document.querySelector(".page-transition");
const ptLabel = pt.querySelector(".pt-label");

document.querySelectorAll("a[data-transition]").forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto") || href.startsWith("tel")) return;
    if (link.target === "_blank") return;
    e.preventDefault();
    pt.style.animation = "none";        // disattiva l'animazione d'entrata CSS
    ptLabel.textContent = link.dataset.transition || "";
    gsap.killTweensOf([pt, ptLabel]);
    gsap.timeline()
      .set(pt, { yPercent: 100 })
      .set(ptLabel, { opacity: 0 })
      .to(pt, { yPercent: 0, duration: 0.6, ease: "power4.inOut" })
      .to(ptLabel, { opacity: 1, duration: 0.25 }, "-=0.28")
      .add(() => { window.location.href = href; }, "+=0.08");
  });
});

/* back/forward (bfcache): rigioca l'apertura del sipario */
window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    pt.style.animation = "none";
    gsap.set(ptLabel, { opacity: 0 });
    gsap.fromTo(pt, { yPercent: 0 }, { yPercent: -100, duration: 1, ease: "power4.out" });
  }
});

/* ============================================================
   ANIMAZIONI SCROLL
   ============================================================ */

/* reveal: opacity + translateY + blur */
document.querySelectorAll("[data-reveal]").forEach((el) => {
  gsap.fromTo(el,
    { opacity: 0, y: 60, filter: "blur(8px)" },
    {
      opacity: 1, y: 0, filter: "blur(0px)",
      duration: 1.4, ease: "power3.out",
      delay: parseFloat(el.dataset.delay || 0),
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
});

/* text reveal con mask (righe che escono da sotto) */
document.querySelectorAll("[data-lines]").forEach((block) => {
  block.querySelectorAll(".l").forEach((line) => {
    const mask = document.createElement("span");
    mask.className = "line-mask";
    const inner = document.createElement("span");
    inner.className = "line-inner";
    line.parentNode.insertBefore(mask, line);
    mask.appendChild(inner);
    inner.appendChild(line);
  });
  gsap.to(block.querySelectorAll(".line-inner"), {
    y: 0, duration: 1.3, ease: "power4.out", stagger: 0.12,
    delay: parseFloat(block.dataset.delay || 0),
    scrollTrigger: { trigger: block, start: "top 85%" },
  });
});

/* hero: zoom-out + parallax allo scroll */
const heroMedia = document.querySelector(".hero-media");
if (heroMedia) {
  gsap.fromTo(heroMedia, { scale: 1.15 }, {
    scale: 1, yPercent: 12, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });

  if (matchMedia("(pointer:fine)").matches) {
    const mx = gsap.quickTo(heroMedia, "x", { duration: 1.2, ease: "power3" });
    const my = gsap.quickTo(heroMedia, "y", { duration: 1.2, ease: "power3" });
    window.addEventListener("mousemove", (e) => {
      mx((e.clientX / innerWidth - 0.5) * 14);
      my((e.clientY / innerHeight - 0.5) * 10);
    });
  }
}

/* immagini progetto: scale(1.15) -> scale(1) + parallax */
document.querySelectorAll(".work-media img, [data-scale] img").forEach((img) => {
  gsap.fromTo(img, { scale: 1.15, yPercent: -6 }, {
    scale: 1, yPercent: 6, ease: "none",
    scrollTrigger: { trigger: img.closest(".work-media, [data-scale]"),
      start: "top bottom", end: "bottom top", scrub: true },
  });
});

/* philosophy: linea verticale che cresce */
const philLine = document.querySelector(".phil-line");
if (philLine) {
  gsap.to(philLine, {
    scaleY: 1, ease: "none",
    scrollTrigger: { trigger: ".philosophy", start: "top 70%", end: "bottom 90%", scrub: true },
  });
}

/* expertise: le discipline compaiono una alla volta */
document.querySelectorAll(".expertise li").forEach((li, i) => {
  gsap.fromTo(li, { opacity: 0, y: 50 }, {
    opacity: 1, y: 0, duration: 1.1, ease: "power3.out", delay: (i % 3) * 0.08,
    scrollTrigger: { trigger: li, start: "top 92%" },
  });
});

/* process: i numeri compaiono mentre scorri */
document.querySelectorAll(".process-step").forEach((step) => {
  const tl = gsap.timeline({ scrollTrigger: { trigger: step, start: "top 65%" } });
  tl.fromTo(step.querySelector(".num"),
      { opacity: 0, y: 90, filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power4.out" })
    .fromTo(step.querySelector(".step-name"),
      { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=0.7")
    .fromTo(step.querySelector(".step-desc"),
      { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=0.6");
});

/* featured object: rotazione lenta e continua.
   Rotazione sull'immagine, parallax sul contenitore: nessun conflitto -> niente scatti. */
document.querySelectorAll(".object-media").forEach((obj) => {
  gsap.fromTo(obj, { yPercent: -6 }, {
    yPercent: 6, ease: "none",
    scrollTrigger: { trigger: obj, start: "top bottom", end: "bottom top", scrub: true },
  });
  const img = obj.querySelector("img");
  if (img) gsap.fromTo(img, { rotation: -5 }, {
    rotation: 5, duration: 16, yoyo: true, repeat: -1, ease: "sine.inOut",
  });
});

/* closing: parallax immagine enorme */
const closingMedia = document.querySelector(".closing-media");
if (closingMedia) {
  gsap.fromTo(closingMedia, { yPercent: -10, scale: 1.1 }, {
    yPercent: 6, scale: 1, ease: "none",
    scrollTrigger: { trigger: ".closing", start: "top bottom", end: "bottom top", scrub: true },
  });
}

/* nav: evidenzia pagina corrente */
const page = document.body.dataset.page;
document.querySelectorAll(`nav a[data-page="${page}"]`).forEach((a) => a.classList.add("active"));
