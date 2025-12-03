(() => {
  const initCarousel = () => {
    const wrapper = document.querySelector('.review-wrapper');
    if (!wrapper) return;

    const track = wrapper.querySelector('.review-track');
    const prevBtn = wrapper.querySelector('.review-nav.prev');
    const nextBtn = wrapper.querySelector('.review-nav.next');
    const cards = track ? track.querySelectorAll('.review-card') : null;

    if (!track || !cards || !cards.length) return;

    let currentIndex = 0;
    let cardWidth = 0;
    let visibleCards = 1;
    let maxIndex = 0;

    const updatePosition = () => {
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;
    };

    const recalc = () => {
      if (!cards[0]) return;

      const rect = cards[0].getBoundingClientRect();
      if (!rect.width) return;

      cardWidth = rect.width + 16;

      const w = window.innerWidth;
      visibleCards = w < 768 ? 1 : w < 1024 ? 2 : 3;
      maxIndex = Math.max(0, cards.length - visibleCards);

      if (currentIndex > maxIndex) currentIndex = maxIndex;
      updatePosition();
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          updatePosition();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
          currentIndex++;
          updatePosition();
        }
      });
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        recalc();
      }, 200);
    });

    recalc();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
  } else {
    initCarousel();
  }
})();
