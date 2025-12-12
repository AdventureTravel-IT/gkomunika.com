(() => {
  'use strict';

  const wrapper = document.querySelector('.package-content');
  const prevBtn = document.querySelector('.btn-prev');
  const nextBtn = document.querySelector('.btn-next');
  const prevBtnMobile = document.querySelector('.btn-prev-mobile');
  const nextBtnMobile = document.querySelector('.btn-next-mobile');
  const cardsContainer = document.querySelector('.cards-container');

  if (!wrapper || !prevBtn || !nextBtn || !cardsContainer) return;

  const packageCards = document.querySelectorAll('.package-card');
  const packages = [
    { cardIndices: [0, 1] },
    { cardIndices: [2, 3] }
  ];

  let currentIndex = 0;

  const updateDisplay = () => {
    packageCards.forEach((card, index) => {
      const shouldDisplay = packages[currentIndex].cardIndices.includes(index);
      card.style.display = shouldDisplay ? 'block' : 'none';
    });

    const isFirst = currentIndex === 0;
    const isLast = currentIndex === packages.length - 1;

    prevBtn.disabled = isFirst;
    nextBtn.disabled = isLast;
    
    if (prevBtnMobile) prevBtnMobile.disabled = isFirst;
    if (nextBtnMobile) nextBtnMobile.disabled = isLast;

    prevBtn.style.opacity = isFirst ? '0.5' : '1';
    prevBtn.style.cursor = isFirst ? 'not-allowed' : 'pointer';
    nextBtn.style.opacity = isLast ? '0.5' : '1';
    nextBtn.style.cursor = isLast ? 'not-allowed' : 'pointer';
    
    if (prevBtnMobile) {
      prevBtnMobile.style.opacity = isFirst ? '0.5' : '1';
      prevBtnMobile.style.cursor = isFirst ? 'not-allowed' : 'pointer';
    }
    if (nextBtnMobile) {
      nextBtnMobile.style.opacity = isLast ? '0.5' : '1';
      nextBtnMobile.style.cursor = isLast ? 'not-allowed' : 'pointer';
    }
  };

  const handlePrev = (e) => {
    e.preventDefault();
    if (currentIndex > 0) {
      currentIndex--;
      updateDisplay();
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (currentIndex < packages.length - 1) {
      currentIndex++;
      updateDisplay();
    }
  };

  prevBtn.addEventListener('click', handlePrev);
  nextBtn.addEventListener('click', handleNext);

  if (prevBtnMobile) prevBtnMobile.addEventListener('click', handlePrev);
  if (nextBtnMobile) nextBtnMobile.addEventListener('click', handleNext);

  updateDisplay();
})();
