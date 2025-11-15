(() => {
  const wrapper = document.querySelector('.review-wrapper');
  if (!wrapper) return;

  const track = wrapper.querySelector('.review-track');
  const prevBtn = wrapper.querySelector('.review-nav.prev');
  const nextBtn = wrapper.querySelector('.review-nav.next');
  const cards = track.querySelectorAll('.review-card');

  if (!track || !cards.length) return;

  let currentIndex = 0;
  const cardWidth = cards[0].offsetWidth + 16;
  const visibleCards = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  const maxIndex = Math.max(0, cards.length - visibleCards);

  const updatePosition = () => {
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;
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
      currentIndex = 0;
      updatePosition();
    }, 250);
  });

  updatePosition();
})();