import { projects } from "../../data/projects.js";
import { siteProfile } from "../../data/site.js";
import {
  createProjectCard,
  getProjectCardImages,
  initRevealAnimations,
  populateSharedProfile,
  sortProjectsByType
} from "./shared.js";

populateSharedProfile(siteProfile);

const filterList = document.getElementById("filter-list");
const filterSelect = document.getElementById("filter-select");
const filterSelectValue = document.getElementById("filter-select-value");
const selectList = document.getElementById("select-list");
const portfolioGrid = document.getElementById("portfolio-grid");
const visibleCount = document.getElementById("visible-count");
const totalCount = document.getElementById("total-count");

let activeFilter = "Project";
const orderedProjects = sortProjectsByType(projects);
const archiveCycleIntervalMs = 5000;
const archiveFadeDurationMs = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ? 0
  : 320;
let archiveImageCycleId = 0;

const allTags = [...new Set(orderedProjects.map((project) => project.projectType || "Project"))];

function isVisibleForFilter(project, filter) {
  return (project.projectType || "Solo") === filter;
}

function setActiveFilter(filter) {
  activeFilter = filter;
  filterSelectValue.textContent = filter;
  filterSelect.classList.remove("active");
  renderFilterControls();
  renderProjects();
}

function renderFilterControls() {
  if (filterList) {
    filterSelectValue.textContent = activeFilter;
    filterList.innerHTML = allTags
      .map(
        (tag) => `
          <li class="filter-item">
            <button class="${tag === activeFilter ? "active" : ""}" type="button" data-filter="${tag}">
              ${tag}
            </button>
          </li>
        `
      )
      .join("");
  }

  if (selectList) {
    selectList.innerHTML = allTags
      .map(
        (tag) => `
          <li class="select-item">
            <button type="button" data-select-item="${tag}">${tag}</button>
          </li>
        `
      )
      .join("");
  }
}

function renderProjects() {
  if (!portfolioGrid) {
    return;
  }

  stopArchiveImageCycle();
  portfolioGrid.innerHTML = "";
  const filtered = orderedProjects.filter((project) =>
    isVisibleForFilter(project, activeFilter)
  );
  const rotatingCards = [];

  filtered.forEach((project) => {
    const card = createProjectCard(project, { compact: false, showSummary: false });
    const cardImage = card.querySelector(".project-card-media img");
    const cardImages = getProjectCardImages(project);

    if (cardImage && cardImages.length > 1) {
      const currentIndex = Number.parseInt(cardImage.dataset.imageIndex || "0", 10);
      rotatingCards.push({
        cardImage,
        cardImages,
        imageIndex: Number.isNaN(currentIndex) ? 0 : currentIndex,
        isTransitioning: false
      });
    }

    portfolioGrid.appendChild(card);
  });

  if (visibleCount) {
    visibleCount.textContent = String(filtered.length);
  }
  if (totalCount) {
    totalCount.textContent = String(projects.length);
  }

  initRevealAnimations();
  startArchiveImageCycle(rotatingCards);
}

function stopArchiveImageCycle() {
  if (!archiveImageCycleId) {
    return;
  }

  window.clearInterval(archiveImageCycleId);
  archiveImageCycleId = 0;
}

function startArchiveImageCycle(rotatingCards) {
  if (!rotatingCards.length) {
    return;
  }

  archiveImageCycleId = window.setInterval(() => {
    rotatingCards.forEach((entry) => {
      if (!entry.cardImage.isConnected || entry.isTransitioning) {
        return;
      }

      const nextImageIndex = (entry.imageIndex + 1) % entry.cardImages.length;
      swapCardImage(entry, nextImageIndex);
    });
  }, archiveCycleIntervalMs);
}

function swapCardImage(entry, nextImageIndex) {
  const nextImage = entry.cardImages[nextImageIndex];
  if (!nextImage) {
    return;
  }

  entry.isTransitioning = true;

  const applySwap = () => {
    if (!entry.cardImage.isConnected) {
      entry.isTransitioning = false;
      return;
    }

    if (!archiveFadeDurationMs) {
      entry.cardImage.src = nextImage;
      entry.cardImage.dataset.imageIndex = String(nextImageIndex);
      entry.imageIndex = nextImageIndex;
      entry.isTransitioning = false;
      return;
    }

    entry.cardImage.classList.add("is-fading-out");
    window.setTimeout(() => {
      if (!entry.cardImage.isConnected) {
        entry.isTransitioning = false;
        return;
      }

      entry.cardImage.src = nextImage;
      entry.cardImage.dataset.imageIndex = String(nextImageIndex);
      entry.imageIndex = nextImageIndex;

      window.requestAnimationFrame(() => {
        entry.cardImage.classList.remove("is-fading-out");
        entry.isTransitioning = false;
      });
    }, archiveFadeDurationMs);
  };

  const preload = new Image();
  preload.addEventListener("load", applySwap, { once: true });
  preload.addEventListener("error", applySwap, { once: true });
  preload.src = nextImage;
}

document.addEventListener("click", (event) => {
  const filterButton = event.target.closest("[data-filter]");
  if (filterButton) {
    setActiveFilter(filterButton.dataset.filter);
    return;
  }

  const selectItem = event.target.closest("[data-select-item]");
  if (selectItem) {
    setActiveFilter(selectItem.dataset.selectItem);
    return;
  }

  if (event.target.closest("#filter-select")) {
    filterSelect.classList.toggle("active");
    return;
  }

  if (!event.target.closest(".filter-select-box")) {
    filterSelect.classList.remove("active");
  }
});

renderFilterControls();
renderProjects();

window.addEventListener("beforeunload", stopArchiveImageCycle);
