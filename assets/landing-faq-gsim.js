(() => {
  const items = document.querySelectorAll('.faq-question');
  if (!items.length) return;

  const handleClick = (e) => {
    const item = e.currentTarget.closest('.faq-question');
    if (!item) return;

    const isOpen = item.classList.contains('open');

    items.forEach((i) => {
      i.classList.remove('open');
      const title = i.querySelector('.question-title');
      if (title) {
        title.setAttribute('aria-expanded', 'false');
      }
    });

    if (!isOpen) {
      item.classList.add('open');
      const title = item.querySelector('.question-title');
      if (title) {
        title.setAttribute('aria-expanded', 'true');
      }
    }
  };

  items.forEach((item) => {
    const title = item.querySelector('.question-title');
    if (!title) return;

    title.addEventListener('click', handleClick);
    title.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick(e);
      }
    });
  });
})();
