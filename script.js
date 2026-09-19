const header = document.getElementById("siteHeader");
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const sections = Array.from(document.querySelectorAll("main section[id]"));
const contactForm = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const heroVisual = document.querySelector(".hero-visual");
const projectCards = Array.from(document.querySelectorAll(".project-card"));

requestAnimationFrame(() => {
  document.body.classList.add("page-ready");
});

function setHeaderState() {
  header.classList.toggle("scrolled", window.scrollY > 12);
}

function closeMenu() {
  document.body.classList.remove("menu-open");
  navMenu.classList.remove("open");
  header.classList.remove("menu-active");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-label", "Open menu");
}

function toggleMenu() {
  const isOpen = navMenu.classList.toggle("open");
  document.body.classList.toggle("menu-open", isOpen);
  header.classList.toggle("menu-active", isOpen);
  menuBtn.setAttribute("aria-expanded", String(isOpen));
  menuBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
}

menuBtn.addEventListener("click", toggleMenu);
navLinks.forEach(link => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

sections.forEach(section => activeObserver.observe(section));

const revealItems = Array.from(document.querySelectorAll(".reveal"));

if (prefersReducedMotion) {
  revealItems.forEach(item => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealItems.forEach(item => revealObserver.observe(item));

  let ticking = false;

  function updateMotion() {
    const scrollY = window.scrollY;

    if (heroVisual) {
      const lift = Math.max(-34, Math.min(16, scrollY * -0.045));
      heroVisual.style.setProperty("--hero-lift", `${lift}px`);
    }

    projectCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const viewportMid = window.innerHeight / 2;
      const cardMid = rect.top + rect.height / 2;
      const distance = (cardMid - viewportMid) / window.innerHeight;
      const lift = Math.max(-18, Math.min(18, distance * -28));
      card.style.setProperty("--card-lift", `${lift.toFixed(2)}px`);
    });

    ticking = false;
  }

  function requestMotionUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateMotion);
  }

  updateMotion();
  window.addEventListener("scroll", requestMotionUpdate, { passive: true });
  window.addEventListener("resize", requestMotionUpdate);
}

contactForm.addEventListener("submit", event => {
  event.preventDefault();

  const data = new FormData(contactForm);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();

  if (!name || !email || !message) {
    formMsg.textContent = "Please fill in your name, email, and message.";
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    formMsg.textContent = "Please enter a valid email address.";
    return;
  }

  const subject = `Portfolio enquiry from ${name}`;
  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;

  formMsg.textContent = "Opening your email app...";
  window.location.href = `mailto:kumarisagarika137@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
