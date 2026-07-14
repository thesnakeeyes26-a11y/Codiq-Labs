// ── INTERACTIVE WEBPAGE LOGIC ──

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Initialize all modular elements
  initMobileNav();
  initServiceModals();

  initFAQs();
  initTestimonialSlider();
  initPortfolioModal();
});

// ── MOBILE NAVIGATION ──
function initMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const links = document.querySelector('.nav-links');
  const linkItems = document.querySelectorAll('.nav-link-item');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });

  linkItems.forEach(item => {
    item.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });
}

// ── SERVICE DETAIL MODALS ──
const servicesData = {
  automation: {
    eyebrow: "Service 01",
    title: "Work Automation",
    desc: "We design and deploy AI-powered automation systems that eliminate repetitive manual work from your business. From lead management to client communication — every workflow is custom-built for your exact needs, saving you hours every single day.",
    features: [
      "Email & WhatsApp auto-reply setup",
      "Lead capture & CRM integration (Notion, Google Sheets, HubSpot)",
      "Automated follow-up sequences",
      "Invoice & payment reminder automation",
      "Custom n8n / Make workflow building",
      "Ongoing system maintenance & optimization"
    ]
  },
  website: {
    eyebrow: "Service 02",
    title: "Website Development",
    desc: "We build premium, animated, mobile-responsive websites that convert visitors into clients. From first concept to live deployment, every site is custom-designed around your brand and built to perform at elite speeds.",
    features: [
      "Custom premium designs — no templates",
      "Smooth hardware-accelerated animations & scroll effects",
      "Mobile-first, fully responsive layouts",
      "Fast loading speeds & SEO-friendly markup structure",
      "Contact forms & automated lead capture systems",
      "Domain configuration & free hosting deployment setup"
    ]
  },
  video: {
    eyebrow: "Service 03",
    title: "App Development",
    desc: "We design and develop high-performance Android and web applications tailored to your business needs — from concept and UI/UX design to full deployment. Clean code, smooth animations, and seamless user experience.",
    features: [
      "Android app development (Java/Kotlin)",
      "Web app development (React, Next.js)",
      "Custom UI/UX design & smooth animations",
      "API integration & backend connectivity",
      "From idea to live deployment",
      "Ongoing support & maintenance"
    ]
  },
  voice: {
    eyebrow: "Service 04",
    title: "Voice Agent Services",
    desc: "Deploy intelligent AI voice agents that work 24/7—handling inbound customer queries, qualifying incoming cold leads, and scheduling appointments. Your agency stays responsive even when your human team is offline.",
    features: [
      "24/7 inbound AI customer call handling",
      "Lead qualification & scoring telephone calls",
      "Automated Google Calendar appointment scheduling",
      "Custom synthetic voice and agent personality setups",
      "Bi-lingual language support (Hindi + English)",
      "Call transcript logs, analytics & pipeline reporting"
    ]
  }
};

function initServiceModals() {
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!overlay || !closeBtn) return;

  // Global window functions to open modals from cards
  window.openModal = function(key) {
    const data = servicesData[key];
    if (!data) return;

    document.getElementById('modal-eyebrow').textContent = data.eyebrow;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-desc').textContent = data.desc;
    
    const featuresList = document.getElementById('modal-features');
    featuresList.innerHTML = data.features.map(f => `
      <li>
        <span class="feature-dot"></span>
        <span>${f}</span>
      </li>
    `).join('');

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  };

  window.closeModalDirect = function() {
    overlay.classList.remove('open');
    document.body.style.overflow = ''; // Unlock scroll
  };

  closeBtn.addEventListener('click', window.closeModalDirect);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      window.closeModalDirect();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeModalDirect();
    }
  });
}


// ── FAQ COLLAPSIBLE ACCORDIONS ──
function initFAQs() {
  const headers = document.querySelectorAll('.faq-header');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const parent = header.parentElement;
      const content = parent.querySelector('.faq-content');
      
      // Close other FAQs
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== parent && item.classList.contains('active')) {
          item.classList.remove('active');
          item.querySelector('.faq-content').style.height = '0px';
        }
      });

      // Toggle current FAQ
      const isActive = parent.classList.toggle('active');
      content.style.height = isActive ? `${content.scrollHeight}px` : '0px';
    });
  });
}

// ── TESTIMONIAL CAROUSEL ROTATOR ──
function initTestimonialSlider() {
  const slides = document.querySelectorAll('.testi-card');
  const dots = document.querySelectorAll('.testi-dot');
  let currentSlide = 0;
  let timer = null;

  if (slides.length === 0) return;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  }

  function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(nextSlide, 7000); // Rotate every 7 seconds
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-slide'));
      showSlide(idx);
      resetTimer();
    });
  });

  // Initialize auto-rotation
  resetTimer();
}


// ── PORTFOLIO LIGHTBOX MODAL ──
function initPortfolioModal() {
  const overlay = document.getElementById('portfolio-modal-overlay');
  const closeBtn = document.getElementById('portfolio-modal-close-btn');
  const mediaContainer = document.getElementById('portfolio-modal-media');
  const titleEl = document.getElementById('portfolio-modal-title');
  const tagsEl = document.getElementById('portfolio-modal-tags');
  const descEl = document.getElementById('portfolio-modal-desc');

  if (!overlay || !closeBtn || !mediaContainer || !titleEl || !tagsEl || !descEl) return;

  const portfolioItems = document.querySelectorAll('.portfolio-item');

  portfolioItems.forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const title = item.querySelector('h4')?.textContent?.trim() || '';
      const desc = item.querySelector('.portfolio-info p')?.textContent?.trim() || '';
      const tags = Array.from(item.querySelectorAll('.project-tags span')).map(span => span.textContent.trim());
      const images = Array.from(item.querySelectorAll('.portfolio-preview img'));

      titleEl.textContent = title;
      descEl.textContent = desc;
      tagsEl.innerHTML = tags.map(tag => `<span>${tag}</span>`).join('');

      if (images.length > 0) {
        mediaContainer.innerHTML = `
          <div class="portfolio-modal-gallery">
            ${images.map(img => `<img src="${img.getAttribute('src')}" alt="${img.getAttribute('alt') || title}">`).join('')}
          </div>
        `;
      } else {
        mediaContainer.innerHTML = '';
      }

      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closePortfolioModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closePortfolioModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closePortfolioModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePortfolioModal();
    }
  });
}
