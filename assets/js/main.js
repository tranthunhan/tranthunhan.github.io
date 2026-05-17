import { siteProfile } from "../../data/site.js";
import { projects } from "../../data/projects.js";
import {
  createProjectCard,
  initRevealAnimations,
  populateSharedProfile
} from "./shared.js";

populateSharedProfile(siteProfile);

const focusAreas = document.getElementById("focus-areas");
const projectCount = document.getElementById("project-count");
const selectedBuilds = document.getElementById("selected-builds");
const headshotSlot = document.querySelector(".headshot-slot");

const selectedBuildSlugs = [
  "kinematic-puppet-cobotics",
  "confined-space-inspection-robot",
  "uts-motorsports-autonomous",
  "additive-manufacturing-plier-project"
];

function renderFocusAreas() {
  if (!focusAreas) {
    return;
  }

  focusAreas.innerHTML = siteProfile.focusAreas
    .map(
      (item) => `
        <article class="info-panel reveal">
          <h3>${item.title}</h3>
          <p>${item.body}</p>
        </article>
      `
    )
    .join("");
}

function renderProjectCount() {
  if (!projectCount) {
    return;
  }

  projectCount.textContent = String(projects.length).padStart(2, "0");
}

function renderSelectedBuilds() {
  if (!selectedBuilds) {
    return;
  }

  const buildCards = selectedBuildSlugs
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter(Boolean);

  selectedBuilds.innerHTML = "";
  buildCards.forEach((project) => {
    const card = createProjectCard(project, {
      compact: true,
      showSummary: false
    });
    card.classList.remove("reveal");
    card.classList.add("selected-build-card", "is-visible");
    selectedBuilds.appendChild(card);
  });
}

function initProfileHoverIconReveal() {
  if (!headshotSlot) {
    return;
  }

  const hoverImage = headshotSlot.querySelector(".headshot-github-hover");
  if (!hoverImage || !siteProfile.links?.github) {
    return;
  }

  let revealTimerId = null;

  const clearTimer = () => {
    if (revealTimerId) {
      clearTimeout(revealTimerId);
      revealTimerId = null;
    }
  };

  const hideIcon = () => {
    clearTimer();
    headshotSlot.classList.remove("show-github-icon");
  };

  const scheduleReveal = () => {
    clearTimer();
    revealTimerId = setTimeout(() => {
      headshotSlot.classList.add("show-github-icon");
      revealTimerId = null;
    }, 2000);
  };

  headshotSlot.addEventListener("pointerenter", scheduleReveal);
  headshotSlot.addEventListener("pointerleave", hideIcon);
  headshotSlot.addEventListener("pointercancel", hideIcon);
}

renderFocusAreas();
renderProjectCount();
renderSelectedBuilds();
initProfileHoverIconReveal();
initRevealAnimations();
