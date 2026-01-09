
document.addEventListener('DOMContentLoaded', () => {
  console.log('Website loaded - Striking Design Active');

  // 1. Scroll Reveal Animation
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.card, .philosophy h2, .philosophy p, .feature-section, .cta-footer h2');
  revealElements.forEach(el => {
    el.classList.add('reveal-on-scroll'); // Add base class via JS
    observer.observe(el);
  });

  // 2. Header Scroll Effect
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 3. Simple Parallax for Hero Orbs
  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    // Parallax logic can be added here
  });

  // 4. Init Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  } else {
    console.warn('Lucide icons not loaded');
  }
});
