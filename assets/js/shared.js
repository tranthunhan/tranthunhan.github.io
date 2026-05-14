import { repoImages } from "../../data/repo-images.js";

function uniqueSources(items = []) {
  return [...new Set(items.filter(Boolean))];
}

function getProjectImagePool(project) {
  const directImages = [project.thumbnail, project.heroImage];
  const galleryImages = (project.gallery || []).map((item) => item?.src);
  const importedRepoImages = (repoImages[project.slug] || []).map(
    (item) => item?.src
  );
  return uniqueSources([...directImages, ...galleryImages, ...importedRepoImages]);
}

function pickRandom(items = []) {
  if (!items.length) {
    return "";
  }
  return items[Math.floor(Math.random() * items.length)];
}

function isExternalPath(path) {
  return (
    /^https?:\/\//i.test(path) ||
    path.startsWith("data:") ||
    path.startsWith("/") ||
    path.startsWith("../")
  );
}

export function resolveImagePath(path, hrefPrefix = "") {
  if (!path) {
    return "";
  }

  if (isExternalPath(path)) {
    return path;
  }

  return encodeURI(`${hrefPrefix}${path}`);
}

export function populateSharedProfile(profile) {
  const isProjectPage = document.body.classList.contains("project-page");
  const normalizeAssetPath = (path) => {
    if (!path) {
      return "";
    }

    if (
      path.startsWith("http") ||
      path.startsWith("data:") ||
      path.startsWith("/") ||
      path.startsWith("../")
    ) {
      return path;
    }

    if (path.startsWith("assets/")) {
      return isProjectPage ? `../${path}` : path;
    }

    return path;
  };

  const normalizeHref = (href) => {
    if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("/")) {
      return href;
    }

    if (href.startsWith("assets/")) {
      return isProjectPage ? `../${href}` : href;
    }

    return href;
  };

  const profileTargets = document.querySelectorAll("[data-profile]");
  profileTargets.forEach((node) => {
    const key = node.dataset.profile;
    if (profile[key]) {
      node.textContent = profile[key];
    }
  });

  const brandLogoPath = normalizeAssetPath(profile.brandLogo || "");
  if (brandLogoPath) {
    document.querySelectorAll(".brand-mark").forEach((markNode) => {
      markNode.textContent = "";
      markNode.dataset.hasLogo = "true";

      const logoImage = document.createElement("img");
      logoImage.src = brandLogoPath;
      logoImage.alt = `${profile.name || "Profile"} logo`;
      logoImage.decoding = "async";
      logoImage.loading = "lazy";
      markNode.appendChild(logoImage);
    });
  }

  const linkTargets = document.querySelectorAll("[data-profile-link]");
  linkTargets.forEach((node) => {
    const key = node.dataset.profileLink;
    const href = profile.links?.[key];
    const contactCard = node.closest(".contact-card");
    if (href) {
      node.setAttribute("href", normalizeHref(href));
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noreferrer");
      node.hidden = false;
      if (contactCard) {
        contactCard.hidden = false;
      }
    } else {
      node.removeAttribute("href");
      node.hidden = true;
      if (contactCard) {
        contactCard.hidden = true;
      }
    }
  });

  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
}

export function initRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window) || revealItems.length === 0) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

export function initRandomProjectLink(allProjects) {
  const buttons = document.querySelectorAll("[data-random-project]");
  if (!buttons.length || !allProjects?.length) {
    return;
  }

  const currentSlug = document.body.dataset.projectSlug;
  const pool = currentSlug
    ? allProjects.filter((project) => project.slug !== currentSlug)
    : allProjects;
  const candidates = pool.length ? pool : allProjects;
  const randomProject =
    candidates[Math.floor(Math.random() * candidates.length)];
  const prefix = document.body.classList.contains("project-page") ? "../" : "";
  const href = `${prefix}projects/${randomProject.slug}.html`;

  buttons.forEach((button) => {
    button.setAttribute("href", href);
    button.setAttribute(
      "title",
      `Go to random project: ${randomProject.title}`
    );
  });
}

export function createProjectCard(project, options = {}) {
  const {
    compact = false,
    hrefPrefix = "",
    showSummary = true
  } = options;

  const card = document.createElement("article");
  card.className = `project-card reveal${compact ? " compact-card" : ""}`;

  const cardImages = getProjectCardImages(project, hrefPrefix);
  const selectedProjectImage = pickRandom(cardImages);
  const selectedProjectImageIndex = Math.max(cardImages.indexOf(selectedProjectImage), 0);
  const cardImage = selectedProjectImage;
  const mediaMarkup = cardImage
    ? `
      <div class="project-card-media">
        <img src="${cardImage}" alt="${project.title} thumbnail" loading="lazy" data-image-index="${selectedProjectImageIndex}" />
      </div>
    `
    : `<div class="project-card-media is-empty" aria-hidden="true"></div>`;

  const tagMarkup = project.tags
    .slice(0, compact ? 3 : 4)
    .map((tag) => `<li>${tag}</li>`)
    .join("");

  card.innerHTML = `
    <a class="project-card-link" href="${hrefPrefix}projects/${project.slug}.html">
      ${mediaMarkup}
      <div class="project-card-body">
        <div class="project-card-meta">
          <span>${project.year}</span>
          <span>${project.projectType || "Solo"}</span>
        </div>
        <h3>${project.title}</h3>
        <p class="project-card-subtitle">${project.subtitle}</p>
        ${
          showSummary
            ? `<p class="project-card-summary">${project.summary}</p>`
            : ""
        }
        <ul class="tag-list">${tagMarkup}</ul>
      </div>
    </a>
  `;

  return card;
}

export function getProjectCardImages(project, hrefPrefix = "") {
  return getProjectImagePool(project).map((path) => resolveImagePath(path, hrefPrefix));
}

export function sortProjectsByType(projectList) {
  const order = { Solo: 0, Project: 1 };
  return projectList
    .map((project, index) => ({ project, index }))
    .sort((a, b) => {
    const projectA = a.project;
    const projectB = b.project;
    const aRank = order[projectA.projectType] ?? 99;
    const bRank = order[projectB.projectType] ?? 99;
    if (aRank !== bRank) {
      return aRank - bRank;
    }
    return a.index - b.index;
  })
    .map((entry) => entry.project);
}

export function createResourceButtons(links, labels) {
  const wrap = document.createElement("div");
  wrap.className = "resource-button-row";

  Object.entries(labels).forEach(([key, label]) => {
    const href = links?.[key];
    if (!href) {
      return;
    }

    const anchor = document.createElement("a");
    anchor.className = "button button-resource";
    anchor.href = href;
    anchor.textContent = label;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    wrap.appendChild(anchor);
  });

  return wrap;
}
