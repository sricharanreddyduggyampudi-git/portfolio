/**
 * BGRY-Style Designer Case Study Interactions
 * - Progressive disclosure (+ Read More / - Close)
 * - Parallax-in viewport scaling & reveal
 */
document.addEventListener('DOMContentLoaded', () => {
  // Read More Toggle
  const readMoreBtn = document.getElementById('readMoreBtn');
  const briefDrawer = document.getElementById('briefDrawer');

  if (readMoreBtn && briefDrawer) {
    readMoreBtn.addEventListener('click', () => {
      const isOpen = briefDrawer.classList.contains('open');
      if (isOpen) {
        briefDrawer.classList.remove('open');
        readMoreBtn.innerHTML = '<span>+ Read More</span>';
        readMoreBtn.setAttribute('aria-expanded', 'false');
      } else {
        briefDrawer.classList.add('open');
        readMoreBtn.innerHTML = '<span>− Close</span>';
        readMoreBtn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  // Parallax In-View Scaling Observer
  const parallaxElems = document.querySelectorAll('.parallax-in');
  if ('IntersectionObserver' in window && parallaxElems.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    });

    parallaxElems.forEach(el => observer.observe(el));
  } else {
    parallaxElems.forEach(el => el.classList.add('is-visible'));
  }
});
