gsap.registerPlugin(ScrollTrigger, SplitText);

const heroName = document.getElementById("hero-name");
const logoSlot = document.querySelector(".nav__logo-slot");
const nav = document.querySelector(".nav");

// ===========================================================
// PRELOADER
// Splits the hero name into letters and reuses them as the
// loading mark, so the preloader and the hero entrance feel
// like one continuous motion instead of two separate animations.
// ===========================================================
function runPreloader(onDone) {
  const mark = document.getElementById("preloader-mark");
  const name = heroName.textContent.trim();

  mark.innerHTML = "";
  [...name].forEach((char) => {
    const span = document.createElement("span");
    span.className = "preloader__letter";
    span.textContent = char === " " ? "\u00A0" : char;
    mark.appendChild(span);
  });

  const tl = gsap.timeline({
    onComplete: () => {
      document.body.classList.remove("is-loading");
      onDone();
    }
  });

  tl.fromTo(".preloader__letter",
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: "power2.out" }
  )
    .to(".preloader__letter", {
      opacity: 0,
      duration: 0.3,
      stagger: 0.02
    }, "+=0.25")
    .to(".preloader", {
      yPercent: -100,
      duration: 0.6,
      ease: "power3.inOut"
    }, "-=0.1");
}


function initCustomCursor() {
  const lead = document.querySelector(".cursor-blob--lead");
  const trail = document.querySelector(".cursor-blob--trail");
  if (!lead || !trail || window.matchMedia("(hover: none)").matches) return;

  const moveLeadX = gsap.quickTo(lead, "x", { duration: 0.1, ease: "power3.out" });
  const moveLeadY = gsap.quickTo(lead, "y", { duration: 0.1, ease: "power3.out" });
  const moveTrailX = gsap.quickTo(trail, "x", { duration: 0.22, ease: "power3.out" });
  const moveTrailY = gsap.quickTo(trail, "y", { duration: 0.22, ease: "power3.out" });

  window.addEventListener("mousemove", (e) => {
    moveLeadX(e.clientX);
    moveLeadY(e.clientY);
    moveTrailX(e.clientX);
    moveTrailY(e.clientY);
  });

  document.querySelectorAll("a, button, .btn").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      gsap.to([lead, trail], { scale: 1.7, duration: 0.3, ease: "back.out(2)" });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to([lead, trail], { scale: 1, duration: 0.3, ease: "power2.out" });
    });
  });
}


function initPawTrail() {
  if (window.matchMedia("(hover: none)").matches) return;

  const pawSVG = `<svg viewBox="0 0 24 24" fill="currentColor">
    <ellipse cx="12" cy="16" rx="6" ry="5"/>
    <ellipse cx="5" cy="8" rx="2.2" ry="3"/>
    <ellipse cx="10.5" cy="5" rx="2.2" ry="3"/>
    <ellipse cx="16" cy="5.5" rx="2.2" ry="3"/>
    <ellipse cx="20" cy="9.5" rx="2.2" ry="3"/>
  </svg>`;

  let lastStamp = 0;
  let toggleSide = 1;

  window.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastStamp < 260) return;
    lastStamp = now;

    const paw = document.createElement("div");
    paw.className = "paw-print";
    paw.innerHTML = pawSVG;
    paw.style.transform = `translate(${e.clientX - 8 + toggleSide * 6}px, ${e.clientY - 8}px) rotate(${toggleSide * 20}deg)`;
    toggleSide *= -1;
    document.body.appendChild(paw);

    gsap.to(paw, {
      opacity: 0.35,
      duration: 0.15,
      onComplete: () => {
        gsap.to(paw, {
          opacity: 0,
          duration: 0.8,
          delay: 0.3,
          onComplete: () => paw.remove()
        });
      }
    });
  });
}


function initMascot() {
  const mascot = document.getElementById("mascot");
  const bird = document.getElementById("mascot-bird");
  if (!mascot) return;

  gsap.set(mascot, { transformOrigin: "50% 100%" });
  gsap.to(mascot, {
    y: -6,
    rotate: -2,
    duration: 1.4,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });

  if (bird) {
    gsap.set(bird, { transformOrigin: "50% 100%" });
    gsap.to(bird, {
      y: -8,
      rotate: 4,
      duration: 1.1,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });
  }

  document.querySelectorAll("section").forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      onEnter: () => {
        gsap.fromTo(mascot,
          { rotate: -8 },
          { rotate: 0, duration: 0.5, ease: "back.out(3)" }
        );
      }
    });
  });

  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      gsap.fromTo(mascot,
        { y: -18 },
        { y: -6, duration: 0.6, ease: "bounce.out" }
      );
    });
  });
}

function initMagnetic() {
  if (window.matchMedia("(hover: none)").matches) return;

  document.querySelectorAll(".btn, .nav__links a, .card__link").forEach((el) => {
    const strength = el.classList.contains("btn") ? 0.35 : 0.5;

    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.3, ease: "power2.out" });
    });

    el.addEventListener("mouseleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    });
  });
}


function initTextReveals() {
  document.querySelectorAll(".section-title").forEach((title) => {
    const split = new SplitText(title, { type: "lines", linesClass: "split-line" });
    gsap.from(split.lines, {
      yPercent: 110,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.08,
      scrollTrigger: {
        trigger: title,
        start: "top 85%"
      }
    });
  });

  document.querySelectorAll(".about__text, .contact__desc").forEach((para) => {
    const split = new SplitText(para, { type: "words", wordsClass: "split-word" });
    gsap.from(split.words, {
      opacity: 0,
      y: 10,
      duration: 0.5,
      stagger: 0.015,
      ease: "power2.out",
      scrollTrigger: {
        trigger: para,
        start: "top 85%"
      }
    });
  });
}


function initCards() {
  gsap.from(".card", {
    opacity: 0,
    y: 40,
    duration: 0.7,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".grid",
      start: "top 80%"
    }
  });

  if (window.matchMedia("(hover: none)").matches) return;

  document.querySelectorAll(".card").forEach((card) => {
    const rotateX = gsap.quickTo(card, "rotateX", { duration: 0.4, ease: "power2.out" });
    const rotateY = gsap.quickTo(card, "rotateY", { duration: 0.4, ease: "power2.out" });

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      rotateY(px * 14);
      rotateX(py * -14);
    });

    card.addEventListener("mouseleave", () => {
      rotateX(0);
      rotateY(0);
    });
  });
}


function initShrinkEffect() {
  if (!heroName || !logoSlot || !nav) return;

  let scrollTween = null;

  function buildShrinkTween() {
    if (scrollTween) {
      scrollTween.scrollTrigger && scrollTween.scrollTrigger.kill();
      scrollTween.kill();
    }

    gsap.set(heroName, { clearProps: "transform,position,top,left,width" });

    const nameRect = heroName.getBoundingClientRect();
    const slotRect = logoSlot.getBoundingClientRect();

    gsap.set(heroName, {
      position: "fixed",
      top: nameRect.top,
      left: nameRect.left,
      margin: 0,
      zIndex: 60,
      x: 0,
      y: 0,
      scale: 1
    });

    const scale = slotRect.height / nameRect.height;
    const deltaX = slotRect.left - nameRect.left;
    const deltaY = slotRect.top - nameRect.top;

    scrollTween = gsap.to(heroName, {
      x: deltaX,
      y: deltaY,
      scale: scale,
      ease: "none",
      scrollTrigger: {
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        scrub: true,
        onLeave: () => nav.classList.add("nav--scrolled"),
        onEnterBack: () => nav.classList.remove("nav--scrolled")
      }
    });
  }

  buildShrinkTween();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildShrinkTween, 200);
  });
}

// ===========================================================
// ENTRANCE + INIT
// ===========================================================
function runEntrance() {
  gsap.from(".js-fade", {
    opacity: 0,
    y: 16,
    duration: 0.6,
    stagger: 0.12,
    ease: "power2.out"
  });

  gsap.from(heroName, {
    opacity: 0,
    y: 16,
    duration: 0.6,
    ease: "power2.out",
    onComplete: initShrinkEffect
  });

  gsap.from(".mascot", {
    opacity: 0,
    scale: 0.6,
    duration: 0.6,
    delay: 0.4,
    ease: "back.out(2)"
  });
}

document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    gsap.to(card, { y: -6, duration: 0.35, ease: "back.out(2)" });
  });
  card.addEventListener("mouseleave", () => {
    gsap.to(card, { y: 0, duration: 0.35, ease: "power2.out" });
  });
});

document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    gsap.fromTo(
      btn,
      { scale: 0.94 },
      { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" }
    );
  });
});

runPreloader(() => {
  runEntrance();
  initCustomCursor();
  initPawTrail();
  initMascot();
  initMagnetic();
  initTextReveals();
  initCards();
});