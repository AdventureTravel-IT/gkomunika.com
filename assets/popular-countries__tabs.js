(() => {
  const buttons = document.querySelectorAll(".tab-button");
  const contents = document.querySelectorAll(".tab-content");
  const showAllButton = document.querySelector(".show-all-destination");
  const PRO_MAX = window.matchMedia("(min-width: 430px) and (max-width: 440px)");

  const urlParams = new URLSearchParams(window.location.search);
  const hasTabParam = urlParams.has("tab");
  const activeTab = urlParams.get("tab") || "land";
  const isHomePage = window.location.pathname === "/";

  function activateTab(tab, { updateUrl = true } = {}) {
    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tab);
    });

    contents.forEach((content) => {
      const isActive = content.id === tab;
      content.classList.toggle("active", isActive);
      
      if (isActive) {
        content.style.display = "";
        content.style.visibility = "visible";
      } else {
        content.style.display = "none";
        content.style.visibility = "hidden";
      }
    });

    if (showAllButton) {
      const baseUrl = showAllButton.getAttribute("href").split("?")[0];
      showAllButton.setAttribute("href", `${baseUrl}?tab=${tab}`);
    }

    if (updateUrl && !isHomePage) {
      const newUrl = `${window.location.pathname}?tab=${tab}`;
      window.history.replaceState(null, "", newUrl);
    }

    applyLimit();
  }

  function limitItems(tabId, limit = 4) {
    const tab = document.getElementById(tabId);
    if (!tab) return;

    const items = tab.querySelectorAll("a");
    const shouldLimit = isHomePage && PRO_MAX.matches;

    items.forEach((el, idx) => {
      el.style.display = shouldLimit && idx >= limit ? "none" : "";
    });
  }

  function applyLimit() {
    limitItems("land", 4);
    limitItems("region", 4);
  }

  function debounce(func, wait = 150) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  activateTab(activeTab, { updateUrl: hasTabParam && !isHomePage });
  applyLimit();

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.getAttribute("data-tab");
      activateTab(tab, { updateUrl: !isHomePage });
    });
  });

  if (PRO_MAX.addEventListener) {
    PRO_MAX.addEventListener("change", applyLimit);
  }

  window.addEventListener("resize", debounce(applyLimit, 150));
})();