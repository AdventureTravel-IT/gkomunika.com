(() => {
  const wrapper = document.querySelector('.review-wrapper');
  if (!wrapper) return;

  const track = wrapper.querySelector('.review-track');
  const prevBtn = wrapper.querySelector('.review-nav.prev');
  const nextBtn = wrapper.querySelector('.review-nav.next');
  const cards = track.querySelectorAll('.review-card');

  let currentIndex = 0;
  let cardsPerView = 3;

  function getCardsPerView() {
    const width = window.innerWidth;
    if (width <= 600) return 1;
    if (width <= 992) return 2;
    return 3;
  }

  function updateCardsPerView() {
    cardsPerView = getCardsPerView();
    currentIndex = 0;
    updateView();
  }

  function updateView() {
    cards.forEach((card, idx) => {
      card.style.display = 'none';
    });

    for (let i = 0; i < cardsPerView; i++) {
      const idx = currentIndex + i;
      if (idx < cards.length) {
        cards[idx].style.display = 'block';
      }
    }
    updateButtons();
  }

  function updateButtons() {
    const maxIndex = Math.max(0, cards.length - cardsPerView);

    if (currentIndex <= 0) {
      prevBtn.disabled = true;
      prevBtn.style.opacity = '0.4';
      prevBtn.style.cursor = 'not-allowed';
    } else {
      prevBtn.disabled = false;
      prevBtn.style.opacity = '1';
      prevBtn.style.cursor = 'pointer';
    }

    if (currentIndex >= maxIndex || cards.length <= cardsPerView) {
      nextBtn.disabled = true;
      nextBtn.style.opacity = '0.4';
      nextBtn.style.cursor = 'not-allowed';
    } else {
      nextBtn.disabled = false;
      nextBtn.style.opacity = '1';
      nextBtn.style.cursor = 'pointer';
    }
  }

  prevBtn.addEventListener('click', function() {
    if (currentIndex > 0) {
      currentIndex--;
      updateView();
    }
  });

  nextBtn.addEventListener('click', function() {
    const maxIndex = Math.max(0, cards.length - cardsPerView);
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateView();
    }
  });

  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateCardsPerView, 150);
  });
  updateCardsPerView();
})();