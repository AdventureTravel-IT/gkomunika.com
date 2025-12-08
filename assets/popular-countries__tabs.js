(() => {
  const buttons = document.querySelectorAll(".tab-button");
  const contents = document.querySelectorAll(".tab-content");
  const showAllButton = document.querySelector(".show-all-destination");

  const urlParams = new URLSearchParams(window.location.search);
  const activeTab = urlParams.get("tab") || "land";

  function activateTab(tab) {
    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tab);
    });

    contents.forEach((content) => {
      if (content.id === tab) {
        content.classList.add("active");
      } else {
        content.classList.remove("active");
      }
    });

    if (showAllButton) {
      const baseUrl = showAllButton.getAttribute("href").split("?")[0];
      showAllButton.setAttribute("href", `${baseUrl}?tab=${tab}`);
    }

    const newUrl = `${window.location.pathname}?tab=${tab}`;
    window.history.pushState(null, "", newUrl);
  }
  activateTab(activeTab);

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.getAttribute("data-tab");
      activateTab(tab);
    });
  });
})();
