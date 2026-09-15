/* ============================================================
   1. NAVBAR SCROLL — header ko scroll par 'scrolled' class dena
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  const header = document.getElementById('siteHeader');

  const SCROLL_THRESHOLD = 70;

  function updateHeaderState() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeaderState);
  updateHeaderState();

  /* ============================================================
     2. HERO SLIDER — homepage hero banner slides ko auto-rotate karna
     ============================================================ */
  const heroSlides = document.querySelectorAll('#heroSlides .hero-slide');
  const HERO_INTERVAL = 6000;

  if (heroSlides.length) {
    let heroIndex = 0;

    setInterval(function () {
      const current = heroSlides[heroIndex];

      const frozenTransform = getComputedStyle(current).transform;
      current.style.animation = 'none';
      current.style.transform = frozenTransform;
      current.classList.remove('active');

      heroIndex = (heroIndex + 1) % heroSlides.length;
      const next = heroSlides[heroIndex];

      next.style.animation = 'none';
      next.style.transform = 'scale(1)';
      void next.offsetWidth;
      next.style.animation = '';
      next.style.transform = '';
      next.classList.add('active');
    }, HERO_INTERVAL);
  }

  /* ============================================================
     3. PACKAGES CAROUSEL (Bike / Car tabs) — homepage carousel data
     ============================================================ */
  const packagesData = {
    bike: [
      { title: "Motorbike Tour Ladakh – Khardung La & Pangong",            duration: "7 Days 6 Nights", img: "./images/img11.jpg", desc: "Ride through some of the world's highest motorable passes on a Royal Enfield, camping under starlit skies.", price: "31,000" },
      { title: "Spiti Valley Bike Expedition",                             duration: "8 Days 7 Nights", img: "./images/img5.jpg",  desc: "Cross rugged mountain trails and remote villages on two wheels through the cold desert.",                     price: "27,999" },
      { title: "Manali to Leh Biking Adventure",                           duration: "9 Days 8 Nights", img: "./images/img9.jpg",  desc: "A classic Himalayan biking route across five high-altitude mountain passes.",                                 price: "29,499" },
      { title: "Punjab Heritage Bike Ride",                                duration: "3 Days 2 Nights", img: "./images/img1.jpg",  desc: "A relaxed ride through mustard fields, old forts and roadside dhabas.",                                       price: "8,999" },
      { title: "Zanskar Valley Off-Road Biking Trail",                     duration: "10 Days 9 Nights",img: "./images/img7.jpg",  desc: "Remote monasteries and river crossings along one of the region's most raw biking trails.",                    price: "32,999" }
    ],
    car: [
      { title: "Manali–Leh–Srinagar Car Road Trip",                        duration: "11 Days 10 Nights", img: "./images/img9.jpg",  desc: "A comfortable self-drive journey across three of the Himalayas' most dramatic mountain passes.", price: "22,999" },
      { title: "Golden Triangle Car Tour – Delhi, Agra, Jaipur",           duration: "5 Days 4 Nights",   img: "./images/img3.jpg",  desc: "A private chauffeur-driven circuit through India's most iconic monuments.",                       price: "14,999" },
      { title: "Jammu to Srinagar Scenic Drive",                           duration: "4 Days 3 Nights",   img: "./images/img10.jpg", desc: "Cedar forests, cool hillside air and the winding road down into the valley.",                     price: "9,999" },
      { title: "Chandigarh & Punjab Countryside Drive",                    duration: "2 Days 1 Night",    img: "./images/img2.jpg",  desc: "A quiet, scenic drive through gardens, forts and open countryside.",                              price: "6,499" },
      { title: "Ladakh Umling La Car Expedition",                          duration: "12 Days 8 Nights",  img: "./images/img8.jpg",  desc: "A fully-supported drive to one of the world's highest motorable roads.",                          price: "24,999" }
    ]
  };

  const carouselEl = document.getElementById('packagesCarousel');
  const filterButtons = document.querySelectorAll('.filter-btn');
  let owl = null;

  // Ek package card ka HTML string banata hai (bike/car dono ke liye common)
  function cardHTML(pkg) {
    return `
      <div class="package-card">
        <div class="package-img">
          <img src="${pkg.img}" alt="${pkg.title}" onerror="this.src='https://placehold.co/400x300/1ea0fe/ffffff?text=Add+Photo'">
        </div>
        <div class="package-body">
        <h3 class="package-title">${pkg.title}</h3>
        <div class="package-desc">

        <p class="para">${pkg.desc}</p>
        </div>
        <div class="package-duration"><i class="bi bi-calendar3"></i> ${pkg.duration}</div>

          <div class="package-footer">
            <div>
              <span class="price-label">Total Price</span>
              <span class="price-value">₹${pkg.price}</span>
            </div>
     <a href="package-detail.html">   <button class="package-cta" aria-label="Book ${pkg.title}">
  <span class="btn-text">Book Now</span>
  <span class="package-cta-arrow"><i class="bi bi-send-fill"></i></span>
</button> </a>
          </div>
        </div>
      </div>`;
  }

  // Cards ko carousel container mein render karta hai + Owl Carousel init karta hai
  function renderCards(list) {
    if (typeof jQuery === 'undefined' || !jQuery.fn.owlCarousel) {
      carouselEl.innerHTML = list.map(cardHTML).join('');
      return;
    }

    const $carousel = jQuery(carouselEl);

    if (owl) {
      $carousel.trigger('destroy.owl.carousel');
      jQuery('#packagesNav').empty();
    }
    carouselEl.innerHTML = list.map(cardHTML).join('');

    $carousel.owlCarousel({
      loop: false,
      margin: 40,
      nav: true,
      navContainer: '#packagesNav',
      navText: [
        "<i class='bi bi-arrow-left'></i>",
        "<i class='bi bi-arrow-right'></i>"
      ],
      dots: true,
      responsive: {
        0:   { items: 1 },
        576: { items: 2 },
        992: { items: 3 }
      }
    });

    owl = true;
  }

  // Region (bike/car) ke hisaab se cards render karta hai
  function renderRegion(region) {
    renderCards(packagesData[region] || []);
  }

  /* ============================================================
     4. FILTER TABS + "VIEW ALL PACKAGES" BUTTON
     ============================================================ */
  const viewAllPackagesBtn = document.getElementById('viewAllPackagesBtn');

  const regionPageMap = {
    bike: 'bike-packages.html',
    car: 'car-packages.html'
  };

  // Active tab ke hisaab se "View All" button ka link update karta hai
  function updateViewAllLink(region) {
    if (viewAllPackagesBtn && regionPageMap[region]) {
      viewAllPackagesBtn.setAttribute('data-href', regionPageMap[region]);
    }
  }

  // Bike/Car filter buttons pe click handle karta hai
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      renderRegion(btn.dataset.region);
      updateViewAllLink(btn.dataset.region);
    });
  });

  updateViewAllLink('bike'); // default active tab on page load

  if (viewAllPackagesBtn) {
    viewAllPackagesBtn.addEventListener('click', function () {
      const target = viewAllPackagesBtn.getAttribute('data-href');
      if (target) {
        window.location.href = target;
      }
    });
  }

  if (carouselEl) {
    renderRegion('bike');
  }

  /* ============================================================
     5. FEATURED PACKAGES SECTION — homepage "Featured" grid
     ============================================================ */
  const featuredData = [
    { title: "Adventurous Ladakh Expedition 2026 with Umling La Pass", duration: "12 Days 8 Nights", img: "./images/img5.jpg", desc: "High-altitude lake camping under starlit skies, with panoramic views of Umling La, one of the world's highest motorable passes.", price: "18,999" },
    { title: "Leh Ladakh Tour Package 2026 with Tso Moriri", duration: "10 Days 9 Nights", img: "./images/img6.jpg", desc: "Sand dunes, double-humped camels and the still waters of Tso Moriri under an open, star-filled sky.", price: "21,499" },
    { title: "Ladakh Winter Adventure – Losar, New Year & Ice Hockey", duration: "9 Days 8 Nights", img: "./images/img7.jpg", desc: "Ring in the New Year on a frozen river, with Losar celebrations and a game of ice hockey along the way.", price: "24,999" },
    { title: "Leh Ladakh Adventure with Stok Village Experience 2026", duration: "8 Days 7 Nights", img: "./images/img8.jpg", desc: "A slower-paced route through Thiksey and Hemis, ending with a homestay in Stok village.", price: "16,499" },
    { title: "Manali–Leh–Srinagar Adventure Tour | Ultimate Himalayan Road Journey", duration: "11 Days 10 Nights", img: "./images/img9.jpg", desc: "One continuous road trip across three of the Himalayas' most dramatic mountain passes.", price: "22,999" },
    { title: "Kangyatse Expedition (6400Mts)", duration: "13 Days 12 Nights", img: "./images/img10.jpg", desc: "A proper high-altitude climb for first-time mountaineers, guided every step to the summit.", price: "1,80,000" },

  ];

  const featuredGrid = document.getElementById('featuredGrid');

  // Featured section ke liye card HTML banata hai
  function featuredCardHTML(pkg) {
    return `
      <div class="featured-card">
        <div class="featured-img">
          <img src="${pkg.img}" alt="${pkg.title}" onerror="this.src='https://placehold.co/500x400/1ea0fe/ffffff?text=Add+Photo'">
        </div>
        <div class="featured-body">
          <h3 class="featured-title">${pkg.title}</h3>
          <div class="featured-desc">
            <p class="para">${pkg.desc}</p>
          </div>
          <div class="featured-duration"><i class="bi bi-calendar3"></i> ${pkg.duration}</div>

          <div class="featured-footer">
            <div>
              <span class="price-label">Total Price</span>
              <span class="price-value">₹${pkg.price}</span>
            </div>

           <a href="package-detail.html">   <button class="package-cta" aria-label="Book ${pkg.title}">
  <span class="btn-text">Book Now</span>
  <span class="package-cta-arrow"><i class="bi bi-send-fill"></i></span>
</button> </a>

          </div>
        </div>
      </div>`;
  }

  if (featuredGrid) {
    featuredGrid.innerHTML = featuredData.map(featuredCardHTML).join('');
  }

  /* ============================================================
     6. SEASONAL PACKAGES SECTION — Spring/Summer/Autumn tabs
     ============================================================ */
  const seasonsData = {
    spring: [
      { title: "Markha Valley Trek", duration: "7 Days | 2 - 12 Persons", img: "./images/img1.jpg", desc: "A gentle valley trek through green villages and apricot orchards as the snow melts.", price: "56,000" },
      { title: "Ladakh Ultimate Riding Expedition", duration: "11 Days | 6 - 16 Persons", img: "./images/img9.jpg", desc: "Motorbike through freshly opened mountain passes before the summer rush sets in.", price: "1,91,000" },
      { title: "Sham Valley Baby Trek", duration: "5 Days | 2 - 14 Persons", img: "./images/img2.jpg", desc: "An easy introductory trek, perfect for first-timers exploring Ladakh in spring.", price: "38,500" },
      { title: "Stok Kangri Base Camp Trek", duration: "6 Days | 4 - 10 Persons", img: "./images/img10.jpg", desc: "Trek up to the base camp of Stok Kangri through quiet, uncrowded trails.", price: "62,000" }
    ],
    summer: [
      { title: "Kang Yatse 2 Expedition 2026", duration: "10 Days | 6 - 8 Persons", img: "./images/img5.jpg", desc: "A classic peak climb with clear summer skies and stable high-altitude weather.", price: "58,000" },
      { title: "Nun Peak Expedition", duration: "20 Days | 6 - 12 Persons", img: "./images/img7.jpg", desc: "A serious high-altitude climb, best attempted in the height of summer.", price: "1,82,000" },
      { title: "Chakula Kangri Expedition (6,534m)", duration: "10 Days | 4 - 12 Persons", img: "./images/img6.jpg", desc: "Summit views over the Ladakh range with warm, settled summer conditions.", price: "1,24,000" },
      { title: "Markha Valley Trek", duration: "7 Days | 2 - 12 Persons", img: "./images/img1.jpg", desc: "The valley in full bloom, with river crossings running at their summer flow.", price: "56,000" }
    ],
    autumn: [
      { title: "Chamser Kangri Expedition 2026", duration: "11 Days | 4 - 16 Persons", img: "./images/img8.jpg", desc: "Crisp autumn air and long visibility make this a favourite post-monsoon climb.", price: "1,02,000" },
      { title: "Ladakh Ultimate Riding Expedition", duration: "11 Days | 6 - 16 Persons", img: "./images/img9.jpg", desc: "Quieter roads and golden landscapes as the crowds thin out after summer.", price: "1,91,000" }
    ]
  };

  const seasonGrid = document.getElementById('seasonGrid');
  const seasonItems = document.querySelectorAll('.season-item');

  // Season section ke liye card HTML banata hai
  function seasonCardHTML(pkg) {
    return `
      <div class="package-card">
        <div class="package-img">
          <img src="${pkg.img}" alt="${pkg.title}" onerror="this.src='https://placehold.co/400x300/1ea0fe/ffffff?text=Add+Photo'">
        </div>
        <div class="package-body">
          <h3 class="package-title">${pkg.title}</h3>
          <div class="package-desc">
            <p class="para">${pkg.desc}</p>
          </div>
          <div class="package-duration"><i class="bi bi-calendar3"></i> ${pkg.duration}</div>

          <div class="package-footer">
            <div>
              <span class="price-label">Total Price</span>
              <span class="price-value">₹${pkg.price}</span>
            </div>
            <a href="package-detail.html">
            <button class="package-cta" aria-label="Book ${pkg.title}">
              <span class="btn-text">Book Now</span>
              <span class="package-cta-arrow"><i class="bi bi-send-fill"></i></span>
            </button>
            </a>
          </div>
        </div>
      </div>`;
  }

  // Selected season ke packages ko render karta hai
  function renderSeason(season) {
    if (!seasonGrid) return;
    const list = seasonsData[season] || [];
    seasonGrid.innerHTML = list.map(seasonCardHTML).join('');
  }

  // Season tabs (Spring/Summer/Autumn) pe click handle karta hai
  seasonItems.forEach(function (item) {
    item.addEventListener('click', function () {
      seasonItems.forEach(function (s) { s.classList.remove('active'); });
      item.classList.add('active');
      renderSeason(item.dataset.season);

      // Mobile/tablet pe grid tak auto-scroll kar deta hai
      if (window.innerWidth <= 992 && seasonGrid) {
        setTimeout(function () {
          seasonGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    });
  });

  if (seasonGrid) {
    renderSeason('spring');
  }

  /* ============================================================
     7. MOBILE MENU TOGGLE (Fullscreen Mega Menu / Offcanvas)
     ============================================================ */
  const menuToggle = document.getElementById('menuToggle');
  const megaMenu = document.getElementById('megaMenu');

  // Mega menu ko open/close karta hai (body scroll lock ke saath)
  function setMenuOpen(isOpen) {
    if (isOpen) {
      megaMenu.classList.add('open');
      menuToggle.classList.add('open');
      document.body.classList.add('menu-open');
    } else {
      megaMenu.classList.remove('open');
      menuToggle.classList.remove('open');
      setTimeout(function () {
        document.body.classList.remove('menu-open');
      }, 350);
    }
  }

  if (menuToggle && megaMenu) {
    menuToggle.addEventListener('click', function () {
      setMenuOpen(!megaMenu.classList.contains('open'));
    });
  }

  /* ============================================================
     8. MEGA MENU — link hover pe background image preview change
     ============================================================ */
  const megaMenuLinks = document.querySelectorAll('.mega-menu-list a');
  const megaMenuImg = document.getElementById('megaMenuImg');

  megaMenuLinks.forEach(function (link) {
    // Mouse hover pe mega-menu ki background image fade karke badalta hai
    link.addEventListener('mouseenter', function () {
      const newSrc = link.dataset.img;
      if (!newSrc) return;

      megaMenuLinks.forEach(function (l) { l.classList.remove('active'); });
      link.classList.add('active');

      if (megaMenuImg.getAttribute('src') === newSrc) return;

      megaMenuImg.classList.remove('show');
      setTimeout(function () {
        megaMenuImg.src = newSrc;
        megaMenuImg.classList.add('show');
      }, 200);
    });

    // Kisi bhi mega-menu link pe click karne par menu band ho jata hai
    link.addEventListener('click', function () {
      if (menuToggle && megaMenu) {
        setMenuOpen(false);
      }
    });
  });
});


/* ============================================================
   9. GALLERY — Desktop (mousemove parallax scroll effect)
   ============================================================ */
const galleryViewport = document.getElementById('galleryViewport');
const galleryTrack = document.getElementById('galleryTrack');

if (galleryViewport && galleryTrack) {

  if (window.innerWidth > 1080) {
    // ===== DESKTOP: mousemove transform effect =====
    let maxScroll = 0;
    let restX = 0;
    let targetX = 0;
    let currentX = 0;

    function applyTransform(x) {
      galleryTrack.style.transform = `translate3d(${Math.round(x * 100) / 100}px, 0, 0)`;
    }

    function recalcGallery() {
      maxScroll = Math.max(0, galleryTrack.scrollWidth - galleryViewport.clientWidth);
      restX = -maxScroll / 2;
      targetX = restX;
      currentX = restX;
      applyTransform(currentX);
    }

    recalcGallery();
    window.addEventListener('resize', recalcGallery);
    window.addEventListener('load', recalcGallery);

    galleryViewport.addEventListener('mousemove', function (e) {
      const rect = galleryViewport.getBoundingClientRect();
      let percent = (e.clientX - rect.left) / rect.width;
      percent = Math.min(1, Math.max(0, percent));
      targetX = -percent * maxScroll;
    });

    galleryViewport.addEventListener('mouseleave', function () {
      targetX = restX;
    });

    // Smooth easing animation loop (lerp) taaki gallery track glide kare
    function animateGallery() {
      currentX += (targetX - currentX) * 0.08;
      if (Math.abs(targetX - currentX) < 0.05) currentX = targetX;
      applyTransform(currentX);
      requestAnimationFrame(animateGallery);
    }

    animateGallery();

  } else {
    /* ============================================================
       10. GALLERY — Mobile/Tablet (native scroll, centered on load)
       ============================================================ */
    function centerGalleryScroll() {
      const maxScroll = Math.max(0, galleryTrack.scrollWidth - galleryViewport.clientWidth);
      galleryViewport.scrollLeft = maxScroll / 2;
    }

    centerGalleryScroll();
    window.addEventListener('load', centerGalleryScroll);
  }
}

/* ============================================================
   11. GALLERY LIGHTBOX — image click karne par fullscreen viewer
   ============================================================ */
const galleryItems = Array.from(galleryTrack.querySelectorAll('.gallery-item img'));
const lightbox = document.getElementById('galleryLightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentIndex = 0;

// Lightbox mein diya gaya image index dikhata hai + counter update karta hai
function showLightboxImage(index) {
  currentIndex = (index + galleryItems.length) % galleryItems.length;
  const target = galleryItems[currentIndex];
  lightboxImg.src = target.src;
  lightboxImg.alt = target.alt;
  lightboxCounter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
}

// Lightbox kholta hai (background scroll lock ke saath)
function openLightbox(index) {
  showLightboxImage(index);
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Lightbox band karta hai
function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

// Gallery ki har image pe click karne se lightbox khulta hai
galleryItems.forEach(function (img, index) {
  img.addEventListener('click', function () {
    openLightbox(index);
  });
});

// Lightbox ke close/prev/next buttons
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', function () { showLightboxImage(currentIndex - 1); });
lightboxNext.addEventListener('click', function () { showLightboxImage(currentIndex + 1); });

// Lightbox ke bahar (overlay) click karne se band ho jaye
lightbox.addEventListener('click', function (e) {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard se lightbox control — Esc band karta hai, arrows navigate karte hain
document.addEventListener('keydown', function (e) {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') showLightboxImage(currentIndex + 1);
  if (e.key === 'ArrowLeft') showLightboxImage(currentIndex - 1);
});

// Har gallery item pe zoom icon overlay add karta hai
document.querySelectorAll('.gallery-item').forEach(function (item) {
  const icon = document.createElement('span');
  icon.className = 'gallery-zoom-icon';
  icon.innerHTML = '<i class="bi bi-zoom-in"></i>';
  item.appendChild(icon);
});


/* ============================================================
   12. FAQ ACCORDION — questions expand/collapse
   ============================================================ */
function initAccordion(listId) {
  const items = document.querySelectorAll('#' + listId + ' .faq-item');

  items.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-toggle i');

    // Page load par jo item already active ho, usko khula rakhta hai
    if (item.classList.contains('active')) {
      answer.style.maxHeight = answer.scrollHeight + 'px';
      icon.classList.remove('bi-plus');
      icon.classList.add('bi-dash');
    }

    // Question pe click karne par accordion toggle karta hai (ek time pe ek khula)
    question.addEventListener('click', function () {
      const isActive = item.classList.contains('active');

      items.forEach(function (other) {
        other.classList.remove('active');
        other.querySelector('.faq-answer').style.maxHeight = null;
        const otherIcon = other.querySelector('.faq-toggle i');
        otherIcon.classList.remove('bi-dash');
        otherIcon.classList.add('bi-plus');
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.classList.remove('bi-plus');
        icon.classList.add('bi-dash');
      }
    });
  });

  // Window resize hone par khule accordion ki height recalculate karta hai
  window.addEventListener('resize', function () {
    const openItem = document.querySelector('#' + listId + ' .faq-item.active');
    if (openItem) {
      const openAnswer = openItem.querySelector('.faq-answer');
      openAnswer.style.maxHeight = openAnswer.scrollHeight + 'px';
    }
  });
}

// Alag-alag pages ke FAQ lists ke liye accordion initialize karta hai
initAccordion('faqList');
initAccordion('itineraryList');
initAccordion('pageFaqList');


/* ============================================================
   13. FOOTER — newsletter/contact form submit handle karna
   ============================================================ */
const footerForm = document.getElementById('footerForm');
if (footerForm) {
  footerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    footerForm.reset();
  });
}


/* ============================================================
   14. PROJECT DETAIL PAGE (hero section img) — future use ke liye reserved
   ============================================================ */