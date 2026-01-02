document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".menu-toggle");
  const panel = document.getElementById("sidebar-panel");
  const icon = document.getElementById("menu-icon");

  if (!btn || !panel) return;

  function open() {
    panel.classList.add("active");
    document.body.classList.add("sidebar-open");
    panel.setAttribute("aria-hidden", "false");
    btn.setAttribute("aria-expanded", "true");
    if (icon) icon.classList.add("open");
  }

  function close() {
    panel.classList.remove("active");
    document.body.classList.remove("sidebar-open");
    panel.setAttribute("aria-hidden", "true");
    btn.setAttribute("aria-expanded", "false");
    if (icon) icon.classList.remove("open");
  }

  function toggle() {
    const isOpen = panel.classList.contains("active");
    isOpen ? close() : open();
  }

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    toggle();
  });

  panel.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link) close();
  });

  document.addEventListener("click", (e) => {
    if (!panel.classList.contains("active")) return;
    const insidePanel = panel.contains(e.target);
    const insideBtn = btn.contains(e.target);
    if (!insidePanel && !insideBtn) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("active")) close();
  });
});
