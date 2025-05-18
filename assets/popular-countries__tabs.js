
    (function () {
      const buttons = document.querySelectorAll(".tab-button");
      const contents = document.querySelectorAll(".tab-content");
      const showAllButton = document.querySelector(".show-all-destination");

      // Ambil tab aktif dari URL atau default ke 'land'
      const urlParams = new URLSearchParams(window.location.search);
      const activeTab = urlParams.get("tab") || "land";

      // Set tab aktif saat pertama kali load
      buttons.forEach((button) => {
        button.classList.toggle("active", button.getAttribute("data-tab") === activeTab);
        button.style.visibility = "visible"; // Tampilkan tombol setelah diatur
      });

      contents.forEach((content) => {
        content.style.display = content.id === activeTab ? "grid" : "none";
        content.style.visibility = "visible"; // Tampilkan konten setelah diatur
      });

      // Update URL dan tampilkan tab saat klik tombol
      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          const tab = button.getAttribute("data-tab");

          // Update tampilan tab
          buttons.forEach((btn) => btn.classList.remove("active"));
          contents.forEach((content) => (content.style.display = "none"));

          button.classList.add("active");
          document.getElementById(tab).style.display = "grid";

          // Update URL tanpa reload
          const newUrl = `${window.location.pathname}?tab=${tab}`;
          window.history.pushState(null, "", newUrl);

          // Update href pada tombol 'Show All Destination'
          if (showAllButton) {
            const baseUrl = showAllButton.getAttribute("href").split('?')[0];
            showAllButton.setAttribute('href', `${baseUrl}?tab=${tab}`);
          }
        });
      });

      // Update href saat pertama kali load
      if (showAllButton) {
        const baseUrl = showAllButton.getAttribute("href").split('?')[0];
        showAllButton.setAttribute('href', `${baseUrl}?tab=${activeTab}`);
      }
    })();
