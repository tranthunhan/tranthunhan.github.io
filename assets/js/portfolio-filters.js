(function () {
  const validFilters = ["all", "robotics", "cad", "manufacturing", "thermal", "personal"];
  const filterSelect = document.getElementById("register-filter-select");
  const visibleCount = document.getElementById("visible-count");
  const totalCount = document.getElementById("total-count");
  const registerEmpty = document.getElementById("register-empty");

  function getRows() {
    return Array.from(document.querySelectorAll("[data-register-row]"));
  }

  function getCards() {
    return Array.from(document.querySelectorAll("[data-register-card]"));
  }

  function normalizeFilter(filterKey) {
    return validFilters.includes(filterKey) ? filterKey : "all";
  }

  function rowMatchesFilter(row, filterKey) {
    const groups = (row.dataset.registerGroups || "all").split(/\s+/);
    return filterKey === "all" || groups.includes(filterKey);
  }

  function updateActiveControls(filterKey) {
    document.querySelectorAll("[data-register-filter]").forEach((button) => {
      const isActive = button.dataset.registerFilter === filterKey;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    if (filterSelect) {
      filterSelect.value = filterKey;
    }
  }

  function applyRegisterFilter(filterKey) {
    const activeFilter = normalizeFilter(filterKey);
    const rows = getRows();
    let visibleRows = 0;

    rows.forEach((row) => {
      const shouldShow = rowMatchesFilter(row, activeFilter);
      row.hidden = !shouldShow;
      visibleRows += shouldShow ? 1 : 0;
    });

    getCards().forEach((card) => {
      card.hidden = !rowMatchesFilter(card, activeFilter);
    });

    if (visibleCount) {
      visibleCount.textContent = String(visibleRows);
    }

    if (totalCount) {
      totalCount.textContent = String(rows.length);
    }

    if (registerEmpty) {
      registerEmpty.hidden = visibleRows > 0;
    }

    updateActiveControls(activeFilter);
  }

  document.addEventListener("click", (event) => {
    const filterButton = event.target.closest("[data-register-filter]");

    if (!filterButton) {
      return;
    }

    event.preventDefault();
    applyRegisterFilter(filterButton.dataset.registerFilter);
  });

  if (filterSelect) {
    filterSelect.addEventListener("change", (event) => {
      applyRegisterFilter(event.target.value);
    });
  }

  window.applyPortfolioRegisterFilter = applyRegisterFilter;
  applyRegisterFilter(filterSelect?.value || "all");
})();
