document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.ma-menu-wrapper[data-tab]');
  const contents = document.querySelectorAll('.ma-section-order-history-container > div');
  const menuSection = document.querySelector('.ma-section-menu');

  function resetMenu() {
    buttons.forEach(btn => {
      btn.querySelector('.menu-wrapper').classList.remove('active');
    });

    contents.forEach(content => {
      content.style.display = 'none';
    });

    if (window.innerWidth <= 768) {
      menuSection.classList.remove('hidden');
    }
  }

  function applyResponsiveBehavior() {
    if (window.innerWidth > 768) {
      const defaultButton = document.querySelector('.ma-menu-wrapper[data-tab="order-history"] .menu-wrapper');
      if (defaultButton) {
        defaultButton.classList.add('active');
      }

      contents.forEach(content => {
        content.style.display = content.id === 'order-history' ? 'block' : 'none';
      });

      menuSection.classList.remove('hidden'); // Pastikan menu selalu terlihat di desktop
    } else {
      resetMenu();
    }
  }

  applyResponsiveBehavior(); // Jalankan saat pertama kali

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      resetMenu();

      const tab = button.getAttribute('data-tab');
      const content = document.getElementById(tab);

      if (content) {
        content.style.display = 'block';
        button.querySelector('.menu-wrapper').classList.add('active');

        if (window.innerWidth <= 768) {
          menuSection.classList.add('hidden');
        }
      }
    });
  });

  // Tambahkan event listener untuk resize agar realtime
  window.addEventListener('resize', applyResponsiveBehavior);
});
