(() => {
  const buttons = document.querySelectorAll(".tab-button");
  const contents = document.querySelectorAll(".tab-content");
  const PRO_MAX = window.matchMedia("(min-width: 430px) and (max-width: 440px)");
  const showAllButton = document.querySelector(".show-all-destination");

  const urlParams = new URLSearchParams(window.location.search);
  const hasTabParam = urlParams.has("tab");
  const activeTab = urlParams.get("tab") || "land";

  const isHomePage = window.location.pathname === "/";

  function activateTab(tab, { updateUrl } = { updateUrl: true }) {
    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tab);
    });

    contents.forEach((content) => {
      content.classList.toggle("active", content.id === tab);
    });

    if (showAllButton) {
      const baseUrl = showAllButton.getAttribute("href").split("?")[0];
      showAllButton.setAttribute("href", `${baseUrl}?tab=${tab}`);
    }

    if (!updateUrl || isHomePage) return;

    const newUrl = `${window.location.pathname}?tab=${tab}`;
    window.history.replaceState(null, "", newUrl);
  }

  function limitItems(tabId, limit = 4) {
    const tab = document.getElementById(tabId);
    if (!tab) return;

    const items = tab.querySelectorAll("a");

    items.forEach((el, idx) => {
      const shouldLimit = isHomePage && PRO_MAX.matches;
      el.style.display = shouldLimit && idx >= limit ? "none" : "";
    });
  }

  function applyLimit() {
    limitItems("land", 4);
    limitItems("region", 4);
  }

  activateTab(activeTab, { updateUrl: hasTabParam && !isHomePage });

  applyLimit();

  PRO_MAX.addEventListener?.("change", applyLimit);
  window.addEventListener("resize", applyLimit);

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.getAttribute("data-tab");
      activateTab(tab, { updateUrl: !isHomePage });
      applyLimit();
    });
  });
})();
