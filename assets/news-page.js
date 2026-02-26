(function () {
  const root = document.getElementById("explore-aggregator");
  if (!root) return;

  const grid = document.getElementById("ea-grid");
  const pagination = document.getElementById("ea-pagination");
  const searchInput = document.getElementById("ea-search");
  const searchBtn = document.getElementById("ea-search-btn");
  const tabsEl = document.getElementById("ea-tabs");

  let tabs = [];
  try {
    tabs = JSON.parse(root.dataset.tabs || "[]");
  } catch (_) {
    tabs = [];
  }

  const state = {
    q: "",
    category: "All",
    page: 1,
    perPage: parseInt(root.dataset.perPage || "9", 10),
    tabs,
  };

  const dataCache = new Map();
  let currentController = null;

  const truncate = (str, n) =>
    !str ? "" : str.length > n ? str.slice(0, n - 1) + "…" : str;

  function normalizeUrl(url) {
    try {
      const u = new URL(url, window.location.origin);
      return u.pathname.replace(/\/$/, "").toLowerCase();
    } catch {
      return String(url).replace(/\/$/, "").toLowerCase();
    }
  }

  function dedupeItems(items) {
    const map = new Map();
    items.forEach((it) => {
      if (!it || !it.url) return;
      const key = normalizeUrl(it.url);
      if (!map.has(key)) {
        map.set(key, it);
      }
    });
    return Array.from(map.values());
  }

  function scrollToTop() {
    const headerOffset = parseInt(root.dataset.scrollOffset || "0", 10);
    const top =
      root.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    try {
      window.scrollTo({ top, behavior: "smooth" });
    } catch (_) {
      window.scrollTo(0, top);
    }
  }

  function normalizeCategory(item) {
    if (state.category === "All") return true;
    const target = state.category.toLowerCase();

    const getCategories = (raw) => {
      if (!raw) return [];
      let value = raw;

      if (Array.isArray(value)) {
        return value.map((t) => String(t).trim().toLowerCase()).filter(Boolean);
      }

      if (typeof value === "string") {
        const trimmed = value.trim();

        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
          try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
              return parsed
                .map((t) => String(t).trim().toLowerCase())
                .filter(Boolean);
            }
          } catch (e) {}
        }

        return trimmed
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean);
      }

      return [String(value).trim().toLowerCase()].filter(Boolean);
    };

    const cats = getCategories(item.category);
    return cats.includes(target);
  }

  // Derive tabs dynamically from item category metafield values
  function deriveTabsFromItems(items) {
    const set = new Set(["All"]);
    items.forEach((it) => {
      if (!it.category) return;
      const raw = it.category.trim();

      // Support JSON array format: ["travel-guide","news"]
      if (raw.startsWith("[") && raw.endsWith("]")) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            parsed.forEach((t) => t && t.trim() && set.add(t.trim()));
            return;
          }
        } catch (_) {}
      }

      // Support comma-separated format: "travel-guide,news"
      raw.split(",").forEach((t) => t.trim() && set.add(t.trim()));
    });
    state.tabs = Array.from(set);
  }

  function renderTabs() {
    tabsEl.innerHTML = "";
    const list = state.tabs && state.tabs.length ? state.tabs : ["All"];
    list.forEach((raw) => {
      const label = String(raw || "").trim();
      const b = document.createElement("button");
      b.className = "ea-tab" + (label === state.category ? " active" : "");
      b.type = "button";
      b.textContent = label;
      b.addEventListener("click", () => {
        if (state.category === label) return;
        state.category = label;
        state.page = 1;
        renderFromCache();
        scrollToTop();
      });
      tabsEl.appendChild(b);
    });
  }

  function renderCards(items) {
    grid.innerHTML = "";
    items.forEach((it) => {
      const pub = it.published_at ? new Date(it.published_at) : null;
      const dateStr = pub
        ? pub.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        : "";

      const card = document.createElement("article");
      card.className = "ea-card";
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");

      card.addEventListener("click", (e) => {
        if (e.target.closest("a")) return;
        window.location.href = it.url;
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter") window.location.href = it.url;
      });

      card.addEventListener("mouseenter", () => {
        if (card.dataset.prefetched) return;
        const l = document.createElement("link");
        l.rel = "prefetch";
        l.href = it.url;
        document.head.appendChild(l);
        card.dataset.prefetched = "1";
      });

      const cover = document.createElement("a");
      cover.href = it.url;
      if (it.image) {
        const img = document.createElement("img");
        img.src = it.image;
        img.alt = it.title || "";
        img.className = "ea-cover";
        img.loading = "lazy";
        img.decoding = "async";
        cover.appendChild(img);
      } else {
        const ph = document.createElement("div");
        ph.className = "ea-cover";
        cover.appendChild(ph);
      }
      card.appendChild(cover);

      const body = document.createElement("div");
      body.className = "ea-body";

      const metaTop = document.createElement("div");
      metaTop.className = "ea-meta-top";

      const cat = document.createElement("span");
      cat.className = "ea-category";
      // Show first category value (support comma-separated or JSON array)
      let displayCat = "";
      if (it.category) {
        const raw = it.category.trim();
        if (raw.startsWith("[") && raw.endsWith("]")) {
          try {
            const parsed = JSON.parse(raw);
            displayCat = Array.isArray(parsed) && parsed[0] ? parsed[0] : raw;
          } catch (_) {
            displayCat = raw.split(",")[0].trim();
          }
        } else {
          displayCat = raw.split(",")[0].trim();
        }
      }
      cat.textContent = displayCat || "Halaman";

      const dateEl = document.createElement("span");
      dateEl.className = "ea-date";
      dateEl.textContent = dateStr;

      metaTop.appendChild(cat);
      metaTop.appendChild(dateEl);
      body.appendChild(metaTop);

      const title = document.createElement("h3");
      title.className = "ea-title";
      title.textContent = truncate(it.title, 50);
      body.appendChild(title);

      const desc = document.createElement("p");
      desc.className = "ea-desc";
      desc.textContent = truncate(it.excerpt, 100);
      body.appendChild(desc);

      const meta = document.createElement("div");
      meta.className = "ea-footer";
      meta.innerHTML = `
      <span>
        <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="6.50636" cy="3.56459" r="3.56459" fill="#356289"/>
          <ellipse cx="6.3717" cy="10.7821" rx="6.3717" ry="3.20813" fill="#356289"/>
        </svg>
      </span>
      <span style="margin-top: -7px;">${it.author || ""}</span>`;
      body.appendChild(meta);

      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  function renderPagination(total) {
    const pageCount = Math.max(1, Math.ceil(total / state.perPage));
    state.page = Math.min(Math.max(1, state.page), pageCount);
    const cur = state.page;

    pagination.innerHTML = "";

    const go = (page) => {
      state.page = page;
      renderFromCache();
      scrollToTop();
    };

    const addBtn = (label, page, { active = false, disabled = false } = {}) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className =
        "ea-page" + (active ? " active" : "") + (disabled ? " disabled" : "");
      b.textContent = String(label);
      if (!active && !disabled && page && page !== cur) {
        b.addEventListener("click", () => go(page));
      } else {
        b.disabled = true;
      }
      pagination.appendChild(b);
    };

    const addEllipsis = () => {
      const s = document.createElement("span");
      s.className = "ea-page ea-ellipsis";
      s.textContent = "…";
      pagination.appendChild(s);
    };

    addBtn("<<", 1, { disabled: cur <= 1 });
    addBtn("<", cur - 1, { disabled: cur <= 1 });

    if (pageCount <= 7) {
      for (let i = 1; i <= pageCount; i++) addBtn(i, i, { active: i === cur });
    } else if (cur <= 4) {
      for (let i = 1; i <= 4; i++) addBtn(i, i, { active: i === cur });
      addEllipsis();
      addBtn(pageCount, pageCount, { active: cur === pageCount });
    } else if (cur >= pageCount - 3) {
      addBtn(1, 1);
      addEllipsis();
      for (let i = pageCount - 3; i <= pageCount; i++)
        addBtn(i, i, { active: i === cur });
    } else {
      addBtn(1, 1);
      addEllipsis();
      [cur - 1, cur, cur + 1].forEach((i) =>
        addBtn(i, i, { active: i === cur })
      );
      addEllipsis();
      addBtn(pageCount, pageCount);
    }

    addBtn(">", cur + 1, { disabled: cur >= pageCount });
    addBtn(">>", pageCount, { disabled: cur >= pageCount });
  }

  async function fetchAllData(force = false) {
    const key =
      state.q && state.q.trim() !== "" ? state.q.trim().toLowerCase() : "*";
    if (!force && dataCache.has(key)) return dataCache.get(key);

    if (currentController) currentController.abort();
    currentController = new AbortController();

    const base = new URLSearchParams();
    base.set("view", "ap-json");
    base.set("type", "page"); // ← only pages
    base.set("q", key);
    base.set("page", "1");
    base.set("_", String(Date.now()));

    let res;
    try {
      res = await fetch(`/search?${base.toString()}`, {
        headers: { Accept: "application/json" },
        signal: currentController.signal,
      });
    } catch (_) {
      return { items: [], count: 0, ts: Date.now() };
    }
    if (!res.ok) return { items: [], count: 0, ts: Date.now() };

    let json1;
    try {
      json1 = await res.json();
    } catch (_) {
      json1 = { items: [], pages: 1, count: 0 };
    }

    let items = Array.isArray(json1.items) ? json1.items : [];
    let totalPages = Number(json1.pages || 1);

    if (!items.length && key === "*") {
      const alt = new URLSearchParams(base.toString());
      alt.delete("q");
      try {
        const r2 = await fetch(`/search?${alt.toString()}`, {
          headers: { Accept: "application/json" },
          signal: currentController.signal,
        });
        if (r2.ok) {
          const j2 = await r2.json();
          items = j2.items || items;
          totalPages = Number(j2.pages || totalPages);
          base.delete("q");
        }
      } catch (_) {}
    }

    const tasks = [];
    for (let p = 2; p <= totalPages; p++) {
      const params = new URLSearchParams(base.toString());
      params.set("page", String(p));
      tasks.push(
        fetch(`/search?${params.toString()}`, {
          headers: { Accept: "application/json" },
          signal: currentController.signal,
        })
          .then((r) => (r.ok ? r.json() : { items: [] }))
          .then((j) => j.items || [])
          .catch(() => [])
      );
    }
    if (tasks.length) {
      const rest = await Promise.allSettled(tasks);
      rest.forEach((pr) => {
        if (pr.status === "fulfilled" && pr.value && pr.value.length)
          items = items.concat(pr.value);
      });
    }

    items = dedupeItems(items);

    const payload = {
      items,
      count: items.length,
      ts: Date.now(),
    };

    dataCache.set(key, payload);
    return payload;
  }

  function renderFromCache() {
    const key =
      state.q && state.q.trim() !== "" ? state.q.trim().toLowerCase() : "*";
    const cached = dataCache.get(key);
    if (!cached) return;

    // Always re-derive tabs from data so they reflect actual category values
    deriveTabsFromItems(cached.items);
    renderTabs();

    const filtered = cached.items.filter(normalizeCategory);

    const sorted = filtered
      .slice()
      .sort(
        (a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0)
      );
    const start = (state.page - 1) * state.perPage;
    const paged = sorted.slice(start, start + state.perPage);

    renderCards(paged);
    renderPagination(sorted.length);

    const url = new URL(window.location.href);
    if (state.q) url.searchParams.set("q", state.q);
    else url.searchParams.delete("q");
    url.searchParams.set("cat", state.category);
    url.searchParams.set("p", String(state.page));
    history.replaceState(null, "", url.toString());
  }

  async function fetchAndRender(force = false) {
    const { items } = await fetchAllData(force);
    deriveTabsFromItems(items);
    renderFromCache();
  }

  let searchTimer = null;
  function triggerSearch() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.page = 1;
      fetchAndRender(true);
      scrollToTop();
    }, 250);
  }

  searchBtn.addEventListener("click", () => {
    const newQ = (searchInput.value || "").trim();
    if (!newQ) {
      state.q = "";
      state.category = "All";
      state.page = 1;
      fetchAndRender(true);
      scrollToTop();
    } else {
      if (newQ === state.q) return;
      state.q = newQ;
      triggerSearch();
    }
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const newQ = (searchInput.value || "").trim();
      if (!newQ) {
        state.q = "";
        state.category = "All";
        state.page = 1;
        fetchAndRender(true);
        scrollToTop();
      } else {
        if (newQ === state.q) return;
        state.q = newQ;
        triggerSearch();
      }
    }
  });

  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() === "") {
      state.q = "";
      state.category = "All";
      state.page = 1;
      fetchAndRender(true);
    }
  });

  const url = new URL(window.location.href);
  const _q = url.searchParams.get("q");
  if (_q) {
    state.q = _q;
    searchInput.value = _q;
  }
  const _cat = url.searchParams.get("cat");
  if (_cat) {
    state.category = _cat;
  }
  const _p = parseInt(url.searchParams.get("p") || "1", 10);
  if (_p > 0) {
    state.page = _p;
  }

  fetchAndRender();
})();
