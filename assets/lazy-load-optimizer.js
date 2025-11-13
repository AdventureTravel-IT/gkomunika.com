(() => {
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
            }
            img.classList.add("loaded");
            obs.unobserve(img);
          }
        });
      },
      { rootMargin: "50px 0px", threshold: 0.01 }
    );
    document
      .querySelectorAll("img[data-src]")
      .forEach((img) => observer.observe(img));
    const sections = document.querySelectorAll(
      ".landing-started-gsim,.landing-package-gsim,.landing-review-gsim"
    );
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { rootMargin: "100px 0px", threshold: 0.1 }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }
})();
