(() => {
  'use strict';
  
  const wrapper = document.querySelector('.package-content');
  if (!wrapper) return;

  const prevBtn = document.querySelector('.btn-prev');
  const nextBtn = document.querySelector('.btn-next');
  
  const groups = [
    {
      images: [
        wrapper.querySelector('.package-image'),
        wrapper.querySelector('.asia-image'),
        wrapper.querySelector('.eropa-image')
      ],
      buttons: [
        wrapper.querySelectorAll('.btn-buy-package')[0],
        wrapper.querySelectorAll('.btn-buy-package')[1]
      ]
    },
    {
      images: [
        wrapper.querySelector('.package-image').cloneNode(true),
        wrapper.querySelector('.middle-east-image'),
        wrapper.querySelector('.amerika-image')
      ],
      buttons: [
        wrapper.querySelectorAll('.btn-buy-package')[2],
        wrapper.querySelectorAll('.btn-buy-package')[3]
      ]
    }
  ];

  let currentIndex = 0;
  const totalGroups = 2;

  function updateView() {
    wrapper.querySelectorAll('.asia-image, .eropa-image, .middle-east-image, .amerika-image').forEach(img => {
      img.style.display = 'none';
    });
    
    wrapper.querySelectorAll('.btn-buy-package').forEach(btn => {
      btn.style.display = 'none';
    });

    if (currentIndex === 0) {
      wrapper.querySelector('.asia-image').style.display = 'block';
      wrapper.querySelector('.eropa-image').style.display = 'block';
      wrapper.querySelectorAll('.btn-buy-package')[0].style.display = 'block';
      wrapper.querySelectorAll('.btn-buy-package')[1].style.display = 'block';
    } else {
      wrapper.querySelector('.middle-east-image').style.display = 'block';
      wrapper.querySelector('.amerika-image').style.display = 'block';
      wrapper.querySelectorAll('.btn-buy-package')[2].style.display = 'block';
      wrapper.querySelectorAll('.btn-buy-package')[3].style.display = 'block';
    }

    updateButtons();
  }

  function updateButtons() {
    if (currentIndex <= 0) {
      prevBtn.disabled = true;
      prevBtn.style.opacity = '0.3';
    } else {
      prevBtn.disabled = false;
      prevBtn.style.opacity = '1';
    }

    if (currentIndex >= totalGroups - 1) {
      nextBtn.disabled = true;
      nextBtn.style.opacity = '0.3';
    } else {
      nextBtn.disabled = false;
      nextBtn.style.opacity = '1';
    }
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateView();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < totalGroups - 1) {
      currentIndex++;
      updateView();
    }
  });

  updateView();
})();
