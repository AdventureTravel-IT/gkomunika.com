(() => {
  const init = () => {
    const images = document.querySelectorAll('img[data-src]');
    const sections = document.querySelectorAll(
      '.landing-started-gsim, .landing-package-gsim, .landing-review-gsim'
    );

    if (!('IntersectionObserver' in window)) {
      images.forEach((img) => {
        if (img.dataset && img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        img.classList.add('loaded');
      });

      sections.forEach((section) => {
        section.classList.add('visible');
      });

      return;
    }

    const imgObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset && img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01,
      }
    );

    images.forEach((img) => imgObserver.observe(img));

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '100px 0px',
        threshold: 0.1,
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
