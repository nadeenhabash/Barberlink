// CURSOR HIGHLIGHT 
const highlight = document.querySelector(".cursor-highlight");

document.addEventListener("mousemove", (e) => {
  highlight.style.top  = e.clientY + "px";
  highlight.style.left = e.clientX + "px";
});

document.querySelectorAll("a, button").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    highlight.style.transform  = "translate(-50%, -50%) scale(2.5)";
    highlight.style.background = "rgba(255, 0, 0, 0.52)";
  });
  el.addEventListener("mouseleave", () => {
    highlight.style.transform  = "translate(-50%, -50%) scale(1)";
    highlight.style.background = "rgba(255, 0, 0, 0.87)";
  });
});

//  BARBERLINK LOGO ANIMATION 
window.addEventListener("load", function () {
  setTimeout(function () {
    document.querySelectorAll(".letter").forEach((l) => l.classList.remove("initial"));
    document.querySelectorAll(".tool-img").forEach((t) => t.classList.add("show"));
  }, 1500);
});

//ABOUT SECTION ANIMATIONS 

function letterDrop() {
  const h1  = document.querySelector(".about-title");
  const arr = h1.textContent.split("");

  h1.textContent = "";
  h1.classList.add("ready");

  arr.forEach((char) => {
    const delay = Math.floor(Math.random() * 9) + 1;
    const span  = document.createElement("span");
    span.className = `letterDrop ld${delay}`;
    span.innerHTML = char === " " ? "&nbsp;" : char;
    h1.appendChild(span);
  });
}

function animateParagraph() {
  const text = document.getElementById("about-text");
  if (!text) return;

  text.classList.add("ready");

  setTimeout(() => {
    const shopBtn     = document.querySelector(".about-title-section .cta-container");
    const aboutSection = document.querySelector(".about-title-section");

    if (shopBtn)      shopBtn.classList.add("show");
    if (aboutSection) aboutSection.classList.add("line-show");

    // Highlight animation — starts 0.5s after paragraph appears
    setTimeout(() => {
      document.querySelectorAll(".highlight-on-scroll").forEach((el) =>
        el.classList.add("highlighted")
      );
    }, 500);

    // Reveal testimonials, then footer
    setTimeout(() => {
      const testimonials = document.querySelector(".testimonial-area");
      if (testimonials) testimonials.classList.add("fade-in");

      setTimeout(() => {
        const footer = document.querySelector(".footer-contact");
        if (footer) footer.classList.add("fade-in");
      }, 800);
    }, 600);
  }, 1000);
}

const aboutObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      // Reset all animated state
      const text         = document.getElementById("about-text");
      const shopBtn      = document.querySelector(".about-title-section .cta-container");
      const aboutSection = document.querySelector(".about-title-section");

      if (text)         text.classList.remove("ready");
      if (shopBtn)      shopBtn.classList.remove("show");
      if (aboutSection) aboutSection.classList.remove("line-show");
      document.querySelectorAll(".highlight-on-scroll").forEach((el) =>
        el.classList.remove("highlighted")
      );

      // Trigger animations
      letterDrop();
      setTimeout(animateParagraph, 1800);

      aboutObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.001 }
);

const aboutTitle = document.querySelector(".about-title-section");
if (aboutTitle) aboutObserver.observe(aboutTitle);

//TESTIMONIALS CAROUSEL 
const CAROUSEL_CONFIG = {
  loop: true,
  items: 2,
  margin: 50,
  dots: true,
  nav: false,
  mouseDrag: true,
  autoplay: true,
  autoplayTimeout: 3000,
  smartSpeed: 800,
};

$(".testimonial-content").owlCarousel(CAROUSEL_CONFIG);

function loadTestimonialsFromAdmin() {
  const stored = localStorage.getItem("barberlink_testimonials");
  if (!stored) return;

  try {
    const testimonials = JSON.parse(stored);
    const container    = document.querySelector(".testimonial-content");

    if (!container || testimonials.length === 0) return;

    $(container).owlCarousel("destroy");
    container.innerHTML = "";

    testimonials.forEach((t) => {
      container.insertAdjacentHTML("beforeend", `
        <div class="single-testimonial">
          <div class="round-1 round"></div>
          <div class="round-2 round"></div>
          <p>${escapeHTML(t.review)}</p>
          <div class="client-info">
            <div class="client-details">
              <h6>${escapeHTML(t.name)}</h6>
              <span>${escapeHTML(t.role)}</span>
            </div>
          </div>
        </div>
      `);
    });

    $(container).owlCarousel(CAROUSEL_CONFIG);
  } catch (error) {
    console.error("Error loading testimonials:", error);
  }
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

setTimeout(loadTestimonialsFromAdmin, 200);

//COMING SOON MODAL 
document.addEventListener("DOMContentLoaded", function () {
  const csOverlay  = document.getElementById("csOverlay");
  const csClose    = document.getElementById("csClose");
  const shopNavLink = document.getElementById("shopNavLink");
  const shopNowBtn  = document.getElementById("shopNowBtn");

  if (!csOverlay) return;

  function openComingSoon(e) {
    e.preventDefault();
    csOverlay.classList.add("active");
  }

  function closeComingSoon() {
    csOverlay.classList.remove("active");
  }

  if (shopNavLink) shopNavLink.addEventListener("click", openComingSoon);
  if (shopNowBtn)  shopNowBtn.addEventListener("click",  openComingSoon);
  if (csClose)     csClose.addEventListener("click",     closeComingSoon);

  csOverlay.addEventListener("click", (e) => {
    if (e.target === csOverlay) closeComingSoon();
  });
});

// NAV SCROLL EFFECT 
window.addEventListener("scroll", function () {
  document.querySelector("nav").classList.toggle("scrolled", window.scrollY > 50);
});