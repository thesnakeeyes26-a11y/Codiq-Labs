// ── ADVANCED GSAP & LENIS SMOOTH-SCROLL ANIMATIONS ──

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Smooth Scrolling (Lenis)
  initLenis();

  // 2. Magnetic Hover Physics on Buttons
  initMagneticButtons();

  // 3. Hero Visual Spotlight Tracker
  initHeroSpotlight();

  // 4. ScrollTrigger Card reveals & Stagger animations
  initScrollReveals();

  // 5. ScrollTrigger Process Timeline Progress Bar
  initProcessTimeline();

  // 6. Navbar Active States & Hiding behavior on scroll down
  initNavbarBehavior();
});

// ── LENIS SMOOTH SCROLL ──
let lenis;
function initLenis() {
  if (typeof Lenis === 'undefined') return;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom ease out expo
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Link Lenis to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

// ── MAGNETIC BUTTONS ──
function initMagneticButtons() {
  const magnets = document.querySelectorAll('.btn-magnetic');
  if (magnets.length === 0) return;

  magnets.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      // Calculate cursor position relative to button center
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // Move button towards cursor (elastic spring pull)
      gsap.to(btn, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.4,
        ease: "power2.out"
      });
    });

    btn.addEventListener('mouseleave', () => {
      // Snap back to base position
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1.1, 0.4)"
      });
    });
  });
}

// ── HERO SPOTLIGHT TRACKER ──
function initHeroSpotlight() {
  const hero = document.getElementById('hero');
  const spotlight = document.getElementById('heroSpotlight');

  if (!hero || !spotlight) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gsap.to(spotlight, {
      left: x,
      top: y,
      duration: 0.3,
      ease: "power2.out"
    });
    spotlight.classList.add('active');
  });

  hero.addEventListener('mouseleave', () => {
    spotlight.classList.remove('active');
  });
}

// ── SCROLLTRIGGER CARD REVEALS ──
function initScrollReveals() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Hero Reveals
  const tlHero = gsap.timeline({ defaults: { ease: "power4.out" } });
  
  tlHero.from('.hero-eyebrow', {
    y: 30,
    opacity: 0,
    duration: 1.2,
    delay: 0.2
  })
  .from('.hero-title', {
    y: 50,
    opacity: 0,
    duration: 1.4
  }, "-=0.9")
  .from('.hero-subtitle', {
    y: 30,
    opacity: 0,
    duration: 1.2
  }, "-=1.0")
  .from('.hero-ctas', {
    y: 20,
    opacity: 0,
    duration: 1.0
  }, "-=1.0")
  .from('.hero-visual', {
    scale: 0.95,
    opacity: 0,
    duration: 1.6
  }, "-=1.2");

  // Section Headers Reveals
  const headers = document.querySelectorAll('#services .section-inner, #portfolio .section-inner, #pricing .section-inner, #why .section-inner, #process .section-inner, #testimonials .section-inner, #faq .section-inner, #contact .section-inner');
  
  headers.forEach(sec => {
    const title = sec.querySelector('.section-title');
    const eyebrow = sec.querySelector('.section-eyebrow');
    const subtitle = sec.querySelector('.section-sub');

    const tlSec = gsap.timeline({
      scrollTrigger: {
        trigger: sec,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });

    if (eyebrow) tlSec.from(eyebrow, { opacity: 0, y: 15, duration: 0.6 });
    if (title) tlSec.from(title, { opacity: 0, y: 25, duration: 0.8 }, "-=0.45");
    if (subtitle) tlSec.from(subtitle, { opacity: 0, y: 15, duration: 0.6 }, "-=0.5");
  });

  // Services Cards Stagger Reveal
  gsap.from('.services-grid .service-card', {
    scrollTrigger: {
      trigger: '.services-grid',
      start: "top 80%"
    },
    y: 60,
    opacity: 0,
    duration: 1.2,
    stagger: 0.15,
    ease: "power3.out"
  });

  // Portfolio items Reveal
  gsap.from('.portfolio-grid .portfolio-item', {
    scrollTrigger: {
      trigger: '.portfolio-grid',
      start: "top 80%"
    },
    y: 60,
    opacity: 0,
    duration: 1.2,
    stagger: 0.15,
    ease: "power3.out"
  });

  // Why Us Cards Reveal
  gsap.from('.why-grid .why-card', {
    scrollTrigger: {
      trigger: '.why-grid',
      start: "top 80%"
    },
    y: 40,
    opacity: 0,
    duration: 1.0,
    stagger: 0.1,
    ease: "power2.out"
  });

  // Pricing Estimator box scale-up reveal
  gsap.from('.pricing-calculator', {
    scrollTrigger: {
      trigger: '.pricing-calculator',
      start: "top 85%"
    },
    y: 50,
    scale: 0.98,
    opacity: 0,
    duration: 1.4,
    ease: "power3.out"
  });

  // Service Card mouse follow light coordinates calculations
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// ── PROCESS TIMELINE ACTIVE PROGRESS BAR ──
function initProcessTimeline() {
  const line = document.getElementById('process-timeline-bar');
  const steps = document.querySelectorAll('.process-step');
  
  if (!line || steps.length === 0) return;

  // Append the active colored progress bar inside the process line wrapper
  const activeLine = document.createElement('div');
  activeLine.style.position = 'absolute';
  activeLine.style.top = '0';
  activeLine.style.left = '0';
  activeLine.style.height = '100%';
  activeLine.style.width = '0%';
  activeLine.style.backgroundColor = 'var(--gold)';
  activeLine.style.boxShadow = '0 0 10px var(--gold)';
  line.appendChild(activeLine);

  // Link timeline width scaling to scroll position
  gsap.to(activeLine, {
    scrollTrigger: {
      trigger: '.process-grid',
      start: "top 70%",
      end: "bottom 70%",
      scrub: true,
      onUpdate: (self) => {
        // Toggle step nodes highlight based on completion threshold
        const progress = self.progress;
        steps.forEach((step, idx) => {
          const threshold = (idx) / (steps.length - 1);
          if (progress >= threshold - 0.05) {
            step.classList.add('active');
          } else {
            step.classList.remove('active');
          }
        });
      }
    },
    width: "100%",
    ease: "none"
  });
}

// ── NAVBAR BEHAVIORS ──
function initNavbarBehavior() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  let lastScrollY = window.scrollY;

  // Scroll logic to hide navbar on scroll down and reveal on scroll up
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Background blur toggling
    if (currentScrollY > 50) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }

    // Show/hide direction logic
    if (currentScrollY > lastScrollY && currentScrollY > 150) {
      nav.classList.add('nav-hidden');
    } else {
      nav.classList.remove('nav-hidden');
    }

    lastScrollY = currentScrollY;
  });

  // Track page scroll to highlight current active navigation items
  const navLinks = document.querySelectorAll('.nav-link-item');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let currentActive = "";
    const scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        currentActive = id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').substring(1);
      if (href === currentActive) {
        link.classList.add('active');
      }
    });
  });

}
