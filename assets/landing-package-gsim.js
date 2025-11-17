(() => {
  'use strict';

  const wrapper = document.querySelector('.package-content');
  const prevBtn = document.querySelector('.btn-prev');
  const nextBtn = document.querySelector('.btn-next');

  if (!wrapper || !prevBtn || !nextBtn) return;

  const packages = [
    { images: ['.asia-image', '.eropa-image'] },
    { images: ['.middle-east-image', '.amerika-image'] }
  ];

  let currentIndex = 0;
  const allImages = document.querySelectorAll(
    '.asia-image, .eropa-image, .middle-east-image, .amerika-image'
  );

  const updateDisplay = () => {
    allImages.forEach(img => {
      img.style.display = 'none';
    });

    const current = packages[currentIndex];
    if (!current) return;

    current.images.forEach(selector => {
      const img = document.querySelector(selector);
      if (img) img.style.display = 'block';
    });

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === packages.length - 1;
  };

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateDisplay();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < packages.length - 1) {
      currentIndex++;
      updateDisplay();
    }
  });

  updateDisplay();
})();
