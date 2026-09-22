/**
 * SRI CHARAN REDDY — INDUSTRIAL DESIGNER INTERACTIONS
 * - 3D card tilt & smooth interactive sticker card
 * - Clean hamburger drawer toggle
 * - Auto-scroll carousels with initial 3.5s pause
 * - Yard tab switcher
 */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");

  // 1. Sticky Header
  function handleScroll() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 25);
    }
  }
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  const brandBadge = document.querySelector(".brand-badge");
  if (brandBadge) {
    brandBadge.addEventListener("click", (e) => {
      if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/" || window.location.pathname.endsWith("/")) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  // 2. Hamburger Drawer
  const burgerBtn = document.querySelector(".burger-menu-btn");
  const menuDrawer = document.querySelector(".menu-drawer-overlay");
  const drawerLinks = document.querySelectorAll(".drawer-link");

  if (burgerBtn && menuDrawer) {
    function toggleMenu() {
      const isOpen = burgerBtn.classList.toggle("is-active");
      menuDrawer.classList.toggle("is-open", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    }

    burgerBtn.addEventListener("click", toggleMenu);

    drawerLinks.forEach((link) => {
      link.addEventListener("click", () => {
        burgerBtn.classList.remove("is-active");
        menuDrawer.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menuDrawer.classList.contains("is-open")) {
        burgerBtn.classList.remove("is-active");
        menuDrawer.classList.remove("is-open");
        document.body.style.overflow = "";
      }
    });
  }

  // 3. Interactive Name Sticker Card
  const stickerCard = document.querySelector(".interactive-sticker-card");
  if (stickerCard) {
    stickerCard.addEventListener("mousemove", (e) => {
      const rect = stickerCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotX = -(y / rect.height) * 8;
      const rotY = (x / rect.width) * 8;
      stickerCard.style.transform = `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-4px)`;
    });

    stickerCard.addEventListener("mouseleave", () => {
      stickerCard.style.transform = "";
    });

    stickerCard.addEventListener("click", () => {
      stickerCard.classList.toggle("is-active-tap");
    });
  }

  // 4. Yard Tab Switcher
  const tabButtons = document.querySelectorAll(".yard-tab-btn");
  const tabPanels = document.querySelectorAll(".yard-panel");

  function switchYardTab(targetTab) {
    if (!targetTab) return;
    tabButtons.forEach((btn) => {
      const tabName = btn.dataset.tab || btn.dataset.yardTab;
      const isActive = tabName === targetTab;
      btn.classList.toggle("active", isActive);
    });

    tabPanels.forEach((panel) => {
      const isTarget = panel.id === targetTab;
      panel.classList.toggle("active", isTarget);
    });

    if (history.replaceState) {
      history.replaceState(null, null, `#${targetTab}`);
    }
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabName = btn.dataset.tab || btn.dataset.yardTab;
      switchYardTab(tabName);
    });
  });

  if (window.location.hash) {
    const hash = window.location.hash.replace("#", "");
    if (document.getElementById(hash)) {
      switchYardTab(hash);
    }
  }

  // 5. Commercial Product Auto-Scroll (Initial 3.5s Delay)
  const productCarousels = document.querySelectorAll(".live-product-carousel");

  productCarousels.forEach((carousel, carouselIdx) => {
    const slidesContainer = carousel.querySelector(".carousel-slides");
    const slides = carousel.querySelectorAll(".carousel-slide");
    const dots = carousel.querySelectorAll(".carousel-dot");

    if (!slidesContainer || slides.length <= 1) return;

    let currentIndex = 0;
    let autoScrollTimer = null;
    let isPaused = false;

    function updateDots(idx) {
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === idx);
      });
    }

    function scrollToSlide(index, smooth = true) {
      if (index >= slides.length) {
        currentIndex = 0;
      } else if (index < 0) {
        currentIndex = slides.length - 1;
      } else {
        currentIndex = index;
      }

      const targetSlide = slides[currentIndex];
      if (targetSlide) {
        slidesContainer.scrollTo({
          left: targetSlide.offsetLeft,
          behavior: smooth ? "smooth" : "auto",
        });
        updateDots(currentIndex);
      }
    }

    function startAutoScroll() {
      stopAutoScroll();
      const intervalDelay = 3200;
      autoScrollTimer = setInterval(() => {
        if (!isPaused) {
          scrollToSlide(currentIndex + 1, true);
        }
      }, intervalDelay);
    }

    function stopAutoScroll() {
      if (autoScrollTimer) {
        clearInterval(autoScrollTimer);
        autoScrollTimer = null;
      }
    }

    carousel.addEventListener("mouseenter", () => {
      isPaused = true;
    });

    carousel.addEventListener("mouseleave", () => {
      isPaused = false;
    });

    let scrollDebounce = null;
    slidesContainer.addEventListener("scroll", () => {
      clearTimeout(scrollDebounce);
      scrollDebounce = setTimeout(() => {
        const scrollLeft = slidesContainer.scrollLeft;
        const slideWidth = slidesContainer.clientWidth;
        if (slideWidth > 0) {
          const activeIdx = Math.round(scrollLeft / slideWidth);
          if (activeIdx >= 0 && activeIdx < slides.length) {
            currentIndex = activeIdx;
            updateDots(currentIndex);
          }
        }
      }, 50);
    }, { passive: true });

    carousel._startAutoScroll = startAutoScroll;
  });

  // Trigger auto-scroll ONLY after user scrolls to commercial products section (5s still delay)
  const commercialSection = document.getElementById("commercial-products") || document.querySelector(".live-products-section");
  if (commercialSection && productCarousels.length > 0) {
    let hasTriggered = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasTriggered) {
          hasTriggered = true;
          // Main image remains still for 5 seconds after scroll, then starts rotating
          setTimeout(() => {
            productCarousels.forEach((carousel) => {
              if (carousel._startAutoScroll) {
                carousel._startAutoScroll();
              }
            });
          }, 5000);
        }
      });
    }, {
      threshold: 0.15
    });

    observer.observe(commercialSection);
  }
});
