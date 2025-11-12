(() => {
  const items  = Array.from(document.querySelectorAll('.faq-question'));
  if (!items.length) return;

  const titles = items.map(it => it.querySelector('.question-title'));

  function openItem(idx){
    items.forEach((it, i) => {
      const title = titles[i];
      const expanded = i === idx;
      it.classList.toggle('open', expanded);
      title?.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  }

  function toggleItem(idx){
    const open = items[idx].classList.contains('open');
    if (open){
      items[idx].classList.remove('open');
      titles[idx]?.setAttribute('aria-expanded','false');
    } else {
      openItem(idx);
    }
  }

  titles.forEach((title, idx) => {
    if (!title) return;

    title.setAttribute('role', 'button');
    title.setAttribute('tabindex', '0');
    title.setAttribute('aria-expanded', items[idx].classList.contains('open') ? 'true' : 'false');

    title.addEventListener('click', () => toggleItem(idx));

    title.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleItem(idx); }
      if (e.key === 'ArrowDown') { e.preventDefault(); (titles[idx+1] || titles[0])?.focus(); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); (titles[idx-1] || titles[titles.length-1])?.focus(); }
    });
  });

  const firstOpen = items.findIndex(it => it.classList.contains('open'));
  if (firstOpen >= 0) openItem(firstOpen);
})();