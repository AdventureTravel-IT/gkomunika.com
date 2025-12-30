document.addEventListener("DOMContentLoaded", function () {
  const root = document.querySelector(".main-search-container");
  if (!root) return;

  const noMatchText = root.dataset.noMatchText || "No match found";
  const defaultFilter = (root.dataset.defaultFilter || "esim").toLowerCase();

  const filterButtonsContainer = root.querySelector(".sim-filter-buttons");
  const wrappers = Array.from(root.querySelectorAll(".main-search-collection-wrapper"));

  const wrapperCards = new Map();
  wrappers.forEach((w) => wrapperCards.set(w, Array.from(w.querySelectorAll(".product-card-container"))));

  let currentFlipped = null;

  function ensureCoverageMounted(card) {
    const back = card.querySelector(".product-card-content-flip-back");
    if (!back) return false;
    if (back.dataset.coverageMounted === "true") return true;

    const tpl = back.querySelector("template.coverage-template");
    const mount = back.querySelector(".coverage-mount");
    if (tpl && mount) {
      mount.appendChild(tpl.content.cloneNode(true));
      back.dataset.coverageMounted = "true";
      return true;
    }
    return false;
  }

  function initCoverageForCard(card) {
    if (card.dataset.coverageInit === "true") return;

    const coverageBlock = card.querySelector(".coverage-block");
    if (!coverageBlock) return;

    const coverageContainer = coverageBlock.querySelector(".coverage-container");
    const productCoverageEl = coverageBlock.querySelector(".product-coverage-json");
    const variantsDataEl = coverageBlock.querySelector(".variants-data-json");
    if (!coverageContainer || !productCoverageEl || !variantsDataEl) return;

    const baseUrl = coverageBlock.dataset.baseUrl || "";
    const version = coverageBlock.dataset.version || "";

    let productCoverage = [];
    let variantsData = [];
    try { productCoverage = JSON.parse(productCoverageEl.textContent || "[]"); } catch {}
    try { variantsData = JSON.parse(variantsDataEl.textContent || "[]"); } catch {}

    const variantDropdowns = card.querySelectorAll(".variant-dropdown");

    function renderCoverage(countries) {
      coverageContainer.innerHTML = "";
      if (!Array.isArray(countries)) return;

      const frag = document.createDocumentFragment();
      for (const country of countries) {
        const formatted = String(country).replace(/_/g, " ");
        const imageUrl = `${baseUrl}${country}.svg${version}`;

        const li = document.createElement("li");
        li.className = "coverage-item";
        li.dataset.country = formatted.toLowerCase();
        li.dataset.countryRaw = country;

        li.innerHTML = `
          <img class="image-countries" src="${imageUrl}" alt="${formatted}"
               width="50" height="50" loading="lazy" decoding="async">
          <h3>${formatted}</h3>
        `;
        frag.appendChild(li);
      }
      coverageContainer.appendChild(frag);

      if (typeof window.filterCountries === "function") window.filterCountries();
    }

    function updateMetafieldDisplay() {
      const selectedOptions = Array.from(variantDropdowns).map((d) => d.value);
      const matchedVariant = variantsData.find((v) =>
        Array.isArray(v.options) && v.options.every((opt, idx) => opt === selectedOptions[idx])
      );

      const coverage = matchedVariant && Array.isArray(matchedVariant.coverage) && matchedVariant.coverage.length
        ? matchedVariant.coverage
        : productCoverage;

      renderCoverage(coverage);
    }

    variantDropdowns.forEach((d) => d.addEventListener("change", updateMetafieldDisplay));
    updateMetafieldDisplay();

    card.dataset.coverageInit = "true";
  }

  function updateCollectionVisibility() {
    wrappers.forEach((wrapper) => {
      const cards = wrapperCards.get(wrapper) || [];
      const hasVisible = cards.some((c) => c.style.display !== "none");
      wrapper.classList.toggle("hidden", !hasVisible);
    });

    const anyVisibleWrapper = wrappers.some((w) => !w.classList.contains("hidden"));
    let emptyMsg = document.getElementById("no-match-msg");

    if (!anyVisibleWrapper) {
      if (!emptyMsg) {
        emptyMsg = document.createElement("div");
        emptyMsg.id = "no-match-msg";
        emptyMsg.className = "main-search__error";
        emptyMsg.innerHTML = `<p>${noMatchText}</p>`;
        root.appendChild(emptyMsg);
      }
    } else if (emptyMsg) {
      emptyMsg.remove();
    }
  }

  function setActiveButton(activeFilter) {
    if (!filterButtonsContainer) return;
    const buttons = filterButtonsContainer.querySelectorAll("button[data-filter]");
    buttons.forEach((b) => b.classList.toggle("active", b.getAttribute("data-filter") === activeFilter));
  }

  function filterProducts(activeFilter) {
    wrappers.forEach((wrapper) => {
      const cards = wrapperCards.get(wrapper) || [];
      for (const card of cards) {
        if (activeFilter === "all") {
          card.style.display = "flex";
          continue;
        }
        const show = card.classList.contains("sim-type-" + activeFilter);
        card.style.display = show ? "flex" : "none";
      }
    });
    updateCollectionVisibility();
  }

  function resolveInitialFilter() {
    const params = new URLSearchParams(window.location.search);
    const simTypeParam = params.get("sim_type");

    let f = simTypeParam ? simTypeParam : defaultFilter;
    f = String(f).toLowerCase().replace(/\s+/g, "-").replace(/_/g, "-");

    const allowed = new Set(["all", "esim", "sim-card", "insurance"]);
    if (!allowed.has(f)) f = defaultFilter || "esim";
    return f;
  }

  root.addEventListener("click", function (event) {
    const flipBtn = event.target.closest(".flipped-trigger");
    const backFace = event.target.closest(".product-card-content-flip-back");

    if (flipBtn) {
      event.preventDefault();

      const card = flipBtn.closest(".product-card-container");
      if (!card) return;

      if (currentFlipped && currentFlipped !== card) currentFlipped.classList.remove("flipped");

      card.classList.toggle("flipped");
      currentFlipped = card.classList.contains("flipped") ? card : null;

      if (currentFlipped) {
        const mounted = ensureCoverageMounted(currentFlipped);
        if (mounted) initCoverageForCard(currentFlipped);
      }
      return;
    }

    if (backFace) {
      const card = backFace.closest(".product-card-container");
      if (card && card.classList.contains("flipped")) {
        card.classList.remove("flipped");
        if (currentFlipped === card) currentFlipped = null;
      }
    }
  });

  if (filterButtonsContainer) {
    filterButtonsContainer.addEventListener("click", function (event) {
      const btn = event.target.closest("button[data-filter]");
      if (!btn) return;

      const selected = btn.getAttribute("data-filter");
      setActiveButton(selected);
      filterProducts(selected);
    });
  }

  const initial = resolveInitialFilter();
  setActiveButton(initial);
  filterProducts(initial);
});
